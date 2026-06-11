-- Phase 4: Add write RLS policies for admin-only access
-- Run this in Supabase SQL editor after initial setup
-- This ensures only users with role='admin' can modify CMS data

-- Drop existing policies if they exist (safe to re-run)
drop policy if exists "Admins can update site_content" on site_content;
drop policy if exists "Admins can insert site_content" on site_content;
drop policy if exists "Admins can delete site_content" on site_content;

drop policy if exists "Admins can update gallery" on gallery;
drop policy if exists "Admins can insert gallery" on gallery;
drop policy if exists "Admins can delete gallery" on gallery;

drop policy if exists "Admins can update notices" on notices;
drop policy if exists "Admins can insert notices" on notices;
drop policy if exists "Admins can delete notices" on notices;

-- site_content write policies (admin only)
create policy "Admins can update site_content" on site_content
  for update to authenticated using (
    auth.jwt()->>'role' = 'admin'
  );

create policy "Admins can insert site_content" on site_content
  for insert to authenticated with check (
    auth.jwt()->>'role' = 'admin'
  );

create policy "Admins can delete site_content" on site_content
  for delete to authenticated using (
    auth.jwt()->>'role' = 'admin'
  );

-- gallery write policies (admin only)
create policy "Admins can update gallery" on gallery
  for update to authenticated using (
    auth.jwt()->>'role' = 'admin'
  );

create policy "Admins can insert gallery" on gallery
  for insert to authenticated with check (
    auth.jwt()->>'role' = 'admin'
  );

create policy "Admins can delete gallery" on gallery
  for delete to authenticated using (
    auth.jwt()->>'role' = 'admin'
  );

-- notices write policies (admin only)
create policy "Admins can update notices" on notices
  for update to authenticated using (
    auth.jwt()->>'role' = 'admin'
  );

create policy "Admins can insert notices" on notices
  for insert to authenticated with check (
    auth.jwt()->>'role' = 'admin'
  );

create policy "Admins can delete notices" on notices
  for delete to authenticated using (
    auth.jwt()->>'role' = 'admin'
  );

-- Update activity_log policies to admin-only read/write
drop policy if exists "authenticated read activity_log" on activity_log;
drop policy if exists "authenticated insert activity_log" on activity_log;

create policy "Admins can read activity_log" on activity_log
  for select to authenticated using (
    auth.jwt()->>'role' = 'admin'
  );

create policy "Admins can insert activity_log" on activity_log
  for insert to authenticated with check (
    auth.jwt()->>'role' = 'admin'
  );
