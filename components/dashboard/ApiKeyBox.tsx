'use client'
import { useState } from 'react'

export function ApiKeyBox({ apiKey }: { apiKey: string }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const display = visible
    ? apiKey
    : apiKey.slice(0, 8) + '••••••••••••••••' + apiKey.slice(-4)

  async function handleCopy() {
    await navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
          className="rounded border border-zinc-800 px-2 py-2 text-xs text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
          title={visible ? 'Hide' : 'Show'}
        >
          {visible ? '👁' : '👁‍🗨'}
        </button>
        <button
          onClick={handleCopy}
          className="rounded border border-zinc-800 px-3 py-2 text-xs text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
