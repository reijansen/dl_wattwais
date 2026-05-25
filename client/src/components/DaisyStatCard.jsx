export default function DaisyStatCard({
  label,
  value,
  unit,
  hint,
  icon,
  tone = 'primary',
  className = '',
}) {
  const toneAccent =
    tone === 'success'
      ? 'text-success'
      : tone === 'warning'
        ? 'text-warning'
        : tone === 'error'
          ? 'text-error'
          : tone === 'info'
            ? 'text-info'
            : 'text-primary';

  const toneBg =
    tone === 'success'
      ? 'bg-success/15 text-success'
      : tone === 'warning'
        ? 'bg-warning/15 text-warning'
        : tone === 'error'
          ? 'bg-error/15 text-error'
          : tone === 'info'
            ? 'bg-info/15 text-info'
            : 'bg-primary/15 text-primary';

  return (
    <div className={`card bg-base-100 border border-base-300 hover:shadow-md transition-shadow ${className}`.trim()}>
      <div className="card-body p-5">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-base-content/80">{label}</div>
          {icon ? <div className={`p-2 rounded-lg ${toneBg}`}>{icon}</div> : null}
        </div>
        <div className={`text-3xl font-bold mt-3 ${toneAccent}`.trim()}>
          {value}{' '}
          {unit ? <span className="text-sm font-semibold text-base-content/60">{unit}</span> : null}
        </div>
        {hint ? <div className="text-xs text-base-content/60 mt-1">{hint}</div> : null}
      </div>
    </div>
  );
}

