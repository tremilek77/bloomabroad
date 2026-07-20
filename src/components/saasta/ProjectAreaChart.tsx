import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const data = [
  { month: 'Jan', active: 240 },
  { month: 'Feb', active: 300 },
  { month: 'Mar', active: 280 },
  { month: 'Apr', active: 420 },
  { month: 'May', active: 390 },
  { month: 'Jun', active: 520 },
  { month: 'Jul', active: 610 },
  { month: 'Aug', active: 560 },
  { month: 'Sep', active: 720 },
]

const config = {
  active: { label: 'Active students', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function ProjectAreaChart() {
  return (
    <div className="card-interactive glimmer rounded-2xl border border-border bg-card/80 p-5 backdrop-blur">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            Last project overview
          </p>
          <p className="text-xs text-muted-foreground">Readiness signals</p>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          Monthly
        </span>
      </div>

      <ChartContainer config={config} className="h-[180px] w-full">
        <AreaChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
          <defs>
            <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-active)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--color-active)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={11}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area
            dataKey="active"
            type="natural"
            stroke="var(--color-active)"
            strokeWidth={2.5}
            fill="url(#fillActive)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
