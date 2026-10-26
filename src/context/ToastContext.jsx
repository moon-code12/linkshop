import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Check, CircleAlert, Info } from 'lucide-react';

const ToastContext = createContext(() => {});
const icons = { success: Check, error: CircleAlert, info: Info };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const next = useRef(0);
  const push = useCallback((message, kind = 'info') => {
    const id = ++next.current;
    setToasts(old => [...old.slice(-2), { id, message, kind }]);
    setTimeout(() => setToasts(old => old.filter(t => t.id !== id)), 3600);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map(t => { const Icon = icons[t.kind]; return <div key={t.id} className={`toast ${t.kind}`}><Icon size={16}/>{t.message}</div>; })}
      </div>
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);
