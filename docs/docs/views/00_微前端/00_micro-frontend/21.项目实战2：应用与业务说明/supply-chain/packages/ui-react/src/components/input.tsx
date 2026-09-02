import type { InputHTMLAttributes } from 'react'

import { cn } from '../lib/utils'

export function Input({
  className,
  type = 'text',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
