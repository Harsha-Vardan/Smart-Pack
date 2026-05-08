import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              px-5 py-3.5 rounded-xl text-sm font-medium min-w-[280px] max-w-[380px]
              backdrop-blur-xl shadow-lg border border-white/10
              ${t.type === 'success' ? 'bg-emerald-500/15 border-l-4 !border-l-emerald-500 text-emerald-300' : ''}
              ${t.type === 'error' ? 'bg-red-500/15 border-l-4 !border-l-red-500 text-red-300' : ''}
              ${t.type === 'info' ? 'bg-indigo-500/15 border-l-4 !border-l-indigo-500 text-indigo-300' : ''}
            `}
            style={{ animation: 'toastIn 0.3s ease' }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
