export default function DaisyBadge({ variant = 'outline', size = 'md', className = '', children }) {
  const variantClass =
    variant === 'success'
      ? 'badge-success'
      : variant === 'warning'
        ? 'badge-warning'
        : variant === 'error'
          ? 'badge-error'
          : variant === 'info'
            ? 'badge-info'
            : variant === 'ghost'
              ? 'badge-ghost'
              : variant === 'outline'
                ? 'badge-outline'
                : '';

  const sizeClass = size === 'lg' ? 'badge-lg' : size === 'sm' ? 'badge-sm' : '';

  return (
    <span className={`badge ${variantClass} ${sizeClass} ${className}`.trim()}>
      {children}
    </span>
  );
}

