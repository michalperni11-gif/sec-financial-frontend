import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'cyan' | 'green' | 'zinc'
  className?: string
}

export function Badge({ children, variant = 'zinc', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variant === 'cyan' && 'bg-cyan-400/10 text-cyan-400',
        variant === 'green' && 'bg-green-400/10 text-green-400',
        variant === 'zinc' && 'bg-zinc-800 text-zinc-400',
        className
      )}
    >
      {children}
    </span>
  )
}
