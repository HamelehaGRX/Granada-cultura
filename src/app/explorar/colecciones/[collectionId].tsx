import { useLocalSearchParams } from 'expo-router';

import { CollectionDetailScreen } from '@/features/explore/screens/CollectionDetailScreen';

export default function CollectionDetailRoute() {
  const { collectionId } = useLocalSearchParams<{ collectionId: string }>();
  return <CollectionDetailScreen collectionId={collectionId ?? ''} />;
}
