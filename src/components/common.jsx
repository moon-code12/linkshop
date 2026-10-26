import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { ImageOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { isFirebaseConfigured } from '../services/firebase.js';

export function Spinner({ label = 'Loading…' }) {
  return <div className="center-state"><Loader2 className="spin" size={26}/><p className="muted">{label}</p></div>;
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return <div className="empty">{Icon && <Icon size={34} strokeWidth={1.5}/>}<h3>{title}</h3>{text && <p>{text}</p>}{action}</div>;
}

export function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className={`img-fallback ${className}`} role="img" aria-label={alt}><ImageOff size={22}/></div>;
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)}/>;
}

export const STATUS_LABEL = { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };
export function StatusBadge({ status }) {
  return <span className={`status ${status}`}>{STATUS_LABEL[status] || status}</span>;
}

export function ConfigRequired() {
  return (
    <div className="container content-page">
      <div className="setup-card">
        <p className="eyebrow">ONE-TIME SETUP</p>
        <h1>Connect your Firebase project</h1>
        <p className="muted">LinkShop stores real accounts, products and orders in Firebase. Add your project keys to <code>.env</code> in the project folder and restart the dev server.</p>
        <pre>{`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...`}</pre>
        <p className="muted">Find them in Firebase Console → Project settings → Your apps → Web app. The README walks through enabling Email/Password and Google sign-in, creating Firestore and publishing the security rules.</p>
      </div>
    </div>
  );
}

// Gate a route behind sign-in and, optionally, a role.
export function RequireAuth({ role, children }) {
  const { user, profile, store, loading, isSeller } = useAuth();
  const location = useLocation();
  if (!isFirebaseConfigured) return <ConfigRequired/>;
  if (loading) return <Spinner/>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace/>;
  if (role === 'seller') {
    if (!isSeller) return <Navigate to="/account" replace/>;
    if (!store && location.pathname !== '/setup-store') return <Navigate to="/setup-store" replace/>;
  }
  if (role === 'admin' && profile?.role !== 'admin') return <Navigate to="/" replace/>;
  return children;
}

export const dateText = ts => {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  return d ? d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
};
export const dateTimeText = ts => {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  return d ? d.toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Just now';
};

export const BackLink = ({ to, children }) => <Link className="back-link" to={to}>← {children}</Link>;
