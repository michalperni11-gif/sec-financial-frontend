import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border border-white/[0.08] bg-[#1a1a1a] p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}
