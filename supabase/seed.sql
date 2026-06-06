-- Supabase initialization script for school website CMS
-- Run this in the Supabase SQL editor to set up the database schema and initial data

-- Drop existing tables if needed (comment out if you want to preserve existing data)
-- drop table if exists notices cascade;
-- drop table if exists gallery cascade;
-- drop table if exists site_content cascade;

-- Create site_content table
create table if not exists site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text,
  subtitle text,
  content text,
  image_url text,
  updated_at timestamp with time zone default now()
);

-- Create gallery table
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  category text default 'Campus',
  created_at timestamp with time zone default now()
);

-- Create notices table
create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  publish_date date not null,
  created_at timestamp with time zone default now()
);

-- Insert initial site content (matches the MVP static data)
insert into site_content (section_key, title, subtitle, content) values
  (
    'brand',
    'Shree Gujarati Samaj School',
    'Indore',
    '{"tagline":"Affordable, heritage-rich education for every Gujarati family in Indore.","description":"A landmark school with a history of community service, full facilities, and holistic student growth across academics, sports and culture."}'
  ),
  (
    'hero',
    'Heritage education for Gujarati families, built for modern admissions.',
    'Shree Gujarati Samaj School blends disciplined academics, cultural pride and affordable facilities to make every parent feel confident about their child''s future.',
    '[{"value":"1500+","label":"Students currently enrolled"},{"value":"55+","label":"Experienced teaching staff"},{"value":"1957","label":"Heritage since"},{"value":"24 years","label":"Free summer sports camp"}]'
  ),
  (
    'benefits',
    'Why Parents Choose Us',
    'A school built around affordability, facilities, and trust.',
    '[{"title":"Affordable full-service education","description":"Low fees with outstanding facilities, nutritious snacks and transportation across Indore."},{"title":"CBSE-aligned KG classrooms","description":"Structured early years learning with modern classrooms designed for young minds."},{"title":"Free weekly nutritious snacks","description":"Nursery to grade 5 students receive healthy midweek snacks to support focused learning."},{"title":"Free summer sports & activity camp","description":"24 years of free summer coaching, athletics, and team-building for school children."},{"title":"City-wide bus service","description":"Convenient and affordable transport available across Indore for every student."},{"title":"Montessori-trained faculty","description":"Most academic staff hold postgraduate and B.Ed Montessori qualifications for stronger learning outcomes."}]'
  ),
  (
    'about',
    'A Gujarati heritage school that also prepares every child for modern success.',
    'Founded with deep community roots in 1957, the school continues to grow with disciplined teaching, strong cultural values and a student-first approach.',
    '{"paragraphs":["Shree Gujarati Samaj School has been a community pillar since 1957. It began with just seven students on Jail Road and has grown into one of Indore''s most trusted schools through dedication, disciplined teaching and strong Gujarati cultural roots.","The school was founded with the generous support of Shri Manilal Parikh and his wife Smt. Chanchalben Parikh. Their belief in education and community service created a learning environment that continues to nurture responsible young citizens."]}'
  ),
  (
    'academic',
    'Academic excellence through active learning',
    'We balance strong classroom learning with clubs, sports and practical skills so every student grows with confidence, discipline and creativity.',
    '{"highlights":["Free summer sports camp for every student","CBSE-aligned KG curriculum and early learning support","Holistic activities in craft, music, computer science and culture","Regular training in skating, badminton, chess and table tennis"]}'
  ),
  (
    'admissions',
    'Admissions that welcome every family',
    'Start your child''s journey with a school that combines strong scholarship, community values, and a supportive environment for every learner.',
    '{"steps":[{"label":"01","title":"Schedule a visit","description":"See the campus and meet our admissions team in person."},{"label":"02","title":"Discuss the program","description":"Review classroom, transport, nutrition and fee details together."},{"label":"03","title":"Enroll with confidence","description":"Complete registration and begin the admissions process smoothly."}]}'
  ),
  (
    'contact',
    'Get in touch',
    'Our admissions team is ready to answer questions about fees, transport, student life and enrollment.',
    '{"phone":"0731-2706468","altPhone":"2703447","email":"sgsindore@hotmail.com","address":"1, Nasiya Road, Indore, M.P., India"}'
  );

-- Create RLS policies for public read access
alter table site_content enable row level security;
alter table gallery enable row level security;
alter table notices enable row level security;

create policy "Allow public read" on site_content for select to anon using (true);
create policy "Allow public read" on gallery for select to anon using (true);
create policy "Allow public read" on notices for select to anon using (true);

-- Note: For write access, set up authentication with email/password in Supabase Auth
-- Then add policies for authenticated admin users
