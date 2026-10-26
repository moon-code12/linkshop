import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail,
  signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase.js';
import { createUserProfile, getStoreByOwner, getUserProfile } from '../services/db.js';

const AuthContext = createContext(null);

const MESSAGES = {
  'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
  'auth/invalid-email': 'That email address doesn’t look right.',
  'auth/weak-password': 'Choose a stronger password (at least 8 characters).',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
  'auth/network-request-failed': 'Network problem. Check your connection and try again.',
  'auth/popup-closed-by-user': 'Sign-in window was closed before finishing.',
  'auth/popup-blocked': 'Your browser blocked the sign-in popup. Allow popups and try again.',
  'auth/operation-not-allowed': 'This sign-in method isn’t enabled yet in the Firebase console.',
  'auth/unauthorized-domain': 'This domain isn’t authorised in Firebase Authentication settings.',
};
export const authMessage = err => MESSAGES[err?.code] || err?.message?.replace('Firebase: ', '') || 'Something went wrong. Please try again.';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  const load = useCallback(async current => {
    if (!current) { setProfile(null); setStore(null); return; }
    const [p, s] = await Promise.all([getUserProfile(current.uid), getStoreByOwner(current.uid)]);
    setProfile(p);
    setStore(s);
  }, []);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, async current => {
      setUser(current);
      try { await load(current); } catch (err) { console.error('Could not load account data', err); }
      setLoading(false);
    });
  }, [load]);

  const value = useMemo(() => ({
    user, profile, store, loading,
    isSeller: profile?.role === 'seller',
    isAdmin: profile?.role === 'admin',
    refresh: () => load(auth.currentUser),
    async signup({ name, email, password, role }) {
      const { user: created } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(created, { displayName: name });
      await createUserProfile(created, { name, role });
      sendEmailVerification(created).catch(() => {});
      await load(created);
      return role;
    },
    async login({ email, password }) {
      const { user: signedIn } = await signInWithEmailAndPassword(auth, email, password);
      await load(signedIn);
    },
    async loginWithGoogle(role = 'customer') {
      const { user: signedIn } = await signInWithPopup(auth, googleProvider);
      if (!(await getUserProfile(signedIn.uid))) await createUserProfile(signedIn, { name: signedIn.displayName || 'New user', role });
      await load(signedIn);
    },
    resetPassword: email => sendPasswordResetEmail(auth, email),
    resendVerification: () => sendEmailVerification(auth.currentUser),
    async logout() { await signOut(auth); setProfile(null); setStore(null); },
  }), [user, profile, store, loading, load]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
