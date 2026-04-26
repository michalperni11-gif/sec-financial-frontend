'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Icons } from './Icons'

export type ToastKind = 'success' | 'error' | 'info' | 'warn'

interface Toast {
  id: number
  kind: ToastKind
  message: string
  ttl: number
}

interface ToastContextValue {
  push: (t: { kind: ToastKind; message: string; ttl?: number }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((t: { kind: ToastKind; message: string; ttl?: number }) => {
    const toast: Toast = { id: ++nextId, kind: t.kind, message: t.message, ttl: t.ttl ?? 4000 }
    setToasts(prev => [...prev, toast])
  }, [])

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="toast-wrap" aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onClose, toast.ttl)
    return () => window.clearTimeout(id)
  }, [toast.ttl, onClose])

  const Icon =
    toast.kind === 'success'
      ? Icons.Check
      : toast.kind === 'error'
        ? Icons.X
        : toast.kind === 'warn'
          ? Icons.Clock
          : Icons.Sparkles

  const cls = toast.kind === 'success' ? 'toast-success' : toast.kind === 'error' ? 'toast-error' : 'toast-info'

  return (
    <div className={`toast ${cls}`} role="status">
      <Icon size={15} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        className="btn btn-ghost btn-icon"
        onClick={onClose}
        aria-label="Dismiss"
        style={{ padding: 4, width: 24, height: 24 }}
      >
        <Icons.X size={12} />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx.push
}
