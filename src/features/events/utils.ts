/** Única frontera que acepta euros del legado; rechaza fracciones de céntimo. */
export function eurosToCents(euros: number): number {
  if (!Number.isFinite(euros) || euros < 0) throw new Error('Precio no válido');
  const scaled = euros * 100;
  const cents = Math.round(scaled);
  const tolerance = Math.min(0.000001, Number.EPSILON * Math.max(1, scaled) * 4);
  if (!Number.isSafeInteger(cents) || Math.abs(scaled - cents) > tolerance) {
    throw new Error('El precio debe representar céntimos enteros seguros');
  }
  return cents;
}

export function optionalText(value: string): string | undefined {
  return value.trim() || undefined;
}
