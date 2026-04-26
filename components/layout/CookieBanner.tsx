'use client'

import { useEffect, useState } from 'react'
import { Icons } from '@/components/ui/Icons'

const STORAGE_KEY = 'secfin_cookies'

export function CookieBanner() {
  const [show, setShow] = useState(false)
  const [customize, setCustomize] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true)
    } catch {
      setShow(true)
    }
  }, [])

  const decide = (v: 'accepted' | 'rejected' | 'partial') => {
    try {
      localStorage.setItem(STORAGE_KEY, v)
    } catch {
      // ignore
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 50,
        maxWidth: 640,
        margin: '0 auto',
      }}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div
        className="card"
        style={{ boxShadow: 'var(--shadow-lg)', borderColor: 'var(--border-strong)' }}
      >
        <div
          className="row"
          style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}
        >
          <div className="col" style={{ gap: 8, flex: 1, minWidth: 240 }}>
            <div className="row" style={{ gap: 8 }}>
              <Icons.Shield size={15} />
              <strong style={{ fontSize: 13.5 }}>Cookies</strong>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
              We use essential cookies to keep you signed in and analytics to improve the API. No third-party
              tracking.
            </p>
            {customize && (
              <div
                className="col"
                style={{
                  gap: 8,
                  marginTop: 8,
                  padding: 10,
                  background: 'var(--bg-soft)',
                  borderRadius: 8,
                  fontSize: 12.5,
                }}
              >
                <label className="row" style={{ gap: 8 }}>
                  <input type="checkbox" defaultChecked disabled /> Essential (required)
                </label>
                <label className="row" style={{ gap: 8 }}>
                  <input type="checkbox" defaultChecked /> Analytics
                </label>
                <label className="row" style={{ gap: 8 }}>
                  <input type="checkbox" /> Marketing
                </label>
              </div>
            )}
          </div>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => decide('rejected')}>
              Reject
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setCustomize(c => !c)}>
              {customize ? 'Hide' : 'Customize'}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => decide('accepted')}>
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
