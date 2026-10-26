import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);
const KEY = 'linkshop-cart-v2';

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || { storeSlug: null, items: [] }; } catch { return { storeSlug: null, items: [] }; }
};

// A cart belongs to one store at a time because each store ships and is paid separately.
export function CartProvider({ children }) {
  const [cart, setCart] = useState(read);
  const toast = useToast();
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(cart)); }, [cart]);

  const value = useMemo(() => {
    const { items, storeSlug } = cart;
    return {
      items, storeSlug,
      total: items.reduce((sum, x) => sum + x.price * x.quantity, 0),
      count: items.reduce((sum, x) => sum + x.quantity, 0),
      addItem(product, slug, quantity = 1) {
        setCart(old => {
          const base = old.storeSlug && old.storeSlug !== slug ? { storeSlug: slug, items: [] } : { storeSlug: slug, items: old.items };
          const found = base.items.find(x => x.id === product.id);
          const nextQty = Math.min(product.stock, (found?.quantity || 0) + quantity);
          const line = { id: product.id, name: product.name, price: product.price, image: product.image, stock: product.stock, category: product.category, quantity: nextQty };
          return { ...base, items: found ? base.items.map(x => (x.id === product.id ? line : x)) : [...base.items, line] };
        });
        if (cart.storeSlug && cart.storeSlug !== slug) toast('Your bag now holds items from this store only.', 'info');
        else toast(`${product.name} added to your bag`, 'success');
      },
      updateQuantity: (id, quantity) => setCart(old => ({
        ...old,
        items: quantity < 1 ? old.items.filter(x => x.id !== id) : old.items.map(x => (x.id === id ? { ...x, quantity: Math.min(x.stock, quantity) } : x)),
      })),
      removeItem: id => setCart(old => ({ ...old, items: old.items.filter(x => x.id !== id) })),
      clearCart: () => setCart({ storeSlug: null, items: [] }),
    };
  }, [cart, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
