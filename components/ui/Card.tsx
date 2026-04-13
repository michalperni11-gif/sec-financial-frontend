import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-lg border border-zinc-800 bg-zinc-900 p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}
