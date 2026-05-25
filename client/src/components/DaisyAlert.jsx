export default function DaisyAlert({
  type = 'error',
  icon,
  title,
  message,
  className = '',
  children,
}) {
  const typeClass =
    type === 'success'
      ? 'alert-success'
      : type === 'warning'
        ? 'alert-warning'
        : type === 'info'
          ? 'alert-info'
          : 'alert-error';

  return (
    <div className={`alert ${typeClass} shadow-lg gap-3 ${className}`.trim()}>
      {icon ? <div className="flex-shrink-0">{icon}</div> : null}
      <div>
        {title ? <h3 className="font-bold">{title}</h3> : null}
        {message ? <p className="text-sm">{message}</p> : null}
        {children}
      </div>
    </div>
  );
}

