import React, { useCallback, useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((type, message, duration = 3200) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, pushToast, removeToast };
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed right-4 top-4 z-50 space-y-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-[280px] animate-in fade-in slide-in-from-right-4 rounded-xl border px-4 py-3 text-sm shadow-lg ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-white text-emerald-800'
              : toast.type === 'error'
                ? 'border-rose-200 bg-white text-rose-800'
                : 'border-sky-200 bg-white text-sky-800'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => onClose(toast.id)}
              className="text-current opacity-50 transition hover:opacity-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
