import { useId } from 'react';
import { colors, radii, sizes, spacing, typography } from '@/theme';
import type { DateInputProps } from './DateInput';

/** DOM aislado en la variante web; no se empaqueta para native. */
export function DateInput({ label, value, onChange, invalid }: DateInputProps) {
  const id = useId();
  return <label htmlFor={id} style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs,
    fontSize: typography.label.fontSize, color: colors.textPrimary }}>
    {label}
    <input id={id} type="date" aria-label={label} aria-invalid={invalid} value={value}
      onChange={event => onChange(event.currentTarget.value)}
      style={{ boxSizing: 'border-box', width: '100%', minWidth: 0, minHeight: sizes.touchTarget,
        padding: spacing.sm, border: `2px solid ${colors.borderStrong}`, borderRadius: radii.small,
        color: colors.textPrimary, background: colors.surface, font: 'inherit', outlineColor: colors.brandPrimary }} />
  </label>;
}
