import { useEffect } from 'react';

/** Variante web aislada: Escape descarta el borrador del diálogo. */
export function useFilterModalEscape(visible: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onDismiss();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss, visible]);
}
