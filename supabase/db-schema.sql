-- Supabase schema for dynamic school website

create table if not exists site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text,
  subtitle text,
  content text,
  image_url text,
  updated_at timestamp with time zone default now()
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  category text,
  created_at timestamp with time zone default now()
);

create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  publish_date date not null,
  created_at timestamp with time zone default now()
);
