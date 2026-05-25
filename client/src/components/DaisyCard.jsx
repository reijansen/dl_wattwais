export default function DaisyCard({
  variant = 'base-200',
  title,
  icon,
  subtitle,
  className = '',
  bodyClassName = '',
  children,
}) {
  const variantClass =
    variant === 'base-100'
      ? 'bg-base-100'
      : 'bg-base-200';

  return (
    <div className={`card ${variantClass} shadow-lg border border-base-300 ${className}`.trim()}>
      <div className={`card-body ${bodyClassName}`.trim()}>
        {(title || subtitle) && (
          <div className="flex items-start gap-3">
            {icon ? <div className="mt-1">{icon}</div> : null}
            <div className="flex-1">
              {title ? <h2 className="card-title text-2xl">{title}</h2> : null}
              {subtitle ? <p className="text-sm text-base-content/70 mt-1">{subtitle}</p> : null}
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
