import * as React from 'react'
import * as RechartsPrimitive from 'recharts'

import { cn } from '../lib/utils'

const themes = { light: '', dark: '.dark' } as const

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof themes, string> }
  )
>

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error('useChart must be used within ChartContainer')
  return context
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/60 [&_.recharts-layer]:outline-none [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, item]) => item.theme || item.color)
  if (!colorConfig.length) return null

  const css = Object.entries(themes)
    .map(
      ([theme, prefix]) => `${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color = item.theme?.[theme as keyof typeof item.theme] ?? item.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join('\n')}
}`,
    )
    .join('\n')

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

export const ChartTooltip = RechartsPrimitive.Tooltip

export function ChartTooltipContent({
  active,
  payload,
  className,
  hideLabel = false,
  label,
}: Partial<RechartsPrimitive.TooltipContentProps> &
  React.ComponentProps<'div'> & { hideLabel?: boolean }) {
  const { config } = useChart()
  if (!active || !payload?.length) return null

  return (
    <div
      className={cn(
        'grid min-w-32 gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-xl',
        className,
      )}
    >
      {!hideLabel && label ? <div className="font-medium">{String(label)}</div> : null}
      <div className="grid gap-1.5">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name ?? 'value')
          return (
            <div className="flex items-center justify-between gap-4" key={key}>
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                {config[key]?.label ?? item.name}
              </span>
              <span className="font-mono font-medium tabular-nums">
                {Number(item.value).toLocaleString('zh-CN')}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
