import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts'
import { Counter } from './Counter'

const VALUE = 60

export function ReadinessGauge() {
  const data = [{ name: 'readiness', value: VALUE, fill: 'var(--chart-1)' }]

  return (
    <div className="card-interactive glimmer rounded-2xl border border-border bg-card/80 p-5 backdrop-blur">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Target</p>
          <p className="text-xs text-muted-foreground">Readiness threshold</p>
        </div>
        <span className="text-sm font-semibold text-signal">
          <Counter value={1204} prefix="+" />
        </span>
      </div>

      <div className="relative mx-auto h-[120px] w-[120px]">
        <RadialBarChart
          width={120}
          height={120}
          data={data}
          startAngle={90}
          endAngle={-270}
          innerRadius={46}
          outerRadius={58}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            dataKey="value"
            background={{ fill: 'var(--muted)' }}
            cornerRadius={12}
            angleAxisId={0}
          />
        </RadialBarChart>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">
            <Counter value={VALUE} suffix="%" />
          </span>
          <span className="text-[10px] text-muted-foreground">on track</span>
        </div>
      </div>
    </div>
  )
}
