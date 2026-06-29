import { storageBucket } from '../services/supabaseClient.js';

/** Extract storage object path from a Supabase public URL. */
export function parseStoragePathFromUrl(publicUrl) {
  if (!publicUrl || typeof publicUrl !== 'string') return null;

  const bucketMarker = `/storage/v1/object/public/${storageBucket}/`;
  const bucketIndex = publicUrl.indexOf(bucketMarker);
  if (bucketIndex !== -1) {
    return decodeURIComponent(publicUrl.slice(bucketIndex + bucketMarker.length).split('?')[0]);
  }

  // Signed or render URLs — try trailing path segment after bucket name
  const looseMarker = `/${storageBucket}/`;
  const looseIndex = publicUrl.indexOf(looseMarker);
  if (looseIndex !== -1) {
    return decodeURIComponent(publicUrl.slice(looseIndex + looseMarker.length).split('?')[0]);
  }

  return null;
}
