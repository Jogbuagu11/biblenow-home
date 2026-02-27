'use client';

/**
 * Verified badge icon matching mobile (circle with check, like Icons.verified).
 * Use this instead of the "✓" character for consistency with the app.
 */
interface VerifiedBadgeProps {
  className?: string;
  size?: number;
  /** When true (default), badge is primary/gold with white check. When false, uses white/currentColor (e.g. on dark avatar). */
  primaryBackground?: boolean;
}

export function VerifiedBadge({ className = '', size = 20, primaryBackground = true }: VerifiedBadgeProps) {
  return (
    <span
      className={className}
      title="Verified"
      style={{ width: size, height: size, display: 'inline-flex', flexShrink: 0 }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="10"
          fill={primaryBackground ? 'var(--color-primary-500, #E1AB31)' : 'currentColor'}
        />
        <path
          fill="white"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.707 7.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L10 12.586l5.293-5.293a1 1 0 011.414 0z"
        />
      </svg>
    </span>
  );
}

/** Small badge for next to names in feeds/cards. */
export function VerifiedBadgeInline({ className = '' }: { className?: string }) {
  return <VerifiedBadge size={18} className={`align-middle ${className}`} primaryBackground />;
}
