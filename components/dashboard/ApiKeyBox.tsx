'use client'
import { useState } from 'react'

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export function ApiKeyBox({ apiKey }: { apiKey: string }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const display = visible
    ? apiKey
    : apiKey.slice(0, 8) + '••••••••••••••••' + apiKey.slice(-4)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 text-xs uppercase tracking-wider text-zinc-500">API Key</div>
      <div className="flex items-center gap-2">
        <code className="flex-1 overflow-hidden text-ellipsis rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-cyan-400 font-mono">
          {display}
        </code>
        <button
          onClick={() => setVisible((v) => !v)}
          className="flex items-center justify-center rounded border border-zinc-800 p-2 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
          title={visible ? 'Hide' : 'Show'}
          aria-label={visible ? 'Hide API key' : 'Show API key'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded border border-zinc-800 px-3 py-2 text-xs text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
          aria-label="Copy API key"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
