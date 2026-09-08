import { Redirect, useLocalSearchParams } from 'expo-router';

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string | string[] }>();
  return <Redirect href={{ pathname: '/', params: { q: (Array.isArray(q) ? q[0] : q) ?? '' } }} />;
}
