export default function DaisyProgress({ variant = 'neutral', value = 0, max = 100, className = '' }) {
  const variantClass =
    variant === 'success'
      ? 'progress-success'
      : variant === 'warning'
        ? 'progress-warning'
        : variant === 'error'
          ? 'progress-error'
          : variant === 'info'
            ? 'progress-info'
            : '';

  return (
    <progress className={`progress ${variantClass} ${className}`.trim()} value={value} max={max} />
  );
}

