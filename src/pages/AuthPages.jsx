import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, MailCheck, ShoppingBag, Store as StoreIcon } from 'lucide-react';
import { authMessage, useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { createStore, importStarterCatalogue, isSlugAvailable } from '../services/db.js';
import { CATEGORY_INFO, slugify, startersFor } from '../services/catalog.js';
import { ConfigRequired, RequireAuth, Spinner } from '../components/common.jsx';
import { isFirebaseConfigured } from '../services/firebase.js';

const GoogleMark = () => (
  <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.2 5.5-4.7 7.2l7.6 5.9c4.4-4.1 6.9-10.1 6.9-17.6z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
);

const strength = pw => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++;
  return s;
};

function PasswordField({ value, onChange, placeholder, autoComplete, showMeter }) {
  const [show, setShow] = useState(false);
  const s = strength(value);
  return (
    <label>Password
      <span className="pw-wrap">
        <input required minLength="8" type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}/>
        <button type="button" className="pw-toggle" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
      </span>
      {showMeter && value && <span className="meter" data-level={s}><i/><i/><i/><i/><small>{['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][s]}</small></span>}
    </label>
  );
}

function AuthShell({ eyebrow, title, text, children, footer }) {
  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <Link className="brand" to="/"><span className="logo">L</span> linkshop</Link>
        <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="muted">{text}</p>
        {children}
        <p className="auth-switch">{footer}</p>
      </div>
    </div>
  );
}

const landing = (role, store, from) => from || (role === 'seller' ? (store ? '/dashboard' : '/setup-store') : '/account');

export function AuthPage({ mode = 'login' }) {
  const signup = mode === 'signup';
  const [params] = useSearchParams();
  const location = useLocation();
  const from = location.state?.from;
  const { user, profile, store, loading, login, signup: register, loginWithGoogle } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [role, setRole] = useState(params.get('role') === 'seller' ? 'seller' : 'customer');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { document.title = `${signup ? 'Create account' : 'Sign in'} — LinkShop`; }, [signup]);

  if (!isFirebaseConfigured) return <ConfigRequired/>;
  if (loading) return <Spinner/>;
  if (user && profile && !busy) return <Navigate to={landing(profile.role, store, from)} replace/>;

  const set = key => e => setForm({ ...form, [key]: e.target.value });
  const run = async action => {
    setError(''); setBusy(true);
    try { await action(); } catch (err) { setError(authMessage(err)); setBusy(false); }
  };
  const submit = e => {
    e.preventDefault();
    if (signup && strength(form.password) < 2) { setError('Use a stronger password: 8+ characters with a mix of letters and numbers.'); return; }
    run(async () => {
      if (signup) {
        await register({ name: form.name.trim(), email: form.email.trim(), password: form.password, role });
        toast('Account created. Check your email to verify your address.', 'success');
        nav(role === 'seller' ? '/setup-store' : from || '/account', { replace: true });
      } else {
        await login({ email: form.email.trim(), password: form.password });
        toast('Welcome back!', 'success');
        setBusy(false);
      }
    });
  };
  const google = () => run(async () => { await loginWithGoogle(role); setBusy(false); });

  return (
    <AuthShell
      eyebrow={signup ? 'GET STARTED' : 'WELCOME BACK'}
      title={signup ? 'Create your account' : 'Good to see you again.'}
      text={signup ? 'Shop with one account, or open your own store.' : 'Sign in to manage your orders or your shop.'}
      footer={<>{signup ? 'Already have an account?' : 'New to LinkShop?'} <Link to={signup ? '/login' : '/signup'} state={location.state}>{signup ? 'Sign in' : 'Create an account'}</Link></>}
    >
      {signup && (
        <div className="role-pick" role="radiogroup" aria-label="Account type">
          <button type="button" role="radio" aria-checked={role === 'customer'} className={role === 'customer' ? 'on' : ''} onClick={() => setRole('customer')}><ShoppingBag size={18}/><b>I want to shop</b><small>Track orders and check out faster</small></button>
          <button type="button" role="radio" aria-checked={role === 'seller'} className={role === 'seller' ? 'on' : ''} onClick={() => setRole('seller')}><StoreIcon size={18}/><b>I want to sell</b><small>Open a store and take orders</small></button>
        </div>
      )}
      <button type="button" className="btn btn-light wide google" onClick={google} disabled={busy}><GoogleMark/> Continue with Google</button>
      <div className="divider"><span>or with email</span></div>
      <form className="form-card" onSubmit={submit}>
        {signup && <label>Your name<input required value={form.name} onChange={set('name')} autoComplete="name" placeholder="Ada Okafor"/></label>}
        <label>Email address<input required type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com"/></label>
        <PasswordField value={form.password} onChange={set('password')} autoComplete={signup ? 'new-password' : 'current-password'} placeholder={signup ? 'At least 8 characters' : 'Your password'} showMeter={signup}/>
        {!signup && <Link className="forgot" to="/forgot-password">Forgot password?</Link>}
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-dark wide" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'} {!busy && <ArrowRight size={16}/>}</button>
      </form>
    </AuthShell>
  );
}

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (!isFirebaseConfigured) return <ConfigRequired/>;
  const submit = async e => {
    e.preventDefault(); setError(''); setBusy(true);
    try { await resetPassword(email.trim()); setSent(true); } catch (err) {
      // Don't reveal whether an address has an account.
      if (err.code === 'auth/user-not-found') setSent(true); else setError(authMessage(err));
    }
    setBusy(false);
  };
  return (
    <AuthShell eyebrow="ACCOUNT RECOVERY" title="Reset your password" text="We’ll email you a link to choose a new one." footer={<Link to="/login">← Back to sign in</Link>}>
      {sent ? <div className="info-box"><MailCheck size={18}/> If an account exists for <b>{email}</b>, a reset link is on its way. Check your inbox and spam folder.</div> : (
        <form className="form-card" onSubmit={submit}>
          <label>Email address<input required type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-dark wide" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button>
        </form>
      )}
    </AuthShell>
  );
}

export function SetupStore() {
  return <RequireAuth role="seller"><SetupStoreForm/></RequireAuth>;
}
function SetupStoreForm() {
  const { user, store, refresh } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', slug: '', tagline: '', whatsapp: '', categories: [] });
  const [touchedSlug, setTouchedSlug] = useState(false);
  const [starter, setStarter] = useState(true);
  const [available, setAvailable] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const slug = slugify(form.slug);
  useEffect(() => {
    setAvailable(null);
    if (slug.length < 3) return undefined;
    const t = setTimeout(() => isSlugAvailable(slug).then(setAvailable).catch(() => setAvailable(null)), 400);
    return () => clearTimeout(t);
  }, [slug]);

  if (store) return <Navigate to="/dashboard" replace/>;
  const setName = v => setForm(f => ({ ...f, name: v, slug: touchedSlug ? f.slug : slugify(v) }));
  const toggle = id => setForm(f => ({ ...f, categories: f.categories.includes(id) ? f.categories.filter(c => c !== id) : [...f.categories, id] }));
  const starterCount = startersFor(form.categories).length;

  const submit = async e => {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      await createStore(user.uid, form);
      if (starter) await importStarterCatalogue(user.uid, form.categories);
      await refresh();
      toast('Your store is live!', 'success');
      nav('/dashboard', { replace: true });
    } catch (err) { setError(err.message); setBusy(false); }
  };

  return (
    <div className="container content-page">
      <div className="auth-box wide-box">
        <p className="eyebrow">STORE SETUP · STEP 1 OF 1</p>
        <h1>Name your store.</h1>
        <p className="muted">You can change everything except the link later.</p>
        <form className="form-card" onSubmit={submit}>
          <label>Store name<input required value={form.name} onChange={e => setName(e.target.value)} placeholder="e.g. Sunday Studio" maxLength="40"/></label>
          <label>Store link
            <span className="slug-wrap"><i>linkshop/store/</i><input required value={form.slug} onChange={e => { setTouchedSlug(true); setForm({ ...form, slug: e.target.value }); }} placeholder="sunday-studio" maxLength="40"/></span>
            {slug.length >= 3 && available !== null && <small className={available ? 'ok-text' : 'error'}>{available ? `✓ /store/${slug} is available` : 'That link is taken'}</small>}
          </label>
          <fieldset className="cat-fieldset">
            <legend>What will you sell?</legend>
            <p className="muted">Pick everything that applies. Your store and its product photos will only show these kinds of items.</p>
            <div className="cat-picks">{CATEGORY_INFO.map(c => (
              <button type="button" key={c.id} className={form.categories.includes(c.id) ? 'on' : ''} aria-pressed={form.categories.includes(c.id)} onClick={() => toggle(c.id)}>
                <b>{c.id}</b><small>{c.hint}</small>
              </button>))}</div>
          </fieldset>
          <label>Tagline (optional)<input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="Everyday pieces, thoughtfully picked." maxLength="90"/></label>
          <label>WhatsApp number (optional)<input type="tel" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="2348012345678"/></label>
          <label className="check-card"><input type="checkbox" checked={starter} onChange={e => setStarter(e.target.checked)}/>
            <span><b>{starterCount ? `Fill my store with ${starterCount} starter products` : 'Fill my store with starter products'}</b><small>Ready-made products with matching photos, only in the categories you picked. Edit or delete any of them later.</small></span></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-dark wide" disabled={busy || available === false || form.categories.length === 0}>{busy ? 'Creating your store…' : 'Create store'} {!busy && <ArrowRight size={16}/>}</button>
        </form>
      </div>
    </div>
  );
}
