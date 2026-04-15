import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'zinc' | 'amber'
  className?: string
}

export function Badge({ children, variant = 'zinc', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold',
        variant === 'green' && 'bg-[#00d47e]/10 text-[#00d47e]',
        variant === 'amber' && 'bg-amber-400/10 text-amber-400',
        variant === 'zinc'  && 'bg-white/[0.06] text-zinc-400',
        className
      )}
    >
      {children}
    </span>
  )
}
