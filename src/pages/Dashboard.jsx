import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ClipboardList, Copy, Package, Plus, Search, Trash2, Users, Wallet, X, Pencil, TriangleAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { importStarterCatalogue, listProducts, listStoreOrders, removeProduct, saveProduct, setStock, updateOrderStatus, updateStore } from '../services/db.js';
import { CATEGORIES, CATEGORY_INFO, naira, startersFor } from '../services/catalog.js';
import { EmptyState, ProductImage, Spinner, StatusBadge, dateTimeText } from '../components/common.jsx';

const DataContext = createContext(null);
const useData = () => useContext(DataContext);

export function DashboardData({ children }) {
  const { store } = useAuth();
  const [state, setState] = useState({ products: [], orders: [], loading: true, error: '' });
  const reload = useCallback(async () => {
    try {
      const [products, orders] = await Promise.all([listProducts(store.id), listStoreOrders(store.id)]);
      setState({ products, orders, loading: false, error: '' });
    } catch (err) { setState(s => ({ ...s, loading: false, error: err.message })); }
  }, [store.id]);
  useEffect(() => { reload(); }, [reload]);
  return <DataContext.Provider value={{ ...state, reload }}>{children}</DataContext.Provider>;
}

/* ---------- derived numbers ---------- */
const counted = orders => orders.filter(o => o.status !== 'cancelled');
const revenue = orders => counted(orders).reduce((sum, o) => sum + o.total, 0);
const dayKey = d => d.toISOString().slice(0, 10);
const orderDate = o => (o.createdAt?.toDate ? o.createdAt.toDate() : new Date());

function customersFrom(orders) {
  const map = new Map();
  orders.forEach(o => {
    const key = (o.customer.email || o.customer.phone).toLowerCase();
    const c = map.get(key) || { key, name: o.customer.name, email: o.customer.email, phone: o.customer.phone, orders: 0, spent: 0, last: null };
    c.orders += 1;
    if (o.status !== 'cancelled') c.spent += o.total;
    const d = orderDate(o);
    if (!c.last || d > c.last) c.last = d;
    map.set(key, c);
  });
  return [...map.values()].sort((a, b) => b.spent - a.spent);
}

function Title({ title, desc, action }) {
  return <div className="dash-title"><div><h1>{title}</h1><p className="muted">{desc}</p></div>{action}</div>;
}
function Stat({ icon: Icon, label, value, hint, tone }) {
  return <div className={`stat ${tone || ''}`}><Icon size={20}/><span>{label}</span><b>{value}</b>{hint && <small>{hint}</small>}</div>;
}
function useGuard() {
  const { loading, error } = useData();
  if (loading) return <Spinner/>;
  if (error) return <div className="demo-alert"><TriangleAlert size={16}/> {error}</div>;
  return null;
}

/* ---------- order table ---------- */
function OrdersTable({ orders, onOpen }) {
  return (
    <div className="table-wrap"><table><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>TOTAL</th><th>PAYMENT</th><th>STATUS</th></tr></thead>
      <tbody>{orders.map(o => (
        <tr key={o.id} className={onOpen ? 'click' : ''} onClick={() => onOpen?.(o)}>
          <td data-label="ORDER"><b>{o.id.slice(0, 8).toUpperCase()}</b><small>{dateTimeText(o.createdAt)}</small></td>
          <td data-label="CUSTOMER">{o.customer.name}<small>{o.items.length} item{o.items.length === 1 ? '' : 's'}</small></td>
          <td data-label="TOTAL">{naira(o.total)}</td>
          <td data-label="PAYMENT"><span className={`status ${o.payment?.status === 'paid' ? 'delivered' : 'pending'}`}>{o.payment?.status === 'paid' ? 'Paid' : o.payment?.method === 'cod' ? 'On delivery' : 'Awaiting'}</span></td>
          <td data-label="STATUS"><StatusBadge status={o.status}/></td>
        </tr>))}</tbody></table></div>
  );
}

/* ---------- overview ---------- */
export function Overview() {
  const { store } = useAuth();
  const { products, orders } = useData();
  const guard = useGuard();
  const [open, setOpen] = useState(null);
  if (guard) return guard;
  const pending = orders.filter(o => o.status === 'pending');
  const low = products.filter(p => p.stock <= 5).sort((a, b) => a.stock - b.stock);
  const sold = {};
  counted(orders).forEach(o => o.items.forEach(i => { sold[i.productId] = (sold[i.productId] || 0) + i.quantity; }));
  const top = products.filter(p => sold[p.id]).sort((a, b) => sold[b.id] - sold[a.id]).slice(0, 4);
  const hour = new Date().getHours();
  return (
    <div className="dash-page">
      <Title title={`${hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'}, ${store.name}`} desc="Here’s what’s happening in your store."
        action={<Link className="btn btn-dark" to="/dashboard/products">+ Add product</Link>}/>
      {products.length === 0 && <EmptyState icon={Package} title="Add your first products" text="Your storefront is empty. Import a starter catalogue or add products one by one." action={<Link className="btn btn-dark" to="/dashboard/products">Go to products</Link>}/>}
      <div className="stats">
        <Stat icon={Wallet} label="Revenue" value={naira(revenue(orders))} hint="Excluding cancelled orders"/>
        <Stat icon={ClipboardList} label="Orders" value={orders.length} hint={`${pending.length} waiting for you`} tone={pending.length ? 'alert' : ''}/>
        <Stat icon={Package} label="Products" value={products.length} hint={`${low.length} low or out of stock`}/>
        <Stat icon={Users} label="Customers" value={customersFrom(orders).length}/>
      </div>
      <div className="two-col wide-left">
        <div className="panel"><div className="panel-heading"><h2>Recent orders</h2><Link to="/dashboard/orders">View all →</Link></div>
          {orders.length ? <OrdersTable orders={orders.slice(0, 5)} onOpen={setOpen}/> : <p className="muted pad">No orders yet. Share your store link to get your first one.</p>}</div>
        <div className="panel"><div className="panel-heading"><h2>Needs attention</h2></div>
          {low.length === 0 && pending.length === 0 ? <p className="muted pad">All caught up. 🎉</p> : <>
            {pending.length > 0 && <Link to="/dashboard/orders" className="attention"><b>{pending.length} pending order{pending.length > 1 ? 's' : ''}</b><small>Accept or cancel to keep customers informed</small></Link>}
            {low.slice(0, 5).map(p => <Link to="/dashboard/inventory" className="attention" key={p.id}><b>{p.name}</b><small>{p.stock === 0 ? 'Out of stock' : `Only ${p.stock} left`}</small></Link>)}</>}
        </div>
      </div>
      {top.length > 0 && <div className="panel"><div className="panel-heading"><h2>Best sellers</h2></div><div className="mini-grid">{top.map(p => <div key={p.id}><ProductImage src={p.image} alt={p.name}/><b>{p.name}</b><span>{sold[p.id]} sold · {naira(p.price)}</span></div>)}</div></div>}
      {open && <OrderDrawer order={open} onClose={() => setOpen(null)}/>}
    </div>
  );
}

/* ---------- products ---------- */
const blank = { name: '', category: CATEGORIES[0], price: '', stock: '', image: '', description: '', featured: false };

function ProductForm({ initial, onClose }) {
  const { store } = useAuth();
  const { reload } = useData();
  const toast = useToast();
  const sells = store.categories?.length ? store.categories : CATEGORIES;
  const [form, setForm] = useState({ ...blank, category: sells[0], ...initial });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = k => e => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      await saveProduct(store.id, form, sells);
      await reload();
      toast(form.id ? 'Product updated' : 'Product added', 'success');
      onClose();
    } catch (err) { setError(err.message); setBusy(false); }
  };
  return (
    <div className="modal-back" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form className="modal form-card" onSubmit={submit}>
        <div className="modal-head"><h3>{form.id ? 'Edit product' : 'New product'}</h3><button type="button" className="icon-btn" aria-label="Close" onClick={onClose}><X size={18}/></button></div>
        <label>Product name<input required value={form.name} onChange={set('name')} maxLength="80"/></label>
        <div className="form-row">
          <label>Category<select required value={form.category} onChange={set('category')}>{[...new Set([...sells, form.category])].map(c => <option key={c}>{c}</option>)}</select></label>
          <label>Price (₦)<input required type="number" min="0" step="1" value={form.price} onChange={set('price')}/></label>
          <label>Stock<input required type="number" min="0" step="1" value={form.stock} onChange={set('stock')}/></label>
        </div>
        <p className="muted fine left">A matching photo is added automatically from the product name and category.</p>
        {form.image && <ProductImage className="form-preview" src={form.image} alt="Current photo"/>}
        <label>Description<textarea rows="3" value={form.description} onChange={set('description')} maxLength="600"/></label>
        <label className="check"><input type="checkbox" checked={form.featured} onChange={set('featured')}/> Feature this product on my storefront</label>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="modal-actions"><button type="button" className="btn btn-light" onClick={onClose}>Cancel</button><button className="btn btn-dark" disabled={busy}>{busy ? 'Saving…' : 'Save product'}</button></div>
      </form>
    </div>
  );
}

export function Products() {
  const { store } = useAuth();
  const { products, reload } = useData();
  const toast = useToast();
  const guard = useGuard();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const shown = useMemo(() => products.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())), [products, q]);
  if (guard) return guard;
  const del = async p => {
    if (!window.confirm(`Delete “${p.name}”? This can’t be undone.`)) return;
    await removeProduct(store.id, p.id); await reload(); toast('Product deleted', 'info');
  };
  const importAll = async () => {
    setBusy(true);
    try { const n = await importStarterCatalogue(store.id, store.categories); await reload(); toast(`${n} products imported`, 'success'); } catch (err) { toast(err.message, 'error'); }
    setBusy(false);
  };
  return (
    <div className="dash-page">
      <Title title="Products" desc={`${products.length} in your catalogue.`} action={<button className="btn btn-dark" onClick={() => setEditing({})}><Plus size={16}/> Add product</button>}/>
      {products.length === 0 ? (
        <EmptyState icon={Package} title="No products yet" text="Start from scratch, or import a ready-made catalogue to see your store come to life." action={<button className="btn btn-dark" disabled={busy} onClick={importAll}>{busy ? 'Importing…' : `Import ${startersFor(store.categories).length} starter products`}</button>}/>
      ) : (
        <div className="panel">
          <label className="searchbox inline"><Search size={15}/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products"/></label>
          <div className="admin-products">{shown.map(p => (
            <div className="admin-product" key={p.id}>
              <ProductImage src={p.image} alt={p.name}/>
              <div><b>{p.name}{p.featured && <em className="pill">Featured</em>}</b><span>{p.category} · {p.stock} in stock</span><strong>{naira(p.price)}</strong></div>
              <div className="row-actions"><button className="icon-btn" aria-label={`Edit ${p.name}`} onClick={() => setEditing(p)}><Pencil size={15}/></button><button className="icon-btn danger" aria-label={`Delete ${p.name}`} onClick={() => del(p)}><Trash2 size={15}/></button></div>
            </div>))}</div>
          {shown.length === 0 && <p className="muted pad">No products match “{q}”.</p>}
        </div>
      )}
      {editing && <ProductForm initial={editing} onClose={() => setEditing(null)}/>}
    </div>
  );
}

/* ---------- orders ---------- */
const NEXT = { pending: ['processing', 'Accept order'], processing: ['shipped', 'Mark as shipped'], shipped: ['delivered', 'Mark as delivered'] };

function OrderDrawer({ order, onClose }) {
  const { reload, orders } = useData();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const live = orders.find(o => o.id === order.id) || order;
  const move = async next => {
    setBusy(true);
    try { await updateOrderStatus(live, next); await reload(); toast(`Order marked ${next}`, 'success'); } catch (err) { toast(err.message, 'error'); }
    setBusy(false);
  };
  const next = NEXT[live.status];
  return (
    <div className="modal-back" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="modal drawer">
        <div className="modal-head"><div><p className="eyebrow">ORDER {live.id.slice(0, 8).toUpperCase()}</p><StatusBadge status={live.status}/></div><button className="icon-btn" aria-label="Close" onClick={onClose}><X size={18}/></button></div>
        <p className="muted">{dateTimeText(live.createdAt)}</p>
        <div className="drawer-section"><h4>Customer</h4><p><b>{live.customer.name}</b></p><p>{live.customer.phone} · {live.customer.email}</p><p>{live.customer.address}</p>{live.customer.note && <p className="note">“{live.customer.note}”</p>}</div>
        <div className="drawer-section"><h4>Items</h4>{live.items.map(i => <div className="sum-line" key={i.productId}><ProductImage src={i.image} alt=""/><span>{i.name}<small>Qty {i.quantity} × {naira(i.price)}</small></span><b>{naira(i.price * i.quantity)}</b></div>)}
          <p className="row"><span>Delivery</span><b>{live.deliveryFee ? naira(live.deliveryFee) : 'Free'}</b></p><p className="row grand"><b>Total</b><b>{naira(live.total)}</b></p></div>
        <div className="drawer-section"><h4>Payment</h4><p>{live.payment?.method === 'card' ? `Card ·· ${live.payment.last4}` : live.payment?.method === 'transfer' ? 'Bank transfer' : 'Pay on delivery'} — <b>{live.payment?.status}</b></p><p className="muted">Ref {live.payment?.reference}{live.payment?.test ? ' (test payment)' : ''}</p></div>
        <div className="modal-actions">
          {live.status !== 'delivered' && live.status !== 'cancelled' && <button className="btn btn-light danger-text" disabled={busy} onClick={() => window.confirm('Cancel this order?') && move('cancelled')}>Cancel order</button>}
          {next && <button className="btn btn-dark" disabled={busy} onClick={() => move(next[0])}>{next[1]}</button>}
        </div>
        {live.status === 'pending' && <p className="muted fine">Accepting an order reserves its stock.</p>}
      </div>
    </div>
  );
}

export function Orders() {
  const { orders } = useData();
  const guard = useGuard();
  const [tab, setTab] = useState('all');
  const [open, setOpen] = useState(null);
  if (guard) return guard;
  const shown = tab === 'all' ? orders : orders.filter(o => o.status === tab);
  return (
    <div className="dash-page">
      <Title title="Orders" desc="Review, accept and fulfil customer orders."/>
      <div className="filters">{['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(t => <button key={t} className={tab === t ? 'selected' : ''} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)} {t === 'all' ? orders.length : orders.filter(o => o.status === t).length}</button>)}</div>
      <div className="panel">{shown.length ? <OrdersTable orders={shown} onOpen={setOpen}/> : <EmptyState icon={ClipboardList} title="No orders here" text="Orders appear as soon as customers check out."/>}</div>
      {open && <OrderDrawer order={open} onClose={() => setOpen(null)}/>}
    </div>
  );
}

/* ---------- inventory ---------- */
function StockRow({ p }) {
  const { store } = useAuth();
  const { reload } = useData();
  const toast = useToast();
  const [value, setValue] = useState(String(p.stock));
  useEffect(() => setValue(String(p.stock)), [p.stock]);
  const save = async () => {
    if (Number(value) === p.stock || value === '') { setValue(String(p.stock)); return; }
    try { await setStock(store.id, p.id, value); await reload(); toast(`${p.name} stock updated`, 'success'); } catch (err) { toast(err.message, 'error'); }
  };
  return (
    <div className="inventory-row">
      <ProductImage src={p.image} alt=""/><b>{p.name}<small>{p.category}</small></b>
      <input className="stock-input" type="number" min="0" aria-label={`Stock for ${p.name}`} value={value} onChange={e => setValue(e.target.value)} onBlur={save} onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}/>
      <span className={'status ' + (p.stock === 0 ? 'cancelled' : p.stock <= 5 ? 'pending' : 'delivered')}>{p.stock === 0 ? 'Out of stock' : p.stock <= 5 ? 'Low stock' : 'In stock'}</span>
    </div>
  );
}
export function Inventory() {
  const { products } = useData();
  const guard = useGuard();
  const [lowOnly, setLowOnly] = useState(false);
  if (guard) return guard;
  const shown = lowOnly ? products.filter(p => p.stock <= 5) : products;
  const units = products.reduce((s, p) => s + p.stock, 0);
  const value = products.reduce((s, p) => s + p.stock * p.price, 0);
  return (
    <div className="dash-page">
      <Title title="Inventory" desc="Edit a quantity and press Enter to save it."/>
      <div className="stats three"><Stat icon={Package} label="Units in stock" value={units}/><Stat icon={Wallet} label="Stock value" value={naira(value)}/><Stat icon={TriangleAlert} label="Low or out" value={products.filter(p => p.stock <= 5).length} tone={products.some(p => p.stock <= 5) ? 'alert' : ''}/></div>
      <div className="panel"><label className="check pad-b"><input type="checkbox" checked={lowOnly} onChange={e => setLowOnly(e.target.checked)}/> Show low stock only</label>
        {shown.length ? shown.map(p => <StockRow key={p.id} p={p}/>) : <p className="muted pad">Nothing to show.</p>}</div>
    </div>
  );
}

/* ---------- customers ---------- */
export function Customers() {
  const { orders } = useData();
  const guard = useGuard();
  if (guard) return guard;
  const list = customersFrom(orders);
  return (
    <div className="dash-page">
      <Title title="Customers" desc="Everyone who has ordered from your store."/>
      <div className="panel">{list.length === 0 ? <EmptyState icon={Users} title="No customers yet" text="Customer records are created automatically from orders."/> : (
        <div className="table-wrap"><table><thead><tr><th>CUSTOMER</th><th>CONTACT</th><th>ORDERS</th><th>SPENT</th><th>LAST ORDER</th></tr></thead>
          <tbody>{list.map(c => <tr key={c.key}><td data-label="CUSTOMER"><b>{c.name}</b>{c.orders > 1 && <small>Repeat customer</small>}</td><td data-label="CONTACT">{c.email}<small>{c.phone}</small></td><td data-label="ORDERS">{c.orders}</td><td data-label="SPENT">{naira(c.spent)}</td><td data-label="LAST ORDER">{c.last.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</td></tr>)}</tbody></table></div>)}</div>
    </div>
  );
}

/* ---------- analytics ---------- */
export function Analytics() {
  const { products, orders } = useData();
  const guard = useGuard();
  if (guard) return guard;
  const live = counted(orders);
  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
  const perDay = days.map(d => live.filter(o => dayKey(orderDate(o)) === dayKey(d)).reduce((s, o) => s + o.total, 0));
  const max = Math.max(...perDay, 1);
  const customers = customersFrom(orders);
  const repeat = customers.length ? Math.round((customers.filter(c => c.orders > 1).length / customers.length) * 100) : 0;
  const aov = live.length ? Math.round(revenue(orders) / live.length) : 0;
  const byCat = {};
  live.forEach(o => o.items.forEach(i => { const cat = products.find(p => p.id === i.productId)?.category || 'Other'; byCat[cat] = (byCat[cat] || 0) + i.price * i.quantity; }));
  const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const catMax = Math.max(...cats.map(c => c[1]), 1);
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => [s, orders.filter(o => o.status === s).length]);
  return (
    <div className="dash-page">
      <Title title="Analytics" desc="Performance based on your real orders."/>
      <div className="stats">
        <Stat icon={Wallet} label="Gross sales" value={naira(revenue(orders))}/><Stat icon={ClipboardList} label="Orders" value={orders.length}/>
        <Stat icon={Users} label="Repeat customers" value={`${repeat}%`}/><Stat icon={BarChart3} label="Average order" value={naira(aov)}/>
      </div>
      <div className="panel"><h2>Sales, last 7 days</h2>
        <div className="bars">{perDay.map((v, i) => <div key={i} title={naira(v)}><em>{v ? naira(v) : ''}</em><span style={{ height: `${(v / max) * 100}%`, minHeight: v ? 4 : 2 }}/><small>{days[i].toLocaleDateString('en-NG', { weekday: 'short' })}</small></div>)}</div></div>
      <div className="two-col">
        <div className="panel"><h2>Sales by category</h2>{cats.length ? cats.map(([c, v]) => <div className="hbar" key={c}><span>{c}</span><div><i style={{ width: `${(v / catMax) * 100}%` }}/></div><b>{naira(v)}</b></div>) : <p className="muted">No sales yet.</p>}</div>
        <div className="panel"><h2>Orders by status</h2>{statuses.map(([s, n]) => <div className="hbar" key={s}><span><StatusBadge status={s}/></span><div><i style={{ width: `${orders.length ? (n / orders.length) * 100 : 0}%` }}/></div><b>{n}</b></div>)}</div>
      </div>
    </div>
  );
}

/* ---------- settings ---------- */
export function StoreSettings() {
  const { store, refresh } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: store.name, tagline: store.tagline || '', whatsapp: store.whatsapp || '', delivery: store.delivery || '', deliveryFee: store.deliveryFee ?? 0, freeDeliveryOver: store.freeDeliveryOver ?? 0, categories: store.categories?.length ? store.categories : CATEGORIES });
  const toggle = id => setForm(f => ({ ...f, categories: f.categories.includes(id) ? f.categories.filter(c => c !== id) : [...f.categories, id] }));
  const [busy, setBusy] = useState(false);
  const link = `${window.location.origin}/store/${store.slug}`;
  const set = k => e => setForm({ ...form, [k]: e.target.value });
  const submit = async e => {
    e.preventDefault();
    if (!form.categories.length) { toast('Pick at least one thing your store sells.', 'error'); return; }
    setBusy(true);
    try { await updateStore(store.id, form); await refresh(); toast('Settings saved', 'success'); } catch (err) { toast(err.message, 'error'); }
    setBusy(false);
  };
  const copy = async () => { try { await navigator.clipboard.writeText(link); toast('Store link copied', 'success'); } catch { toast(link, 'info'); } };
  return (
    <div className="dash-page">
      <Title title="Store settings" desc="Your identity, contact and delivery details."/>
      <div className="panel share"><div><b>Your store link</b><p className="muted">Share this on WhatsApp, Instagram and your bio.</p><code>{link}</code></div><button className="btn btn-light" onClick={copy}><Copy size={15}/> Copy</button></div>
      <form className="panel form-card" onSubmit={submit}>
        <h2>Store profile</h2>
        <label>Store name<input required value={form.name} onChange={set('name')} maxLength="40"/></label>
        <label>Tagline<input value={form.tagline} onChange={set('tagline')} maxLength="90"/></label>
        <label>WhatsApp number<input type="tel" value={form.whatsapp} onChange={set('whatsapp')} placeholder="2348012345678"/></label>
        <fieldset className="cat-fieldset">
          <legend>What you sell</legend>
          <p className="muted">Product photos and your storefront only use these categories.</p>
          <div className="cat-picks">{CATEGORY_INFO.map(c => (
            <button type="button" key={c.id} className={form.categories.includes(c.id) ? 'on' : ''} aria-pressed={form.categories.includes(c.id)} onClick={() => toggle(c.id)}><b>{c.id}</b><small>{c.hint}</small></button>))}</div>
        </fieldset>
        <h2 className="mt">Delivery</h2>
        <label>Delivery information<textarea rows="2" value={form.delivery} onChange={set('delivery')}/></label>
        <div className="form-row"><label>Delivery fee (₦)<input type="number" min="0" value={form.deliveryFee} onChange={set('deliveryFee')}/></label><label>Free delivery over (₦, 0 = never)<input type="number" min="0" value={form.freeDeliveryOver} onChange={set('freeDeliveryOver')}/></label></div>
        <button className="btn btn-dark" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
      </form>
    </div>
  );
}
