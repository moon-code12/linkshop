import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
initializeApp();
const db = getFirestore();

// Safe placeholder for the trusted checkout flow. It deliberately does not charge a payment.
// Add provider-specific payment session creation and verified webhook handling before production.
export const createCheckoutDraft = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in is required for this starter endpoint.');
  const { storeId, items } = request.data || {};
  if (typeof storeId !== 'string' || !Array.isArray(items) || items.length === 0) {
    throw new HttpsError('invalid-argument', 'A storeId and non-empty items list are required.');
  }
  // This writes a non-payment draft only; prices must be re-read from Firestore server-side.
  const ref = await db.collection('checkoutDrafts').add({
    storeId,
    userId: request.auth.uid,
    requestedItems: items.map(item => ({ productId: String(item.productId || ''), quantity: Number(item.quantity || 0) })),
    status: 'draft',
    createdAt: FieldValue.serverTimestamp()
  });
  return { draftId: ref.id, status: 'draft', message: 'Draft created; no payment was taken.' };
});
