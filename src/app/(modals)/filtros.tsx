import { Redirect } from 'expo-router';

export default function FiltersModalScreen() {
  // Entrada enlazable al único panel/estado de Home, sin otra copia modal.
  return <Redirect href={{ pathname: '/', params: { panel: 'date' } }} />;
}
