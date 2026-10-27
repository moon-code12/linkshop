import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, runTransaction,
  serverTimestamp, setDoc, updateDoc, where, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase.js';
import { slugify, startersFor } from './catalog.js';
import { pickImage } from './imageLibrary.js';

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
export const DELIVERY_FEE_DEFAULT = 2500;

export const deliveryFor = (store, subtotal) =>
  subtotal >= (store.freeDeliveryOver || Infinity) ? 0 : (store.deliveryFee ?? DELIVERY_FEE_DEFAULT);

const withId = snap => ({ id: snap.id, ...snap.data() });
const productsRef = storeId => collection(db, 'stores', storeId, 'products');

/* ---------- users ---------- */
export async function createUserProfile(user, { name, role }) {
  await setDoc(doc(db, 'users', user.uid), { name, email: user.email, role, createdAt: serverTimestamp() });
}
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? withId(snap) : null;
}

/* ---------- stores ---------- */
export async function getStoreBySlug(slug) {
  const slugSnap = await getDoc(doc(db, 'slugs', slug));
  if (!slugSnap.exists()) return null;
  const storeSnap = await getDoc(doc(db, 'stores', slugSnap.data().storeId));
  return storeSnap.exists() ? withId(storeSnap) : null;
}
export async function getStoreByOwner(uid) {
  const snap = await getDoc(doc(db, 'stores', uid));
  return snap.exists() ? withId(snap) : null;
}
export async function listStores(max = 12) {
  const snap = await getDocs(query(collection(db, 'stores'), orderBy('createdAt', 'desc'), limit(max)));
  return snap.docs.map(withId);
}
// Featured products across stores for the homepage (falls back to any products if none are featured).
export async function listHomeProducts(stores, max = 8) {
  const perStore = await Promise.all(stores.slice(0, 6).map(async store => {
    const snap = await getDocs(query(productsRef(store.id), limit(12)));
    const all = snap.docs.map(d => ({ ...withId(d), storeSlug: store.slug, storeName: store.name }));
    return [...all.filter(p => p.featured), ...all.filter(p => !p.featured)].filter(p => p.stock > 0 && p.image).slice(0, 4);
  }));
  const out = [];
  for (let i = 0; out.length < max && perStore.some(l => l[i]); i++) perStore.forEach(l => { if (l[i] && out.length < max) out.push(l[i]); });
  return out;
}
export async function isSlugAvailable(slug) {
  return !(await getDoc(doc(db, 'slugs', slug))).exists();
}
export async function createStore(uid, { name, slug, tagline, whatsapp, categories }) {
  const clean = slugify(slug || name);
  if (clean.length < 3) throw new Error('Choose a store link with at least 3 letters or numbers.');
  if (!categories?.length) throw new Error('Pick at least one thing your store sells.');
  await runTransaction(db, async tx => {
    const slugRef = doc(db, 'slugs', clean);
    if ((await tx.get(slugRef)).exists()) throw new Error('That store link is already taken. Try another.');
    tx.set(slugRef, { storeId: uid });
    tx.set(doc(db, 'stores', uid), {
      name: name.trim(), slug: clean, ownerId: uid, tagline: tagline?.trim() || '', whatsapp: whatsapp?.trim() || '', categories,
      delivery: 'Delivery arranged by the seller after you order.', deliveryFee: DELIVERY_FEE_DEFAULT,
      freeDeliveryOver: 100000, createdAt: serverTimestamp(),
    });
  });
  return clean;
}
export async function updateStore(storeId, data) {
  await updateDoc(doc(db, 'stores', storeId), {
    name: data.name.trim(), tagline: data.tagline.trim(), whatsapp: data.whatsapp.trim(), delivery: data.delivery.trim(),
    ...(data.categories?.length ? { categories: data.categories } : {}),
    deliveryFee: Math.max(0, Number(data.deliveryFee) || 0), freeDeliveryOver: Math.max(0, Number(data.freeDeliveryOver) || 0),
  });
}

/* ---------- products ---------- */
export async function listProducts(storeId) {
  const snap = await getDocs(query(productsRef(storeId), orderBy('createdAt', 'desc')));
  return snap.docs.map(withId);
}
export async function getProduct(storeId, productId) {
  const snap = await getDoc(doc(db, 'stores', storeId, 'products', productId));
  return snap.exists() ? withId(snap) : null;
}
// `sells` is the list of categories the store sells; automatic photos never come from outside it.
const cleanProduct = (p, sells = []) => ({
  name: p.name.trim(), category: p.category.trim(), description: (p.description || '').trim(),
  ...(p.image && !p.autoImage ? { image: p.image.trim(), autoImage: false } : { image: pickImage(p.name, p.category, sells), autoImage: true }),
  price: Math.max(0, Math.round(Number(p.price) || 0)), stock: Math.max(0, Math.round(Number(p.stock) || 0)), featured: Boolean(p.featured),
});
export async function saveProduct(storeId, product, sells) {
  const data = cleanProduct(product, sells);
  if (product.id) { await updateDoc(doc(db, 'stores', storeId, 'products', product.id), data); return product.id; }
  const ref = await addDoc(productsRef(storeId), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}
export async function removeProduct(storeId, productId) {
  await deleteDoc(doc(db, 'stores', storeId, 'products', productId));
}
export async function setStock(storeId, productId, stock) {
  await updateDoc(doc(db, 'stores', storeId, 'products', productId), { stock: Math.max(0, Math.round(Number(stock) || 0)) });
}
// Imports only the starter products in the categories the store sells.
export async function importStarterCatalogue(storeId, sells) {
  const items = startersFor(sells);
  const batch = writeBatch(db);
  items.forEach((p, i) => {
    batch.set(doc(productsRef(storeId)), { ...cleanProduct(p, sells), createdAt: new Date(Date.now() - i * 1000) });
  });
  await batch.commit();
  return items.length;
}

/* ---------- orders ---------- */
// Prices and stock are re-read from Firestore at checkout so a stale or edited cart can't set its own price.
export async function quoteCart(store, cartItems) {
  const fresh = await Promise.all(cartItems.map(async item => ({ item, product: await getProduct(store.id, item.id) })));
  const lines = [];
  for (const { item, product } of fresh) {
    if (!product) throw new Error(`“${item.name}” is no longer available. Please remove it from your cart.`);
    if (product.stock < item.quantity) {
      throw new Error(product.stock === 0 ? `“${product.name}” is sold out.` : `Only ${product.stock} of “${product.name}” left in stock.`);
    }
    lines.push({ productId: product.id, name: product.name, price: product.price, quantity: item.quantity, image: product.image });
  }
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const deliveryFee = deliveryFor(store, subtotal);
  return { lines, subtotal, deliveryFee, total: subtotal + deliveryFee };
}
export async function saveOrder({ store, quote, customer, userId, payment }) {
  const ref = await addDoc(collection(db, 'orders'), {
    storeId: store.id, storeName: store.name, storeSlug: store.slug, userId: userId || null, customer,
    items: quote.lines, subtotal: quote.subtotal, deliveryFee: quote.deliveryFee, total: quote.total,
    payment, status: 'pending', createdAt: serverTimestamp(),
  });
  return ref.id;
}
export async function getOrder(orderId) {
  const snap = await getDoc(doc(db, 'orders', orderId));
  return snap.exists() ? withId(snap) : null;
}
export async function listStoreOrders(storeId) {
  const snap = await getDocs(query(collection(db, 'orders'), where('storeId', '==', storeId)));
  return snap.docs.map(withId).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}
export async function listUserOrders(userId) {
  const snap = await getDocs(query(collection(db, 'orders'), where('userId', '==', userId)));
  return snap.docs.map(withId).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}
// Stock is deducted when a seller accepts an order and restored if an accepted order is cancelled.
export async function updateOrderStatus(order, next) {
  const orderRef = doc(db, 'orders', order.id);
  await runTransaction(db, async tx => {
    const current = (await tx.get(orderRef)).data();
    const from = current.status;
    if (from === next) return;
    if (from === 'delivered' || from === 'cancelled') throw new Error(`A ${from} order can’t be changed.`);
    const deduct = from === 'pending' && ['processing', 'shipped', 'delivered'].includes(next);
    const restore = ['processing', 'shipped'].includes(from) && next === 'cancelled';
    if (deduct || restore) {
      const refs = current.items.map(i => doc(db, 'stores', current.storeId, 'products', i.productId));
      const snaps = await Promise.all(refs.map(r => tx.get(r)));
      snaps.forEach((snap, idx) => {
        if (!snap.exists()) return;
        const qty = current.items[idx].quantity;
        const stock = snap.data().stock + (deduct ? -qty : qty);
        if (stock < 0) throw new Error(`Not enough stock of “${current.items[idx].name}” to accept this order.`);
        tx.update(refs[idx], { stock });
      });
    }
    const paymentUpdate = next === 'delivered' && current.payment?.status !== 'paid' ? { 'payment.status': 'paid' } : {};
    tx.update(orderRef, { status: next, ...paymentUpdate });
  });
}
export async function listAllOrders() {
  const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(200)));
  return snap.docs.map(withId);
}
