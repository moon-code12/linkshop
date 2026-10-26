// Payment gateway abstraction.
//
// Checkout only talks to `getGateway(method)` and the `charge()` contract below, so the simulated
// gateway can later be swapped for Paystack/Flutterwave without touching any UI code. A real
// provider must create the session and verify the transaction on a server (Cloud Function),
// never in the browser.
//
// charge({ amount, currency, email, card }) -> { ok, reference, method, status, error? }

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export const luhnValid = number => {
  const digits = String(number).replace(/\s+/g, '');
  if (!/^\d{13,19}$/.test(digits)) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
};

export const cardBrand = number => {
  const n = String(number).replace(/\s+/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
  if (/^506[0-9]/.test(n) || /^65/.test(n)) return 'Verve';
  return 'Card';
};

export const expiryValid = value => {
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim());
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  return new Date(year, month, 1) > new Date();
};

const reference = prefix => `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

// Simulated card gateway: validates the card locally and approves it. Nothing is charged.
const testCardGateway = {
  id: 'card',
  label: 'Card payment',
  isTest: true,
  async charge({ card }) {
    await wait(1400);
    if (!luhnValid(card.number)) return { ok: false, error: 'That card number is not valid.' };
    if (!expiryValid(card.expiry)) return { ok: false, error: 'That card has expired or the date is invalid.' };
    if (!/^\d{3,4}$/.test(card.cvv)) return { ok: false, error: 'Enter the 3 or 4 digit security code.' };
    if (card.number.replace(/\s+/g, '').endsWith('0002')) return { ok: false, error: 'Your card was declined. Try another card.' };
    return { ok: true, reference: reference('TEST'), method: 'card', brand: cardBrand(card.number), status: 'paid' };
  },
};

const transferGateway = {
  id: 'transfer',
  label: 'Bank transfer',
  isTest: true,
  async charge() {
    await wait(600);
    return { ok: true, reference: reference('TRF'), method: 'transfer', status: 'awaiting-transfer' };
  },
};

const codGateway = {
  id: 'cod',
  label: 'Pay on delivery',
  isTest: false,
  async charge() {
    return { ok: true, reference: reference('COD'), method: 'cod', status: 'pay-on-delivery' };
  },
};

const gateways = { card: testCardGateway, transfer: transferGateway, cod: codGateway };
export const getGateway = method => gateways[method] || codGateway;
export const PAYMENT_MODE = 'test';
