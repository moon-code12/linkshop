// Public shopping pages: landing, storefront, product, bag, checkout and order tracking.
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, Check, ClipboardList, Copy, CreditCard, Landmark, Lock, MessageCircle, Search, ShieldCheck, ShoppingBag,
  Store as StoreIcon, Truck, Wallet, Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { isFirebaseConfigured } from '../services/firebase.js';
import { deliveryFor, getOrder, getProduct, getStoreBySlug, listHomeProducts, listProducts, listStores, quoteCart, saveOrder } from '../services/db.js';
import { naira } from '../services/catalog.js';
import { cardBrand, getGateway, PAYMENT_MODE } from '../services/payments.js';
import ProductCard from '../components/ProductCard.jsx';
import { BackLink, ConfigRequired, EmptyState, ProductImage, Spinner, StatusBadge, dateTimeText } from '../components/common.jsx';

/* ------------------------------------------------------------------ data hooks */
function useStore(slug) {
  const [state, setState] = useState({ store: null, loading: true, error: '' });
  useEffect(() => {
    let live = true;
    if (!isFirebaseConfigured) { setState({ store: null, loading: false, error: '' }); return undefined; }
    setState({ store: null, loading: true, error: '' });
    getStoreBySlug(slug)
      .then(store => live && setState({ store, loading: false, error: '' }))
      .catch(err => live && setState({ store: null, loading: false, error: err.message }));
    return () => { live = false; };
  }, [slug]);
  return state;
}

function useStoreProducts(store) {
  const [state, setState] = useState({ products: [], loading: true });
  useEffect(() => {
    let live = true;
    if (!store) return undefined;
    setState(s => ({ ...s, loading: true }));
    listProducts(store.id).then(products => live && setState({ products, loading: false })).catch(() => live && setState({ products: [], loading: false }));
    return () => { live = false; };
  }, [store]);
  return state;
}

function StoreGate({ slug, children }) {
  const { store, loading, error } = useStore(slug);
  if (!isFirebaseConfigured) return <ConfigRequired/>;
  if (loading) return <Spinner label="Opening store…"/>;
  if (!store) return <div className="container content-page"><EmptyState icon={StoreIcon} title="Store not found" text={error || 'This store link doesn’t exist, or the seller changed it.'} action={<Link className="btn btn-dark" to="/">Explore stores</Link>}/></div>;
  return children(store);
}

/* ------------------------------------------------------------------ landing */
const HERO = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
];

export function Home() {
  const [stores, setStores] = useState(null);
  const [picks, setPicks] = useState([]);
  useEffect(() => {
    if (!isFirebaseConfigured) { setStores([]); return; }
    listStores(9).then(list => { setStores(list); listHomeProducts(list).then(setPicks).catch(() => {}); }).catch(() => setStores([]));
  }, []);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">MADE FOR INDEPENDENT SELLERS</p>
            <h1>Your business.<br/><em>Your own link.</em></h1>
            <p className="hero-p">Open a beautiful online store in minutes. Add your products, share one link on WhatsApp and Instagram, and manage every order from a real dashboard.</p>
            <div className="hero-actions">
              <Link className="btn btn-dark" to="/signup?role=seller">Create your store <ArrowRight size={17}/></Link>
              <a className="btn btn-light" href="#stores">Browse stores</a>
            </div>
            <ul className="hero-points"><li><Check size={15}/> Free to start</li><li><Check size={15}/> Orders, stock and customers in one place</li><li><Check size={15}/> Built for Naira</li></ul>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-circle"/>
            <img className="art-img a1" src={HERO[0]} alt=""/><img className="art-img a2" src={HERO[1]} alt=""/><img className="art-img a3" src={HERO[2]} alt=""/>
            <div className="float-note"><Check size={17}/> New order · {naira(32000)}</div>
          </div>
        </div>
      </section>

      <section className="section" id="stores">
        <div className="container">
          <p className="eyebrow">EXPLORE</p>
          <h2>Stores on LinkShop</h2>
          {stores === null ? <Spinner/> : stores.length === 0 ? (
            <EmptyState icon={StoreIcon} title="No stores yet" text={isFirebaseConfigured ? 'Be the first. Open a store and it will appear here.' : 'Connect Firebase to see live stores.'} action={<Link className="btn btn-dark" to="/signup?role=seller">Open a store</Link>}/>
          ) : (
            <div className="store-cards">{stores.map(s => (
              <Link key={s.id} to={`/store/${s.slug}`} className="store-card">
                <span className="store-initial">{s.name[0]?.toUpperCase()}</span>
                <div><b>{s.name}</b><small>{s.tagline || `linkshop.app/${s.slug}`}</small></div><ArrowRight size={16}/>
              </Link>
            ))}</div>
          )}
        </div>
      </section>

      {picks.length > 0 && (
        <section className="section featured-section">
          <div className="container">
            <p className="eyebrow">FRESH FROM THE STORES</p>
            <h2>Featured products</h2>
            <div className="products-grid four">{picks.map(p => (
              <div key={`${p.storeSlug}-${p.id}`}><ProductCard product={p} slug={p.storeSlug}/><Link className="from-store" to={`/store/${p.storeSlug}`}>from {p.storeName}</Link></div>
            ))}</div>
          </div>
        </section>
      )}

      <section className="section tint" id="how">
        <div className="container">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>From idea to first order in three steps.</h2>
          <div className="features">
            <Feature icon={<StoreIcon/>} n="1" title="Open your store" text="Sign up, pick a name and a store link. Import a starter catalogue or add your own products."/>
            <Feature icon={<ShoppingBag/>} n="2" title="Share your link" text="Customers browse, search and check out on any phone, with no app to install."/>
            <Feature icon={<ClipboardList/>} n="3" title="Run your orders" text="Accept orders, update delivery status and watch stock, customers and sales update live."/>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container features four">
          <Feature icon={<ShieldCheck/>} title="Secure accounts" text="Firebase Authentication with email, Google sign-in and password reset."/>
          <Feature icon={<Truck/>} title="Delivery you control" text="Set your delivery fee and a free-delivery threshold."/>
          <Feature icon={<Wallet/>} title="Flexible payment" text="Card, bank transfer or pay on delivery at checkout."/>
          <Feature icon={<Zap/>} title="Live inventory" text="Stock updates as you accept and cancel orders."/>
        </div>
      </section>

      <section className="container callout">
        <div><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2>Give your business<br/>a home on the internet.</h2><p>It takes about two minutes to set up your first store.</p><Link className="btn btn-dark" to="/signup?role=seller">Get started <ArrowRight size={17}/></Link></div>
        <ShoppingBag size={100} strokeWidth={1}/>
      </section>
    </>
  );
}
function Feature({ icon, title, text, n }) {
  return <article className="feature"><div className="feature-icon">{icon}</div>{n && <span className="feature-n">{n}</span>}<h3>{title}</h3><p>{text}</p></article>;
}

/* ------------------------------------------------------------------ storefront */
const PAGE = 12;
export function Storefront() {
  const { storeSlug } = useParams();
  return <StoreGate slug={storeSlug}>{store => <StorefrontView store={store}/>}</StoreGate>;
}
function StorefrontView({ store }) {
  const { products, loading } = useStoreProducts(store);
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('featured');
  const [inStock, setInStock] = useState(false);
  const [shown, setShown] = useState(PAGE);
  useEffect(() => { document.title = `${store.name} — LinkShop`; }, [store.name]);
  useEffect(() => setShown(PAGE), [cat, q, sort, inStock]);

  const cats = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let out = products.filter(p => (cat === 'All' || p.category === cat) && (!inStock || p.stock > 0) && (!term || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(term)));
    const sorters = { 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, name: (a, b) => a.name.localeCompare(b.name), featured: (a, b) => Number(b.featured) - Number(a.featured) };
    out = [...out].sort(sorters[sort]);
    return out;
  }, [products, cat, q, sort, inStock]);
  const feature = products.find(p => p.featured) || products[0];

  return (
    <div className="container store-page">
      <section className="store-banner">
        <div>
          <p className="eyebrow">INDEPENDENT STORE</p>
          <h1>{store.name}</h1>
          <p>{store.tagline || 'Thoughtfully selected, delivered to your door.'}</p>
          <div className="banner-badges">
            <span><Truck size={14}/> {store.freeDeliveryOver ? `Free delivery over ${naira(store.freeDeliveryOver)}` : 'Delivery arranged by seller'}</span>
            {store.whatsapp && <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><MessageCircle size={14}/> Chat on WhatsApp</a>}
          </div>
        </div>
        {feature && <ProductImage src={feature.image} alt={feature.name}/>}
      </section>

      {loading ? <Spinner label="Loading products…"/> : products.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="This store is still stocking up" text="No products have been added yet. Check back soon."/>
      ) : (
        <>
          <div className="toolbar">
            <label className="searchbox"><Search size={16}/><input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search ${products.length} products`} aria-label="Search products"/></label>
            <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products">
              <option value="featured">Featured first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name A–Z</option>
            </select>
            <label className="check"><input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)}/> In stock only</label>
          </div>
          <div className="filters">{cats.map(c => <button key={c} className={cat === c ? 'selected' : ''} onClick={() => setCat(c)}>{c}</button>)}</div>
          <p className="muted result-count">{list.length} {list.length === 1 ? 'product' : 'products'}</p>
          {list.length === 0 ? <EmptyState icon={Search} title="Nothing matches" text="Try a different search or category." action={<button className="btn btn-light" onClick={() => { setQ(''); setCat('All'); setInStock(false); }}>Clear filters</button>}/> : (
            <div className="products-grid">{list.slice(0, shown).map(p => <ProductCard key={p.id} product={p} slug={store.slug}/>)}</div>
          )}
          {list.length > shown && <div className="load-more"><button className="btn btn-light" onClick={() => setShown(shown + PAGE)}>Show more ({list.length - shown} left)</button></div>}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ product */
export function ProductDetail() {
  const { storeSlug, productId } = useParams();
  return <StoreGate slug={storeSlug}>{store => <ProductView store={store} productId={productId}/>}</StoreGate>;
}
function ProductView({ store, productId }) {
  const [product, setProduct] = useState(undefined);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const toast = useToast();
  const nav = useNavigate();
  useEffect(() => {
    setProduct(undefined); setQty(1);
    getProduct(store.id, productId).then(p => {
      setProduct(p);
      if (p) { document.title = `${p.name} — ${store.name}`; listProducts(store.id).then(all => setRelated(all.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4))); }
    }).catch(() => setProduct(null));
  }, [store, productId]);

  if (product === undefined) return <Spinner/>;
  if (!product) return <div className="container content-page"><EmptyState icon={ShoppingBag} title="Product not found" text="It may have been removed by the seller." action={<Link className="btn btn-dark" to={`/store/${store.slug}`}>Back to the store</Link>}/></div>;
  const soldOut = product.stock < 1;
  const copy = async () => { try { await navigator.clipboard.writeText(window.location.href); toast('Link copied', 'success'); } catch { toast('Copy the address from your browser bar.', 'info'); } };

  return (
    <div className="container content-page">
      <p className="crumb"><Link to={`/store/${store.slug}`}>{store.name}</Link>　›　{product.category}　›　{product.name}</p>
      <div className="detail">
        <ProductImage src={product.image} alt={product.name} className="detail-img"/>
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <h2>{naira(product.price)}</h2>
          <p>{product.description}</p>
          <p className={`stock-line ${soldOut ? 'out' : product.stock <= 5 ? 'low' : 'ok'}`}>{soldOut ? 'Sold out' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock and ready to ship'}</p>
          {!soldOut && (
            <>
              <div className="quantity"><button aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span>{qty}</span><button aria-label="Increase quantity" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button></div>
              <div className="detail-actions sticky-cta">
                <button className="btn btn-dark" onClick={() => addItem(product, store.slug, qty)}><ShoppingBag size={16}/> Add to bag</button>
                <button className="btn btn-light" onClick={() => { addItem(product, store.slug, qty); nav(`/store/${store.slug}/checkout`); }}>Buy now</button>
              </div>
            </>
          )}
          <ul className="perks">
            <li><Truck size={16}/> {store.delivery || 'Delivery arranged by the seller.'}</li>
            <li><ShieldCheck size={16}/> Orders are tracked from payment to delivery.</li>
          </ul>
          <div className="detail-links">
            <button className="link-btn" onClick={copy}><Copy size={14}/> Copy link</button>
            {store.whatsapp && <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I have a question about ${product.name}`)}`} target="_blank" rel="noreferrer"><MessageCircle size={14}/> Ask the seller</a>}
          </div>
        </div>
      </div>
      {related.length > 0 && <section className="related"><h2>You may also like</h2><div className="products-grid four">{related.map(p => <ProductCard key={p.id} product={p} slug={store.slug}/>)}</div></section>}
    </div>
  );
}

/* ------------------------------------------------------------------ bag */
export function Cart() {
  const { storeSlug } = useParams();
  return <StoreGate slug={storeSlug}>{store => <CartView store={store}/>}</StoreGate>;
}
function CartView({ store }) {
  const { items, total, storeSlug, updateQuantity, removeItem } = useCart();
  const mine = storeSlug === store.slug;
  const subtotal = mine ? total : 0;
  const fee = deliveryFor(store, subtotal);
  const toFree = store.freeDeliveryOver ? Math.max(0, store.freeDeliveryOver - subtotal) : 0;
  return (
    <div className="container content-page">
      <BackLink to={`/store/${store.slug}`}>Continue shopping</BackLink>
      <p className="eyebrow">YOUR BAG</p><h1>Shopping bag</h1>
      <div className="cart-layout">
        <div>
          {mine && items.length ? items.map(i => (
            <div className="cart-item" key={i.id}>
              <ProductImage src={i.image} alt={i.name}/>
              <div><Link to={`/store/${store.slug}/product/${i.id}`}><b>{i.name}</b></Link><p>{naira(i.price)}</p>
                <div className="quantity small"><button aria-label="Decrease" onClick={() => updateQuantity(i.id, i.quantity - 1)}>−</button><span>{i.quantity}</span><button aria-label="Increase" disabled={i.quantity >= i.stock} onClick={() => updateQuantity(i.id, i.quantity + 1)}>+</button></div>
              </div>
              <div className="line-total"><b>{naira(i.price * i.quantity)}</b><button className="remove" onClick={() => removeItem(i.id)}>Remove</button></div>
            </div>
          )) : <EmptyState icon={ShoppingBag} title="Your bag is empty" text="Explore the store and add something you like." action={<Link className="btn btn-dark" to={`/store/${store.slug}`}>Browse products</Link>}/>}
        </div>
        {mine && items.length > 0 && (
          <aside className="summary">
            <h3>Order summary</h3>
            <p><span>Subtotal</span><b>{naira(subtotal)}</b></p>
            <p><span>Delivery</span><b>{fee === 0 ? 'Free' : naira(fee)}</b></p>
            {toFree > 0 && fee > 0 && <div className="free-ship"><div><span style={{ width: `${Math.min(100, (subtotal / store.freeDeliveryOver) * 100)}%` }}/></div><small>Add {naira(toFree)} more for free delivery</small></div>}
            <hr/><p className="grand"><b>Total</b><b>{naira(subtotal + fee)}</b></p>
            <Link className="btn btn-dark wide sticky-cta" to={`/store/${store.slug}/checkout`}>Checkout <ArrowRight size={16}/></Link>
          </aside>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ checkout */
const formatCard = v => v.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d; };

export function Checkout() {
  const { storeSlug } = useParams();
  return <StoreGate slug={storeSlug}>{store => <CheckoutView store={store}/>}</StoreGate>;
}
function CheckoutView({ store }) {
  const { user, profile } = useAuth();
  const { items, total, storeSlug, clearCart } = useCart();
  const nav = useNavigate();
  const [data, setData] = useState({ name: '', email: '', phone: '', address: '', city: '', note: '', method: 'card' });
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { setData(d => ({ ...d, name: d.name || profile?.name || user?.displayName || '', email: d.email || user?.email || '' })); }, [user, profile]);

  const mine = storeSlug === store.slug && items.length > 0;
  const fee = deliveryFor(store, total);
  const change = e => setData({ ...data, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (busy) return;
    setError(''); setBusy(true);
    try {
      const quote = await quoteCart(store, items);
      const gateway = getGateway(data.method);
      const result = await gateway.charge({ amount: quote.total, currency: 'NGN', email: data.email, card });
      if (!result.ok) throw new Error(result.error);
      const payment = { method: result.method, status: result.status, reference: result.reference, test: gateway.isTest, ...(result.brand ? { brand: result.brand, last4: card.number.replace(/\D/g, '').slice(-4) } : {}) };
      const customer = { name: data.name.trim(), email: data.email.trim(), phone: data.phone.trim(), address: `${data.address.trim()}, ${data.city.trim()}`, note: data.note.trim() };
      const id = await saveOrder({ store, quote, customer, userId: user?.uid, payment });
      clearCart();
      nav(`/order/${id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'We couldn’t place your order. Please try again.');
      setBusy(false);
    }
  };

  if (!mine) return <div className="container content-page"><EmptyState icon={ShoppingBag} title="Your bag is empty" text="Add something first, then come back to check out." action={<Link className="btn btn-dark" to={`/store/${store.slug}`}>Browse products</Link>}/></div>;
  const methods = [['card', 'Card', CreditCard, 'Visa, Mastercard or Verve'], ['transfer', 'Bank transfer', Landmark, 'Pay to the seller’s account'], ['cod', 'Pay on delivery', Wallet, 'Cash or transfer when it arrives']];

  return (
    <div className="container content-page">
      <BackLink to={`/store/${store.slug}/cart`}>Back to bag</BackLink>
      <p className="eyebrow">ALMOST THERE</p><h1>Checkout</h1>
      {!user && <p className="muted guest-note">Checking out as a guest. <Link to="/login" state={{ from: `/store/${store.slug}/checkout` }}>Sign in</Link> to track orders in your account.</p>}
      <div className="cart-layout">
        <form className="form-card" onSubmit={submit}>
          <h3>Contact and delivery</h3>
          <div className="form-row">
            <label>Full name<input required name="name" value={data.name} onChange={change} autoComplete="name"/></label>
            <label>Phone number<input required name="phone" type="tel" value={data.phone} onChange={change} placeholder="0803 000 0000" autoComplete="tel" pattern="[0-9+\s()-]{7,16}" title="Enter a valid phone number"/></label>
          </div>
          <label>Email<input required name="email" type="email" value={data.email} onChange={change} autoComplete="email"/></label>
          <label>Delivery address<input required name="address" value={data.address} onChange={change} placeholder="House number and street" autoComplete="street-address"/></label>
          <label>City and state<input required name="city" value={data.city} onChange={change} placeholder="e.g. Ikeja, Lagos" autoComplete="address-level2"/></label>
          <label>Note to seller (optional)<textarea name="note" rows="2" value={data.note} onChange={change}/></label>

          <h3>Payment</h3>
          <div className="methods">{methods.map(([id, label, Icon, hint]) => (
            <label key={id} className={`method ${data.method === id ? 'on' : ''}`}><input type="radio" name="method" checked={data.method === id} onChange={() => setData({ ...data, method: id })}/><Icon size={19}/><span><b>{label}</b><small>{hint}</small></span></label>
          ))}</div>

          {data.method === 'card' && (
            <div className="card-box">
              <label>Card number<input required inputMode="numeric" autoComplete="cc-number" value={card.number} onChange={e => setCard({ ...card, number: formatCard(e.target.value) })} placeholder="4242 4242 4242 4242"/></label>
              <div className="form-row three">
                <label>Name on card<input required autoComplete="cc-name" value={card.holder} onChange={e => setCard({ ...card, holder: e.target.value })}/></label>
                <label>Expiry<input required inputMode="numeric" autoComplete="cc-exp" value={card.expiry} onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })} placeholder="MM / YY"/></label>
                <label>CVV<input required inputMode="numeric" autoComplete="cc-csc" type="password" maxLength="4" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })} placeholder="123"/></label>
              </div>
              {card.number && <small className="muted">{cardBrand(card.number)} detected</small>}
            </div>
          )}
          {data.method === 'transfer' && <p className="info-box">After you place the order, the seller will contact you with account details. Your order is held until payment is confirmed.</p>}
          {data.method === 'cod' && <p className="info-box">You pay the courier when your order arrives.</p>}
          {PAYMENT_MODE === 'test' && data.method !== 'cod' && <p className="test-banner"><Lock size={14}/> <span><b>Test payment mode.</b> No money is charged. Use card <code>4242 4242 4242 4242</code>, any future date and any CVV. A number ending in <code>0002</code> simulates a declined card.</span></p>}

          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-dark wide sticky-cta" disabled={busy}>{busy ? 'Processing…' : data.method === 'card' ? `Pay ${naira(total + fee)}` : 'Place order'} {!busy && <ArrowRight size={16}/>}</button>
        </form>

        <aside className="summary">
          <h3>Your order</h3>
          {items.map(i => <div className="sum-line" key={i.id}><ProductImage src={i.image} alt=""/><span>{i.name}<small>Qty {i.quantity}</small></span><b>{naira(i.price * i.quantity)}</b></div>)}
          <hr/><p><span>Subtotal</span><b>{naira(total)}</b></p><p><span>Delivery</span><b>{fee === 0 ? 'Free' : naira(fee)}</b></p>
          <hr/><p className="grand"><b>Total</b><b>{naira(total + fee)}</b></p>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ order tracking */
const STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const PAY_LABEL = { paid: 'Paid', 'awaiting-transfer': 'Awaiting transfer', 'pay-on-delivery': 'Pay on delivery' };
const METHOD_LABEL = { card: 'Card', transfer: 'Bank transfer', cod: 'Pay on delivery' };

export function OrderStatus() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [order, setOrder] = useState(undefined);
  const [store, setStore] = useState(null);
  useEffect(() => {
    if (!isFirebaseConfigured) { setOrder(null); return; }
    getOrder(orderId).then(o => { setOrder(o); if (o) getStoreBySlug(o.storeSlug).then(setStore).catch(() => {}); }).catch(() => setOrder(null));
  }, [orderId]);

  if (!isFirebaseConfigured) return <ConfigRequired/>;
  if (order === undefined) return <Spinner label="Finding your order…"/>;
  if (!order) return <div className="container content-page"><EmptyState icon={ClipboardList} title="Order not found" text="Check the link you were given, or sign in to see your orders." action={<Link className="btn btn-dark" to="/account">My orders</Link>}/></div>;

  const step = STEPS.indexOf(order.status);
  const pay = order.payment || {};
  const copy = async () => { try { await navigator.clipboard.writeText(window.location.href); toast('Tracking link copied', 'success'); } catch { toast('Copy the address from your browser bar.', 'info'); } };

  return (
    <div className="container content-page narrow">
      <div className="success">
        <div className="success-mark"><Check size={28}/></div>
        <p className="eyebrow">ORDER {order.id.slice(0, 8).toUpperCase()}</p>
        <h1>{order.status === 'cancelled' ? 'This order was cancelled.' : 'Thank you, your order is in.'}</h1>
        <p className="muted">Placed {dateTimeText(order.createdAt)} with <b>{order.storeName}</b>. Keep this page. It’s your private tracking link.</p>
        <button className="link-btn center" onClick={copy}><Copy size={14}/> Copy tracking link</button>
      </div>

      {order.status !== 'cancelled' ? (
        <ol className="timeline">{STEPS.map((s, i) => <li key={s} className={i <= step ? 'done' : ''}><span>{i < step ? <Check size={13}/> : i + 1}</span>{s[0].toUpperCase() + s.slice(1)}</li>)}</ol>
      ) : <p className="info-box">Cancelled orders can’t be changed. Contact the seller if you have questions.</p>}

      <div className="panel order-panel">
        <h2>Items</h2>
        {order.items.map(i => <div className="sum-line" key={i.productId}><ProductImage src={i.image} alt=""/><span>{i.name}<small>Qty {i.quantity} · {naira(i.price)}</small></span><b>{naira(i.price * i.quantity)}</b></div>)}
        <hr/><p className="row"><span>Subtotal</span><b>{naira(order.subtotal)}</b></p><p className="row"><span>Delivery</span><b>{order.deliveryFee ? naira(order.deliveryFee) : 'Free'}</b></p><p className="row grand"><b>Total</b><b>{naira(order.total)}</b></p>
      </div>
      <div className="two-col">
        <div className="panel"><h2>Delivery</h2><p className="detail-line"><b>{order.customer.name}</b></p><p className="detail-line">{order.customer.address}</p><p className="detail-line">{order.customer.phone}</p></div>
        <div className="panel"><h2>Payment</h2><p className="detail-line"><b>{METHOD_LABEL[pay.method] || pay.method}</b>{pay.last4 ? ` ·· ${pay.last4}` : ''}</p><p className="detail-line"><StatusBadge status={pay.status === 'paid' ? 'delivered' : 'pending'}/> {PAY_LABEL[pay.status] || pay.status}</p><p className="detail-line muted">Ref {pay.reference}{pay.test ? ' · test payment' : ''}</p></div>
      </div>
      <div className="success-actions">
        <Link className="btn btn-dark" to={`/store/${order.storeSlug}`}>Continue shopping</Link>
        {user && <Link className="btn btn-light" to="/account">All my orders</Link>}
        {store?.whatsapp && <a className="btn btn-light" target="_blank" rel="noreferrer" href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, about my order ${order.id.slice(0, 8).toUpperCase()}`)}`}><MessageCircle size={15}/> Message seller</a>}
      </div>
    </div>
  );
}
