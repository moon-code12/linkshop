import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Boxes, ClipboardList, LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingBag, Shield, User, Users, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const nav = [
  ['/dashboard', 'Overview', LayoutDashboard, true], ['/dashboard/products', 'Products', Package], ['/dashboard/orders', 'Orders', ClipboardList],
  ['/dashboard/inventory', 'Inventory', Boxes], ['/dashboard/customers', 'Customers', Users], ['/dashboard/analytics', 'Analytics', BarChart3],
  ['/dashboard/settings', 'Settings', Settings],
];

const Brand = () => <Link className="brand" to="/"><span className="logo">L</span> linkshop</Link>;

function AccountMenu() {
  const { user, profile, isSeller, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const toast = useToast();
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  if (!user) return <><Link className="nav-link" to="/login">Log in</Link><Link className="btn btn-dark small" to="/signup?role=seller">Start selling</Link></>;
  const first = (profile?.name || user.displayName || user.email).split(' ')[0];
  return (
    <div className="menu">
      <button className="menu-trigger" onClick={() => setOpen(!open)} aria-expanded={open}><span className="avatar">{first[0].toUpperCase()}</span>{first}</button>
      {open && (
        <div className="menu-pop">
          <Link to="/account"><User size={15}/> My orders</Link>
          {isSeller && <Link to="/dashboard"><LayoutDashboard size={15}/> Seller dashboard</Link>}
          {isAdmin && <Link to="/admin"><Shield size={15}/> Platform admin</Link>}
          <button onClick={async () => { await logout(); toast('You have been signed out.', 'info'); nav('/'); }}><LogOut size={15}/> Sign out</button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { count, storeSlug } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="header">
      <div className="container header-inner">
        <Brand/>
        <nav><Link to="/#stores">Explore stores</Link><Link to="/#how">How it works</Link><Link to="/signup?role=seller">Sell with LinkShop</Link></nav>
        <div className="head-actions">
          <Link className="cart-link" to={storeSlug ? `/store/${storeSlug}/cart` : '/#stores'} aria-label={`Shopping bag, ${count} items`}><ShoppingBag size={19}/>{count > 0 && <span>{count}</span>}</Link>
          <AccountMenu/>
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">{open ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
      </div>
      {open && <nav className="mobile-nav"><Link to="/#stores">Explore stores</Link><Link to="/#how">How it works</Link><Link to="/signup?role=seller">Sell with LinkShop</Link>{!user && <Link to="/login">Log in</Link>}</nav>}
    </header>
  );
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 50);
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function SiteLayout() {
  return (
    <>
      <ScrollManager/>
      <Header/>
      <main><Outlet/></main>
      <footer className="footer">
        <div className="container foot-grid">
          <div><Brand/><p className="muted">Real storefronts for independent sellers. Share one link, take orders, run your business.</p></div>
          <div><b>Shop</b><Link to="/#stores">Explore stores</Link><Link to="/account">Track an order</Link></div>
          <div><b>Sell</b><Link to="/signup?role=seller">Open a store</Link><Link to="/login">Seller login</Link></div>
          <div><b>Company</b><span>Payments run in test mode.</span><span>© {new Date().getFullYear()} LinkShop</span></div>
        </div>
      </footer>
    </>
  );
}

export function DashboardLayout() {
  const { store, logout } = useAuth();
  const nav2 = useNavigate();
  return (
    <div className="dash-shell">
      <aside className="sidebar">
        <Brand/>
        <p className="side-label">WORKSPACE</p>
        {nav.map(([to, label, Icon, end]) => <NavLink key={to} end={end} to={to} className={({ isActive }) => 'side-link ' + (isActive ? 'active' : '')}><Icon size={17}/>{label}</NavLink>)}
        <Link className="side-link side-bottom" to={`/store/${store?.slug}`}>View storefront ↗</Link>
      </aside>
      <div className="dash-main">
        <div className="dash-top">
          <span>{store?.name} <small>/{store?.slug}</small></span>
          <span className="dash-top-actions"><Link to="/">Exit</Link><button className="link-btn" onClick={async () => { await logout(); nav2('/'); }}>Sign out</button></span>
        </div>
        <Outlet/>
      </div>
    </div>
  );
}
