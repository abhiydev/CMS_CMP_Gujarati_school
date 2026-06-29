import { supabase } from './supabaseClient.js';

export async function logActivity({ action, entityType = null, entityId = null, details = null, actorEmail = null }) {
  try {
    const { error } = await supabase.from('activity_log').insert({
      action,
      entity_type: entityType,
      entity_id: entityId ? String(entityId) : null,
      details,
      actor_email: actorEmail,
    });
    if (error && import.meta.env.DEV) {
      console.warn('Activity log insert failed:', error.message);
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('Activity log insert failed:', err);
    }
  }
}

export async function fetchRecentActivity(limit = 20) {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    if (import.meta.env.DEV) console.warn('Activity fetch failed:', error.message);
    return [];
  }
  return data ?? [];
}
