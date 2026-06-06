-- Phase 3 operational improvements: activity log, draft/publish status
-- Safe to re-run on existing databases.

-- Draft / publish support
alter table site_content add column if not exists status text default 'published';
alter table notices add column if not exists status text default 'published';

-- Lightweight activity log
create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text,
  entity_id text,
  details text,
  actor_email text,
  created_at timestamptz default now()
);

alter table activity_log enable row level security;

-- Authenticated admins can read/write activity log
do $$ begin
  create policy "authenticated read activity_log" on activity_log
    for select to authenticated using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated insert activity_log" on activity_log
    for insert to authenticated with check (true);
exception when duplicate_object then null;
end $$;

-- Role setup (run manually per user in Supabase Auth):
-- update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email = 'admin@school.com';
-- update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"editor"}' where email = 'editor@school.com';
