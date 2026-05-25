import { Callout } from '@tremor/react';

export default function TremorCalloutList({ items = [], color = 'slate', className = '' }) {
  if (!items?.length) return null;

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      {items.map((text, idx) => (
        <Callout key={idx} title={text} color={color} />
      ))}
    </div>
  );
}

