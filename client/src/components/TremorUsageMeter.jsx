import { Badge, ProgressBar, Text } from '@tremor/react';

export default function TremorUsageMeter({
  label = 'Usage',
  value = 0,
  color = 'slate',
  left = 'Low',
  middle = 'Moderate',
  right = 'High',
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Text className="text-base-content/70">{label}</Text>
        <Badge color={color}>{Math.round(value)}%</Badge>
      </div>
      <ProgressBar value={value} color={color} />
      <div className="flex justify-between text-xs text-base-content/60">
        <span>{left}</span>
        <span>{middle}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}

