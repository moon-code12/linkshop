import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, MailWarning, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { PLANS, commissionFor, listAllOrders, listStores, listUserOrders, planOf, setStorePlan } from '../services/db.js';
import { naira } from '../services/catalog.js';
import { EmptyState, RequireAuth, Spinner, StatusBadge, dateTimeText } from '../components/common.jsx';

export function Account() { return <RequireAuth><AccountView/></RequireAuth>; }

function AccountView() {
  const { user, profile, isSeller, store, resendVerification } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState(null);
  useEffect(() => { listUserOrders(user.uid).then(setOrders).catch(() => setOrders([])); }, [user.uid]);
  const verify = async () => { try { await resendVerification(); toast('Verification email sent.', 'success'); } catch { toast('Please wait a moment before requesting another email.', 'error'); } };
  return (
    <div className="container content-page narrow">
      <p className="eyebrow">MY ACCOUNT</p>
      <h1>Hi, {(profile?.name || user.displayName || 'there').split(' ')[0]}.</h1>
      <p className="muted">{user.email}</p>
      {!user.emailVerified && <div className="demo-alert"><MailWarning size={17}/><span>Please verify your email address. <button className="link-btn" onClick={verify}>Resend the email</button></span></div>}
      {isSeller && <div className="panel share"><div><b>{store ? store.name : 'Finish setting up your store'}</b><p className="muted">{store ? 'Manage products, orders and customers.' : 'You’re one step away from selling.'}</p></div><Link className="btn btn-dark" to={store ? '/dashboard' : '/setup-store'}>{store ? 'Open dashboard' : 'Set up store'}</Link></div>}
      <div className="panel">
        <h2>My orders</h2>
        {orders === null ? <Spinner/> : orders.length === 0 ? <EmptyState icon={ClipboardList} title="No orders yet" text="Orders you place while signed in show up here." action={<Link className="btn btn-dark" to="/#stores">Explore stores</Link>}/> : (
          <div className="order-list">{orders.map(o => (
            <Link to={`/order/${o.id}`} className="order-row" key={o.id}>
              <div><b>{o.storeName}</b><small>{dateTimeText(o.createdAt)} · {o.items.reduce((s, i) => s + i.quantity, 0)} items</small></div>
              <span>{naira(o.total)}</span><StatusBadge status={o.status}/>
            </Link>))}</div>
        )}
      </div>
    </div>
  );
}

export function Admin() { return <RequireAuth role="admin"><AdminView/></RequireAuth>; }

function AdminView() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { Promise.all([listStores(100), listAllOrders()]).then(([stores, orders]) => setData({ stores, orders })).catch(err => setError(err.message)); }, []);
  if (error) return <div className="container content-page"><div className="demo-alert">{error}</div></div>;
  if (!data) return <Spinner/>;
  const live = data.orders.filter(o => o.status !== 'cancelled');
  const gmv = live.reduce((s, o) => s + o.total, 0);
  const rows = data.stores.map(s => {
    const mine = live.filter(o => o.storeId === s.id);
    return { store: s, plan: planOf(s), orders: data.orders.filter(o => o.storeId === s.id).length,
      sales: mine.reduce((sum, o) => sum + o.total, 0), commission: mine.reduce((sum, o) => sum + commissionFor(s, o), 0) };
  });
  const commission = rows.reduce((s, r) => s + r.commission, 0);
  const subscriptions = rows.reduce((s, r) => s + PLANS[r.plan].monthly, 0);
  const changePlan = async (store, plan) => {
    try {
      await setStorePlan(store.id, plan);
      setData(d => ({ ...d, stores: d.stores.map(x => x.id === store.id ? { ...x, plan } : x) }));
      toast(`${store.name} is now on the ${PLANS[plan].name} plan.`, 'success');
    } catch (err) { toast(err.message || 'Could not change the plan.', 'error'); }
  };
  return (
    <div className="container content-page">
      <p className="eyebrow">PLATFORM OPERATIONS</p><h1><Shield size={26}/> Admin overview</h1>
      <div className="stats three"><div className="stat"><span>Stores</span><b>{data.stores.length}</b></div><div className="stat"><span>Orders</span><b>{data.orders.length}</b></div><div className="stat"><span>Gross merchandise value</span><b>{naira(gmv)}</b></div></div>
      <div className="stats three"><div className="stat"><span>Commission earned</span><b>{naira(commission)}</b></div><div className="stat"><span>Subscriptions / month</span><b>{naira(subscriptions)}</b></div><div className="stat"><span>Platform revenue</span><b>{naira(commission + subscriptions)}</b></div></div>
      <div className="demo-alert"><span>Demo mode: fees are calculated and tracked here, but no money is collected until real payments are connected.</span></div>
      <div className="panel"><h2>Plans</h2><div className="table-wrap"><table><thead><tr><th>PLAN</th><th>MONTHLY FEE</th><th>COMMISSION</th><th>STORES</th></tr></thead><tbody>
        {Object.entries(PLANS).map(([key, p]) => <tr key={key}><td data-label="PLAN"><b>{p.name}</b></td><td data-label="MONTHLY FEE">{naira(p.monthly)}</td><td data-label="COMMISSION">{p.commission * 100}%</td><td data-label="STORES">{rows.filter(r => r.plan === key).length}</td></tr>)}</tbody></table></div></div>
      <div className="panel"><h2>Stores</h2><div className="table-wrap"><table><thead><tr><th>STORE</th><th>LINK</th><th>PLAN</th><th>ORDERS</th><th>SALES</th><th>COMMISSION</th></tr></thead><tbody>
        {rows.map(r => <tr key={r.store.id}><td data-label="STORE"><b>{r.store.name}</b></td><td data-label="LINK"><Link to={`/store/${r.store.slug}`}>/store/{r.store.slug}</Link></td>
          <td data-label="PLAN"><select value={r.plan} aria-label={`Plan for ${r.store.name}`} onChange={e => changePlan(r.store, e.target.value)}>{Object.entries(PLANS).map(([key, p]) => <option key={key} value={key}>{p.name}</option>)}</select></td>
          <td data-label="ORDERS">{r.orders}</td><td data-label="SALES">{naira(r.sales)}</td><td data-label="COMMISSION">{naira(r.commission)}</td></tr>)}</tbody></table></div></div>
      <div className="panel"><h2>Latest orders</h2><div className="table-wrap"><table><thead><tr><th>ORDER</th><th>STORE</th><th>TOTAL</th><th>COMMISSION</th><th>STATUS</th></tr></thead><tbody>
        {data.orders.slice(0, 20).map(o => <tr key={o.id}><td data-label="ORDER"><b>{o.id.slice(0, 8).toUpperCase()}</b><small>{dateTimeText(o.createdAt)}</small></td><td data-label="STORE">{o.storeName}</td><td data-label="TOTAL">{naira(o.total)}</td><td data-label="COMMISSION">{naira(commissionFor(data.stores.find(s => s.id === o.storeId), o))}</td><td data-label="STATUS"><StatusBadge status={o.status}/></td></tr>)}</tbody></table></div></div>
    </div>
  );
}
