export default function DaisyCollapse({ title, children, className = '', defaultOpen = false }) {
  return (
    <details
      className={`collapse collapse-arrow bg-base-100 border border-base-300 ${className}`.trim()}
      open={defaultOpen ? true : undefined}
    >
      <summary className="collapse-title font-semibold cursor-pointer select-none">{title}</summary>
      <div className="collapse-content">{children}</div>
    </details>
  );
}
