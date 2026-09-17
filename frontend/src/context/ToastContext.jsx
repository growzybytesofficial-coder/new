import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X, ShoppingBag, Heart } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ title, message, type = 'success', duration = 3500, action }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type, duration, action }])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-2xl border backdrop-blur-md transition-all duration-300 animate-slide-up ${
              toast.type === 'success'
                ? 'bg-slate-900/95 text-white border-emerald-500/40 shadow-emerald-950/30'
                : toast.type === 'error'
                ? 'bg-red-950/95 text-white border-red-500/50 shadow-red-950/40'
                : toast.type === 'wishlist'
                ? 'bg-slate-900/95 text-white border-rose-500/40 shadow-rose-950/30'
                : 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/40'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="text-emerald-400" size={20} />}
              {toast.type === 'error' && <AlertCircle className="text-red-400" size={20} />}
              {toast.type === 'wishlist' && <Heart className="text-rose-400 fill-rose-400" size={20} />}
              {toast.type === 'info' && <Info className="text-blue-400" size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              {toast.title && <h4 className="text-sm font-bold text-white leading-snug">{toast.title}</h4>}
              {toast.message && <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>}
              {toast.action && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      toast.action.onClick?.()
                      removeToast(toast.id)
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 underline underline-offset-2"
                  >
                    {toast.action.label}
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
