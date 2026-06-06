-- Run in Supabase SQL editor to add CMS sections missing from initial seed.
-- Safe to re-run: uses ON CONFLICT DO NOTHING.

insert into site_content (section_key, title, subtitle, content) values
  (
    'facilities',
    'Spaces and services designed around student wellbeing.',
    'Every facility is chosen to support learning, play, health and the strong cultural identity of the school.',
    '[{"title":"Fully equipped classrooms","description":"CBSE pattern KG sections and classrooms designed to encourage early academic curiosity.","image":""},{"title":"Cultural celebration spaces","description":"Regular events and performances that keep Gujarati values alive through music, dance and festivals.","image":""},{"title":"Play zone for pre-primary learners","description":"Safe, playful spaces for younger students to explore and build confidence every day.","image":""},{"title":"Nutritious midweek snacks","description":"Thursday snacks for nursery through grade 5 ensure healthy growth and better concentration.","image":""},{"title":"Transport across Indore","description":"Affordable bus connectivity to the school from multiple city locations.","image":""},{"title":"Experienced faculty & staff","description":"A team of teachers and support staff committed to discipline, values and academic progress.","image":""}]'
  ),
  (
    'studentLife',
    'A lively campus day where learning meets culture and sports.',
    'The school brings together academic learning, performances, competitions and community celebrations in one active environment.',
    '[{"title":"Cultural performances","image":""},{"title":"Sports and teamwork","image":""},{"title":"Creative events","image":""},{"title":"Community celebrations","image":""}]'
  ),
  (
    'leadership',
    'Guiding every child with care, discipline and conviction.',
    'The school leadership shares a clear vision for success and character-building at every stage of learning.',
    '[{"name":"निधी मुंगी","role":"Head Mistress","position":"च. म. प. गुजराती प्राइमरी एव मिडिल स्कूल, इंदौर","image":"","quote":"प्यारे बच्चो, हमें हमेशा आत्मविश्वास बनाए रखना है।"},{"name":"कमलेशभाई","role":"Chairman","position":"च. म. प. गुजराती प्राइमरी एव मिडिल स्कूल, इंदौर","image":"","quote":"आज का जीवन पूरी तरह तकनीकी हो चुका है।"}]'
  )
on conflict (section_key) do nothing;

-- Extend academic content with editable achievement chips (merge manually if row already exists).
-- update site_content
-- set content = content::jsonb || '{"achievements":["1500+ students guided","CBSE-pattern KG classes","Free summer sports camp","Play zone for young learners"]}'::jsonb
-- where section_key = 'academic';
