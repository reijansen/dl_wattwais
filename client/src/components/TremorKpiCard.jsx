import { Card, Metric, Text } from '@tremor/react';

export default function TremorKpiCard({ title, value, subtitle, icon, accent = 'emerald' }) {
  return (
    <Card className="bg-base-100 border border-base-300 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Text className="text-base-content/70">{title}</Text>
          <Metric className="text-base-content">{value}</Metric>
          {subtitle ? <Text className="mt-1 text-base-content/60">{subtitle}</Text> : null}
        </div>
        {icon ? <div className="text-base-content/70">{icon}</div> : null}
      </div>
    </Card>
  );
}
