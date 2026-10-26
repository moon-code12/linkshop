# LinkShop

A multi-seller storefront platform built with React, Vite, Tailwind and Firebase. Sellers open a store at `/store/your-name`, manage products, stock and orders from a dashboard, and customers check out on any device.

## What is real

- **Accounts:** Firebase Authentication with email/password, Google sign-in, password reset and email verification. Accounts are either `customer` or `seller`.
- **Data:** Stores, products and orders live in Firestore. Nothing is hard-coded.
- **Catalogue:** A seller can import 36 starter products across six categories, then edit or delete them.
- **Storefront:** Search, category filters, sorting, in-stock filter, product pages, related products and a persistent bag.
- **Checkout:** Prices and stock are re-read from Firestore at checkout, delivery fees follow the store's settings, and orders get private tracking links.
- **Seller dashboard:** Live overview, product CRUD, order workflow (pending → processing → shipped → delivered, or cancelled), inventory editing, customers, analytics and settings.
- **Customer account:** Order history for signed-in shoppers.
- **Admin:** `/admin` is protected by the `admin` role, which can only be set by hand in the Firebase console.
- **Security rules:** `firestore.rules` enforces ownership, validates writes and stops users granting themselves a role.

## Payments: test mode

Card, transfer and pay-on-delivery are wired end to end, but card payments are **simulated**. No money moves. Cards are checked locally (Luhn, expiry, CVV) and only the brand and last 4 digits are saved. Use `4242 4242 4242 4242`; a number ending `0002` simulates a decline.

All payment code is in `src/services/payments.js` behind one `charge()` contract. To go live later, add a provider (e.g. Paystack) there, create the session and verify the transaction in a Cloud Function (needs the Blaze plan), and have the server write the order.

## Setup

1. Create a project at https://console.firebase.google.com/ and add a **Web app**.
2. Put the config values in `.env` (see `.env.example`):
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
3. In **Authentication → Sign-in method**, enable **Email/Password** and **Google**. Add your domain under **Settings → Authorized domains** when you deploy.
4. In **Firestore Database**, create a database, then publish the rules:
   ```
   npm install -g firebase-tools
   firebase login
   firebase use --add
   firebase deploy --only firestore
   ```
5. Run it:
   ```
   npm install
   npm run dev
   ```
6. Sign up as a seller, create a store, and tick the starter-catalogue box.

To deploy the site: `npm run build` then `firebase deploy --only hosting`.

To make someone an admin: open their document in the `users` collection in the Firebase console and set `role` to `admin`.

## Known limits (worth fixing before large-scale use)

- Order totals and stock are checked in the browser at checkout. Without a server, a determined user could submit an altered order. A Cloud Function should create orders once you take real payments.
- Stock is deducted when the seller accepts an order, not when it is placed, so two customers can briefly buy the last unit.
- Product images are web links. Firebase Storage uploads need the Blaze plan.
- Public store listing on the home page shows the 9 newest stores.
