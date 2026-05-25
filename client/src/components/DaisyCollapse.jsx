export default function DaisyCollapse({ title, children, className = '', defaultOpen = false }) {
  return (
    <div className={`collapse collapse-arrow bg-base-100 border border-base-300 ${className}`.trim()}>
      <input type="checkbox" defaultChecked={defaultOpen} />
      <div className="collapse-title font-semibold">{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}

