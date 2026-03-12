/**
 * Section header — eyebrow + title. Use for dashboard sections, feature blocks.
 * Shares typography and spacing with the design system.
 */
export function SectionHeader({ eyebrow, title, className = '' }) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="font-display text-caption font-semibold uppercase tracking-widest text-ers-inkTertiary mb-1.5">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="font-display font-semibold text-ers-ink text-h2 tracking-tight max-w-2xl">
          {title}
        </h2>
      )}
    </div>
  );
}
