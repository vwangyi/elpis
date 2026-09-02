import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '../lib/utils'

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
      secondary: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
      success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
      warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
      danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
      info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
