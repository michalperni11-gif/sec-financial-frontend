import Link from 'next/link'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#111111] px-4">
      <Link href="/" className="mb-8 text-sm font-black tracking-widest text-white">
        SECfin<span className="text-[#00d47e]">API</span>
      </Link>
      <div className="w-full max-w-sm border border-white/[0.08] bg-[#1a1a1a] p-8">
        <h1 className="mb-1 text-xl font-bold text-zinc-100">{title}</h1>
        {subtitle && <p className="mb-6 text-sm text-zinc-500">{subtitle}</p>}
        {!subtitle && <div className="mb-6" />}
        {children}
      </div>
    </div>
  )
}
