-- NovelStack seed data — run AFTER schema.sql in the Supabase SQL editor.
-- Creates 3 writers (via auth.users, so the new-user trigger fires),
-- then 3 stories with chapters and bodies.
--
-- NOTE: inserting into auth.users directly is the simplest way to seed.
-- If your Supabase version rejects these columns, create the 3 users from
-- the Auth dashboard instead, then run only the UPDATE / story sections
-- with their real ids. (Flagged in MVP_PROGRESS.md.)

insert into auth.users
  (id, instance_id, aud, role, email, encrypted_password,
   email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values
  ('11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-000000000000',
   'authenticated','authenticated','maya@example.com','',
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Maya R."}'),
  ('22222222-2222-2222-2222-222222222222','00000000-0000-0000-0000-000000000000',
   'authenticated','authenticated','jokafor@example.com','',
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"J. Okafor"}'),
  ('33333333-3333-3333-3333-333333333333','00000000-0000-0000-0000-000000000000',
   'authenticated','authenticated','lchen@example.com','',
   now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"L. Chen"}')
on conflict (id) do nothing;

-- The on_auth_user_created trigger already made public.users rows — tidy them.
update public.users set username='mayar',  role='writer', is_verified=true,
  bio='Romance, mostly. Slow burns a speciality.' where id='11111111-1111-1111-1111-111111111111';
update public.users set username='jokafor', role='writer', is_verified=true,
  bio='Secondary-world fantasy and the occasional sea monster.' where id='22222222-2222-2222-2222-222222222222';
update public.users set username='lchen',  role='writer',
  bio='Quiet sci-fi about loud feelings.' where id='33333333-3333-3333-3333-333333333333';

-- Stories
insert into public.stories
  (id, author_id, title, slug, description, cover_color, genre, status, total_reads, published_at)
values
  ('aaaaaaaa-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',
   'The Long Way Home','the-long-way-home',
   'She left town with a backpack and a one-way fare. The road had other plans.',
   '#D85A30','romance','ongoing',340000, now()),
  ('aaaaaaaa-0000-0000-0000-000000000002','22222222-2222-2222-2222-222222222222',
   'Saltwater Kingdom','saltwater-kingdom',
   'A drowned dynasty wakes beneath the tide, and only a smuggler''s daughter can hear it.',
   '#4F4AAA','fantasy','ongoing',512000, now()),
  ('aaaaaaaa-0000-0000-0000-000000000003','33333333-3333-3333-3333-333333333333',
   'Soft Static','soft-static',
   'Two strangers share a frequency no one else can hear.',
   '#1D9E75','scifi','ongoing',208000, now())
on conflict (id) do nothing;

-- Chapters (first 3 free per story). page_count = word_count / 250.
insert into public.chapters
  (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values
  ('cccccccc-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000001',
   1,'The one-way fare','She didn''t turn back. Not when the rain started, not when the road dipped out of sight.',
   60,1,true, now()),
  ('cccccccc-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   2,'A town with no name','By the second morning the map had stopped being useful and started being a story.',
   58,1,true, now()),
  ('cccccccc-0000-0000-0000-000000000003','aaaaaaaa-0000-0000-0000-000000000001',
   3,'Borrowed weather','The diner served coffee like an apology and she took three cups of it.',
   55,1,true, now()),
  ('cccccccc-0000-0000-0000-000000000004','aaaaaaaa-0000-0000-0000-000000000001',
   4,'The long way','Some doors only open once, and she had already chosen this one.',
   62,1,false, now()),
  ('cccccccc-0000-0000-0000-000000000010','aaaaaaaa-0000-0000-0000-000000000002',
   1,'The tide remembers','The sea gave back everything eventually, her father said. He was wrong about the order.',
   59,1,true, now()),
  ('cccccccc-0000-0000-0000-000000000020','aaaaaaaa-0000-0000-0000-000000000003',
   1,'Frequency','The radio caught a voice that the manual swore could not exist.',
   54,1,true, now())
on conflict (id) do nothing;

insert into public.chapter_content (chapter_id, body) values
  ('cccccccc-0000-0000-0000-000000000001',
   'She didn''t turn back. Not when the rain started, not when the road dipped out of sight. Some doors only open once — and she''d already chosen this one. The town behind her had a name she would stop saying by spring, and the one ahead of her had no name she knew yet at all. That was the point.'),
  ('cccccccc-0000-0000-0000-000000000002',
   'By the second morning the map had stopped being useful and started being a story. Roads she had never driven curled toward towns she had never named.'),
  ('cccccccc-0000-0000-0000-000000000003',
   'The diner served coffee like an apology and she took three cups of it. The waitress watched her the way you watch weather.'),
  ('cccccccc-0000-0000-0000-000000000004',
   'Some doors only open once, and she had already chosen this one. What waited on the far side of it had been waiting a long time.'),
  ('cccccccc-0000-0000-0000-000000000010',
   'The sea gave back everything eventually, her father said. He was wrong about the order, and he was wrong about the cost.'),
  ('cccccccc-0000-0000-0000-000000000020',
   'The radio caught a voice that the manual swore could not exist. It said her name like it had been practising.')
on conflict (chapter_id) do nothing;
