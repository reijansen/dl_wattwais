import { Card, Metric, Text } from '@tremor/react';

export default function TremorKpiCard({ title, value, subtitle, icon, size = 'lg' }) {
  const metricSizeClass = size === 'md' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl';
  return (
    <Card className="bg-base-100 border border-base-300 shadow-sm">
      <div className="flex items-start justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <Text className="text-base-content/70">{title}</Text>
          <div className="overflow-hidden">
            <Metric className={`text-base-content tabular-nums ${metricSizeClass} leading-tight whitespace-nowrap truncate`}>
              {value}
            </Metric>
          </div>
          {subtitle ? <Text className="mt-1 text-base-content/60">{subtitle}</Text> : null}
        </div>
        {icon ? <div className="text-base-content/70 flex-shrink-0">{icon}</div> : null}
      </div>
    </Card>
  );
}
