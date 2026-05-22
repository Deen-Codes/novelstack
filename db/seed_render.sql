-- NovelStack — FULL catalog seed (combined, idempotent).
-- Run once in the Supabase SQL editor, AFTER schema.sql + seed.sql + migrations 001/002/003.
-- Every insert uses ON CONFLICT DO NOTHING, so re-running is safe.
-- Assembled from seed_catalog.sql + seed_parts/batch2-5 on 2026-05-22.


-- ==================== seed_catalog.sql ====================

-- NovelStack — catalog seed (batch 1)
-- Run AFTER schema.sql, seed.sql, and migrations 001 + 002, in the Supabase SQL editor.
-- 16 author accounts + 16 stories across every genre, each with 3 chapters
-- (opening chapters fully written, chapter 3 a shorter locked teaser).
-- Voice, tense, person and quality are varied on purpose — a real catalog is uneven.
-- Idempotent: every insert uses ON CONFLICT DO NOTHING.

-- ============================================================
-- AUTHORS  (auth.users insert -> trigger makes public.users -> UPDATE)
-- ============================================================
insert into auth.users
  (id, instance_id, aud, role, email, encrypted_password,
   email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values
  ('5eed0001-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-01@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Priya Anand"}'),
  ('5eed0001-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-02@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"E. M. Castle"}'),
  ('5eed0001-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-03@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"honeybadgerwrites"}'),
  ('5eed0001-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-04@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Dani"}'),
  ('5eed0001-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-05@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Tomas Vey"}'),
  ('5eed0001-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-06@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"goblin_hours"}'),
  ('5eed0001-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-07@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"R. Adeyemi"}'),
  ('5eed0001-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-08@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Lena Hoff"}'),
  ('5eed0001-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-09@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"ceres_night_shift"}'),
  ('5eed0001-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-10@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"J. P. Marsh"}'),
  ('5eed0001-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-11@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Carmen Ruiz"}'),
  ('5eed0001-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-12@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Aoife Brennan"}'),
  ('5eed0001-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-13@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"nina."}'),
  ('5eed0001-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-14@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"H. Okonkwo"}'),
  ('5eed0001-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-15@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"starlight_acolyte"}'),
  ('5eed0001-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000000','authenticated','authenticated','seed-16@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Wren Salt"}')
on conflict (id) do nothing;

update public.users set username='priya.anand', role='writer', is_verified=false, bio='Contemporary romance, mostly set in places I have actually stood in.', date_of_birth='1991-03-14' where id='5eed0001-0000-0000-0000-000000000001';
update public.users set username='emcastle', role='writer', is_verified=true, bio='Historical romance. Letters, longing, bad weather.', date_of_birth='1984-07-02' where id='5eed0001-0000-0000-0000-000000000002';
update public.users set username='honeybadgerwrites', role='both', is_verified=false, bio='i write soft fantasy and reply to comments too much', date_of_birth='1998-11-20' where id='5eed0001-0000-0000-0000-000000000003';
update public.users set username='dani.txt', role='writer', is_verified=false, bio=null, date_of_birth='2001-05-09' where id='5eed0001-0000-0000-0000-000000000004';
update public.users set username='tomasvey', role='writer', is_verified=true, bio='Secondary-world fantasy. Slow maps, slower kings.', date_of_birth='1979-09-30' where id='5eed0001-0000-0000-0000-000000000005';
update public.users set username='goblin_hours', role='both', is_verified=false, bio='markets, mostly', date_of_birth='2000-02-17' where id='5eed0001-0000-0000-0000-000000000006';
update public.users set username='r.adeyemi', role='writer', is_verified=false, bio='Fantasy with maps in the front and regret in the back.', date_of_birth='1989-12-01' where id='5eed0001-0000-0000-0000-000000000007';
update public.users set username='lenahoff', role='writer', is_verified=false, bio='quiet sci-fi. i promise the engine is a metaphor.', date_of_birth='1993-06-22' where id='5eed0001-0000-0000-0000-000000000008';
update public.users set username='ceres_night_shift', role='writer', is_verified=false, bio=null, date_of_birth='1996-08-08' where id='5eed0001-0000-0000-0000-000000000009';
update public.users set username='jpmarsh', role='writer', is_verified=false, bio='Thrillers about ordinary commutes that go wrong.', date_of_birth='1982-01-19' where id='5eed0001-0000-0000-0000-000000000010';
update public.users set username='carmenruiz', role='writer', is_verified=false, bio='Mystery. The dog always knows first.', date_of_birth='1987-04-27' where id='5eed0001-0000-0000-0000-000000000011';
update public.users set username='aoifebrennan', role='writer', is_verified=true, bio='Family drama, mostly. I am sorry in advance.', date_of_birth='1976-10-11' where id='5eed0001-0000-0000-0000-000000000012';
update public.users set username='nina.', role='writer', is_verified=false, bio='kitchen stories', date_of_birth='2003-03-03' where id='5eed0001-0000-0000-0000-000000000013';
update public.users set username='h.okonkwo', role='writer', is_verified=false, bio='Horror that happens one floor away.', date_of_birth='1990-10-31' where id='5eed0001-0000-0000-0000-000000000014';
update public.users set username='starlight_acolyte', role='both', is_verified=false, bio='Starlight Academy fan, second-year arc, NO SPOILERS in comments pls', date_of_birth='2002-07-14' where id='5eed0001-0000-0000-0000-000000000015';
update public.users set username='wrensalt', role='writer', is_verified=false, bio='poems about tin roofs and the people under them', date_of_birth='1994-09-05' where id='5eed0001-0000-0000-0000-000000000016';

-- ============================================================
-- STORIES
-- ============================================================
insert into public.stories
  (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values
  ('5eed0002-0000-0000-0000-000000000001','5eed0001-0000-0000-0000-000000000001','The Tuesday Market','the-tuesday-market-7g2','He sells bread she cannot afford to like. She keeps coming back on Tuesdays anyway.','#D8642F','romance','{"slow-burn","small-town","contemporary"}','ongoing',false,184200,9120,now() - interval '46 days',now() - interval '3 days'),
  ('5eed0002-0000-0000-0000-000000000002','5eed0001-0000-0000-0000-000000000002','A Letter Half Sent','a-letter-half-sent-q4m','In 1893 a governess writes to a man she has never met, and posts only half of it.','#7A4B33','romance','{"historical","epistolary","yearning"}','complete',false,96400,5210,now() - interval '210 days',now() - interval '60 days'),
  ('5eed0002-0000-0000-0000-000000000003','5eed0001-0000-0000-0000-000000000003','The Witch Keeps Bees','the-witch-keeps-bees-x1k','The hedge-witch of Larrow wants to be left alone. The new doctor will not be told.','#C28A1E','romance','{"fantasy-romance","cottagecore","grumpy-sunshine"}','ongoing',false,251700,14800,now() - interval '88 days',now() - interval '1 days'),
  ('5eed0002-0000-0000-0000-000000000004','5eed0001-0000-0000-0000-000000000004','Text Me When You Land','text-me-when-you-land-p9w','Two time zones, one bad idea, and a group chat that will not let it go.','#E0556B','romance','{"contemporary","long-distance","messy"}','ongoing',true,73900,3400,now() - interval '20 days',now() - interval '2 days'),
  ('5eed0002-0000-0000-0000-000000000005','5eed0001-0000-0000-0000-000000000005','The Salt-Eaten Crown','the-salt-eaten-crown-v3d','A coastal kingdom crowns its kings by drowning them first. This year the heir can swim.','#3F5C8A','fantasy','{"epic-fantasy","sea","politics"}','ongoing',false,402000,22100,now() - interval '130 days',now() - interval '5 days'),
  ('5eed0002-0000-0000-0000-000000000006','5eed0001-0000-0000-0000-000000000006','Goblin Market Day','goblin-market-day-m7n','Every fourth Sunday the market opens under the bridge. Mind your pockets, mind your name.','#5E7A2E','fantasy','{"urban-fantasy","fae","first-person"}','paused',false,41200,1980,now() - interval '160 days',now() - interval '120 days'),
  ('5eed0002-0000-0000-0000-000000000007','5eed0001-0000-0000-0000-000000000007','Nine Doors for the Cartographer','nine-doors-cartographer-b5t','She maps a city that rearranges itself nightly. Eight doors are charted. The ninth charts her.','#6A4E7C','fantasy','{"portal-fantasy","maps","present-tense"}','ongoing',false,158600,8730,now() - interval '74 days',now() - interval '6 days'),
  ('5eed0002-0000-0000-0000-000000000008','5eed0001-0000-0000-0000-000000000008','The Quiet Engine','the-quiet-engine-h2c','The generation ship runs perfectly. That is the first thing the new archivist learns to distrust.','#2E6E78','scifi','{"generation-ship","mystery","literary"}','ongoing',false,127300,7050,now() - interval '52 days',now() - interval '4 days'),
  ('5eed0002-0000-0000-0000-000000000009','5eed0001-0000-0000-0000-000000000009','Last Shift on Ceres','last-shift-on-ceres-k8r','The mining station closes in ninety days. Someone does not want the last crew to leave.','#8A5230','scifi','{"space","horror-adjacent","blue-collar"}','ongoing',true,58900,2640,now() - interval '33 days',now() - interval '7 days'),
  ('5eed0002-0000-0000-0000-000000000010','5eed0001-0000-0000-0000-000000000010','The Commuter','the-commuter-r6y','The 7:14 train carries the same forty faces every morning. Today it carries thirty-nine.','#4A4A52','thriller','{"thriller","commute","present-tense"}','ongoing',false,213400,11200,now() - interval '40 days',now() - interval '2 days'),
  ('5eed0002-0000-0000-0000-000000000011','5eed0001-0000-0000-0000-000000000011','Who Fed the Dog','who-fed-the-dog-d3v','A locked house, a dead man, and a spaniel that is somehow not hungry.','#9A7B2E','mystery','{"cozy-mystery","whodunit","amateur-sleuth"}','complete',false,142800,6900,now() - interval '180 days',now() - interval '44 days'),
  ('5eed0002-0000-0000-0000-000000000012','5eed0001-0000-0000-0000-000000000012','The Inheritance of Spoons','inheritance-of-spoons-w2q','Three sisters, one farmhouse, and a drawer of cutlery nobody will divide.','#6E5A3C','drama','{"family-drama","grief","literary"}','ongoing',false,89100,5400,now() - interval '61 days',now() - interval '8 days'),
  ('5eed0002-0000-0000-0000-000000000013','5eed0001-0000-0000-0000-000000000013','my mother''s kitchen','my-mothers-kitchen-t8x','a girl learns her mother''s recipes the year her mother forgets them.','#B06A4A','drama','{"slice-of-life","memory","first-person"}','ongoing',false,30700,1610,now() - interval '15 days',now() - interval '1 days'),
  ('5eed0002-0000-0000-0000-000000000014','5eed0001-0000-0000-0000-000000000014','The Tenant Below','the-tenant-below-z5h','The flat downstairs has been empty for years. The footsteps disagree.','#3A2E2E','horror','{"horror","haunting","slow-dread"}','ongoing',true,176500,9800,now() - interval '57 days',now() - interval '3 days'),
  ('5eed0002-0000-0000-0000-000000000015','5eed0001-0000-0000-0000-000000000015','Starlight Academy: Second Year','starlight-academy-second-year-c1f','The Academy said second year would be easier. The Academy lied, like it does.','#5544A0','fanfiction','{"fanfiction","academy","found-family"}','ongoing',false,64300,4120,now() - interval '28 days',now() - interval '2 days'),
  ('5eed0002-0000-0000-0000-000000000016','5eed0001-0000-0000-0000-000000000016','Tin Roof Songs','tin-roof-songs-n9s','Short poems for long summers, written under a roof that keeps the rain honest.','#4E7A5E','poetry','{"poetry","summer","collection"}','ongoing',false,18900,1240,now() - interval '70 days',now() - interval '9 days')
on conflict (id) do nothing;

-- ============================================================
-- CHAPTERS + BODIES
-- ============================================================
insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at) values
  ('5eed0003-0000-0000-0000-000000010001','5eed0002-0000-0000-0000-000000000001',1,'Sourdough','The stall opened at six and by seven the good loaves were gone, which Mara knew, which was why she always came at half past.',96,1,true,now() - interval '46 days'),
  ('5eed0003-0000-0000-0000-000000010002','5eed0002-0000-0000-0000-000000000001',2,'Exact Change','He never had change and she never had the right coins, and somehow this had become a small weekly negotiation neither of them wanted to win.',92,1,true,now() - interval '39 days'),
  ('5eed0003-0000-0000-0000-000000010003','5eed0002-0000-0000-0000-000000000001',3,'The Rye','By the fourth Tuesday he set a loaf aside without being asked.',54,1,true,now() - interval '32 days'),
  ('5eed0003-0000-0000-0000-000000010011','5eed0002-0000-0000-0000-000000000002',1,'October','I have begun this letter four times. The fire is poor and my excuses are worse, so I will simply say it: the post brought your name today.',95,1,true,now() - interval '210 days'),
  ('5eed0003-0000-0000-0000-000000010012','5eed0002-0000-0000-0000-000000000002',2,'What I Did Not Write','There is a version of this letter in the grate. It said too much and I am not yet brave in that particular way.',88,1,true,now() - interval '204 days'),
  ('5eed0003-0000-0000-0000-000000010013','5eed0002-0000-0000-0000-000000000002',3,'Spring, Posted Whole','This one I will send entire. Every word of it. Even the ones that frighten me.',49,1,true,now() - interval '190 days'),
  ('5eed0003-0000-0000-0000-000000010021','5eed0002-0000-0000-0000-000000000003',1,'A Sting Is a Sentence','The witch of Larrow did not dislike people. She simply found that bees asked less of her and gave back honey, which was a fairer trade than most.',97,1,true,now() - interval '88 days'),
  ('5eed0003-0000-0000-0000-000000010022','5eed0002-0000-0000-0000-000000000003',2,'The New Doctor','He knocked like a man who expected doors to obey him. She let him knock.',86,1,true,now() - interval '80 days'),
  ('5eed0003-0000-0000-0000-000000010023','5eed0002-0000-0000-0000-000000000003',3,'Honey for a Fever','He came back. Of course he came back. People always did once the bees had been kind to them.',52,1,false,now() - interval '70 days'),
  ('5eed0003-0000-0000-0000-000000010031','5eed0002-0000-0000-0000-000000000004',1,'Wheels Up','okay so the thing about loving someone in a different time zone is the math. its always the math. its 11pm here and hes already in tomorrow.',90,1,true,now() - interval '20 days'),
  ('5eed0003-0000-0000-0000-000000010032','5eed0002-0000-0000-0000-000000000004',2,'The Group Chat Has Opinions','three notifications. all of them my friends. none of them helpful.',78,1,true,now() - interval '14 days'),
  ('5eed0003-0000-0000-0000-000000010033','5eed0002-0000-0000-0000-000000000004',3,'Layover','six hours in an airport is either a romance or a breakdown and i havent decided which.',46,1,false,now() - interval '8 days'),
  ('5eed0003-0000-0000-0000-000000010041','5eed0002-0000-0000-0000-000000000005',1,'The Drowning of Kings','On the morning they meant to drown him, the heir of Vael woke early, ate well, and checked, as he had every day for nineteen years, that he still remembered how to swim.',98,1,true,now() - interval '130 days'),
  ('5eed0003-0000-0000-0000-000000010042','5eed0002-0000-0000-0000-000000000005',2,'Salt in the Lungs','The court called it tradition. His mother called it necessary. He had learned, young, that the two words were often worn by the same ugly thing.',90,1,true,now() - interval '120 days'),
  ('5eed0003-0000-0000-0000-000000010043','5eed0002-0000-0000-0000-000000000005',3,'A Crown That Floats','They had not, in four hundred years, planned for an heir who simply did not die.',55,1,true,now() - interval '110 days'),
  ('5eed0003-0000-0000-0000-000000010051','5eed0002-0000-0000-0000-000000000006',1,'Mind Your Name','First rule my nan gave me about the bridge market: dont tell anyone your name, not even the nice ones, especially not the nice ones.',88,1,true,now() - interval '160 days'),
  ('5eed0003-0000-0000-0000-000000010052','5eed0002-0000-0000-0000-000000000006',2,'The Apple Seller','She had eyes like wet coins and she knew i hadnt eaten. thats the trick of them. they always know.',74,1,true,now() - interval '150 days'),
  ('5eed0003-0000-0000-0000-000000010053','5eed0002-0000-0000-0000-000000000006',3,'What I Paid','i still have all my fingers. im just careful now about what sundays i answer to.',44,1,false,now() - interval '140 days'),
  ('5eed0003-0000-0000-0000-000000010061','5eed0002-0000-0000-0000-000000000007',1,'Eight Doors','Tonight the city keeps still long enough for Senna to ink the eighth door, and she lets herself, for one careful breath, feel something like finished.',92,1,true,now() - interval '74 days'),
  ('5eed0003-0000-0000-0000-000000010062','5eed0002-0000-0000-0000-000000000007',2,'The Map Objects','The line will not hold. She draws the street and the street, politely and completely, declines to be there in the morning.',84,1,true,now() - interval '66 days'),
  ('5eed0003-0000-0000-0000-000000010063','5eed0002-0000-0000-0000-000000000007',3,'The Ninth','It is not on any wall. It opens, she understands, inward.',47,1,false,now() - interval '58 days'),
  ('5eed0003-0000-0000-0000-000000010071','5eed0002-0000-0000-0000-000000000008',1,'Archivist','The ship had run for two hundred years without complaint, and Iris was hired, at great expense, to read the complaints it had never filed.',93,1,true,now() - interval '52 days'),
  ('5eed0003-0000-0000-0000-000000010072','5eed0002-0000-0000-0000-000000000008',2,'A Perfect Record','Nothing had gone wrong on the Quiet Engine. Not once. Iris had worked enough jobs to know that nothing was the loudest word in any log.',91,1,true,now() - interval '44 days'),
  ('5eed0003-0000-0000-0000-000000010073','5eed0002-0000-0000-0000-000000000008',3,'Deck Seven','Deck Seven was on every schematic and on no map the crew would draw for her.',50,1,false,now() - interval '36 days'),
  ('5eed0003-0000-0000-0000-000000010081','5eed0002-0000-0000-0000-000000000009',1,'Ninety Days','Corin had ninety days left on Ceres and a list of things to fix, and the list, he noticed that morning, was one item longer than he had left it.',94,1,true,now() - interval '33 days'),
  ('5eed0003-0000-0000-0000-000000010082','5eed0002-0000-0000-0000-000000000009',2,'The Headcount','Forty-one crew signed the closure roster. Forty-one badges scanned out each night. The night cycle counted forty-two warm bodies and would not be argued with.',92,1,true,now() - interval '24 days'),
  ('5eed0003-0000-0000-0000-000000010083','5eed0002-0000-0000-0000-000000000009',3,'Lower Levels','Nobody had been down to the old shafts in a year. The dust there, Corin saw, had been walked through recently.',53,1,false,now() - interval '14 days'),
  ('5eed0003-0000-0000-0000-000000010091','5eed0002-0000-0000-0000-000000000010',1,'The 7:14','It is a Tuesday and the train is exactly on time, and Helen counts the carriage the way she always does, without meaning to, the way some people crack knuckles.',95,1,true,now() - interval '40 days'),
  ('5eed0003-0000-0000-0000-000000010092','5eed0002-0000-0000-0000-000000000010',2,'Thirty-Nine','The man in the grey coat is not here. He is always here. He is the sort of fact a morning is built on, and the morning, today, is missing one.',93,1,true,now() - interval '33 days'),
  ('5eed0003-0000-0000-0000-000000010093','5eed0002-0000-0000-0000-000000000010',3,'The Empty Seat','By Friday three more seats are wrong, and Helen stops telling herself she is the only one counting.',49,1,false,now() - interval '26 days'),
  ('5eed0003-0000-0000-0000-000000010101','5eed0002-0000-0000-0000-000000000011',1,'A Spaniel, Unbothered','When they found Mr Aldous dead in his locked study, the only living thing in the house was his spaniel, and the spaniel was not, by any measure, distressed.',96,1,true,now() - interval '180 days'),
  ('5eed0003-0000-0000-0000-000000010102','5eed0002-0000-0000-0000-000000000011',2,'The Untouched Bowl','I have kept dogs my whole life. A dog that has lost its master does not finish breakfast. This one had not started it.',88,1,true,now() - interval '174 days'),
  ('5eed0003-0000-0000-0000-000000010103','5eed0002-0000-0000-0000-000000000011',3,'Who Was Kind','Someone in that house had been kind to the dog on the worst morning of its life. I only had to find out who.',51,1,true,now() - interval '166 days'),
  ('5eed0003-0000-0000-0000-000000010111','5eed0002-0000-0000-0000-000000000012',1,'The Drawer','The farmhouse had been divided in principle for years. In practice it came down, as these things do, to a drawer of spoons no sister would claim and none would surrender.',95,1,true,now() - interval '61 days'),
  ('5eed0003-0000-0000-0000-000000010112','5eed0002-0000-0000-0000-000000000012',2,'Eldest','Bridget arrived first, because Bridget always arrived first, and stood in the kitchen as though early were a kind of ownership.',86,1,true,now() - interval '52 days'),
  ('5eed0003-0000-0000-0000-000000010113','5eed0002-0000-0000-0000-000000000012',3,'The Middle One','Nobody ever asked Clare what she wanted from the house. She had stopped, a long time ago, expecting them to start.',52,1,false,now() - interval '44 days'),
  ('5eed0003-0000-0000-0000-000000010121','5eed0002-0000-0000-0000-000000000013',1,'flour','my mother measured nothing. a handful was a unit. a pinch was a unit. she could not write the recipe down because the recipe lived in her hands.',90,1,true,now() - interval '15 days'),
  ('5eed0003-0000-0000-0000-000000010122','5eed0002-0000-0000-0000-000000000013',2,'the year she forgot the salt','it was small at first. soup without salt. my name, for a second, in the wrong decade.',74,1,true,now() - interval '8 days'),
  ('5eed0003-0000-0000-0000-000000010123','5eed0002-0000-0000-0000-000000000013',3,'i write it down','so now i stand in her kitchen with a notebook and i steal the recipes back one handful at a time.',46,1,true,now() - interval '2 days'),
  ('5eed0003-0000-0000-0000-000000010131','5eed0002-0000-0000-0000-000000000014',1,'Empty for Years','The letting agent said the downstairs flat had been vacant since long before Sam moved in, and said it quickly, the way you return a thing you do not want to be holding.',96,1,true,now() - interval '57 days'),
  ('5eed0003-0000-0000-0000-000000010132','5eed0002-0000-0000-0000-000000000014',2,'Footsteps, Patient','The pacing began at night. Not hurried. A person crossing a room, pausing at a window, crossing back, like someone with nowhere to be and all the time that implied.',93,1,true,now() - interval '48 days'),
  ('5eed0003-0000-0000-0000-000000010133','5eed0002-0000-0000-0000-000000000014',3,'The Viewing','Sam asked to see the empty flat. The agent''s keys, she noticed, did not fit the lower door.',53,1,false,now() - interval '39 days'),
  ('5eed0003-0000-0000-0000-000000010141','5eed0002-0000-0000-0000-000000000015',1,'Welcome Back, Allegedly','First-years get a banquet. Second-years get a timetable and a roommate and a strong sense that the Academy has stopped pretending to be glad you are here.',91,1,true,now() - interval '28 days'),
  ('5eed0003-0000-0000-0000-000000010142','5eed0002-0000-0000-0000-000000000015',2,'The Roommate Situation','my new roommate alphabetises her spell components and i have already lost one. this is going great.',76,1,true,now() - interval '20 days'),
  ('5eed0003-0000-0000-0000-000000010143','5eed0002-0000-0000-0000-000000000015',3,'Detention, Group Rate','turns out the whole study group got detention. turns out detention is where the actual plot starts.',45,1,false,now() - interval '12 days'),
  ('5eed0003-0000-0000-0000-000000010151','5eed0002-0000-0000-0000-000000000016',1,'June','The tin roof keeps the rain honest. / It will not let a drop pretend / it fell for any reason / but its own small weight.',38,1,true,now() - interval '70 days'),
  ('5eed0003-0000-0000-0000-000000010152','5eed0002-0000-0000-0000-000000000016',2,'The Long Light','Summer here does not end. / It thins. / It leaves the room / the way a guest does / who you wanted to stay.',36,1,true,now() - interval '40 days'),
  ('5eed0003-0000-0000-0000-000000010153','5eed0002-0000-0000-0000-000000000016',3,'Closing the House','We fold the year into the cupboard / with the spare sheets / and the smell of someone / who used to live here.',40,1,true,now() - interval '9 days')
on conflict (id) do nothing;

insert into public.chapter_content (chapter_id, body) values
  ('5eed0003-0000-0000-0000-000000010001','The stall opened at six and by seven the good loaves were gone, which Mara knew, which was why she always came at half past. It made her, she supposed, a person who arrived after the good things. She had decided to stop minding that. The bread man was rearranging his crates and did not look up. "We have rye," he said. "We always have rye. Nobody loves the rye." "I am not nobody," Mara said, which was not true on a Tuesday, and was the closest she had come in months to flirting.'),
  ('5eed0003-0000-0000-0000-000000010002','He never had change and she never had the right coins, and somehow this had become a small weekly negotiation neither of them wanted to win. "Next week," he would say, sliding the loaf across, and next week she would owe him forty pence and he would wave it off, and the debt would roll forward like a wheel that had decided where it was going. Mara had started keeping the forty pence in her coat pocket on purpose. She liked, she found, owing him something. It was a reason that lived outside of bread.'),
  ('5eed0003-0000-0000-0000-000000010003','By the fourth Tuesday he set a loaf aside without being asked. It sat on the crate with her name on a scrap of paper, spelled wrong, and she did not correct it. Some mistakes you keep.'),
  ('5eed0003-0000-0000-0000-000000010011','I have begun this letter four times. The fire is poor and my excuses are worse, so I will simply say it: the post brought your name today, on a card from your sister, and I find I have read it more times than the message warranted. You are, I am told, a serious man. I am a governess of twenty-six with ink on three fingers and opinions on rather more than is thought becoming. I do not know why your sister thought we should write. I find, having begun, that I do not much care to know.'),
  ('5eed0003-0000-0000-0000-000000010012','There is a version of this letter in the grate. It said too much and I am not yet brave in that particular way. It spoke of the evening light on the orchard wall and how I had wished, plainly, for someone to remark on it with. The version I am sending you instead asks after your health and the harvest. Please understand that the harvest is not what I mean. I have never in my life cared about a harvest.'),
  ('5eed0003-0000-0000-0000-000000010013','This one I will send entire. Every word of it. Even the ones that frighten me, even the line about the orchard wall, even my name at the bottom with nothing hiding behind it.'),
  ('5eed0003-0000-0000-0000-000000010021','The witch of Larrow did not dislike people. She simply found that bees asked less of her and gave back honey, which was a fairer trade than most arrangements she had been offered by anything that walked upright. Her cottage sat at the hedge''s end where the village stopped bothering to be a village. This suited her. When folk wanted a tincture they left coin on the flat stone and she left the bottle, and nobody had to perform the long sad theatre of being neighbourly. It had taken her years to build a life that quiet. She was rather proud of it.'),
  ('5eed0003-0000-0000-0000-000000010022','He knocked like a man who expected doors to obey him. She let him knock. Through the window she watched him take in the bee skeps, the herb ropes, the general evidence of a woman who had arranged her whole existence around not being disturbed, and she watched him decide, visibly, that none of it applied to him. "I am the new doctor," he called. "I think we should be allies." "I think," she told the window, "you should learn to be told no."'),
  ('5eed0003-0000-0000-0000-000000010023','He came back. Of course he came back. People always did once the bees had been kind to them, and the bees, traitors that they were, had been very kind to him indeed.'),
  ('5eed0003-0000-0000-0000-000000010031','okay so the thing about loving someone in a different time zone is the math. its always the math. its 11pm here and hes already in tomorrow, hes had a whole day i wasnt in, and i lie here doing the subtraction like it will give me a different answer if i do it enough. eight hours. it is always going to be eight hours. i knew that when i let this start. i let it start anyway because he laughed at the thing nobody else laughed at, and apparently that is all it takes for me, apparently i am that cheap and that easily kept.'),
  ('5eed0003-0000-0000-0000-000000010032','three notifications. all of them my friends. none of them helpful. priya: just CALL him. dev: priya is right (rare). priya: also you said youd stop saying its casual. i typed "its casual" and then i deleted it and then i sat there holding the phone like it had done something to me.'),
  ('5eed0003-0000-0000-0000-000000010033','six hours in an airport is either a romance or a breakdown and i havent decided which. he is somewhere over an ocean right now, unreachable, the most honest he has been all month, and i am eating a bad sandwich and missing a person who is technically on his way to me.'),
  ('5eed0003-0000-0000-0000-000000010041','On the morning they meant to drown him, the heir of Vael woke early, ate well, and checked, as he had every day for nineteen years, that he still remembered how to swim. He did. He had made very sure of it. The kingdom of Vael crowned its kings the old way, by giving them to the sea and accepting back whatever the sea returned, and for four centuries the sea had returned a corpse and the corpse had been called a king. Aedric intended, with great and quiet rudeness, to be returned alive.'),
  ('5eed0003-0000-0000-0000-000000010042','The court called it tradition. His mother called it necessary. He had learned, young, that the two words were often worn by the same ugly thing when it wanted to be let into a room. "The people need the rite," she said, not unkindly, fastening the drowning-cloak at his throat. "The people," Aedric said, "have never been asked if they would settle for a living king instead. I thought today I might ask them."'),
  ('5eed0003-0000-0000-0000-000000010043','They had not, in four hundred years, planned for an heir who simply did not die. The priests had no liturgy for it. The court had no protocol. Aedric, dripping on the temple steps and entirely alive, found the silence enormously promising.'),
  ('5eed0003-0000-0000-0000-000000010051','First rule my nan gave me about the bridge market: dont tell anyone your name, not even the nice ones, especially not the nice ones. second rule: the market opens every fourth sunday under the canal bridge and if you can see it, it has already decided to let you in, so theres no point pretending you cant. i was eleven the first time i could see it. nan held my wrist the whole way through and i thought it was love. it was not love. it was bookkeeping. she was making sure the market never got to count me as alone.'),
  ('5eed0003-0000-0000-0000-000000010052','She had eyes like wet coins and she knew i hadnt eaten. thats the trick of them. they always know. "apple, love?" she said, and the apple was the best thing i had ever seen, gold going to red like a sunset that had been folded up small. i said no. it cost me something to say no. you dont get that something back.'),
  ('5eed0003-0000-0000-0000-000000010053','i still have all my fingers. im just careful now about what sundays i answer to, and i never, ever, tell the apple seller she was close.'),
  ('5eed0003-0000-0000-0000-000000010061','Tonight the city keeps still long enough for Senna to ink the eighth door, and she lets herself, for one careful breath, feel something like finished. The lamp gutters. Her hand is steady. On the vellum the city of Orrin lies flat and obedient and complete, eight doors charted, eight ways the place can be entered by someone who knows where to stand. She has given six years to this map. She does not yet let herself think the word that comes after finished, because the word that comes after finished is always, in her experience, another door.'),
  ('5eed0003-0000-0000-0000-000000010062','The line will not hold. She draws the street and the street, politely and completely, declines to be there in the morning. This is not new. Orrin rearranges itself the way other cities settle in their sleep, and a cartographer of Orrin learns to map not where things are but where things agree to be. What is new is the smudge near the eighth door. She did not draw it. It has the particular grey of a thumbprint, and her thumbs, she checks, are clean.'),
  ('5eed0003-0000-0000-0000-000000010063','It is not on any wall. It opens, she understands, inward, and she stands in her quiet room with eight doors charted behind her and feels the ninth one know her name.'),
  ('5eed0003-0000-0000-0000-000000010071','The ship had run for two hundred years without complaint, and Iris was hired, at great expense, to read the complaints it had never filed. The Quiet Engine was a generation ship of the old patient kind, built to cross the dark slowly and deliver, eventually, descendants. Its archive was immaculate. Every birth, every repair, every ration adjustment, logged and cross-referenced and dull. Iris had spent a career in dull archives. She had learned that the dull ones were dull because someone, somewhere, was working very hard to keep them that way.'),
  ('5eed0003-0000-0000-0000-000000010072','Nothing had gone wrong on the Quiet Engine. Not once. Iris had worked enough jobs to know that nothing was the loudest word in any log, that real history had texture, friction, the small honest disasters of people living too close together for too long. She pulled the maintenance record for the first fifty years and read it twice. It was smooth as a swept floor. Somebody, she thought, sweeps this. Somebody has been sweeping this for two hundred years.'),
  ('5eed0003-0000-0000-0000-000000010073','Deck Seven was on every schematic and on no map the crew would draw for her. When she said the words deck seven aloud in the mess, three conversations changed direction at once, gently, like fish.'),
  ('5eed0003-0000-0000-0000-000000010081','Corin had ninety days left on Ceres and a list of things to fix, and the list, he noticed that morning, was one item longer than he had left it. He read the new line twice. CHECK LOWER SHAFT SEALS. It was his handwriting. It was not his memory. He had spent eleven years on this station learning its moods, and the station, he would have said, did not write things down. That was a thing the station had people for. That was a thing the station had him for.'),
  ('5eed0003-0000-0000-0000-000000010082','Forty-one crew signed the closure roster. Forty-one badges scanned out each night. The night cycle counted forty-two warm bodies and would not be argued with. Corin took the discrepancy to the supervisor, who looked tired in a way that started somewhere behind her face. "Heat ghosts," she said. "Old station. Bad sensors." "Bad sensors read low," Corin said. "They lose people. They don''t invent them." She did not have an answer for that, and worse, she did not look surprised that he had said it.'),
  ('5eed0003-0000-0000-0000-000000010083','Nobody had been down to the old shafts in a year. The dust there, Corin saw, had been walked through recently, in both directions, by feet that knew the way and had not wanted the lights on to find it.'),
  ('5eed0003-0000-0000-0000-000000010091','It is a Tuesday and the train is exactly on time, and Helen counts the carriage the way she always does, without meaning to, the way some people crack knuckles. Forty faces. It is always forty. The same forty since the timetable changed in spring, give or take a holiday, give or take a cold. She knows them the way you know wallpaper. The girl with the enormous headphones. The two men who never sit together but always nod. The old woman with the canvas bag who reads, every single morning, the first page of a different book.'),
  ('5eed0003-0000-0000-0000-000000010092','The man in the grey coat is not here. He is always here. He is the sort of fact a morning is built on, and the morning, today, is missing one. Helen tells herself the obvious things. People take days off. People get other trains. She tells herself these things all the way into the city, and they do not take, because she has also noticed that nobody else has noticed, that the carriage has closed over his absence like water, and that she appears to be the only person on the 7:14 who remembers the grey coat was ever there at all.'),
  ('5eed0003-0000-0000-0000-000000010093','By Friday three more seats are wrong, and Helen stops telling herself she is the only one counting. She starts, instead, to wonder what happens to a face on this train once she is the last one keeping it.'),
  ('5eed0003-0000-0000-0000-000000010101','When they found Mr Aldous dead in his locked study, the only living thing in the house was his spaniel, and the spaniel was not, by any measure, distressed. I was brought in because I am the sort of woman a village brings in: too old to gossip with, too nosy to ignore. The constable wanted it called natural. The door was locked from the inside, the window latched, the man sixty-eight and fond of his port. Natural is a tidy word. I have never trusted a tidy word, and I trusted this one even less once I had met the dog.'),
  ('5eed0003-0000-0000-0000-000000010102','I have kept dogs my whole life. A dog that has lost its master does not finish breakfast. It mopes, it waits at the door, it carries one shoe about the house like a grievance. This one had not started its breakfast, and the bowl was full, and the spaniel lay by the cold hearth with the particular calm of an animal that has been recently, thoroughly reassured. Someone had comforted that dog. Someone had been in the locked house, on the morning its master died, and had taken the time to be kind.'),
  ('5eed0003-0000-0000-0000-000000010103','Someone in that house had been kind to the dog on the worst morning of its life. I only had to find out who, and then I would know, I was quite sure, everything else worth knowing.'),
  ('5eed0003-0000-0000-0000-000000010111','The farmhouse had been divided in principle for years. In practice it came down, as these things do, to a drawer of spoons no sister would claim and none would surrender. Their mother had not left a will so much as a silence, and into that silence the three of them had poured every old argument they owned. The house could be sold. The land could be valued. But the spoons were the good spoons, the Sunday spoons, the ones that had stirred every cup of tea any of them had ever cried into, and a valuer could not put a number on that, and so the drawer stayed shut, and so did they.'),
  ('5eed0003-0000-0000-0000-000000010112','Bridget arrived first, because Bridget always arrived first, and stood in the kitchen as though early were a kind of ownership. She had the kettle on before her coat was off. She had opinions warming with it. "We should be sensible," she said, which in Bridget''s mouth had never once meant we should be kind, and Clare, coming in behind her, felt the old familiar tiredness arrive on schedule, like a bus you hated but could set your watch by.'),
  ('5eed0003-0000-0000-0000-000000010113','Nobody ever asked Clare what she wanted from the house. She had stopped, a long time ago, expecting them to start, and she was surprised, standing in the cold hall, by how much the not-asking could still find a soft place to land.'),
  ('5eed0003-0000-0000-0000-000000010121','my mother measured nothing. a handful was a unit. a pinch was a unit. a "until it looks right" was a unit, and the maddening thing, the thing i would give anything for now, is that it always did look right. she could not write the recipe down because the recipe lived in her hands, in the specific weather of her kitchen, in a body that had made this bread ten thousand times and did not need to be told. i used to find it careless. i understand now it was the opposite. it was knowing something so completely you stopped being able to see it.'),
  ('5eed0003-0000-0000-0000-000000010122','it was small at first. soup without salt. my name, for a second, in the wrong decade. a pause in the doorway of a room she had walked into forty years. you tell yourself small things are small. you are allowed to do that for a little while. then one day she held a wooden spoon and looked at it like a word she nearly knew, and i stopped being allowed.'),
  ('5eed0003-0000-0000-0000-000000010123','so now i stand in her kitchen with a notebook and i steal the recipes back one handful at a time. i weigh her handfuls on a scale she would have laughed at. i am building her a book she can no longer read, and i am doing it anyway, because it turns out the book was never going to be for her.'),
  ('5eed0003-0000-0000-0000-000000010131','The letting agent said the downstairs flat had been vacant since long before Sam moved in, and said it quickly, the way you return a thing you do not want to be holding. Sam had not asked for the flat''s history. That was the part that stayed with her afterwards. She had asked, simply, whether the building was quiet, and the agent had answered a question about the downstairs flat that nobody in the room had put to her, and then had smiled too long, and then had moved them both firmly along to the matter of the deposit.'),
  ('5eed0003-0000-0000-0000-000000010132','The pacing began at night. Not hurried. A person crossing a room, pausing at a window, crossing back, like someone with nowhere to be and all the time that implied. Sam lay in the dark above it and mapped the flat below by sound: here the window, here the long wall, here the spot where the walker always stopped, always, as though something there were worth the stopping. The flat below her was empty. She had been told so quickly, and twice. She was beginning to feel that the speed of the telling had been the actual message.'),
  ('5eed0003-0000-0000-0000-000000010133','Sam asked to see the empty flat. The agent''s keys, she noticed, did not fit the lower door, and the agent did not seem to find this strange, and that, more than the footsteps, was the thing that kept Sam standing in the corridor long after she should have gone back up.'),
  ('5eed0003-0000-0000-0000-000000010141','First-years get a banquet. Second-years get a timetable and a roommate and a strong sense that the Academy has stopped pretending to be glad you are here. I had spent the whole summer telling people second year would be easier. I had said it so many times it had started to sound like a thing I knew rather than a thing I hoped, and standing in the entrance hall with my trunk and my one good robe, watching the new first-years get their banquet, I understood I had been comforting precisely the wrong person all along.'),
  ('5eed0003-0000-0000-0000-000000010142','my new roommate alphabetises her spell components and i have already lost one. this is going great. her name is Petra and she has a label maker and she used it, on day one, on my side of the room, which i have decided to find charming because the alternative is three terms of quiet warfare and i did that last year and it was exhausting.'),
  ('5eed0003-0000-0000-0000-000000010143','turns out the whole study group got detention. turns out detention is where the actual plot starts, in a locked archive, at night, with the one teacher nobody trusts and a door that should not have been warm to the touch.'),
  ('5eed0003-0000-0000-0000-000000010151','The tin roof keeps the rain honest. / It will not let a drop pretend / it fell for any reason / but its own small weight. / All June we lay beneath it / and learned that argument: / that things come down / because they are heavy, / and for no other reason, / and that this is not / the saddest way / to fall.'),
  ('5eed0003-0000-0000-0000-000000010152','Summer here does not end. / It thins. / It leaves the room / the way a guest does / who you wanted to stay: / slowly, with both hands, / touching the doorframe once, / saying nothing you can keep, / leaving the light on / in the hall / so the house will not / notice yet.'),
  ('5eed0003-0000-0000-0000-000000010153','We fold the year into the cupboard / with the spare sheets / and the smell of someone / who used to live here. / The tin roof will go on / without an audience. / It does not need us / to keep the rain honest. / It only let us think so / because we were young / and it was kind.')
on conflict (chapter_id) do nothing;


-- ==================== seed_parts/batch2_fantasy.sql ====================

-- NovelStack launch seed data
-- Batch 2: FANTASY (epic/secondary-world, low fantasy, contemporary/urban)
-- 20 authors, 20 stories, mixed chapter counts

-- ============================================================
-- AUTHOR 01
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-01@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Mara Olwen"}')
on conflict (id) do nothing;
update public.users set username='m.olwen', display_name='Mara Olwen', role='writer', is_verified=true, bio='Wrote my first dragon story at nine. Still at it. Tea-dependent.', date_of_birth='1988-03-14' where id='b2100000-0000-0000-0000-000000000001';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000001','b2100000-0000-0000-0000-000000000001','The Salt Throne','the-salt-throne','A drowned dynasty wakes when the tide forgets to come back. Edda, a tidekeeper''s apprentice, must decide who deserves to breathe.','#1F3A5F','fantasy','{"epic-fantasy","political-intrigue","ocean"}','ongoing',false,184203,9421, now() - interval '210 days', now() - interval '6 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000100001','b2200000-0000-0000-0000-000000000001',1,'Low Water','The sea went out on a Tuesday and did not come back. Edda counted the tide marks twice before she ran to wake the keeper, who only laughed.',168,1,true, now() - interval '210 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000100001','The sea went out on a Tuesday and did not come back. Edda counted the tide marks twice before she ran to wake the keeper, who only laughed and turned over in his cot. By noon the boats lay tilted in mud that had never seen sun, and the fishing families stood at the harbour wall the way you stand at a deathbed.

Edda knew the tide tables better than she knew her own birthday. She had copied them every morning for three years. The numbers in her head did not lie, and the numbers said the water should be at her knees by now.

Instead there was a road. A wet black road going out under where the sea had been, paved in something too even to be stone. It led toward the horizon, and at its far end something pale stood up out of the muck and shook itself like a dog.

The keeper stopped laughing then.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000100002','b2200000-0000-0000-0000-000000000001',2,'The Keeper''s Confession','He had not told her everything. Keepers never do. That night, with the village quiet and afraid, the old man finally said the word he had been swallowing for forty years.',155,1,true, now() - interval '203 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000100002','He had not told her everything. Keepers never do. That night, with the village quiet and afraid, the old man finally said the word he had been swallowing for forty years.

Adrellan. The drowned city. He said it should have stayed a story, the kind told to keep children off the rocks. But he had seen the salt throne once, as a boy, when the water thinned during a bad winter, and he had never been able to make himself forget the shape of it.

Edda listened with her hands flat on the table. She was not afraid, exactly. She was the kind of person who needed to know things, and a city under the water was a great deal to know.

"They will want a keeper," the old man said. "They always want someone to mind the tides for them. And I am too old to go down that road."

He looked at her then, and she understood the rest without him saying it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000100003','b2200000-0000-0000-0000-000000000001',3,'The Road Down','Walking the seabed felt like trespassing in a house where everyone had died politely. Edda kept to the black road and tried not to look at the things in the mud.',142,1,true, now() - interval '190 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000100003','Walking the seabed felt like trespassing in a house where everyone had died politely. Edda kept to the black road and tried not to look at the things in the mud — anchors, ribs of ships, once a doorframe standing alone with nothing around it.

The pale figure had not moved since morning. Up close it was a statue, a woman with her arms out, and the road ran straight between her feet and onward into a haze that smelled of iron.

Edda touched the statue''s ankle. It was warm. Stone should not be warm.

"You came faster than the last one," the statue said, without moving its mouth, and Edda decided that she would not scream, because screaming would waste breath she might need later.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000100004','b2200000-0000-0000-0000-000000000001',4,'Adrellan','The city had been waiting the way a held breath waits. Edda walked its streets and felt the weight of all that patience press against her ears.',58,1,false, now() - interval '120 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000100004','The city had been waiting the way a held breath waits. Edda walked its streets and felt the weight of all that patience press against her ears. Houses leaned together over the lanes. In their windows, faces turned to follow her, and not one of them was unkind, and that was somehow worse than if they had been.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000100005','b2200000-0000-0000-0000-000000000001',5,'Who Deserves to Breathe','They put the question to her plainly, as if it were a chore. The dead of Adrellan wanted the tide back, and only a living keeper could bargain for it.',61,1,false, now() - interval '40 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000100005','They put the question to her plainly, as if it were a chore. The dead of Adrellan wanted the tide back, and only a living keeper could bargain for it. But the bargain had a price measured in lungs, and Edda was supposed to decide whose. She thought of her village at the harbour wall. She thought of the old keeper, who had sent her precisely so he would not have to choose.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 02
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-02@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Devon Cross"}')
on conflict (id) do nothing;
update public.users set username='dragon.scribbles', display_name='Devon Cross', role='writer', is_verified=false, bio='just here to write fight scenes tbh', date_of_birth='2001-07-22' where id='b2100000-0000-0000-0000-000000000002';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000002','b2100000-0000-0000-0000-000000000002','Ash Knight','ash-knight','Kell got knighted by accident and now everyone expects him to kill a demon. He cannot even kill a chicken. This is fine.','#6B2A2A','fantasy','{"low-fantasy","comedy","sword-and-sorcery"}','ongoing',false,52310,3140, now() - interval '95 days', now() - interval '2 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000200001','b2200000-0000-0000-0000-000000000002',1,'Wrong Tent','Look. In Kell''s defense, all the tents looked the same, and the squire who shoved him forward had a very convincing grip, and the sword they handed him was already drawn.',172,1,true, now() - interval '95 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000200001','Look. In Kell''s defense, all the tents looked the same, and the squire who shoved him forward had a very convincing grip, and the sword they handed him was already drawn. By the time he realized he was kneeling in the king''s tent instead of the laundry tent, the blade had touched both his shoulders and a man with a very large hat was calling him Sir.

You do not correct a man with a hat that large. Kell had learned that early. So he said thank you, and he stood up, and he walked out of the tent a knight, which was a problem, because Kell was a turnip farmer and the only thing he had ever sworn an oath to was his mother''s recipe for soup.

Outside, a herald was already shouting his name. A crowd had gathered. Someone had drawn a picture of a demon on a board and there were a great many arrows on the picture pointing at Kell.

He considered running. He was good at running. It was, honestly, his best skill.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000200002','b2200000-0000-0000-0000-000000000002',2,'A Horse Named Disaster','The stables gave Kell the worst horse they had, because the good horses were for real knights, and the stablemaster could smell a fake from across the yard.',148,1,true, now() - interval '88 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000200002','The stables gave Kell the worst horse they had, because the good horses were for real knights, and the stablemaster could smell a fake from across the yard. The horse was named Disaster. Kell did not name it. It came pre-named, which he felt said something.

Disaster bit him on the way out of the yard. Disaster bit a fencepost. Disaster tried, with real ambition, to bite the sun.

But Disaster also walked in roughly the direction Kell pointed, and Kell had to admit that was more cooperation than he''d gotten from most living things lately. He patted its neck. It did not bite him for that, which he chose to read as friendship.

"We don''t have to actually fight the demon," he told the horse. "We just have to go in that direction and then, at some point, have a clever idea."

Disaster snorted. It was not a confident snort.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000200003','b2200000-0000-0000-0000-000000000002',3,'The Witch Who Sells Maps','She did not look like a witch. She looked like an accountant. The sign over her stall said MAPS and under that, in smaller letters, AND ADVICE YOU WONT LIKE.',139,1,true, now() - interval '70 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000200003','She did not look like a witch. She looked like an accountant. The sign over her stall said MAPS and under that, in smaller letters, AND ADVICE YOU WONT LIKE.

"You''re the fake knight," she said, before Kell had opened his mouth.

"I prefer accidental knight."

"You''ll prefer dead knight by next week, the rate you''re going." She rolled out a map and tapped a black smear at its edge. "Demon''s here. It''s not actually a demon, by the way. It''s worse, and the difference will matter to you very much when you meet it."

Kell looked at the smear. Then at the witch. "Could you, perhaps, just tell me the worse thing now?"

"I could," she agreed pleasantly, and did not.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000200004','b2200000-0000-0000-0000-000000000002',4,'Not a Demon','The thing in the valley wore a crown and looked extremely tired. Kell had expected horns. He had not expected paperwork.',54,1,false, now() - interval '30 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000200004','The thing in the valley wore a crown and looked extremely tired. Kell had expected horns. He had not expected paperwork. It was sitting at a desk in the middle of a scorched field, signing documents, and when it saw Kell it sighed the way a man sighs when one more customer walks in at closing time.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000200005','b2200000-0000-0000-0000-000000000002',5,'Kell Has a Clever Idea','It was not a good clever idea. It was barely a clever idea at all. But it was the only one Kell had, and Disaster was already eating the demon''s paperwork, so he committed.',49,1,false, now() - interval '5 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000200005','It was not a good clever idea. It was barely a clever idea at all. But it was the only one Kell had, and Disaster was already eating the demon''s paperwork, so he committed. He offered the tired king-thing a job. A turnip farm needed managing, and the pay was soup.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 03
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-03@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Priya Anand"}')
on conflict (id) do nothing;
update public.users set username='paulwrites', display_name='Priya Anand', role='writer', is_verified=false, bio=null, date_of_birth='1994-11-09' where id='b2100000-0000-0000-0000-000000000003';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000003','b2100000-0000-0000-0000-000000000003','The Lantern District','the-lantern-district','In a city where streetlamps are bound spirits, a lamplighter starts hearing the lamps complain. Then one goes dark with a person still inside it.','#3A2F4A','fantasy','{"urban-fantasy","mystery","slow-burn"}','ongoing',false,77640,5012, now() - interval '160 days', now() - interval '11 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000300001','b2200000-0000-0000-0000-000000000003',1,'The Eleven O''Clock Round','Most lamplighters never hear the lamps. That is the point of the binding. Sefa heard hers on a wet October night, and at first she thought it was the wind in a drainpipe.',176,1,true, now() - interval '160 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000300001','Most lamplighters never hear the lamps. That is the point of the binding. Sefa heard hers on a wet October night, and at first she thought it was the wind in a drainpipe.

It said, very clearly, "You missed the one on Cooper Lane."

She had not missed the one on Cooper Lane. She had a list and she crossed things off the list and Cooper Lane was crossed off. But she went back anyway, because a voice with no mouth is a hard thing to argue with, and she found the Cooper Lane lamp dark and cold and the glass faintly fogged from the inside, the way a window fogs when something is breathing against it.

Sefa had lit lamps for nine years. She knew the names of every spirit on her round, the way a postman knows the dogs. She did not know this. She put her hand against the iron post and felt it shudder, once, like a person trying not to cry in public.

"Right," she said, to nobody, to the street. "Right. Okay."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000300002','b2200000-0000-0000-0000-000000000003',2,'The Binding Office','The Binding Office kept hours that suited no living person. Sefa stood at the counter for forty minutes before a clerk acknowledged she had a body.',151,1,true, now() - interval '150 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000300002','The Binding Office kept hours that suited no living person. Sefa stood at the counter for forty minutes before a clerk acknowledged she had a body.

"Cooper Lane," she said. "It''s gone dark. And I think there''s — I think someone is in it."

The clerk did not look up. "Lamps don''t have someones in them. Lamps have spirits in them. Spirits are not someones. It''s the first thing they teach you."

"This one talked to me."

That made the clerk look up. He had the face of a man who had spent his whole life hoping nothing interesting would ever happen to him, and was now watching that hope die.

"Talked," he repeated. "Words?"

"Words. A sentence. It told me I''d missed a lamp, and I hadn''t, except I had." She leaned on the counter. "Whose spirit is in the Cooper Lane lamp? I want the name. I know you have a book with the names."

The clerk closed the book very quietly, which told her everything.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000300003','b2200000-0000-0000-0000-000000000003',3,'A Name She Knew','The clerk would not give her the book. But Sefa had been a lamplighter for nine years, and lamplighters know how to come back when the office is empty.',144,1,true, now() - interval '130 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000300003','The clerk would not give her the book. But Sefa had been a lamplighter for nine years, and lamplighters know how to come back when the office is empty.

The book was not even locked. That bothered her more than a lock would have. It meant nobody expected anyone to care.

Cooper Lane. Bound spring of the year nineteen. And there, in the column for the spirit''s living name, in handwriting that had pressed hard enough to dent the page: Tomas Vell.

Sefa sat down on the office floor. She knew that name. Tomas Vell had been a lamplighter too, on the eastern round, and one autumn he had simply stopped coming to work, and everyone had said he''d gone to the coast.

He had not gone to the coast. He had gone into a lamp.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000300004','b2200000-0000-0000-0000-000000000003',4,'What the Lamps Know','She started talking to all of them after that. It was slow. Spirits measure time differently, and most had forgotten they had ever been people.',62,1,false, now() - interval '80 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000300004','She started talking to all of them after that. It was slow. Spirits measure time differently, and most had forgotten they had ever been people. But the lamp on Harrow Street remembered enough to be angry, and anger, Sefa was learning, was a kind of memory that lasted. It told her there were others. It told her the office knew. It told her to be careful which clerk she trusted.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000300005','b2200000-0000-0000-0000-000000000003',5,'The Eastern Round','Nobody had lit the eastern round in years. The lamps there had gone feral, and walking among them at dusk, Sefa understood she was being watched by things that resented the light she carried.',57,1,false, now() - interval '20 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000300005','Nobody had lit the eastern round in years. The lamps there had gone feral, and walking among them at dusk, Sefa understood she was being watched by things that resented the light she carried. One post leaned toward her as she passed. The glass was clear, the spirit gone, and scratched into the iron at eye height was a single word, fresh: RUN.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 04
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-04@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"xX_raven_Xx"}')
on conflict (id) do nothing;
update public.users set username='xX_raven_Xx', display_name='Raven', role='writer', is_verified=false, bio='dark fantasy only. dont @ me about the body count', date_of_birth='2003-02-28' where id='b2100000-0000-0000-0000-000000000004';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000004','b2100000-0000-0000-0000-000000000004','Crowfeeder','crowfeeder','They hung the wrong woman at the crossroads. The crows remembered. So did she.','#1A1A22','fantasy','{"dark-fantasy","revenge","grimdark"}','ongoing',true,98455,6730, now() - interval '140 days', now() - interval '4 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000400001','b2200000-0000-0000-0000-000000000004',1,'The Crossroads Tree','They hung her at the crossroads because that was where you hung witches, and the village had decided she was one on a Thursday, with very little debate.',165,1,true, now() - interval '140 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000400001','They hung her at the crossroads because that was where you hung witches, and the village had decided she was one on a Thursday, with very little debate. Her name was Wren. She was not a witch. She had simply known which well was poisoned, and knowing things, in that village, was a hanging offense if you were poor enough.

The rope did its work. The crowd went home to dinner. And the crows came down out of the crossroads tree, the way crows do, because a hanged body is a kind of generosity if you have feathers.

But these crows did not feed. They sat on her shoulders and her outstretched hands and they waited, all night, in the cold, the way mourners wait. By dawn there were two hundred of them, and the body had not been touched, and something behind Wren''s closed eyes was beginning, very slowly, to count.

When she opened them, the crows did not startle. They had been expecting her.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000400002','b2200000-0000-0000-0000-000000000004',2,'Down From the Rope','Coming back is not the same as living. Wren learned the difference in the first hour, when she tried to feel the cold and found the place where cold used to go was empty.',158,1,true, now() - interval '132 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000400002','Coming back is not the same as living. Wren learned the difference in the first hour, when she tried to feel the cold and found the place where cold used to go was empty. Her body worked. Her heart did something, some imitation of beating. But she was a house with the lights on and nobody warm inside.

The crows stayed close. When she looked through their eyes — and she could, she discovered, the way you discover you can move a finger — she saw the village from above, small and smug and asleep.

She knew all eleven names. The headman. The priest who had blessed the rope. The nine who had pulled it, taking turns so no single hand would carry the whole weight of her.

Wren was patient now. Death had taught her that, if nothing else. She would not rush. She had two hundred pairs of eyes and the rest of a long autumn, and the village had given her absolutely nothing left to lose.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000400003','b2200000-0000-0000-0000-000000000004',3,'The First Name','She did not start with the headman. She started with the priest, because he had used words, and words were what had killed her, and Wren believed in a certain symmetry.',147,1,true, now() - interval '110 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000400003','She did not start with the headman. She started with the priest, because he had used words, and words were what had killed her, and Wren believed in a certain symmetry.

He was awake when the crows began to gather on his roof. One bird, then a dozen, then the whole black weight of them, until the thatch creaked and the room went dark with the shapes crossing his single window.

He prayed. Of course he prayed. Wren listened to him do it, through the ears of the bird on his sill, and she felt nothing, which frightened her a little, somewhere far down.

She did not let the crows touch him. That was important. She only let him understand, fully and without hurry, exactly what was sitting in his rafters and exactly whose face it remembered. Then she let him keep his sleepless night.

Fear first. Always fear first. The rest could wait for morning.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000400004','b2200000-0000-0000-0000-000000000004',4,'What the Headman Bought','The headman tried to buy her off. He stood at the crossroads with a chest of coin and called her name into the dark like it was a dog''s.',60,1,false, now() - interval '60 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000400004','The headman tried to buy her off. He stood at the crossroads with a chest of coin and called her name into the dark like it was a dog''s. Wren came. She always came when called now; it was the one courtesy death had left her. She looked at the coin. She looked at the tree she had hung from. Then she asked him, gently, which of those things he thought she still had a use for.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000400005','b2200000-0000-0000-0000-000000000004',5,'Nine Left','Two names crossed off. The village had stopped pretending. They barred their doors at noon now and watched the sky, and the watching was its own slow punishment, and Wren found she could be satisfied with that for a while.',56,1,false, now() - interval '12 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000400005','Two names crossed off. The village had stopped pretending. They barred their doors at noon now and watched the sky, and the watching was its own slow punishment, and Wren found she could be satisfied with that for a while. But one of the nine had run. South, the crows said. Toward the city, where there were no crossroads trees and a great many roofs. Wren turned her two hundred faces south and considered the distance.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 05
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-05@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Tom Hareley"}')
on conflict (id) do nothing;
update public.users set username='worldbuilder99', display_name='Tom Hareley', role='writer', is_verified=false, bio='17 years on this setting. probably too long. enjoy the maps', date_of_birth='1979-06-03' where id='b2100000-0000-0000-0000-000000000005';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000005','b2100000-0000-0000-0000-000000000005','The Cartographer of Vael','the-cartographer-of-vael','The continent rearranges itself every spring. Joran maps it anyway. This year, the map starts mapping him back.','#2C4A3E','fantasy','{"epic-fantasy","worldbuilding","adventure"}','ongoing',false,41200,2890, now() - interval '230 days', now() - interval '18 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000500001','b2200000-0000-0000-0000-000000000005',1,'The Spring Shift','In Vael, geography is a season. Every year on the first warm night the land exhales and the mountains find new places to be, and the rivers go looking for the sea by different roads.',183,1,true, now() - interval '230 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000500001','In Vael, geography is a season. Every year on the first warm night the land exhales and the mountains find new places to be, and the rivers go looking for the sea by different roads. By dawn the continent is a stranger. The old maps are good only for kindling, and the cartographers go out, as they have for six hundred years, to make the country knowable again before the trade caravans starve.

Joran was the youngest master cartographer Vael had certified, and he carried that fact the way you carry a stone in your boot — aware of it constantly, never quite comfortable. His teacher had retired north. His rival had retired into the ground. The eastern provinces were his to chart, alone, this spring, and he had told the guild he was ready.

He stood at the edge of the shifted land at first light, ink already mixed, and watched a valley that had not existed yesterday breathe mist into the cold. It was beautiful. It was also, he would later be very sure, watching him.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000500002','b2200000-0000-0000-0000-000000000005',2,'Ink and Distance','A cartographer''s first rule: the map is a promise. Joran had recited it as a boy. He had never, until the eastern provinces, understood it as a threat.',156,1,true, now() - interval '224 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000500002','A cartographer''s first rule: the map is a promise. Joran had recited it as a boy. He had never, until the eastern provinces, understood it as a threat.

It happened on the fourth day. He drew a ridge — carefully, to scale, the way he drew everything — and when he looked up from the page the ridge was there, in the world, where an hour earlier there had been flat heath.

He told himself the land had shifted again. Late shifts happened, the texts said so. He did not believe the texts. He drew a small pond, just to test it, a stupid childish doodle in the margin of his good vellum.

By evening there was a pond. Round as a coin. Exactly where his ink had been.

Joran sat with his back to a rock and did not draw anything for a long time. The blank page felt, for the first time in his life, like a loaded thing.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000500003','b2200000-0000-0000-0000-000000000005',3,'The Map Mapping Back','He woke to find a line drawn across his own forearm in his own ink, and it matched, exactly, a river he had not yet charted.',138,1,true, now() - interval '200 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000500003','He woke to find a line drawn across his own forearm in his own ink, and it matched, exactly, a river he had not yet charted.

He had not done it. He had slept with his hands folded, the way his teacher had taught him, so the ink would not smear. The line on his arm was precise. Confident. Better, frankly, than his own work.

Joran understood then that the relationship had two directions. He drew the land, and the land — or the map, or whatever lived in the seam between them — had begun to draw him.

He should have gone back to the guild. He knew that. He also knew that no cartographer in six hundred years had been offered this, and that knowledge, that terrible curiosity, was the same thing that had made him a master too young. He uncapped the ink.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000500004','b2200000-0000-0000-0000-000000000005',4,'The Blank Province','East of the river, his predecessor''s old maps all showed the same thing: nothing. A clean white rectangle, labelled only with a date and the word LATER.',59,1,false, now() - interval '90 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000500004','East of the river, his predecessor''s old maps all showed the same thing: nothing. A clean white rectangle, labelled only with a date and the word LATER. Sixty years of cartographers had reached that edge and, apparently, agreed without ever meeting to leave it empty. Joran stood at the boundary with his pen. The province ahead was not unmapped because it was unknown. It was unmapped because someone, long ago, had decided it was safer drawn by no one.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000500005','b2200000-0000-0000-0000-000000000005',5,'What Wants to Be Drawn','Something in the blank province wanted a shape. Joran could feel it pressing against the white of the page like a hand against frosted glass, patient, and very old.',52,1,false, now() - interval '40 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000500005','Something in the blank province wanted a shape. Joran could feel it pressing against the white of the page like a hand against frosted glass, patient, and very old. To map a thing was to make it real and fixed and findable. That was the cartographer''s gift. It was also, he finally understood, why the province had been left blank, and why his pen now felt so heavy in his grip.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 06
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-06@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Lena Vasquez"}')
on conflict (id) do nothing;
update public.users set username='r.amari', display_name='Lena Vasquez', role='writer', is_verified=false, bio='coffee shop urban fantasy. low stakes. high feelings.', date_of_birth='1996-09-17' where id='b2100000-0000-0000-0000-000000000006';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000006','b2100000-0000-0000-0000-000000000006','Closing Shift at the Hex & Bean','closing-shift-hex-and-bean','The night-shift barista at a magical cafe just wants her tips and her bus home. The regulars keep almost dying. It is very inconvenient.','#7A4B2A','fantasy','{"urban-fantasy","cozy","found-family"}','ongoing',false,63900,4470, now() - interval '120 days', now() - interval '3 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000600001','b2200000-0000-0000-0000-000000000006',1,'Decaf for the Banshee','The thing about the Hex and Bean is that the espresso machine is haunted and the customers are worse, and Wendy gets paid the same as a barista at a normal cafe, which is to say, not enough.',171,1,true, now() - interval '120 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000600001','The thing about the Hex and Bean is that the espresso machine is haunted and the customers are worse, and Wendy gets paid the same as a barista at a normal cafe, which is to say, not enough.

It was eleven minutes to close when the banshee came in. Wendy knew she was a banshee because she always ordered decaf and then cried, quietly, into it, and because once she had screamed and a man two tables over had immediately remembered an urgent appointment with his own death.

"Decaf, oat, the usual," Wendy said, already reaching for the cup. "You doing okay tonight, Moira?"

Moira sniffed. "Someone I love is going to die before sunrise."

"Right. Anyone I know?"

"You," said Moira, and blew her nose.

Wendy did not stop frothing the oat milk. You did not, in this job, let the customers see you flinch. But she did make a mental note to take the well-lit route to the bus stop, and to maybe, finally, learn what the panic button under the till actually did.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000600002','b2200000-0000-0000-0000-000000000006',2,'The Panic Button','It turned out the panic button did not call the police. Wendy pressed it at 11:58 and the floor of the Hex and Bean simply stopped being the floor.',149,1,true, now() - interval '113 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000600002','It turned out the panic button did not call the police. Wendy pressed it at 11:58 and the floor of the Hex and Bean simply stopped being the floor.

She landed on a different floor, a older one, flagstone, in a room she had never seen behind a door she had wiped down a thousand times. The cafe had a back room. The back room was full of people. The people were all regulars, and they were all looking at her with the specific guilt of a surprise party that has gone slightly wrong.

"We were going to tell you," said the man who always ordered the bottomless filter coffee and never seemed to leave. "After your probation."

"My probation ended in March."

"Yes," he agreed. "Well." He gestured at the room, at the maps and the wards and the very large weapon mounted over the fireplace. "Surprise. The cafe is also other things. And you, it seems, are also other things, or Moira wouldn''t have warned you."

Wendy sat down on the nearest crate. It was a long way from the bus stop.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000600003','b2200000-0000-0000-0000-000000000006',3,'Latte Art Is Not a Combat Skill','They wanted Wendy to learn the family business, by which they meant the keeping-things-from-eating-the-neighbourhood business. She pointed out, reasonably, that her only marketable skill was a passable fern in foam.',142,1,true, now() - interval '95 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000600003','They wanted Wendy to learn the family business, by which they meant the keeping-things-from-eating-the-neighbourhood business. She pointed out, reasonably, that her only marketable skill was a passable fern in foam.

"That''s not nothing," said Moira, who had stopped crying and now seemed almost cheerful, which Wendy found more alarming than the screaming. "Intent, focus, a steady hand. You pour a ward like you pour a heart in a cappuccino, dear. Same wrist."

"I''m not pouring a ward."

"You poured one last Tuesday. The one that kept the thing in the alley out of the cafe." Moira patted her hand. "We all noticed. We just didn''t want to spook you before payroll cleared."

Wendy looked at her own hands. They were, she had to admit, very steady. Nine months of closing shifts had made them that way. She had thought she was just getting good at coffee.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000600004','b2200000-0000-0000-0000-000000000006',4,'The Thing in the Alley Comes Back','It came back on a Wednesday, during the lull, when Wendy was alone behind the counter and the only weapon in reach was a milk thermometer.',58,1,false, now() - interval '45 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000600004','It came back on a Wednesday, during the lull, when Wendy was alone behind the counter and the only weapon in reach was a milk thermometer. The thing filled the doorway like spilled ink filling a crack. Wendy did not run. She reached for a clean cup, because her hands knew what to do even when she didn''t, and she started, very calmly, to pour.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000600005','b2200000-0000-0000-0000-000000000006',5,'Tips Included','The regulars came back to find the alley-thing sitting at table four, drinking a flat white, looking confused and a little embarrassed about the whole eating-the-neighbourhood plan.',54,1,false, now() - interval '8 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000600005','The regulars came back to find the alley-thing sitting at table four, drinking a flat white, looking confused and a little embarrassed about the whole eating-the-neighbourhood plan. Wendy was wiping down the steam wand. "It just needed somewhere warm to sit," she said, not looking up. "And a snack. Most things do." Moira began, very softly, to cry, but this time it was the good kind.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 07
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-07@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Garrick Hu"}')
on conflict (id) do nothing;
update public.users set username='garrickwrites', display_name='Garrick Hu', role='writer', is_verified=false, bio=null, date_of_birth='1985-12-30' where id='b2100000-0000-0000-0000-000000000007';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000007','b2100000-0000-0000-0000-000000000007','The Tenth Sword','the-tenth-sword','Nine legendary swords ended the last war. The tenth was buried so it could never start another. A farmboy just dug it up looking for water.','#5A4A2A','fantasy','{"epic-fantasy","chosen-one","war"}','complete',false,210800,12030, now() - interval '265 days', now() - interval '14 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000700001','b2200000-0000-0000-0000-000000000007',1,'A Dry Year','It had not rained in the valley since the spring before, and the wells were giving up one by one, like old men.',162,1,true, now() - interval '265 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000700001','It had not rained in the valley since the spring before, and the wells were giving up one by one, like old men. So Aldo dug. He was sixteen and the strongest thing his family owned, and digging a new well was the kind of job that fell to the strongest thing.

He dug for nine days in the dry south field, where the dowser''s stick had finally twitched. He went down past the topsoil, past the clay, into a layer of pale stone that rang under the pick like a struck bell.

On the ninth day the pick did not ring. It clanged, metal on metal, and Aldo cleared the dirt with his hands and found a crossguard.

He thought, at first, it was a plough blade. The valley was full of buried iron; war had passed through it twice. But ploughs do not have grips wound in silver wire, and ploughs do not, when your fingers close around them, go warm, and ploughs do not whisper a name that is almost, but not quite, your own.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000700002','b2200000-0000-0000-0000-000000000007',2,'The Dowser Knew','The old dowser had pointed his stick at that field on purpose. Aldo understood it the moment he carried the sword home and saw the man waiting at the gate, already weeping.',151,1,true, now() - interval '258 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000700002','The old dowser had pointed his stick at that field on purpose. Aldo understood it the moment he carried the sword home and saw the man waiting at the gate, already weeping.

"I''m sorry," the dowser said. "I''m so sorry, boy. I didn''t want it to be you. I didn''t want it to be anyone."

"It''s just an old sword."

"It is the Tenth Sword." The dowser said it the way you say the name of a sickness. "The nine ended the war. The tenth was meant to end the world, if the world ever needed ending, and so the wise ones buried it where no army would think to look. Under a turnip field. Under sixty years of peace."

Aldo looked at the blade across his arms. It did not look like the end of the world. It looked tired, and a little hopeful, and that was the part that frightened him.

"Then I''ll put it back," he said.

The dowser shook his head. "It only comes up once. And it has already chosen who carries it down."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000700003','b2200000-0000-0000-0000-000000000007',3,'The Road to the Capital','News of an unburied sword travels faster than any boy can walk. By the time Aldo reached the second town, three different banners were already looking for him.',144,1,true, now() - interval '240 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000700003','News of an unburied sword travels faster than any boy can walk. By the time Aldo reached the second town, three different banners were already looking for him.

He had thought, in the dry south field, that the sword was a kind of luck. Three days on the road had corrected him. The sword was a kind of debt, and the whole continent had decided to come collecting.

A woman in grey found him at an inn and did not draw a weapon, which made her the most dangerous person he had met so far. She sat down across the table, folded her hands, and said, "There are eleven nations who want that on their wall, and exactly one old man who wants it back in the ground. You are going to have to pick a side, and you are going to have to do it before supper."

Aldo, who had never picked anything more consequential than which field to plant, set down his spoon.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000700004','b2200000-0000-0000-0000-000000000007',4,'The Woman in Grey','She said her name was Sael, that she had carried the Third Sword in the last war, and that carrying it had cost her everything a person can lose and still keep walking.',61,1,false, now() - interval '180 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000700004','She said her name was Sael, that she had carried the Third Sword in the last war, and that carrying it had cost her everything a person can lose and still keep walking. She had come, she said, not to take the Tenth from Aldo, and not to help any banner claim it. She had come to teach him how to set it down. It was, she admitted, a skill almost nobody survived long enough to learn.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000700005','b2200000-0000-0000-0000-000000000007',5,'The Burying Ground','There was a place, Sael said, older than the nine swords, older than the war, where a thing could be put down so completely that even legend forgot it. The road there ran straight through the war Aldo was trying to prevent.',56,1,false, now() - interval '120 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000700005','There was a place, Sael said, older than the nine swords, older than the war, where a thing could be put down so completely that even legend forgot it. The road there ran straight through the war Aldo was trying to prevent. He had wanted, his whole life, to matter to no one. Now eleven nations knew his name, and the only way back to that quiet was forward, through all of them.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000700006','b2200000-0000-0000-0000-000000000007',6,'What the Sword Wanted','It spoke to him properly on the last night, and what it wanted was not war, and not the end of the world. It wanted, quietly, almost shyly, to be allowed to rest.',57,1,false, now() - interval '20 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000700006','It spoke to him properly on the last night, and what it wanted was not war, and not the end of the world. It wanted, quietly, almost shyly, to be allowed to rest. Sixty years underground had been the only peace it had ever known. Aldo lay awake with the blade beside him and understood, finally, that he and the Tenth Sword wanted exactly the same thing, and always had.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 08
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-08@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Nessa Brandt"}')
on conflict (id) do nothing;
update public.users set username='nessabee', display_name='Nessa Brandt', role='writer', is_verified=false, bio='witch fiction. herbs and grudges.', date_of_birth='1992-04-11' where id='b2100000-0000-0000-0000-000000000008';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000008','b2100000-0000-0000-0000-000000000008','The Inheritance of Thorn House','inheritance-of-thorn-house','Margot inherits her aunt''s house, her aunt''s garden, and her aunt''s ongoing feud with the rest of the coven. The garden is not optional.','#3E5A2C','fantasy','{"urban-fantasy","witches","family-drama"}','ongoing',false,58200,3920, now() - interval '105 days', now() - interval '9 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000800001','b2200000-0000-0000-0000-000000000008',1,'The Will','Aunt Cordelia''s will was four pages long. Three of them were about the garden. Margot read it twice on the train and understood roughly none of it.',158,1,true, now() - interval '105 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000800001','Aunt Cordelia''s will was four pages long. Three of them were about the garden. Margot read it twice on the train and understood roughly none of it.

She had met her aunt exactly four times, all of them awkward, all of them involving a great deal of tea and a smell of crushed leaves that Margot had never been able to name. Cordelia had always looked at her a little too long, the way you look at a parcel you are deciding whether to open.

Now the parcel had been opened, posthumously, by a solicitor with an apologetic voice. The house was hers. Thorn House. And the garden, the will stressed, in Cordelia''s own slanting hand at the bottom of page three: the garden must be kept. Not tidy. Not pretty. Kept. The word was underlined three times, and beside it, smaller, almost an afterthought: it knows when it is neglected, and it does not forgive.

Margot put the will in her bag. She decided not to think about that last line until she absolutely had to.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000800002','b2200000-0000-0000-0000-000000000008',2,'The Garden Wakes','She had to think about it the next morning, when she opened the kitchen door and the garden turned, all of it at once, to look at her.',147,1,true, now() - interval '99 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000800002','She had to think about it the next morning, when she opened the kitchen door and the garden turned, all of it at once, to look at her.

There was no other word for it. The roses leaned. The tall pale flowers along the wall swung their heads round on their stems, slow and deliberate, the way a room of strangers turns when you walk in late. Even the herbs, low and unassuming, seemed to be paying attention.

Margot stood very still on the step. She was a sensible person. She worked in insurance. She had a pension.

"Hello," she said, because it seemed rude not to.

The garden did not answer in words. But the gate at the far end, which had been shut, drifted slowly open, and a path she was fairly sure had not been there yesterday revealed itself between the beds, leading somewhere green and shadowed. An invitation. Or a chore. With this family, Margot was beginning to suspect, those were the same thing.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000800003','b2200000-0000-0000-0000-000000000008',3,'The Coven Comes Calling','Three women arrived at Thorn House before lunch, uninvited, carrying a cake. Margot had been raised to distrust an uninvited cake.',141,1,true, now() - interval '80 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000800003','Three women arrived at Thorn House before lunch, uninvited, carrying a cake. Margot had been raised to distrust an uninvited cake.

They introduced themselves as friends of Cordelia, which Margot already doubted, because they said the word friends the way you say the name of an ex. They admired the hallway. They did not, she noticed, step past the kitchen toward the garden. They kept well clear of the kitchen, in fact, the way you keep clear of a dog you have history with.

"We wondered," said the eldest, setting the cake down, "whether you''d be keeping the place. A young woman, a career in the city. It must feel like such a burden."

"We could take the garden off your hands," said the youngest, too quickly, and the eldest gave her a look that could have curdled milk.

Margot smiled her insurance smile, the one that gave nothing away, and put the kettle on.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000800004','b2200000-0000-0000-0000-000000000008',4,'What Grows by the Wall','The path led to a single bed against the oldest wall, where nothing grew but one black-stemmed plant, and Margot understood at once that this was the thing the coven actually wanted.',56,1,false, now() - interval '40 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000800004','The path led to a single bed against the oldest wall, where nothing grew but one black-stemmed plant, and Margot understood at once that this was the thing the coven actually wanted. It was not beautiful. It was barely alive. But the rest of the garden bent toward it like courtiers, and when Margot crouched to look closer, the black plant shivered, and a name surfaced in her mind that she was certain was not her own thought.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000800005','b2200000-0000-0000-0000-000000000008',5,'Cordelia''s Letters','In the potting shed she found a tin of letters, all unsent, all addressed to the coven, and reading them Margot learned that the feud had a body buried under it.',53,1,false, now() - interval '11 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000800005','In the potting shed she found a tin of letters, all unsent, all addressed to the coven, and reading them Margot learned that the feud had a body buried under it. Cordelia had not been hiding the black-stemmed plant out of spite. She had been guarding it. The letters did not say from what. They only said, again and again, in that same triple-underlined hand: do not let them dig.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 09
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-09@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Cole Whitman"}')
on conflict (id) do nothing;
update public.users set username='cole_w', display_name='Cole Whitman', role='writer', is_verified=false, bio='first story be nice', date_of_birth='2005-08-19' where id='b2100000-0000-0000-0000-000000000009';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000009','b2100000-0000-0000-0000-000000000009','Dragonbound (DISCONTINUED maybe)','dragonbound-maybe','A boy bonds with a dragon egg and they have to save the kingdom. classic but i wanted to write it ok','#8A2E2E','fantasy','{"epic-fantasy","dragons","young-adult"}','paused',false,8430,410, now() - interval '70 days', now() - interval '52 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000900001','b2200000-0000-0000-0000-000000000009',1,'The Egg','Bryn found the egg in the woods and it was warm even though it was winter and that was the first weird thing.',144,1,true, now() - interval '70 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000900001','Bryn found the egg in the woods and it was warm even though it was winter and that was the first weird thing. It was about the size of a melon and it had a kind of pattern on it like flames but frozen, and when he picked it up his hands tingled all the way to the elbow.

He knew he should tell someone. His mother always said, if you find something strange in the woods you tell an adult. But Bryn also knew that if he told an adult they would take the egg away, and he had wanted something that was just his for as long as he could remember.

So he put it in his coat. It pressed warm against his chest the whole walk home, and once, he was almost sure, it moved.

That night he hid it under his bed wrapped in his only good blanket. He couldnt sleep. He kept thinking he could hear it, a sound like a heartbeat that wasnt his own, and he lay there grinning at the ceiling in the dark.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000900002','b2200000-0000-0000-0000-000000000009',2,'It Hatches','It hatched on the third night and the noise was so loud Bryn was sure the whole village would wake up but somehow nobody did.',138,1,true, now() - interval '64 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000900002','It hatched on the third night and the noise was so loud Bryn was sure the whole village would wake up but somehow nobody did.

The dragon was small. Smaller than a cat. It was the colour of a coal that still had a little fire left in it, dark with orange showing through the cracks, and it looked up at Bryn with eyes that were way too clever for something that was four minutes old.

"Hi," Bryn whispered. He didnt know what else to say. "Im Bryn."

The dragon tilted its head. And then a voice spoke, right inside his skull, not loud but very clear, and it said: I know. I have been listening to you sleep for three nights. You snore.

Bryn fell off the bed.

The dragon, he would later swear, laughed at him. It made a sound like a kettle starting to boil and its whole small body shook, and Bryn sat on the floor in the cold and started, helplessly, to laugh too.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000900003','b2200000-0000-0000-0000-000000000009',3,'Soldiers in the Village','Bryn woke up to shouting and when he looked out the window there were soldiers in the square and they were asking everyone the same question.',128,1,true, now() - interval '58 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000900003','Bryn woke up to shouting and when he looked out the window there were soldiers in the square and they were asking everyone the same question. Had anyone found an egg. Had anyone seen anything in the woods. There was a man with them in a black coat who wasnt a soldier and somehow he was scarier than all of them.

The dragon was very quiet in Bryns mind. Then it said: that man can feel me. We have maybe an hour. Probably less.

Bryn looked at the little dragon, who was hiding in his coat again, and he looked at the soldiers, and he realised that his life had stopped being his own life and become a different kind of story, the kind that didnt have safe parts.

"Okay," he said. His voice shook. "Okay. We run. I dont have a plan past that."

Thats fine, the dragon said. Neither do I. We can be bad at this together.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000000900004','b2200000-0000-0000-0000-000000000009',4,'The Black Coat','sorry this chapter is short ive been busy with exams. the man in the black coat catches up to them at the river.',48,1,false, now() - interval '53 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000000900004','The man in the black coat caught up to them at the river. He didnt run. He just walked, and somehow that was worse. The dragon hissed in Bryns mind, a sound with no words in it, only fear. Bryn picked up a rock. It was a stupid weapon against a man like that but it was what he had.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 10
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-10@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Imogen Saar"}')
on conflict (id) do nothing;
update public.users set username='isaar', display_name='Imogen Saar', role='writer', is_verified=true, bio='Novelist. Three books in print, the rest live here first.', date_of_birth='1981-01-25' where id='b2100000-0000-0000-0000-000000000010';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000010','b2100000-0000-0000-0000-000000000010','The Glassmaker''s Daughter','the-glassmakers-daughter','In a city where memories can be poured into glass and sold, a glassmaker''s daughter discovers her father has been buying back her childhood, one window at a time.','#4A6A7A','fantasy','{"low-fantasy","literary","memory"}','ongoing',true,89100,6210, now() - interval '175 days', now() - interval '7 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001000001','b2200000-0000-0000-0000-000000000010',1,'The Trade','In the city of Halvane they do not bury the dead with their memories. They pour them, while the dying still breathe, into glass — and the glass is sold, and the memory belongs to whoever can pay.',187,1,true, now() - interval '175 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001000001','In the city of Halvane they do not bury the dead with their memories. They pour them, while the dying still breathe, into glass — and the glass is sold, and the memory belongs to whoever can pay.

Tova had grown up in the workshop where this was done. She knew the weight of a full pane, the particular green a memory of grief took, the way joy clouded the glass faintly gold. Her father was the finest glassmaker in the quarter, and she had spent her childhood the way other children spent theirs at games: learning to read a stranger''s whole life by the colour it had set into.

She did not, as a rule, look at the panes her father kept for himself. A glassmaker was entitled to a private shelf. Everyone understood that.

But on the morning of her twenty-third birthday she went into the cold room for a tray of cooling glass, and the low sun came through the window, and the shelf of her father''s private panes lit up — and every single one of them, she saw, was a memory of her. Small. A child. Her own face, behind glass she had not known existed.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001000002','b2200000-0000-0000-0000-000000000010',2,'The Cold Room','She did not ask him that day, or the next. Tova was her father''s daughter, and her father had taught her that you study a thing fully before you let it know you have seen it.',164,1,true, now() - interval '168 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001000002','She did not ask him that day, or the next. Tova was her father''s daughter, and her father had taught her that you study a thing fully before you let it know you have seen it.

So she counted. Forty-one panes, each one a memory of her younger self, arranged on the shelf not by colour but, she realised slowly, by year. Her at five, gap-toothed. Her at eight, asleep over a book. Her at eleven, crying about something she could no longer name — because of course she could not name it. The memory was not in her anymore. It was in the glass.

That was the part that kept her awake. A memory in glass is a memory removed. Every pane on that shelf was a piece of her own childhood that she had lived, and then lost, and her father had been quietly buying the lost pieces back. From whom? She had never sold a memory in her life. She would have remembered selling a memory.

Unless, of course, she would not have.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001000003','b2200000-0000-0000-0000-000000000010',3,'A Ledger','Every glassmaker keeps a ledger. Tova knew where her father kept his, and one evening, while he slept, she finally opened it to the year she was born.',152,1,true, now() - interval '150 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001000003','Every glassmaker keeps a ledger. Tova knew where her father kept his, and one evening, while he slept, she finally opened it to the year she was born.

The handwriting changed three pages in. Her father''s was upright and careful. This other hand was looser, hurried, and it belonged — she knew it instantly, the way you know a voice in the dark — to her mother, who had died when Tova was four. Or who Tova believed had died. The ledger did not use the word died.

The ledger used the word poured.

Tova sat on the workshop floor with the book in her lap and the cold coming up through the stone, and she made herself read it all, every entry, in her mother''s rushing hand. By the last page she understood that the forty-one panes upstairs were not her father buying back her childhood at all. They were her father hiding it. From her. So that she would never assemble the one memory he could not let her keep.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001000004','b2200000-0000-0000-0000-000000000010',4,'The Forty-Second Pane','There was a gap on the shelf. She had counted forty-one, and the years did not. One was missing, and Tova began, methodically, to look for it.',63,1,false, now() - interval '70 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001000004','There was a gap on the shelf. She had counted forty-one, and the years did not. One was missing, and Tova began, methodically, to look for it. Not in the cold room. Her father was too careful for that. She looked in the places a glassmaker hides the pane he cannot bear to keep but cannot bring himself to break — and she found it, at last, set into the workshop window itself, where she had looked through it her whole life without ever once seeing it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001000005','b2200000-0000-0000-0000-000000000010',5,'What the Glass Held','To read a pane you must hold it to the light and let the memory pour back into you. It cannot be undone. Tova stood at the window with her father''s secret in her hands and decided she would rather know.',58,1,false, now() - interval '15 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001000005','To read a pane you must hold it to the light and let the memory pour back into you. It cannot be undone. Tova stood at the window with her father''s secret in her hands and decided she would rather know. She did not call out to wake him. Whatever was in the glass had been hers to begin with, taken from her at four years old, and she was twenty-three now, and tired of being protected from her own life.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 11
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-11@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Jay Okonkwo"}')
on conflict (id) do nothing;
update public.users set username='jaytells', display_name='Jay Okonkwo', role='writer', is_verified=false, bio='heist stories. always heist stories.', date_of_birth='1998-10-06' where id='b2100000-0000-0000-0000-000000000011';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000011','b2100000-0000-0000-0000-000000000011','Six Ways to Rob a God','six-ways-to-rob-a-god','The temple of the Coin God has never been robbed in four hundred years. Resa has a plan. The plan has six steps. Five of them are lies.','#7A6A1A','fantasy','{"low-fantasy","heist","ensemble"}','ongoing',false,112400,7340, now() - interval '130 days', now() - interval '1 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001100001','b2200000-0000-0000-0000-000000000011',1,'The Unrobbable Vault','Four hundred years. That is how long the temple of the Coin God has stood unrobbed, and every thief in the city will tell you that number like it is a law of nature.',169,1,true, now() - interval '130 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001100001','Four hundred years. That is how long the temple of the Coin God has stood unrobbed, and every thief in the city will tell you that number like it is a law of nature, like the tides, like the fact that bread falls butter-side down.

Resa hated that number. She had hated it since she was eleven and hungry, watching priests carry more gold into that temple in a single afternoon than her whole street would see in a lifetime. She had been planning the job, in some corner of her head, every day since. It had taken her nineteen years to get good enough to admit the plan out loud.

She admitted it out loud in the back room of a laundry, to five people she did not entirely trust, which was the correct number of people to not entirely trust for a job this size.

"Six steps," she said, and laid the first card on the table. "I''ll be honest with you about one of them. The God can hear honesty. So five of these are lies, and you''re going to have to live them like they''re true, or the God will know, and the God does not forgive."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001100002','b2200000-0000-0000-0000-000000000011',2,'The Crew','You cannot rob a god alone. Resa had known that since she was eleven, and she had spent the nineteen years not just planning the job, but collecting the people stubborn enough to attempt it with her.',156,1,true, now() - interval '124 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001100002','You cannot rob a god alone. Resa had known that since she was eleven, and she had spent the nineteen years not just planning the job, but collecting the people stubborn enough to attempt it with her.

There was Den, who could lie to a truth-spell because he no longer believed anything, including his own name. There was old Marisha, who had been a temple accountant for thirty years and had been quietly memorising the vault rotations the entire time, out of nothing but spite. There were the twins, who did not talk, and whom Resa had stopped trying to tell apart. And there was the priest.

The priest was the part nobody liked. You needed someone the God already trusted, and a trusted person, by definition, had something to lose. Resa had found one whose faith had a crack in it shaped exactly like a dead daughter, and she was not proud of using that crack, but she was going to use it anyway.

"That''s the crew," she said. "Now the lies."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001100003','b2200000-0000-0000-0000-000000000011',3,'Step One Is a Lie','Resa told them step one with a completely straight face, and it was completely false, and the genius of it was that she needed her own crew to believe it.',146,1,true, now() - interval '100 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001100003','Resa told them step one with a completely straight face, and it was completely false, and the genius of it was that she needed her own crew to believe it.

The Coin God could hear a lie the way you hear a wrong note in a song. So the trick was not to lie to the God. The trick was to never know you were lying. If Den believed, all the way down, that the job was a forgery scam and not a vault break, then when the God reached into Den''s mind it would find a forger, honest and complete, and it would relax.

Five of her six people would walk into that temple carrying a false job in their heads like a real one. Only Resa would carry the truth, and Resa had spent nineteen years learning to hold a true thought so still that even a god might mistake it for furniture.

"You''ll hate me," she told them, "when you find out. That''s step six. Hating me is part of the plan too."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001100004','b2200000-0000-0000-0000-000000000011',4,'The Accountant''s Spite','Marisha walked them through thirty years of vault rotations from memory, and Resa understood that her real weapon had never been a lockpick. It was a woman nobody had thought to thank.',60,1,false, now() - interval '55 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001100004','Marisha walked them through thirty years of vault rotations from memory, and Resa understood that her real weapon had never been a lockpick. It was a woman nobody had thought to thank. The temple had paid Marisha badly and dismissed her quietly, and in doing so had handed Resa the one thing four hundred years of thieves had lacked: someone on the inside with nothing left but a grudge and a perfect memory.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001100005','b2200000-0000-0000-0000-000000000011',5,'The Priest''s Crack','On the night before the job the priest came to Resa alone and said he knew she was using his grief. She did not deny it. She had decided, long ago, that lying to the God did not require lying to him.',57,1,false, now() - interval '20 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001100005','On the night before the job the priest came to Resa alone and said he knew she was using his grief. She did not deny it. She had decided, long ago, that lying to the God did not require lying to him. "Yes," she said. "I am. And you''re going to let me, because the God watched your daughter die and did nothing, and you have been waiting four years for someone to hand you a way to make it pay."')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 12
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-12@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Hattie Pell"}')
on conflict (id) do nothing;
update public.users set username='hattiep', display_name='Hattie Pell', role='writer', is_verified=false, bio='', date_of_birth='1990-05-08' where id='b2100000-0000-0000-0000-000000000012';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000012','b2100000-0000-0000-0000-000000000012','The Wolves of Marrow Street','wolves-of-marrow-street','Half the houses on Marrow Street are werewolf families. Nobody talks about it. Then a developer buys the corner lot and the truce starts to come apart.','#3A3A28','fantasy','{"urban-fantasy","werewolves","community"}','ongoing',true,46700,3010, now() - interval '88 days', now() - interval '5 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001200001','b2200000-0000-0000-0000-000000000012',1,'The Corner Lot','Marrow Street had a system, and the system worked, and the system was never written down anywhere because writing it down would have meant admitting what the system was for.',164,1,true, now() - interval '88 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001200001','Marrow Street had a system, and the system worked, and the system was never written down anywhere because writing it down would have meant admitting what the system was for.

The system was this: on the three nights around the full moon, the curtains stayed shut, the bins came in early, and nobody — nobody — went out after dark. The families on the odd-numbered side ran on the nights of the dark moon. The even side ran on the bright. Forty years of careful scheduling, passed down like a family recipe, so that no two packs were ever loose on the same night with the same hunger.

It was Della''s grandmother who had built that schedule, back when Marrow Street was half empty and the howling carried. Della had inherited the house, the schedule, and the quiet job of keeping the peace.

Then the sign went up on the corner lot. SOLD. And under that, a developer''s cheerful logo, and a phone number, and Della stood on the pavement reading it and felt the whole careful machinery of forty years give one small, sickening lurch.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001200002','b2200000-0000-0000-0000-000000000012',2,'The Survey','The developer sent a surveyor on a Tuesday. He had a clipboard and good shoes and absolutely no idea that the friendly old woman bringing him tea was deciding, with each sip he took, how much she could afford to tell him.',158,1,true, now() - interval '81 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001200002','The developer sent a surveyor on a Tuesday. He had a clipboard and good shoes and absolutely no idea that the friendly old woman bringing him tea was deciding, with each sip he took, how much she could afford to tell him.

"Lovely quiet street," he said. "You don''t get that, usually. So central."

"We like our quiet," Della agreed.

"The plan''s flats. Six storeys. Bit of retail at the bottom." He sketched a shape in the air, oblivious. "Lights on all night, security. Real improvement for the area."

Lights on all night. Della kept her face still. Marrow Street ran on darkness the way a clock runs on a spring. You could not put a six-storey building full of strangers and floodlights on the corner lot without the whole street noticing it, every full moon, in the worst possible way.

"You should talk to the residents'' association," she said pleasantly. "Before you finalise anything. We''re very involved."

There was no residents'' association. There was going to be one by Friday.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001200003','b2200000-0000-0000-0000-000000000012',3,'The Odd Side and the Even Side','To stop the development Della needed both sides of the street to agree on something, and the two packs of Marrow Street had not agreed on anything since 1987.',147,1,true, now() - interval '60 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001200003','To stop the development Della needed both sides of the street to agree on something, and the two packs of Marrow Street had not agreed on anything since 1987.

The feud was old and stupid, the way the worst feuds are. Something about a fence, a dog that was not entirely a dog, and a christening nobody had been invited to. Nobody alive remembered the details clearly. They just remembered the shape of the grudge, and they kept it watered.

Della called the meeting in the community hall and watched the odd side file in and sit on the left, and the even side file in and sit on the right, and the empty rows between them like a river nobody would cross.

"Right," she said, standing where her grandmother used to stand. "You can carry on hating each other. That''s allowed. But you''re going to have to hate each other quietly, and on the same side of the table, because there is a man with a clipboard who wants to put a lighthouse on the corner lot, and he does not care which of you started the fence thing."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001200004','b2200000-0000-0000-0000-000000000012',4,'A Bad Full Moon','The first full moon after the SOLD sign went up was a bad one. The street was tense, the schedule frayed, and somebody on the even side ran a night early.',61,1,false, now() - interval '30 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001200004','The first full moon after the SOLD sign went up was a bad one. The street was tense, the schedule frayed, and somebody on the even side ran a night early. Della heard it from her kitchen — the wrong howl on the wrong night — and she stood there with the kettle in her hand and understood that the developer was not the real danger. The real danger was that Marrow Street, frightened, would forget how to be careful.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001200005','b2200000-0000-0000-0000-000000000012',5,'What the Surveyor Saw','He came back. Of course he came back; developers always do. But this time he came back at dusk, near the moon, and Della saw his car turn into the street and started, very fast, to run.',55,1,false, now() - interval '9 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001200005','He came back. Of course he came back; developers always do. But this time he came back at dusk, near the moon, and Della saw his car turn into the street and started, very fast, to run. The man with the clipboard was about to learn what Marrow Street was for. The only question left was whether he learned it from her, calmly, on a doorstep, or from something else, later, in the dark.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 13
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-13@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Soren Vey"}')
on conflict (id) do nothing;
update public.users set username='sorenvey', display_name='Soren Vey', role='writer', is_verified=false, bio='grimdark and proud. updates whenever', date_of_birth='1987-02-14' where id='b2100000-0000-0000-0000-000000000013';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000013','b2100000-0000-0000-0000-000000000013','The Mercy of Ravens','the-mercy-of-ravens','A disgraced battlefield surgeon is conscripted by the army that ruined her. She will save their soldiers. She has not decided yet whether she will let them live afterward.','#2A2A2A','fantasy','{"dark-fantasy","grimdark","war"}','ongoing',true,71300,4880, now() - interval '155 days', now() - interval '16 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001300001','b2200000-0000-0000-0000-000000000013',1,'Conscripted','They came for Aerith at dawn, which she appreciated, in a bleak way. The army that had burned her hospital at least had the decency to ruin her life on a schedule.',166,1,true, now() - interval '155 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001300001','They came for Aerith at dawn, which she appreciated, in a bleak way. The army that had burned her hospital at least had the decency to ruin her life on a schedule.

The officer who knocked was young, and clean, and clearly believed he was offering her something. A pardon, he called it. The Crown was generous. Her past would be forgotten, her name restored, in exchange for her hands and her skill and her presence at the front, where the surgeons were dying faster than the soldiers.

Aerith listened to all of it with a cup of cold tea in her hands. She did not interrupt. She had learned, in three years of disgrace, that letting a powerful man finish his speech was a small free thing, and that small free things were all she had left.

"You burned my hospital," she said, when he was done.

"That was a different campaign."

"It was eleven months ago." She set down the tea. "Fine. I''ll come. I''ll mend your soldiers. But you should know I''m not doing it for the pardon, and you should spend some time, on the road, wondering what I''m doing it for instead."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001300002','b2200000-0000-0000-0000-000000000013',2,'The Field Hospital','The field hospital was a barn with the animals only recently removed. Aerith stood in the doorway, counted the wounded, counted the supplies, and did the arithmetic that every army hopes its surgeons will not do out loud.',159,1,true, now() - interval '148 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001300002','The field hospital was a barn with the animals only recently removed. Aerith stood in the doorway, counted the wounded, counted the supplies, and did the arithmetic that every army hopes its surgeons will not do out loud.

Forty-some men. Enough thread and poppy and clean water for perhaps half. The rest was a question of choosing, and choosing was the part of the work that had broken every surgeon she had ever known, one way or another.

She had thought, on the road, that she might enjoy this. That she might stand here, holding the power of life over the very army that had wronged her, and feel something like justice.

She felt nothing like justice. She felt the old, familiar dread, the weight of forty men and twenty chances, and her hands were already rolling up her sleeves, because her hands had never once, in twenty years, waited for the rest of her to decide.

"Boil that water again," she said to the nearest orderly. "And bring me the ones who''ll scream loudest. Quiet ones can wait. Quiet ones are usually already lost."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001300003','b2200000-0000-0000-0000-000000000013',3,'The Boy from the Burned Town','The third soldier on her table was from the town her hospital had stood in. He recognised her before she recognised him, and he begged her, through the poppy haze, not to let him die owing her his life.',150,1,true, now() - interval '130 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001300003','The third soldier on her table was from the town her hospital had stood in. He recognised her before she recognised him, and he begged her, through the poppy haze, not to let him die owing her his life.

"You''re her," he kept saying. "The raven surgeon. You stitched my sister once. And then they made me a soldier and we burned — we burned —"

"Be quiet now," Aerith said, not unkindly, threading her needle. "You can hate yourself when you''ve healed. Hating yourself is hard work and you haven''t the blood to spare for it tonight."

She worked on him until the light failed. She was good — she had always been good, that was the cruelty of it, the skill had never had the decency to leave her along with her reputation. When she finally straightened, her back screaming, the boy was alive, and breathing, and looking at her with an expression she had no name for.

It was not gratitude. It was something heavier, and it would, she knew, follow her for the rest of the campaign.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001300004','b2200000-0000-0000-0000-000000000013',4,'The General''s Request','The general wanted a private word. Generals always want a private word, and it is never private and never just a word.',62,1,false, now() - interval '75 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001300004','The general wanted a private word. Generals always want a private word, and it is never private and never just a word. He wanted to know if a surgeon could do the opposite of her trade — quietly, in the night, to a wounded enemy officer the Crown found inconvenient to keep alive. Aerith looked at him for a long time. She had been waiting, she realised, for exactly this question. She just had not expected it to arrive so soon, or to be so tempting.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001300005','b2200000-0000-0000-0000-000000000013',5,'What She Decided','She gave the general her answer at midnight, in the barn, with forty sleeping men around her and her hands very clean. It was not the answer he wanted, and it was not mercy either, and Aerith had stopped, some time ago, expecting those to be the only two choices.',54,1,false, now() - interval '18 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001300005','She gave the general her answer at midnight, in the barn, with forty sleeping men around her and her hands very clean. It was not the answer he wanted, and it was not mercy either, and Aerith had stopped, some time ago, expecting those to be the only two choices. There was a third thing a surgeon could do with the trust of an army that had wronged her, and she had spent the whole campaign deciding to do it.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 14
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-14@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Pippa Dorne"}')
on conflict (id) do nothing;
update public.users set username='pippawrites', display_name='Pippa Dorne', role='writer', is_verified=false, bio='cosy fantasy. nobody dies in my books i promise', date_of_birth='1993-07-30' where id='b2100000-0000-0000-0000-000000000014';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000014','b2100000-0000-0000-0000-000000000014','The Teashop at the Edge of the Map','teashop-at-the-edge-of-the-map','A retired adventurer opens a teashop in a village so small it isn''t on any map. Her old life keeps walking through the door anyway.','#6A8A5A','fantasy','{"cozy-fantasy","slice-of-life","found-family"}','ongoing',false,94300,6800, now() - interval '115 days', now() - interval '3 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001400001','b2200000-0000-0000-0000-000000000014',1,'A Quiet Place to Stop','Brindle had killed three things that legends are written about, and she had decided, somewhere around the third one, that what she actually wanted was a teashop.',161,1,true, now() - interval '115 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001400001','Brindle had killed three things that legends are written about, and she had decided, somewhere around the third one, that what she actually wanted was a teashop.

Not metaphorically. An actual teashop, with actual tea, in a village so small and so far from anywhere that the mapmakers had simply never bothered. The village was called Lowmott. It had a well, a baker, eleven houses, and now, as of this spring, a teashop with a hand-painted sign that Brindle had done herself and was quietly very proud of.

The first month was wonderful. She learned which of the eleven households took milk and which took honey. She learned that the baker''s boy would trade her a loaf for a pot of the strong black if she let him sit by the window and watch the road. She learned, slowly, what it felt like to wake up and not need a weapon within reach of the bed.

Then, on a grey morning in her second month, the bell over the door rang, and Brindle looked up, and the past walked in wearing its travelling boots.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001400002','b2200000-0000-0000-0000-000000000014',2,'An Old Companion','It was Hesper. Of course it was Hesper. Of all the people who might have found Lowmott, it would be the one who had once carried Brindle, bleeding, down a mountain.',152,1,true, now() - interval '108 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001400002','It was Hesper. Of course it was Hesper. Of all the people who might have found Lowmott, it would be the one who had once carried Brindle, bleeding, down a mountain.

She looked older. They both did. Hesper sat down at the window table without being asked, the way you sit down somewhere you have decided is safe, and she looked at the teapots and the little painted sign and the baker''s boy in the corner, and something in her face came loose.

"You actually did it," she said. "You always said the teashop and we always laughed."

"You laughed," Brindle corrected, setting down a cup. "I was never joking." She poured. Hesper took honey; Brindle had remembered. "You didn''t come all this way for the tea."

"No." Hesper wrapped both hands around the cup. "I came because something is wrong, Brindle, and you''re the only person I trust to tell me I''m allowed to walk away from it."

Brindle sat down across from her old friend, and the morning, gently, stopped being quiet.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001400003','b2200000-0000-0000-0000-000000000014',3,'The Trouble Hesper Brought','Brindle had a rule about the teashop. No weapons past the doormat, no old business after dark, and absolutely no saving the world before the morning pot had steeped.',145,1,true, now() - interval '85 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001400003','Brindle had a rule about the teashop. No weapons past the doormat, no old business after dark, and absolutely no saving the world before the morning pot had steeped.

So she made Hesper wait. She steeped the pot. She served the baker''s boy his loaf-traded tea and waved off old Marrin who only came in to complain about the weather. And then, with the shop quiet and the rain steady on the glass, she sat down and let Hesper talk.

The trouble was not, it turned out, a monster. Brindle had half hoped it would be a monster. Monsters she understood. The trouble was a debt, and a promise, and a young person three valleys over who was about to inherit something dangerous because everyone wiser had run out of road.

"You want me to come back," Brindle said.

"No." Hesper looked at the little teashop, at the life. "No. I want you to tell me how you got to stop. Because I can''t find the door, Brindle. I''ve been looking for years and I can''t find the door out."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001400004','b2200000-0000-0000-0000-000000000014',4,'The Baker''s Boy Asks a Question','The baker''s boy, who watched the road every day and missed nothing, asked Brindle that evening why her friend had a sword she kept pretending not to have.',57,1,true, now() - interval '50 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001400004','The baker''s boy, who watched the road every day and missed nothing, asked Brindle that evening why her friend had a sword she kept pretending not to have. Brindle dried a cup and thought about lying, and then didn''t. "Because she carried it so long," she said, "she''s forgotten she''s allowed to set it down. Some people need to be shown the doormat. That''s all I did. Someone showed me mine.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001400005','b2200000-0000-0000-0000-000000000014',5,'A Second Cup','Hesper stayed a week. Then two. The village of Lowmott, which had eleven houses, quietly began to discuss whether it might, this year, build a twelfth.',52,1,true, now() - interval '12 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001400005','Hesper stayed a week. Then two. The village of Lowmott, which had eleven houses, quietly began to discuss whether it might, this year, build a twelfth. Brindle did not push. She just kept the pot full and the doormat clear, and she watched her oldest friend slowly learn the thing it had taken Brindle three legends and one teashop to learn: that stopping was not the same as giving up.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 15
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-15@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Reza Tahan"}')
on conflict (id) do nothing;
update public.users set username='rezawrites', display_name='Reza Tahan', role='writer', is_verified=false, bio=null, date_of_birth='1989-09-02' where id='b2100000-0000-0000-0000-000000000015';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000015','b2100000-0000-0000-0000-000000000015','The Last Caravan to Astrabad','last-caravan-to-astrabad','The desert road to Astrabad closes for good at the next solstice. One last caravan, a hundred passengers, and a navigator who has been lying about knowing the way.','#9A7A3A','fantasy','{"epic-fantasy","desert","journey"}','ongoing',false,38900,2410, now() - interval '195 days', now() - interval '22 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001500001','b2200000-0000-0000-0000-000000000015',1,'The Road That Closes','The desert road to Astrabad does not close the way other roads close. There is no gate. There is no decree. At the solstice the road simply stops being a place that goes anywhere.',172,1,true, now() - interval '195 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001500001','The desert road to Astrabad does not close the way other roads close. There is no gate. There is no decree. At the solstice the road simply stops being a place that goes anywhere — the dunes shift, the stars rearrange themselves over the sand, and Astrabad becomes, for everyone left on the wrong side, a city that can be remembered but never reached.

This happens once a generation. Nobody knows why. The desert keeps its own counsel.

Idris stood in the staging yard at Kharif and watched the last caravan assemble. A hundred passengers, give or take. Families mostly, trying to reach relatives before the road sealed. Forty camels. Six wagons. And one navigator, hired at considerable expense, whose job was to read the shifting stars and walk a hundred frightened strangers across a desert that was actively trying to forget the way.

The navigator was Idris. This was a problem, and the size of the problem was this: Idris had never walked the Astrabad road in his life. He had simply needed the fee very badly, and he had always been an excellent liar, and those two facts had carried him to exactly here.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001500002','b2200000-0000-0000-0000-000000000015',2,'First Night Out','The first night out, the caravan trusted him completely, and Idris discovered that being trusted by a hundred people is a far heavier load than any camel was carrying.',157,1,true, now() - interval '188 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001500002','The first night out, the caravan trusted him completely, and Idris discovered that being trusted by a hundred people is a far heavier load than any camel was carrying.

They made camp as the sky went purple. The families gathered close around the fires, and the elders told the children that the navigator knew the stars, that the navigator would not let them be lost, and Idris sat a little apart and listened to himself be described as a thing he was not.

He did know stars. That part was not entirely a lie. He had spent a hard youth on shorter desert routes and he could read a sky better than most. But the Astrabad stars were a different language, and the books he had stolen to study were old, and the road moved, and somewhere out there in the dark a hundred people''s only hope of reaching their families was a man running a confidence trick he no longer knew how to stop.

A child brought him tea. "Thank you for taking us," she said. Idris drank the tea and said nothing, because for once in his life he could not think of a single lie kind enough.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001500003','b2200000-0000-0000-0000-000000000015',3,'The Old Woman Who Counted Stars','One of the passengers, an old woman travelling alone, watched the sky the way Idris watched it, and on the fourth night she sat down beside him and said, very quietly, that they were going the wrong way.',151,1,true, now() - interval '170 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001500003','One of the passengers, an old woman travelling alone, watched the sky the way Idris watched it, and on the fourth night she sat down beside him and said, very quietly, that they were going the wrong way.

Idris did not panic. Panicking was for amateurs, and whatever else he was, he was not an amateur liar. "And how would you know that, grandmother?"

"Because I walked this road forty years ago, the last time it closed." She did not look at him. She looked at the stars. "I know you''re not a navigator, boy. A real navigator would have corrected us on the second night. I''ve been waiting to see what you''d do."

Idris was quiet for a long moment. The fires crackled. A camel groaned somewhere in the dark.

"And what have you decided?" he asked. "Now that you''ve seen."

"I''ve decided," the old woman said, "that you and I are going to get these people to Astrabad together, and that you are going to spend the rest of the journey learning, very fast, to deserve the way they look at you."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001500004','b2200000-0000-0000-0000-000000000015',4,'The Sand That Forgets','The old woman taught him the road the way you teach a song. But the desert was already forgetting it, and each lesson was a race against a path dissolving under their feet.',59,1,false, now() - interval '90 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001500004','The old woman taught him the road the way you teach a song. But the desert was already forgetting it, and each lesson was a race against a path dissolving under their feet. By the ninth day a landmark she described — a black rock shaped like a fist — was simply not there when they reached where it should be. The road was closing early. Idris understood, with cold clarity, that the lie had stopped being his biggest problem.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001500005','b2200000-0000-0000-0000-000000000015',5,'What Idris Confessed','He told them the truth at the fire on the twelfth night, all of it, because the old woman had a fever now and somebody had to lead, and you cannot lead a hundred people across a dying desert on a lie they have not agreed to.',56,1,false, now() - interval '24 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001500005','He told them the truth at the fire on the twelfth night, all of it, because the old woman had a fever now and somebody had to lead, and you cannot lead a hundred people across a dying desert on a lie they have not agreed to. He waited for the anger. It came. But under the anger, in the faces of the families, Idris saw something he had not expected and did not feel he had earned: they were still listening.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 16
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-16@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Birdie K"}')
on conflict (id) do nothing;
update public.users set username='birdie.k', display_name='Birdie K', role='writer', is_verified=false, bio='magic school but make it weird', date_of_birth='2004-12-12' where id='b2100000-0000-0000-0000-000000000016';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000016','b2100000-0000-0000-0000-000000000016','Remedial Summoning','remedial-summoning','Wisp failed Summoning twice. The thing she accidentally called up during the retake is now legally her responsibility and refuses to go home.','#5A3A6A','fantasy','{"urban-fantasy","magic-school","comedy"}','ongoing',false,67200,4530, now() - interval '78 days', now() - interval '2 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001600001','b2200000-0000-0000-0000-000000000016',1,'The Retake','You are allowed to fail Summoning twice at the Academy. On the third attempt they make you sign a form, and the form is not encouraging.',158,1,true, now() - interval '78 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001600001','You are allowed to fail Summoning twice at the Academy. On the third attempt they make you sign a form, and the form is not encouraging.

Wisp signed it. She was good at most things — wards, herblore, the theory of basically everything — but Summoning required a kind of confidence she had simply never been issued, and confidence cannot be borrowed, no matter how nicely you ask your roommate.

The examiner drew the circle. Wisp stepped in. She was supposed to call something small. A messenger sprite. A pocket imp. The exam standard was, frankly, embarrassingly low, which somehow made failing it worse.

She spoke the words. She felt the pull. And then — and she would replay this moment for weeks — she sneezed.

You are not supposed to sneeze during a summoning. The circle does not know what to do with a sneeze. The circle, faced with a sneeze, made an executive decision, and the air in the examination hall folded itself in half, and something stepped through that was definitely, definitely not a pocket imp.

The examiner dropped his clipboard. That, more than anything, told Wisp she was in trouble.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001600002','b2200000-0000-0000-0000-000000000016',2,'Legally Your Problem','The thing she summoned was the size of a small horse, the colour of a bruise, and had far too many opinions for something that had existed, in this realm, for under a minute.',149,1,true, now() - interval '71 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001600002','The thing she summoned was the size of a small horse, the colour of a bruise, and had far too many opinions for something that had existed, in this realm, for under a minute.

"This is a non-standard outcome," said the examiner, who had retrieved his clipboard and was using it as a shield. "Miss Wisp. Per Academy regulation, a summoned entity that cannot be immediately dismissed becomes the legal ward of the summoner. Until it can be rehomed."

"Rehomed," Wisp repeated.

"Or returned. Voluntarily. By the entity." He eyed the bruise-coloured thing. "Does it want to go home?"

The creature considered the question with what looked like genuine effort. Then it sat down, heavily, on the examination circle, smudging it beyond all use, and announced in a voice like a cello falling down stairs: "No."

"There," said the examiner, ticking a box. "It''s settled. You''ve failed the practical, but you''ve passed Involuntary Guardianship, which is technically a higher credit. Congratulations, I suppose."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001600003','b2200000-0000-0000-0000-000000000016',3,'It Will Not Fit Under the Bed','The dormitory rules said no pets. The dormitory rules did not specifically address a bruise-coloured entity of indeterminate species that had started calling Wisp "the small one" and following her to lectures.',143,1,true, now() - interval '55 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001600003','The dormitory rules said no pets. The dormitory rules did not specifically address a bruise-coloured entity of indeterminate species that had started calling Wisp "the small one" and following her to lectures.

Her roommate, Otta, took it surprisingly well. Otta took most things well; it was, Wisp had decided, her most irritating quality.

"It can sleep by the window," Otta said. "It seems to like the window."

"It does not fit by the window. It does not fit anywhere. It is the size of a misunderstanding."

The creature, from the window, where it had somehow folded itself to fit, made a low pleased rumble. It had been improving its vocabulary at an alarming rate. That morning it had used the word "jurisdiction" correctly in a sentence, and Wisp had not slept well since.

"Wisp," said Otta, more gently. "It chose to stay. Things don''t do that for no reason. Have you considered just... asking it why?"

Wisp had not. Wisp had been too busy panicking. She looked at the creature. The creature looked back, patient, expectant, far too clever, and waited to be asked.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001600004','b2200000-0000-0000-0000-000000000016',4,'Why It Stayed','So she asked it. They sat on the dormitory floor at two in the morning, the small one and the large one, and the creature told her, in its cello-down-stairs voice, the reason.',58,1,false, now() - interval '28 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001600004','So she asked it. They sat on the dormitory floor at two in the morning, the small one and the large one, and the creature told her, in its cello-down-stairs voice, the reason. It had not been summoned by the sneeze. It had been waiting, on the other side, for years, for a circle drawn by someone who failed gently rather than someone who succeeded cruelly. Wisp''s failure, it explained, had been the safest door it had ever seen.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001600005','b2200000-0000-0000-0000-000000000016',5,'The Summoning Master Wants a Word','News travels fast at the Academy, and by the end of the week the Summoning Master herself had requested a meeting with Wisp, with the examiner, and, pointedly, with the entity.',54,1,false, now() - interval '6 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001600005','News travels fast at the Academy, and by the end of the week the Summoning Master herself had requested a meeting with Wisp, with the examiner, and, pointedly, with the entity. Wisp walked to that office certain she was about to be expelled. The creature walked beside her, unbothered, and murmured that the Summoning Master had been trying to open a safe door for thirty years, and would, it predicted, be far more interested than angry.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 17
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000017','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-17@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Aldous Frame"}')
on conflict (id) do nothing;
update public.users set username='afr4me', display_name='Aldous Frame', role='writer', is_verified=false, bio='old guy writing the book i wanted as a kid', date_of_birth='1968-03-21' where id='b2100000-0000-0000-0000-000000000017';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000017','b2100000-0000-0000-0000-000000000017','The Bell That Counts the Dead','bell-that-counts-the-dead','Every town has a death bell. Eldermere''s has started ringing for people who are still alive — and the bellringer''s apprentice can hear which names are coming.','#4A4A5A','fantasy','{"low-fantasy","mystery","quiet-horror"}','ongoing',false,53600,3680, now() - interval '142 days', now() - interval '13 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001700001','b2200000-0000-0000-0000-000000000017',1,'One Ring Per Soul','In Eldermere the bell rings once for every soul that leaves the town, and it has done so, faithfully, for as long as the town has had a name.',167,1,true, now() - interval '142 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001700001','In Eldermere the bell rings once for every soul that leaves the town, and it has done so, faithfully, for as long as the town has had a name. One ring per death. The whole town stops when it sounds. People count under their breath, and then go and find out who.

Corin had been apprenticed to the bell for two years. He had not chosen the work. The bell chose its own ringers — it had always done so — and one autumn, when Corin was fourteen, the old bellringer had simply stopped him in the lane and said the bell had spoken his name, and that had been that.

The work was not hard. The bell told him when. He climbed, he rang, he counted. It was solemn and it was steady and Corin had grown, slowly, almost to like it.

Then, on a still night in his third year, the bell woke him at the wrong hour, and it gave him a name to ring, the way it always did. But the name belonged to the baker''s wife. And the baker''s wife, Corin knew for an absolute certainty, was downstairs in her kitchen at that very moment, alive, and singing.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001700002','b2200000-0000-0000-0000-000000000017',2,'He Did Not Ring It','Corin did not ring the bell that night. It was the first time in three years he had refused it, and the bell did not like to be refused.',154,1,true, now() - interval '135 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001700002','Corin did not ring the bell that night. It was the first time in three years he had refused it, and the bell did not like to be refused.

He sat in the tower until dawn with his hands jammed under his arms so they could not betray him, and the bell pressed at the inside of his skull the whole time, patient and cold, repeating the name. The baker''s wife. The baker''s wife. As if he had simply misheard.

He had not misheard. He went down at first light and walked past the bakery, and the windows were lit, and the smell of new bread was in the lane, and the baker''s wife leaned out and wished him good morning and asked after his mother.

She was not dead. She was the least dead person Corin had ever seen.

He went to the old bellringer''s grave — the man had passed the winter before — and he stood there in the cold and said, out loud, "It''s ringing for the living. What do I do." The grave, of course, said nothing. But the bell, far above him in the tower, gave a single low hum, as though it had heard the question, and was considering its answer.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001700003','b2200000-0000-0000-0000-000000000017',3,'The Old Ringer''s Notes','The bellringer''s cottage still stood empty. Corin had a key. He had never used it — it had felt like trespass — but a bell ringing for the living changes what counts as trespass.',146,1,true, now() - interval '115 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001700003','The bellringer''s cottage still stood empty. Corin had a key. He had never used it — it had felt like trespass — but a bell ringing for the living changes what counts as trespass.

The old man had kept notes. Of course he had; he had been that sort. Decades of them, in a careful cramped hand, mostly weather and bell-times and the small accounts of a small life. Corin read for hours, by candle, until the candle guttered.

It was on a loose page, tucked into the back, not bound with the rest. The old ringer had written it late in his life; the hand was shakier. It said: The bell does not ring for death. It rings for a soul that is leaving. Sometimes a soul leaves the body before the body knows to stop. If you hear a living name, the bell is not wrong. The bell is early. And you, boy — if you are reading this — you have until it leaves.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001700004','b2200000-0000-0000-0000-000000000017',4,'The Baker''s Wife','He went to her. He did not know how to begin, so he began badly, the way you do, and the baker''s wife listened to him stammer and then sat down very suddenly, as though her legs had been waiting for permission.',61,1,false, now() - interval '65 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001700004','He went to her. He did not know how to begin, so he began badly, the way you do, and the baker''s wife listened to him stammer and then sat down very suddenly, as though her legs had been waiting for permission. "I''ve been so tired," she said, to the table, not to him. "For a year now. A tiredness with no bottom to it. I thought it was just the work." She looked up at Corin. "How long does your bell say I have?"')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001700005','b2200000-0000-0000-0000-000000000017',5,'A Second Name','The bell gave him a second living name the following week. And a third the week after. Corin stood in the tower with three names that were not yet deaths and understood that the bell had not malfunctioned. The bell was warning him. Something was coming for Eldermere, soul by soul.',57,1,false, now() - interval '14 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001700005','The bell gave him a second living name the following week. And a third the week after. Corin stood in the tower with three names that were not yet deaths and understood that the bell had not malfunctioned. The bell was warning him. Something was coming for Eldermere, soul by soul, quietly, and the bell — old, faithful, frightened in its way — had chosen a frightened boy to be the only person in town who could hear it coming.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 18
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-18@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Mei-Lin Frost"}')
on conflict (id) do nothing;
update public.users set username='meilinf', display_name='Mei-Lin Frost', role='writer', is_verified=false, bio='enemies to lovers is a public service', date_of_birth='1997-06-15' where id='b2100000-0000-0000-0000-000000000018';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000018','b2100000-0000-0000-0000-000000000018','The Frostward Pact','the-frostward-pact','Two rival ice-mages are forced to share a single tower for a year, or both forfeit their licences. Neither plans to be the one who breaks first.','#4A6A8A','fantasy','{"romantic-fantasy","enemies-to-lovers","magic"}','ongoing',true,128700,9100, now() - interval '98 days', now() - interval '4 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001800001','b2200000-0000-0000-0000-000000000018',1,'One Tower, Two Mages','The Frostward Tower was built for one ice-mage. It had one workroom, one library, one absurdly small kitchen, and as of this morning, by order of the Guild, two extremely unwilling tenants.',169,1,true, now() - interval '98 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001800001','The Frostward Tower was built for one ice-mage. It had one workroom, one library, one absurdly small kitchen, and as of this morning, by order of the Guild, two extremely unwilling tenants.

Saika read the order three times, hoping it would change. It did not. The Guild had grown tired of her feud with Corwin Vale — tired of the duels, the sabotaged exams, the formal complaints filed in triplicate — and had reached a decision of breathtaking pettiness. The two of them would share the Frostward Tower for one full year. They would co-author a single piece of research. And if either of them left, or failed to cooperate, both would lose their licences. Permanently.

Saika set down the order. She looked around the tower''s one workroom. She heard, on the stair, the unmistakable tread of a man who had clearly read the same order and arrived at the same fury.

The door opened. Corwin Vale stood in it, snow still on his coat, expression arranged into something cold and pleasant and absolutely murderous.

"Frost," he said.

"Vale," she said.

It was going to be a very long year.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001800002','b2200000-0000-0000-0000-000000000018',2,'The Division of Territory','They negotiated the tower like two nations negotiating a border. It took four hours and produced a treaty, a chalk line down the middle of the workroom, and absolutely no goodwill whatsoever.',155,1,true, now() - interval '91 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001800002','They negotiated the tower like two nations negotiating a border. It took four hours and produced a treaty, a chalk line down the middle of the workroom, and absolutely no goodwill whatsoever.

"The east window is mine," Corwin said. "The light''s better for delicate work."

"The light is identical. There is one sun." Saika folded her arms. "But fine. Take the east window. I''ll take the library after dark, when you''re asleep, since you so clearly need your rest."

"I sleep four hours a night."

"That explains a great deal about you."

They glared at each other across the chalk line. The tower, which had stood in companionable silence for two hundred years, seemed almost to wince.

Then Corwin sighed, and pinched the bridge of his nose, and said, in a completely different voice — tired, human, unguarded for exactly one second — "We have to publish something real, Frost. They''ll know if it''s a sham. So at some point, gods help us both, we are going to have to actually talk."

Saika hated that he was right. She hated it intensely. She did not, she noted, hate the voice.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001800003','b2200000-0000-0000-0000-000000000018',3,'The First Honest Conversation','It happened at two in the morning, over the failed third draft of their research, because exhaustion is the great dissolver of feuds and neither of them had the energy left to perform.',148,1,true, now() - interval '70 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001800003','It happened at two in the morning, over the failed third draft of their research, because exhaustion is the great dissolver of feuds and neither of them had the energy left to perform.

"Why do you even hate me?" Corwin asked. He was sitting on the floor on his side of the chalk line, ink on his fingers, hair a disaster. "Honestly. I''ve never been able to work it out."

Saika opened her mouth to recite the list. It was a good list. She had maintained it for years.

And then she found, to her genuine alarm, that she could not actually remember the first item on it. The feud had outlived its own origin. It had become a habit she wore because the alternative — looking directly at Corwin Vale and deciding what she thought of him with no history in the way — was somehow far more frightening.

"I don''t know," she admitted. The words felt dangerous in her mouth. "I think I forgot. I think I''ve been angry at you for so long it stopped needing a reason."

Corwin looked at her across the chalk line for a long moment. Then he, very slightly, smiled.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001800004','b2200000-0000-0000-0000-000000000018',4,'Snowed In','The first great storm of winter sealed the tower for nine days. Nine days, two mages, one small kitchen, and a chalk line that had begun, somewhere in the cold, to look extremely arbitrary.',60,1,false, now() - interval '35 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001800004','The first great storm of winter sealed the tower for nine days. Nine days, two mages, one small kitchen, and a chalk line that had begun, somewhere in the cold, to look extremely arbitrary. On the fourth night Saika crossed it to borrow a book and did not, she noticed, hurry back. On the sixth, Corwin cooked. On the ninth, when the storm broke, neither of them mentioned that the chalk line had quietly worn away.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001800005','b2200000-0000-0000-0000-000000000018',5,'The Research Works','Their research, when it finally cohered, was good. Genuinely good — the kind of work neither could have done alone. Saika stared at the finished pages and realised the Guild''s petty punishment had, infuriatingly, been right about everything.',56,1,false, now() - interval '7 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001800005','Their research, when it finally cohered, was good. Genuinely good — the kind of work neither could have done alone. Saika stared at the finished pages and realised the Guild''s petty punishment had, infuriatingly, been right about everything. The year was nearly over. The licences were safe. And the only problem left, she thought, watching Corwin laugh at something across the room, was that she no longer wanted the year to end.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 19
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000019','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-19@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Otis Vane"}')
on conflict (id) do nothing;
update public.users set username='otis_v', display_name='Otis Vane', role='writer', is_verified=false, bio='trying my hand at fantasy. usually write crime.', date_of_birth='1976-11-28' where id='b2100000-0000-0000-0000-000000000019';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000019','b2100000-0000-0000-0000-000000000019','The Thief-Taker of Greel','thief-taker-of-greel','In a city where stolen things can be magically traced, the best thief-taker in Greel is hired to find a missing object that, by every law of magic, should not be missing at all.','#5A5A3A','fantasy','{"low-fantasy","mystery","noir"}','ongoing',false,44100,2960, now() - interval '125 days', now() - interval '19 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001900001','b2200000-0000-0000-0000-000000000019',1,'A Trade Without Mysteries','Greel is an easy city to be a thief-taker in, because in Greel, stolen things want to be found. Bind an object to its owner and it will pull, faintly, toward home, forever.',165,1,true, now() - interval '125 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001900001','Greel is an easy city to be a thief-taker in, because in Greel, stolen things want to be found. Bind an object to its owner and it will pull, faintly, toward home, forever. A thief-taker is really just a person who knows how to feel that pull and follow it down the right alley.

Halvard had followed the pull down a great many alleys. Thirty years of them. He was good, which in his trade meant patient, and he had reached the age where patience was mostly what he had left.

His work was honest and dull. A merchant''s ring. A guildmaster''s seal. He found the thing, he found the thief, he collected his fee, he went home to a cat that tolerated him. There were no mysteries in it. The magic did not allow for mysteries. That was the whole point of the magic.

So when the woman in the expensive coat sat down across from him and described an object that had been stolen, and bound, and yet pulled toward nowhere at all — a bound thing with no direction — Halvard set down his drink, and felt, for the first time in years, the small cold thrill of not understanding something.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001900002','b2200000-0000-0000-0000-000000000019',2,'The Object With No Direction','She would not tell him what the object was. That, in itself, told Halvard a great deal — none of it good, all of it interesting.',151,1,true, now() - interval '118 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001900002','She would not tell him what the object was. That, in itself, told Halvard a great deal — none of it good, all of it interesting.

"You''re hiring me to find a thing," he said, slowly, "and you won''t describe the thing."

"I''ll tell you its weight. Its size. The metal of it." The woman''s coat was worth more than Halvard''s flat. "Not its nature. Its nature is not your concern. Your concern is the pull."

"The pull is the same as the nature. In my trade. The pull is how a thing tells you what it is." He leaned back. "You said it pulls toward nowhere. There''s no nowhere. Every bound object pulls toward its owner. If it pulls toward nowhere, that means one of three things, and you''re going to dislike all three."

She waited.

"Either the owner is dead," Halvard said, "and gone past where the binding can reach. Or the owner has never lived at all. Or —" and here he watched her face very carefully — "the object is in a place that the magic of this city has been specifically, deliberately, expensively built not to see."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001900003','b2200000-0000-0000-0000-000000000019',3,'The Blind Quarter','There was one place in Greel the tracing magic had never worked. The locals called it the Blind Quarter. Halvard had been avoiding it, professionally, his entire career.',144,1,true, now() - interval '95 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001900003','There was one place in Greel the tracing magic had never worked. The locals called it the Blind Quarter. Halvard had been avoiding it, professionally, his entire career.

It was not large. A dozen streets, down by the old river wall, where any bound object went silent the instant it crossed in. Thief-takers did not work the Blind Quarter. You could not. The whole trade rested on the pull, and in those dozen streets there was no pull, only a flat dead quiet, like a room with the windows bricked up.

Nobody knew why. There were stories — there are always stories — but Halvard had spent thirty years not caring, because the Blind Quarter had never once been his problem.

Now a woman in an expensive coat had made it his problem. The object she would not name pulled toward nowhere, and there was only one nowhere in Greel, and Halvard stood at the edge of the Blind Quarter in the grey afternoon and looked down its first silent street and felt every one of his thirty careful years asking him, quietly, to turn around.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001900004','b2200000-0000-0000-0000-000000000019',4,'Who Lives in the Quiet','People did live in the Blind Quarter. That surprised him. He had expected it empty. Instead he found a small, watchful community who had chosen, for reasons of their own, to live somewhere magic could not look.',62,1,false, now() - interval '55 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001900004','People did live in the Blind Quarter. That surprised him. He had expected it empty. Instead he found a small, watchful community who had chosen, for reasons of their own, to live somewhere magic could not look. They were not criminals, mostly. They were people who had something — a past, a name, a face — that they needed the city to forget. Halvard, asking his careful questions, began to suspect the object he sought was a person too.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000001900005','b2200000-0000-0000-0000-000000000019',5,'The Weight of the Thing','The woman had told him the object''s weight, its size, the metal of it. Standing in the Blind Quarter at dusk, Halvard finally did the arithmetic, and the answer was the shape and weight of a child.',54,1,false, now() - interval '21 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000001900005','The woman had told him the object''s weight, its size, the metal of it. Standing in the Blind Quarter at dusk, Halvard finally did the arithmetic, and the answer was the shape and weight of a child. Not a thing at all. A small person, wearing something bound, hidden in the one quarter of the city where no magic could pull them home. Halvard sat down on a quiet doorstep and thought, for a long while, about who he was actually working for.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 20
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b2100000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b2-author-20@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Quill"}')
on conflict (id) do nothing;
update public.users set username='quill.makes.things', display_name='Quill', role='writer', is_verified=false, bio='they/them. portal fantasy enjoyer. wips everywhere', date_of_birth='2000-04-04' where id='b2100000-0000-0000-0000-000000000020';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b2200000-0000-0000-0000-000000000020','b2100000-0000-0000-0000-000000000020','The Door in the Self-Storage Unit','door-in-the-self-storage-unit','Unit 114 came cheap because the previous renter vanished. There is a reason. There is a door at the back, and it does not lead to more storage.','#6A4A3A','fantasy','{"urban-fantasy","portal-fantasy","mystery"}','ongoing',false,82500,5640, now() - interval '60 days', now() - interval '6 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000002000001','b2200000-0000-0000-0000-000000000020',1,'Unit 114','The man at the self-storage place was very keen for Theo to take Unit 114, and Theo, who had a couch and nowhere to put it, was not in a position to ask why.',163,1,true, now() - interval '60 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000002000001','The man at the self-storage place was very keen for Theo to take Unit 114, and Theo, who had a couch and nowhere to put it, was not in a position to ask why.

"Half price," the man said. "First three months. Just — you know. It''s a good unit."

It was a good unit. That was the strange part. Theo had expected damp, or a smell, or a roof problem. Instead Unit 114 was clean and dry and oddly deep, deeper than the units on either side, which Theo only noticed because he had spent a boring year doing measurements for a living.

He moved the couch in. He moved in the boxes, the bike, the lamp his ex had not wanted. And it was while he was stacking the last boxes against the back wall that he understood the unit was not just deep. The back wall was not the back wall.

There was a door in it. A perfectly ordinary door, white-painted, slightly ajar. And cold air was coming under it, and the cold air smelled, very faintly, of a forest after rain.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000002000002','b2200000-0000-0000-0000-000000000020',2,'The Previous Renter','Theo did not open the door that first day. He went home, and he did not sleep, and in the morning he went to the storage office and asked the only sensible question, which was: what happened to whoever had Unit 114 before me.',157,1,true, now() - interval '54 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000002000002','Theo did not open the door that first day. He went home, and he did not sleep, and in the morning he went to the storage office and asked the only sensible question, which was: what happened to whoever had Unit 114 before me.

The man behind the desk got very interested in his keyboard.

"She stopped paying," he said. "People do that. We cleared the unit, we re-let it. Standard."

"You cleared it. So her stuff is somewhere."

"In the back. We hold it ninety days." The man finally looked up, and Theo saw that he was not a bad man, just a tired one, just someone who had decided long ago not to think too hard about Unit 114. "Look. Her name was Priya. She rented it two years. And one day the cameras have her going in, and they just — they don''t have her coming out. And we looked. We looked everywhere a person could be."

Theo thought of the door. The white door, slightly ajar, breathing forest air.

"Can I see her things?" he said.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000002000003','b2200000-0000-0000-0000-000000000020',3,'Priya''s Boxes','They let him into the holding room. Priya''s whole stored life fit into six boxes, and Theo sat on the concrete floor and went through every one of them like an apology to a stranger.',146,1,true, now() - interval '40 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000002000003','They let him into the holding room. Priya''s whole stored life fit into six boxes, and Theo sat on the concrete floor and went through every one of them like an apology to a stranger.

Mostly it was ordinary. Books, kitchen things, a coat. But the sixth box was different. The sixth box was full of notes — Priya''s own, in a small determined hand — and they were all about the door.

She had been studying it. For two years. The notes were careful, almost scientific: dates, observations, the temperature of the air that came under it, the way the forest smell changed with the seasons on the other side. She had not been afraid of the door. She had been courting it.

The last note was dated the day the cameras lost her. It was short. It said: I think it only opens for someone who isn''t running away. I''ve been running my whole life. I have to fix that first, or it won''t take me. I think today I finally fixed it.

Theo read it four times. Then he put the notes in his bag, because they were not finished, and somebody had to finish them.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000002000004','b2200000-0000-0000-0000-000000000020',4,'What the Door Wanted','Theo started visiting the unit every evening. Not to go through. Just to sit with the door, the way Priya had, and learn it. He was, he admitted to himself, also running from something. The door seemed to know.',61,1,false, now() - interval '25 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000002000004','Theo started visiting the unit every evening. Not to go through. Just to sit with the door, the way Priya had, and learn it. He was, he admitted to himself, also running from something — a city, a person, a version of himself he had packed into boxes and paid monthly to avoid. The door stayed ajar. It breathed its cold forest air at him, patient, and never once, in all those evenings, opened any wider.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000002000005','b2200000-0000-0000-0000-000000000020',5,'Not Running','Priya''s last note had been a kind of instruction, and Theo finally understood it on a Tuesday in the unit, with the lamp his ex had not wanted glowing beside him. The door did not open for the brave. It opened for the people who had stopped fleeing.',58,1,false, now() - interval '8 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000002000005','Priya''s last note had been a kind of instruction, and Theo finally understood it on a Tuesday in the unit, with the lamp his ex had not wanted glowing beside him. The door did not open for the brave. It opened for the people who had stopped fleeing. Theo sat very still on Priya''s old patch of concrete and did the hardest thing he had done in years, which was to decide, fully and honestly, that he was no longer running. The door, behind him, swung quietly wide.')
on conflict (chapter_id) do nothing;


-- ==================== seed_parts/batch3_thriller_horror.sql ====================

-- NovelStack launch seed data — Batch 3: THRILLER, MYSTERY, HORROR
-- 20 authors / 20 stories (7 thriller, 7 mystery, 6 horror)
-- All UUIDs prefixed b3. Apostrophes doubled for SQL.

-- ============================================================
-- AUTHOR 01 — thriller
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-01@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Dana Mercer"}')
on conflict (id) do nothing;
update public.users set username='d.mercer', display_name='Dana Mercer', role='writer', is_verified=true, bio='Former crime reporter. I write what I used to cover.', date_of_birth='1981-03-14' where id='b3100000-0000-0000-0000-000000000001';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000001','b3100000-0000-0000-0000-000000000001','The Last Good Witness','the-last-good-witness','A federal witness vanishes the night before she is due to testify. The marshal assigned to protect her has eleven hours to figure out whether she ran or was taken.','#1f3a5f','thriller','{"witness-protection","crime","slow-burn"}','ongoing',true,48213,3120, now() - interval '142 days', now() - interval '6 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000100001','b3200000-0000-0000-0000-000000000001',1,'Eleven Hours','The motel room smelled of bleach and old cigarettes, and the bed had not been slept in. Marshal Cole Ramsey stood in the doorway and counted the things that were wrong.',164,1,true, now() - interval '142 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000100001','The motel room smelled of bleach and old cigarettes, and the bed had not been slept in. Marshal Cole Ramsey stood in the doorway and counted the things that were wrong. Her shoes were gone. Her toothbrush was gone. But the suitcase was still open on the dresser, half-packed, like she had been interrupted in the middle of a thought. Witnesses who run take everything. Witnesses who get taken leave the suitcase. He keyed his radio and told dispatch he had a problem, and then he sat down on the edge of the unslept bed and made himself think instead of panic. Hannah Vore was due in a federal courtroom at nine the next morning. It was now ten past ten at night. Somewhere between here and there a man named Victor Salt very badly wanted her not to arrive, and for the first time in his career Cole was not sure he was going to win.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000100002','b3200000-0000-0000-0000-000000000001',2,'The Front Desk Clerk','The clerk was nineteen and terrified, which Cole expected, and lying, which he had not. She kept her eyes on the visitor log and would not look at the parking lot camera.',158,1,true, now() - interval '138 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000100002','The clerk was nineteen and terrified, which Cole expected, and lying, which he had not. She kept her eyes on the visitor log and would not look at the parking lot camera. He had interviewed enough frightened people to know the difference between someone afraid of a badge and someone afraid of what the badge would find. This was the second kind. "Nobody came in," she said again. "Slow night." Cole let the silence stretch until it hurt. Then he slid his card across the counter and told her that whoever had paid her would not be there at three in the morning when things went wrong, and he would. She started crying before he finished the sentence. It was not a confession. But it was close enough that he stopped thinking of Hannah Vore as missing and started thinking of her as merchandise that had not yet been delivered, which meant there was still time.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000100003','b3200000-0000-0000-0000-000000000001',3,'A Car With No Plates','By midnight Cole had a partial description and a direction, which was more than he had at ten and less than he needed. The car had turned north onto the county road.',142,1,true, now() - interval '130 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000100003','By midnight Cole had a partial description and a direction, which was more than he had at ten and less than he needed. The car had turned north onto the county road, a dark sedan with no plates, and after that the cameras simply ran out. North was forty miles of nothing before the state line. North was also, he realized with a cold drop in his stomach, the long way around to the airfield where Victor Salt kept a plane he was not supposed to own. Cole called it in and got told to wait for backup. He did the math on backup — forty minutes, minimum — and then he got in his car and did not wait. Some rules were written by people who had never sat in an unslept motel room counting a missing woman''s shoes.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000100004','b3200000-0000-0000-0000-000000000001',4,'The Airfield','The hangar lights were on. That was the first mistake Salt''s people made, and Cole intended to make them pay for every one.',54,1,false, now() - interval '96 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000100004','The hangar lights were on. That was the first mistake Salt''s people made, and Cole intended to make them pay for every one. He left the car a quarter mile out and went the rest on foot through wet grass, badge in his pocket, gun in his hand, doing the only kind of arithmetic that mattered now — how many of them, and how fast.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000100005','b3200000-0000-0000-0000-000000000001',5,'Nine in the Morning','Hannah Vore walked into the courtroom at three minutes to nine with a marshal on each side and a bruise she would not explain.',58,1,false, now() - interval '12 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000100005','Hannah Vore walked into the courtroom at three minutes to nine with a marshal on each side and a bruise she would not explain. Cole sat in the back row and watched her be sworn in. He had not slept in thirty hours. When she said Victor Salt''s name out loud, steady and clear, he finally let himself breathe, though the case against the airfield was only just beginning.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 02 — thriller
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-02@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Marcus Lyle"}')
on conflict (id) do nothing;
update public.users set username='coldcase22', display_name='Marcus Lyle', role='writer', is_verified=false, bio='thriller guy. updates whenever the day job lets me', date_of_birth='1990-07-22' where id='b3100000-0000-0000-0000-000000000002';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000002','b3100000-0000-0000-0000-000000000002','Static on the Line','static-on-the-line','A 911 dispatcher recognizes the voice of a caller reporting a break-in. It is her own brother, who has been dead for two years.','#3b2f4a','thriller','{"conspiracy","missing-person","twist"}','ongoing',false,21770,1404, now() - interval '88 days', now() - interval '3 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000200001','b3200000-0000-0000-0000-000000000002',1,'Caller Forty-One','It was a slow Tuesday and call forty-one came in at 2:14 a.m. Renata had her headset on and her coffee gone cold and she said the words she had said ten thousand times.',171,1,true, now() - interval '88 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000200001','It was a slow Tuesday and call forty-one came in at 2:14 a.m. Renata had her headset on and her coffee gone cold and she said the words she had said ten thousand times. "Nine-one-one, what is your emergency." The man on the line was whispering. He said someone was in his house, downstairs, and he could hear them moving. Standard. She started the trace, started the script, started typing. And then he said her name. Not the operator script name. He said "Ren," the way only one person had ever said it, the way her brother Daniel had said it across a kitchen table her whole childhood. Her hands stopped on the keyboard. Daniel had been dead for two years. She had identified the body herself. She had picked the music for the service. "Ren," the voice said again, "please. They''re coming up the stairs."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000200002','b3200000-0000-0000-0000-000000000002',2,'The Address Does Not Exist','The trace came back and Renata stared at it for a long time. The address her brother had given was a house on Halloway Court. Halloway Court had been demolished in 2019.',149,1,true, now() - interval '83 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000200002','The trace came back and Renata stared at it for a long time. The address her brother had given was a house on Halloway Court. Halloway Court had been demolished in 2019. There was a parking structure there now. She knew because she drove past it every day on her way to this building. Her supervisor, Boyd, leaned over her shoulder and asked if she was okay, because apparently she had gone the color of paper. She told him the call dropped. She did not tell him about the name. You did not tell people about the name unless you wanted a mandatory evaluation and six weeks of unpaid leave. Instead she copied the audio file to a flash drive when nobody was looking, and on her break she sat in her car in the dark and listened to her dead brother breathe.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000200003','b3200000-0000-0000-0000-000000000002',3,'The Coroner Was Wrong','She drove to the parking structure on Halloway at four in the morning because she could not not do it. Level three, the voice had said. The corner.',138,1,true, now() - interval '70 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000200003','She drove to the parking structure on Halloway at four in the morning because she could not not do it. Level three, the voice had said. The corner. There was nothing in the corner of level three except a maintenance door, painted the same grey as the wall, with a padlock that looked far newer than the building around it. Renata photographed the lock. She photographed the door. She told herself she was being insane and she photographed it anyway, and when she got home she pulled Daniel''s case file, the one she was absolutely not supposed to have, and read the coroner''s report for the forty-first time. Cause of death. Time of death. And there, at the bottom, an identifying detail that had always bothered her and that she had never let herself look at directly.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000200004','b3200000-0000-0000-0000-000000000002',4,'Boyd Knows','Her supervisor pulled her into the break room and shut the door, and Renata understood, all at once, that Boyd had been waiting two years for her to find the flash drive.',60,1,false, now() - interval '40 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000200004','Her supervisor pulled her into the break room and shut the door, and Renata understood, all at once, that Boyd had been waiting two years for her to find the flash drive. "You weren''t supposed to take that call," he said, very quietly. "It was routed to you on purpose. Sit down, Ren. There''s a lot you don''t know about what your brother was doing for us."')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000200005','b3200000-0000-0000-0000-000000000002',5,'Level Three','The padlock opened with the third key Boyd handed her. Behind the maintenance door was a staircase going down, and the air that came up smelled of cold concrete and something electrical.',55,1,false, now() - interval '3 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000200005','The padlock opened with the third key Boyd handed her. Behind the maintenance door was a staircase going down, and the air that came up smelled of cold concrete and something electrical. Renata went first. Boyd had told her not to expect Daniel, exactly, and she had not understood what that meant until she reached the bottom and saw the screens, dozens of them, and every one playing back a different night she thought she had lived alone.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 03 — thriller
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-03@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Priya Anand"}')
on conflict (id) do nothing;
update public.users set username='joanwrites', display_name='Priya Anand', role='writer', is_verified=false, bio=null, date_of_birth='1995-11-02' where id='b3100000-0000-0000-0000-000000000003';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000003','b3100000-0000-0000-0000-000000000003','Forty Minutes to Pier 9','forty-minutes-to-pier-9','A courier picks up a sealed package and a single instruction: deliver it in forty minutes or do not bother. Everyone she passes seems to know what is inside it.','#5a1f1f','thriller','{"chase","ticking-clock","city"}','complete',false,33902,2188, now() - interval '210 days', now() - interval '54 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000300001','b3200000-0000-0000-0000-000000000003',1,'The Pickup','Nadia took the job because rent was due and the app said it paid four hundred dollars for one delivery. That should have been the warning. Four hundred dollars is not a delivery fee.',155,1,true, now() - interval '210 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000300001','Nadia took the job because rent was due and the app said it paid four hundred dollars for one delivery. That should have been the warning. Four hundred dollars is not a delivery fee, it is a bribe, and she knew that, and she clicked accept anyway because the landlord had stopped being polite. The pickup was a dry cleaner on Voss Street. The man behind the counter did not look like he worked there. He handed her a padded envelope the size of a paperback, surprisingly heavy, taped shut along every edge. "Pier nine," he said. "You have forty minutes from now. Not forty-five. Not fifty. If you''re late, leave it in a trash can and walk away and forget my face." Then he looked at the clock on the wall, and so did she, and the second hand was already moving.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000300002','b3200000-0000-0000-0000-000000000003',2,'The Man in the Grey Coat','By the time she reached the second intersection she was certain she was being followed, and not certain by how many people. The grey coat she had seen twice.',146,1,true, now() - interval '205 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000300002','By the time she reached the second intersection she was certain she was being followed, and not certain by how many people. The grey coat she had seen twice — once outside the dry cleaner, once reflected in a bakery window. He was not fast and he was not hiding, which somehow was worse. He did not need to hurry. He knew where she was going. Nadia ducked into the train station, not to catch a train but to break his line of sight, and in the crush of the platform a woman she had never met pressed close and said into her ear, "Whatever they offered you, the package is worth more. Open it. Open it before the pier." Then the woman was gone and the doors were closing and Nadia stood there with thirty-one minutes left and a paperback-sized thing burning a hole in her bag.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000300003','b3200000-0000-0000-0000-000000000003',3,'What Was Inside','She did not open it on the train. She opened it in a bathroom stall on the concourse, hands shaking, the tape peeling away in long ugly strips.',141,1,true, now() - interval '198 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000300003','She did not open it on the train. She opened it in a bathroom stall on the concourse, hands shaking, the tape peeling away in long ugly strips. Inside was a phone. An old phone, cheap, the kind you buy with cash. It was switched off. Taped to the back was a folded slip of paper, and on the paper, in small careful handwriting, was a name. Her own name. Her full legal name, the one almost nobody knew, the one from before she changed it. Nadia sat down on the closed lid of the toilet and felt the forty minutes shrink around her like a wet rope. The package was not something she was carrying to Pier 9. The package was a message about her, and she was simply the cheapest way to make sure it arrived.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000300004','b3200000-0000-0000-0000-000000000003',4,'The Phone Rings','She turned the phone on with fourteen minutes left. It found a signal immediately, like it had been waiting, and it rang before the screen had even finished loading.',61,1,false, now() - interval '120 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000300004','She turned the phone on with fourteen minutes left. It found a signal immediately, like it had been waiting, and it rang before the screen had even finished loading. Nadia answered it because there was no version of this where not answering helped. The voice on the other end was patient and almost kind. "Good," it said. "You opened it. The grey coat would have killed you at the pier. Now we can talk about your father.")')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000300005','b3200000-0000-0000-0000-000000000003',5,'Pier 9','She went to the pier anyway. Not because the man at the dry cleaner had told her to, but because the voice on the phone had told her not to, and she had stopped trusting the voice three minutes ago.',57,1,false, now() - interval '54 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000300005','She went to the pier anyway. Not because the man at the dry cleaner had told her to, but because the voice on the phone had told her not to, and she had stopped trusting the voice three minutes ago. The grey coat was already there, at the rail, watching the water. Nadia walked up beside him with the dead man''s phone in her hand and said the only sentence she had left. "I think we were both lied to.")')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 04 — thriller
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-04@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Trevor Okafor"}')
on conflict (id) do nothing;
update public.users set username='trev_writes_88', display_name='Trevor Okafor', role='writer', is_verified=false, bio='action thrillers mostly. be nice in the comments lol', date_of_birth='1988-05-30' where id='b3100000-0000-0000-0000-000000000004';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000004','b3100000-0000-0000-0000-000000000004','The Quiet Account','the-quiet-account','An accountant at a logistics firm notices a shipping route that costs money instead of making it. When he flags it, the man who built the route flies in to meet him personally.','#2f4a2f','thriller','{"corporate","whistleblower","slow-burn"}','paused',false,9844,612, now() - interval '160 days', now() - interval '74 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000400001','b3200000-0000-0000-0000-000000000004',1,'Route 12','Daniel Pham was good at his job in the way that nobody noticed, which suited him. He found a number that was wrong on a Thursday afternoon and the whole rest of his life started right there.',152,1,true, now() - interval '160 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000400001','Daniel Pham was good at his job in the way that nobody noticed, which suited him. He found a number that was wrong on a Thursday afternoon and the whole rest of his life started right there. Route 12 ran trucks from the depot out to a distribution point near the border and back. On paper it cost the company eighty thousand dollars a quarter and brought in nothing. No deliveries logged. No clients attached. A route that only spent money. Daniel was an accountant. He did not believe in routes that only spent money any more than a doctor believes in a heartbeat with no body attached. He opened a spreadsheet, the way other men open a door they have been told to leave shut, and he started pulling Route 12 apart line by careful line.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000400002','b3200000-0000-0000-0000-000000000004',2,'The Flag','He flagged it through the proper channel because he was, at heart, a man who believed in proper channels. The email went out at 4:50 on Friday. By Monday morning everything was different.',144,1,true, now() - interval '151 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000400002','He flagged it through the proper channel because he was, at heart, a man who believed in proper channels. The email went out at 4:50 on Friday. By Monday morning everything was different. His manager was warmer than usual. HR sent him a calendar invite for a "quick chat about your great work." And a man named Garrett Voss, who Daniel knew only as a name on the org chart three levels above his own, had flown in from the regional office and wanted lunch. Just the two of them. Daniel said yes because saying no would have been louder. He spent the weekend printing copies of the Route 12 file and hiding them in places a reasonable person would not look, and he hated that he was already thinking like a man who expected to be searched.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000400003','b3200000-0000-0000-0000-000000000004',3,'Lunch with Garrett Voss','Voss ordered for both of them, which Daniel found he disliked intensely, and then he smiled and asked Daniel to walk him through exactly what he thought he had found.',58,1,true, now() - interval '110 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000400003','Voss ordered for both of them, which Daniel found he disliked intensely, and then he smiled and asked Daniel to walk him through exactly what he thought he had found. Daniel did. He kept it short and factual. When he finished, Voss was quiet for a moment, then said, "You''re right about all of it. That''s the problem. Now I have to decide what kind of man you are.")')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000400004','b3200000-0000-0000-0000-000000000004',4,'The Offer','The promotion was real. The relocation package was real. The new title came with a salary that would have changed his mother''s life. All Daniel had to do was stop opening spreadsheets.',49,1,false, now() - interval '74 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000400004','The promotion was real. The relocation package was real. The new title came with a salary that would have changed his mother''s life. All Daniel had to do was stop opening spreadsheets. He took the contract home and read it at the kitchen table until two in the morning, and what frightened him most was how reasonable it all sounded, and how close he came to signing.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 05 — thriller
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-05@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Sasha Voronova"}')
on conflict (id) do nothing;
update public.users set username='nightshift.tales', display_name='Sasha Voronova', role='writer', is_verified=false, bio='i write on the bus. typos are free of charge', date_of_birth='1999-09-09' where id='b3100000-0000-0000-0000-000000000005';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000005','b3100000-0000-0000-0000-000000000005','House-Sitting for the Hendersons','house-sitting-for-the-hendersons','Two weeks, one big empty house, a generous fee. The only rule the Hendersons left behind was about the basement door, and rules like that never stay unbroken.','#1f1f3a','thriller','{"home-invasion","isolation","tension"}','ongoing',true,17320,1090, now() - interval '64 days', now() - interval '8 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000500001','b3200000-0000-0000-0000-000000000005',1,'The List on the Fridge','The Hendersons left a list on the fridge held up by a magnet shaped like a lemon. Feed the cat. Water the ferns. Bins out Wednesday. And, at the bottom, underlined twice, do not open the basement door.',158,1,true, now() - interval '64 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000500001','The Hendersons left a list on the fridge held up by a magnet shaped like a lemon. Feed the cat. Water the ferns. Bins out Wednesday. And, at the bottom, underlined twice, do not open the basement door. Cora read it three times. The first two times she found it funny — eccentric homeowners, probably worried about the boiler, probably worried about a renter snooping. The third time it stopped being funny, because the basement door had a deadbolt on the outside, and you do not put a deadbolt on the outside of a door to keep yourself from going down. You put it there to keep something from coming up. She put the kettle on. The cat watched her from the top of the stairs and did not come down, and she told herself cats were like that, and she almost believed it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000500002','b3200000-0000-0000-0000-000000000005',2,'Night Two','The first night was fine. The second night Cora woke at 3 a.m. to a sound she spent a long time trying to call the pipes. It was not the pipes.',147,1,true, now() - interval '59 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000500002','The first night was fine. The second night Cora woke at 3 a.m. to a sound she spent a long time trying to call the pipes. It was not the pipes. Pipes do not pause. This sound came in slow patient knocks, three at a time, and then a gap, and then three more, and it was coming up through the floor of the kitchen which sat directly above the basement. She lay in the Hendersons'' guest bed with the duvet pulled to her chin like a child and counted the knocks until they stopped on their own around four. In the morning she told herself it had been a dream. Then she found the cat sitting at the top of the basement stairs, completely still, staring at the bottom of that bolted door, and it had been there long enough that the food in its bowl had gone hard.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000500003','b3200000-0000-0000-0000-000000000005',3,'The Neighbour','Cora went next door because she could not stand to be in the house alone with her own thoughts. The neighbour, an older man named Pell, went very quiet when she said the word Henderson.',55,1,true, now() - interval '44 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000500003','Cora went next door because she could not stand to be in the house alone with her own thoughts. The neighbour, an older man named Pell, went very quiet when she said the word Henderson. He asked her how long the contract was. Two weeks, she said. He nodded slowly and said, "They always do two weeks. Lock your bedroom door, love. And don''t answer it if it knocks polite.")')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000500004','b3200000-0000-0000-0000-000000000005',4,'The Deadbolt','On the sixth night the knocking stopped. Cora did not feel relieved. She came down at dawn and found the basement deadbolt drawn back, and the door standing open three inches onto the dark.',52,1,false, now() - interval '20 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000500004','On the sixth night the knocking stopped. Cora did not feel relieved. She came down at dawn and found the basement deadbolt drawn back, and the door standing open three inches onto the dark. She had not opened it. The cat was gone. And on the lemon-magnet list on the fridge, in handwriting that was not the Hendersons'', someone had added a new line at the very bottom.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000500005','b3200000-0000-0000-0000-000000000005',5,'Eight Days Left','The new line said: thank you for letting me up. Cora packed her bag in ninety seconds. The front door would not open, and neither would any of the windows, and outside it was getting dark again.',49,1,false, now() - interval '8 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000500005','The new line said: thank you for letting me up. Cora packed her bag in ninety seconds. The front door would not open, and neither would any of the windows, and outside it was getting dark again. She called Pell next door and he answered on the first ring, like he had been waiting, and all he said was, "Eight days left. Stay near the lemon. It doesn''t like the lemon.")')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 06 — thriller
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-06@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Eleanor Briggs"}')
on conflict (id) do nothing;
update public.users set username='e.briggs.writer', display_name='Eleanor Briggs', role='writer', is_verified=true, bio='Three published procedurals. Slumming it online for fun.', date_of_birth='1969-02-18' where id='b3100000-0000-0000-0000-000000000006';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000006','b3100000-0000-0000-0000-000000000006','The Long Drive North','the-long-drive-north','She agreed to drive her estranged father to a hospital eight hours away. Somewhere past the third gas station she realizes he is not sick, and they are not going to a hospital.','#4a3a1f','thriller','{"family","road-trip","unreliable"}','ongoing',false,28455,1877, now() - interval '99 days', now() - interval '5 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000600001','b3200000-0000-0000-0000-000000000006',1,'Six in the Morning','He was waiting on the porch when I pulled up, which surprised me, because in twenty years I had never once known my father to be early for anything.',160,1,true, now() - interval '99 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000600001','He was waiting on the porch when I pulled up, which surprised me, because in twenty years I had never once known my father to be early for anything. He had one bag. It was small and it was hard-sided and he held it on his lap the whole time instead of putting it in the trunk, and I did not ask about that, because we were not the kind of family that asked. The appointment was at a specialist eight hours north. He had called me on Tuesday, the first call in three years, and said the word cancer in a flat voice and asked if I would drive him, and I had said yes before I finished being angry. So now it was six in the morning and the sky was the colour of dishwater and my father was in my passenger seat holding a bag, and I told myself this was a kind thing I was doing.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000600002','b3200000-0000-0000-0000-000000000006',2,'The Third Gas Station','We stopped three times before noon and each time he paid in cash and each time he watched the road behind us while he did it. By the third station I had stopped pretending not to notice.',151,1,true, now() - interval '92 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000600002','We stopped three times before noon and each time he paid in cash and each time he watched the road behind us while he did it. By the third station I had stopped pretending not to notice. I asked him, point blank, which hospital. He told me a name. I typed it into my phone while he was in the restroom and there was no hospital by that name anywhere in the state, and there was no specialist, and when I really thought about it there had been no medical paperwork, no pill bottles, no appointment card. Just a word on a phone call and twenty years of me wanting him to need me. When he came back to the car I handed him a coffee and smiled and said the drive was going well, and I started, very quietly, to be afraid of my own father for the first time since I was nine years old.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000600003','b3200000-0000-0000-0000-000000000006',3,'What Was in the Bag','He fell asleep around two in the afternoon, finally, his head against the window. The bag had slid into the footwell. I am not proud of what I did at the next red light.',57,1,true, now() - interval '70 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000600003','He fell asleep around two in the afternoon, finally, his head against the window. The bag had slid into the footwell. I am not proud of what I did at the next red light. I unzipped it two inches with one hand, eyes on him, and what I saw inside was not pills and not clothes. It was banded cash and a passport that was not in his name, and underneath those, the cold dull shape of something I did not want to name.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000600004','b3200000-0000-0000-0000-000000000006',4,'The Turn He Wanted','He woke as we passed the exit for the city and told me, gently, to take the next one. The next exit went east, toward the water. North had been a lie since the porch.',54,1,false, now() - interval '30 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000600004','He woke as we passed the exit for the city and told me, gently, to take the next one. The next exit went east, toward the water. North had been a lie since the porch. I kept both hands on the wheel and asked him the only question that mattered. "Dad. What did you do." He looked out at the road for a long moment. Then he said, "It''s what I''m about to do that you should worry about, sweetheart.")')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 07 — thriller
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-07@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Kai Sorensen"}')
on conflict (id) do nothing;
update public.users set username='kaisor', display_name='Kai Sorensen', role='writer', is_verified=false, bio='spy stuff', date_of_birth='1993-12-01' where id='b3100000-0000-0000-0000-000000000007';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000007','b3100000-0000-0000-0000-000000000007','Asset','asset','A retired analyst gets a postcard with no message, just a date. It is the recall signal she designed herself, fifteen years ago, for an operation that was never supposed to need one.','#3a1f2f','thriller','{"spy","cold-war-vibes","comeback"}','ongoing',true,14002,940, now() - interval '47 days', now() - interval '2 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000700001','b3200000-0000-0000-0000-000000000007',1,'The Postcard','The postcard came on a Tuesday with the gas bill and a flyer for a roof company. It showed a lighthouse Margit had never visited. There was no message on the back. Only a date.',149,1,true, now() - interval '47 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000700001','The postcard came on a Tuesday with the gas bill and a flyer for a roof company. It showed a lighthouse Margit had never visited. There was no message on the back. Only a date, written in pencil, eleven days from now. She stood in her own hallway in her slippers and felt fifteen years fall away like a coat off a hook. She had designed that signal herself. A postcard, a lighthouse, a date in pencil — she had built it to be deniable, to look like nothing, to mean only one thing to only one person. It meant the operation was live again. It meant someone still alive remembered her real name. And it meant that the people she had spent fifteen years quietly hoping were dead were, regrettably, not.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000700002','b3200000-0000-0000-0000-000000000007',2,'The Bank Box','She had kept one safe deposit box for fifteen years, in a town three hours away, under a name that had never been on a tax form. The clerk did not recognize her. Good.',146,1,true, now() - interval '40 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000700002','She had kept one safe deposit box for fifteen years, in a town three hours away, under a name that had never been on a tax form. The clerk did not recognize her. Good. The box held three things and Margit took them out in order, the way she had rehearsed in her head on so many sleepless nights that the rehearsal had worn smooth. A passport. An envelope of cash gone slightly soft with age. And a single sheet of paper, folded in four, with a list of five names on it. Two of the names had small pencil ticks beside them, ticks she herself had made the week she walked away, when she had quietly confirmed those two were dead. Three names had no tick. The postcard meant one of those three had sent it. The job now was to find out which, before the other two found her.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000700003','b3200000-0000-0000-0000-000000000007',3,'A Younger Person''s Game','They sent someone to watch her house. He was good, but he was twenty-six, and twenty-six year olds did not know how patient an old woman can be.',56,1,true, now() - interval '25 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000700003','They sent someone to watch her house. He was good, but he was twenty-six, and twenty-six year olds did not know how patient an old woman can be. Margit watched him watch her for two days. On the third day she walked out with a bag of groceries, smiled at him through his windshield, and got into his car uninvited. "You can take me to whoever sent the postcard," she said, "or you can explain to them why you lost me.")')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000700004','b3200000-0000-0000-0000-000000000007',4,'Name Number Three','The car took her to a hotel restaurant where a man she had ticked off as dead fifteen years ago was eating soup. He looked up, unsurprised, and gestured at the empty chair.',51,1,false, now() - interval '2 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000700004','The car took her to a hotel restaurant where a man she had ticked off as dead fifteen years ago was eating soup. He looked up, unsurprised, and gestured at the empty chair. "You put a pencil mark next to my name," he said. "I always wondered if you believed it, or if you just wanted to." Margit sat down. The pencil had lied. She wanted, very much, to know who had lied to the pencil.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 08 — mystery
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-08@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Iris Calloway"}')
on conflict (id) do nothing;
update public.users set username='irisc', display_name='Iris Calloway', role='writer', is_verified=false, bio='cozy mysteries and the occasional poison', date_of_birth='1986-08-08' where id='b3100000-0000-0000-0000-000000000008';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000008','b3100000-0000-0000-0000-000000000008','The Marrowdale Flower Show','the-marrowdale-flower-show','When the village''s most decorated gardener collapses at the annual flower show, everyone assumes a weak heart. The retired schoolteacher judging the marrows assumes otherwise.','#2f4a3a','mystery','{"cozy","village","amateur-sleuth"}','complete',false,41200,2630, now() - interval '188 days', now() - interval '61 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000800001','b3200000-0000-0000-0000-000000000008',1,'The Prize Marrow','Marrowdale took its flower show seriously, which is to say it took it more seriously than the council elections, the church roof, and in one memorable year, a royal visit.',157,1,true, now() - interval '188 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000800001','Marrowdale took its flower show seriously, which is to say it took it more seriously than the council elections, the church roof, and in one memorable year, a royal visit. Edith Pell had judged the vegetable tables for nineteen consecutive summers and could tell a cheating marrow from an honest one at thirty feet. So she was paying attention, as she always paid attention, when Gerald Thwaite stepped up to collect his ribbon for the dahlias and instead of smiling sat down very suddenly on the grass and did not get up. The marquee filled with the particular hush that comes before screaming. Edith set down her clipboard. Gerald had been the healthiest seventy-year-old in the village and he had also, as of last Thursday, been threatening to expose something about the show committee, and Edith did not believe in coincidences any more than she believed in honest marrows.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000800002','b3200000-0000-0000-0000-000000000008',2,'The Thermos','The doctor said heart. The village agreed it was heart. Edith went home, made a pot of tea, and wrote down everything Gerald Thwaite had eaten and drunk that afternoon.',148,1,true, now() - interval '180 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000800002','The doctor said heart. The village agreed it was heart. Edith went home, made a pot of tea, and wrote down everything Gerald Thwaite had eaten and drunk that afternoon, which was a habit she had carried over from forty years of marking exams: when in doubt, list. He had eaten a scone. He had eaten half a cucumber sandwich. And he had drunk, repeatedly, from his own thermos, the green tartan one he carried everywhere, because Gerald had famously not trusted the tea urn since the incident in 2011. Edith underlined the thermos twice. Then she remembered that in the chaos after he fell, when everyone was crowding and crying, she had seen Mrs. Albright from the committee pick that thermos up off the grass, very calmly, and carry it away.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000800003','b3200000-0000-0000-0000-000000000008',3,'A Word with Mrs. Albright','Edith invited herself to tea, which in Marrowdale is a recognized form of interrogation, and watched Mrs. Albright''s hands while they talked about the weather.',58,1,true, now() - interval '150 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000800003','Edith invited herself to tea, which in Marrowdale is a recognized form of interrogation, and watched Mrs. Albright''s hands while they talked about the weather. The thermos was nowhere in the kitchen. Edith mentioned it casually, the green tartan one, such a distinctive thing, and Mrs. Albright said she had no idea what Edith meant, and poured the tea, and her hands were perfectly steady, which Edith found far more interesting than if they had shaken.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000800004','b3200000-0000-0000-0000-000000000008',4,'The Committee Minutes','The parish kept minutes of every committee meeting going back to 1952. Edith requested four years of them and spent a wet weekend reading what Gerald Thwaite had been quietly objecting to.',49,1,false, now() - interval '110 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000800004','The parish kept minutes of every committee meeting going back to 1952. Edith requested four years of them and spent a wet weekend reading what Gerald Thwaite had been quietly objecting to. The show''s prize fund. It had grown, year on year, far beyond what the village raised, and only one person had ever signed for it, and Gerald had asked, twice, in writing, where the surplus went.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000800005','b3200000-0000-0000-0000-000000000008',5,'The Ribbon','Edith solved it the way she had always solved a difficult exam paper: by reading the question one more time. The answer was on the ribbon Gerald never got to collect.',46,1,false, now() - interval '61 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000800005','Edith solved it the way she had always solved a difficult exam paper: by reading the question one more time. The answer was on the ribbon Gerald never got to collect — or rather on the little card pinned behind it, in handwriting she had spent nineteen summers learning to recognize. She put the kettle on, then she telephoned the police, and only then did she allow herself to feel sad.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 09 — mystery
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-09@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Devon Reyes"}')
on conflict (id) do nothing;
update public.users set username='xX_raven_Xx_2', display_name='Devon Reyes', role='writer', is_verified=false, bio='dark mysteries. 17. constructive crit only pls', date_of_birth='2008-04-12' where id='b3100000-0000-0000-0000-000000000009';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000009','b3100000-0000-0000-0000-000000000009','Locker 114','locker-114','A high school senior finds a locker that is not on any record, with her own dead sister''s name written inside it. Solving why means asking questions the school does not want asked.','#3a3a1f','mystery','{"high-school","missing-person","teen-sleuth"}','ongoing',false,19505,1612, now() - interval '55 days', now() - interval '9 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000900001','b3200000-0000-0000-0000-000000000009',1,'Wrong Number','The locker stuck. Mine always stuck, locker 114, third row from the gym doors, and I kicked the bottom corner the way you had to and it popped open and it was not my locker.',150,1,true, now() - interval '55 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000900001','The locker stuck. Mine always stuck, locker 114, third row from the gym doors, and I kicked the bottom corner the way you had to and it popped open and it was not my locker. My stuff was gone. The history binder, the bad photo of me and Mara taped inside the door, the broken mirror — all of it gone. Instead there was an empty locker with clean shelves, and scratched into the metal at the back, small and deep like someone had spent a long time on it, was a name. Mara Reyes. My sister''s name. My sister who had gone to this school four years ago and then had not gone anywhere ever again. I stood there with the bell ringing and the hallway emptying around me and I did not move, because Mara had never had locker 114. Mara had been a freshman when she disappeared. Freshmen got the second floor.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000900002','b3200000-0000-0000-0000-000000000009',2,'Not on the List','I went to the office and asked Mrs. Doyle who had locker 114 before me. She typed for a while. Then she said locker 114 did not exist, and she said it in a voice that had practiced saying it.',144,1,true, now() - interval '50 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000900002','I went to the office and asked Mrs. Doyle who had locker 114 before me. She typed for a while. Then she said locker 114 did not exist, and she said it in a voice that had practiced saying it. The lockers in that row went 110, 112, 116. I told her I used 114 every single day. I told her it was on my own registration sheet. She smiled the smile adults use when they have decided you are upset about something else, and she said the row had been renumbered last year, and there must be a mistake. I let her think I believed her. Then I went back at lunch with my phone and I photographed the number plate on my locker, 114, and I photographed the lockers on either side, 112 and 116, and I sat on the gym floor and looked at the gap in the numbers that the school said was not there.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000900003','b3200000-0000-0000-0000-000000000009',3,'The Janitor','Mr. Okolie had worked at the school longer than any teacher. He was the only adult who did not flinch when I said Mara''s name, and that was how I knew to ask him.',57,1,true, now() - interval '35 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000900003','Mr. Okolie had worked at the school longer than any teacher. He was the only adult who did not flinch when I said Mara''s name, and that was how I knew to ask him. He leaned on his mop and looked at me for a long time. "That locker," he said, "I painted over that number three times. Three different summers. Somebody keeps putting it back. I stopped trying. You should stop too, but you won''t, will you.")')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000900004','b3200000-0000-0000-0000-000000000009',4,'The Yearbook','I checked out the yearbook from the year Mara vanished. Forty pages of smiling kids. On page twenty-two, in the bottom row, there was a photo with no name printed under it.',52,1,false, now() - interval '9 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000900004','I checked out the yearbook from the year Mara vanished. Forty pages of smiling kids. On page twenty-two, in the bottom row, there was a photo with no name printed under it — just a blank space where the name should be. The face in the photo was not Mara. The face in the photo was a girl I had been seeing in the third-row hallway for three days, and had assumed was a freshman I didn''t know.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 10 — mystery
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-10@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Howard Tate"}')
on conflict (id) do nothing;
update public.users set username='h_tate_noir', display_name='Howard Tate', role='writer', is_verified=false, bio='hardboiled detective fiction. i know it''s out of fashion. don''t care.', date_of_birth='1974-10-25' where id='b3100000-0000-0000-0000-000000000010';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000010','b3100000-0000-0000-0000-000000000010','The Pawnshop on Delcourt','the-pawnshop-on-delcourt','A private investigator is hired to recover a stolen watch. The watch is worthless. The reason a wealthy man wants it back so badly is not.','#2f2f4a','mystery','{"noir","detective","hardboiled"}','ongoing',true,12880,710, now() - interval '120 days', now() - interval '15 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000a00001','b3200000-0000-0000-0000-000000000010',1,'A Cheap Watch','The watch was worth maybe forty dollars and the man across my desk was offering me four thousand to find it. In my line of work that arithmetic is the whole case.',151,1,true, now() - interval '120 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000a00001','The watch was worth maybe forty dollars and the man across my desk was offering me four thousand to find it. In my line of work that arithmetic is the whole case. His name was Sutton, he wore a suit that cost more than my car, and he told me the watch had sentimental value, which is what people say when they have decided you are too dumb to ask the next question. I asked the next question anyway. I always do. It is why I have an office above a laundromat instead of a corner office downtown. Sutton''s jaw tightened, and he said his late father had owned it, and he said it the way an actor says a line he has run too many times. I took the job. Not for the four thousand. For the lie. A man only overpays that hard for a cheap thing when the thing can hurt him.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000a00002','b3200000-0000-0000-0000-000000000010',2,'Delcourt Street','The watch had been pawned at a shop on Delcourt, the kind of street where the streetlights have given up. The owner remembered the watch. He did not want to.',147,1,true, now() - interval '113 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000a00002','The watch had been pawned at a shop on Delcourt, the kind of street where the streetlights have given up. The owner remembered the watch. He did not want to. He was a careful old man named Brandt who had survived forty years in a business built on other people''s desperation, and careful old men do not survive that long by talking to strangers. I put a twenty on the counter. He looked at it like it was a spider. So I put the watch''s description next to it, and Brandt went still in a way that twenty dollars does not buy. "That watch," he said finally, "came in three times. Three different people. Same watch. And every one of them looked over their shoulder doing it." Then he gave me the twenty back, which scared me more than anything he had said.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000a00003','b3200000-0000-0000-0000-000000000010',3,'Inside the Case','I bought a watch like it from a junk shop and took the back off at my desk with the good lamp on. There was a folded slip of paper behind the movement. There always is.',55,1,true, now() - interval '88 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000a00003','I bought a watch like it from a junk shop and took the back off at my desk with the good lamp on. There was a folded slip of paper behind the movement. There always is. Numbers, a date, and a single initial. I did not know yet what the numbers opened, but I knew Sutton had not paid four thousand dollars for sentiment. He had paid it to keep me from doing exactly what I had just done.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000a00004','b3200000-0000-0000-0000-000000000010',4,'The Other Two','Three people had pawned the watch. Brandt gave me the dates. Two of those people were now dead, and the third was a woman who had stopped answering her phone the same week Sutton hired me.',48,1,false, now() - interval '15 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000a00004','Three people had pawned the watch. Brandt gave me the dates. Two of those people were now dead, and the third was a woman who had stopped answering her phone the same week Sutton hired me. I sat in my car outside her building for an hour. The math was simple now and I did not like the answer. I was not the fourth man hired to find the watch. I was the fourth man hired to carry it.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 11 — mystery
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-11@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Bonnie Whitlock"}')
on conflict (id) do nothing;
update public.users set username='bonnie_w', display_name='Bonnie Whitlock', role='writer', is_verified=false, bio=null, date_of_birth='1991-06-17' where id='b3100000-0000-0000-0000-000000000011';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000011','b3100000-0000-0000-0000-000000000011','The Inheritance Clause','the-inheritance-clause','Six estranged cousins are summoned to a remote estate for the reading of a will. The lawyer explains the terms, then locks the doors, then explains the real terms.','#4a1f3a','mystery','{"locked-room","inheritance","ensemble"}','ongoing',false,23110,1455, now() - interval '76 days', now() - interval '4 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000b00001','b3200000-0000-0000-0000-000000000011',1,'Six Cars in the Drive','By four o''clock there were six cars in the drive and not one of the people who arrived in them had spoken to another in a decade. Great-Aunt Constance had planned it that way.',153,1,true, now() - interval '76 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000b00001','By four o''clock there were six cars in the drive and not one of the people who arrived in them had spoken to another in a decade. Great-Aunt Constance had planned it that way, you could feel it, the way you can feel a chess move three turns after it is made. The estate sat at the end of a road that had no other houses on it. The nearest town was forty minutes back and the phone signal had quietly died somewhere around the second cattle grid. Marianne arrived last. She stood in the gravel and counted the cars and felt her stomach drop, because she had assumed she would be the only one summoned, and clearly so had everyone else, and Constance had known they would all assume that. The front door opened before anyone knocked. A lawyer in a grey suit said the will would be read at five, and dinner served at seven, and that nobody, for legal reasons, would be leaving tonight.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000b00002','b3200000-0000-0000-0000-000000000011',2,'The Reading','The lawyer read the will in a flat voice in the long dining room. The estate, the accounts, the whole considerable lot of it, went to whichever of the six was still present at noon in three days.',146,1,true, now() - interval '71 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000b00002','The lawyer read the will in a flat voice in the long dining room. The estate, the accounts, the whole considerable lot of it, went to whichever of the six was still present at noon in three days. Present, the will specified, and able to sign. Marianne watched the other five do the same arithmetic she was doing. Cousin Roderick laughed, a short ugly bark, and said it was a joke, Constance''s last joke, and the lawyer did not laugh with him. He simply turned to the last page and read the final clause, and the final clause said that if any of the six died before noon on the third day, their share would be divided among the survivors. Then he folded the document, set it on the table, and told them where the bedrooms were. Nobody moved for a long time.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000b00003','b3200000-0000-0000-0000-000000000011',3,'Dinner for Six','Dinner was served at seven and eaten in near silence. Marianne noticed that everyone, without discussing it, had chosen a seat with their back to a wall.',58,1,true, now() - interval '52 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000b00003','Dinner was served at seven and eaten in near silence. Marianne noticed that everyone, without discussing it, had chosen a seat with their back to a wall. The cook brought six identical plates. Cousin Roderick swapped his with Marianne''s when he thought no one was watching, and Marianne, who had been watching everyone all evening, swapped it quietly back, and ate, and watched him watch her eat.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000b00004','b3200000-0000-0000-0000-000000000011',4,'The First Morning','Marianne woke to shouting. Five cousins stood in the upstairs hall outside a locked bedroom door. The sixth cousin was not answering, and the lawyer was already counting the survivors.',47,1,false, now() - interval '4 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000b00004','Marianne woke to shouting. Five cousins stood in the upstairs hall outside a locked bedroom door. The sixth cousin was not answering, and the lawyer was already counting the survivors. When they broke the door down the room was empty, the window latched from the inside, and on the pillow lay a single key that none of them recognized and all of them wanted.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 12 — mystery
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-12@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Asha Mbeki"}')
on conflict (id) do nothing;
update public.users set username='ashawrites', display_name='Asha Mbeki', role='writer', is_verified=true, bio='Mystery and crime. Librarian by day, which helps more than you''d think.', date_of_birth='1983-01-29' where id='b3100000-0000-0000-0000-000000000012';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000012','b3100000-0000-0000-0000-000000000012','The Returned Book','the-returned-book','A library book is returned eleven years overdue, with a pressed flower and a note inside marking a page. The branch librarian recognizes the handwriting of a girl who never came home.','#1f4a3a','mystery','{"cold-case","library","quiet"}','complete',false,30740,2095, now() - interval '230 days', now() - interval '88 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000c00001','b3200000-0000-0000-0000-000000000012',1,'Eleven Years Overdue','The book came back through the after-hours slot on a Monday, and when Faith scanned it the system did something she had never seen it do in twenty years. It froze, then it flagged the title in red.',159,1,true, now() - interval '230 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000c00001','The book came back through the after-hours slot on a Monday, and when Faith scanned it the system did something she had never seen it do in twenty years. It froze, then it flagged the title in red. Eleven years, two months overdue. Faith had been a librarian long enough that overdue books rarely moved her, but she sat down with this one. It had been checked out by Lena Surrey, who was sixteen at the time, and who had walked out of this very branch on an October afternoon and never been seen again. The case had gone cold the way cases do, slowly, in stages, until it was just a photograph on a noticeboard nobody updated. Faith turned the book over in her hands. It was in good condition. Better than good. Somebody had kept it carefully, somewhere dry, for eleven years, and then chosen this week to bring it back.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000c00002','b3200000-0000-0000-0000-000000000012',2,'Page 144','Faith should have called the police first. She knows that now. Instead she opened the book, because she is a librarian, and a librarian opens the book.',150,1,true, now() - interval '224 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000c00002','Faith should have called the police first. She knows that now. Instead she opened the book, because she is a librarian, and a librarian opens the book. Page 144 was marked. Not with a receipt or a bus ticket but with a flower, pressed flat and brown with age, the kind that grows wild on the embankment behind the old quarry. And tucked against the spine was a folded note, lined paper, and the handwriting on it was round and careful and unmistakably the handwriting of a sixteen-year-old, the loops on the letters too generous, the way Lena had signed her library card. The note was three sentences long. Faith read it once and put the book down and found that her hands were not entirely steady. The note was not a goodbye. The note was an instruction, and it was addressed, by name, to Faith.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000c00003','b3200000-0000-0000-0000-000000000012',3,'The Embankment','The note told her where the flower had come from. Faith was sixty-one years old and she had not climbed the quarry embankment since she was a girl, but she went, on her own, on a Sunday.',57,1,true, now() - interval '190 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000c00003','The note told her where the flower had come from. Faith was sixty-one years old and she had not climbed the quarry embankment since she was a girl, but she went, on her own, on a Sunday. The flowers still grew there, a whole bank of them, exactly as the note said. And among them, set into the ground and gone green with moss, was a small flat stone that someone had placed there deliberately, with care, a long time ago.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000c00004','b3200000-0000-0000-0000-000000000012',4,'Who Returned It','The police asked the obvious question and Faith had no answer. Lena could not have returned the book. So someone who knew exactly what was on page 144 had kept it eleven years, and waited.',49,1,false, now() - interval '140 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000c00004','The police asked the obvious question and Faith had no answer. Lena could not have returned the book. So someone who knew exactly what was on page 144 had kept it eleven years, and waited. Faith pulled the branch''s old volunteer rota for that October. One name stopped her cold. He still lived in the town. He still, in fact, came in every Thursday for the newspapers.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000c00005','b3200000-0000-0000-0000-000000000012',5,'Thursday','He came in on Thursday, as he always did, and went to the newspaper rack, as he always did. Faith waited until he sat down. Then she set the returned book on the table in front of him, open to page 144.',46,1,false, now() - interval '88 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000c00005','He came in on Thursday, as he always did, and went to the newspaper rack, as he always did. Faith waited until he sat down. Then she set the returned book on the table in front of him, open to page 144, the pressed flower on the page. He looked at it for a long time. When he finally looked up, he did not look afraid. He looked relieved, and that was the worst part of all.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 13 — mystery
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-13@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Connor Flynn"}')
on conflict (id) do nothing;
update public.users set username='flynnc_99', display_name='Connor Flynn', role='writer', is_verified=false, bio='writing my first mystery be gentle', date_of_birth='2000-03-03' where id='b3100000-0000-0000-0000-000000000013';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000013','b3100000-0000-0000-0000-000000000013','The Wrong Apartment','the-wrong-apartment','He sublets a cheap apartment and finds the previous tenant''s mail still arriving — including increasingly worried letters from someone who clearly thinks the tenant is still alive.','#3a2f1f','mystery','{"urban","epistolary","slow-burn"}','paused',false,7620,388, now() - interval '102 days', now() - interval '66 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000d00001','b3200000-0000-0000-0000-000000000013',1,'Mail for Mr. Adler','The apartment was cheap because the building was ugly and the landlord did not care, and that suited me fine. What did not suit me was the mail. It kept coming for somebody named T. Adler.',148,1,true, now() - interval '102 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000d00001','The apartment was cheap because the building was ugly and the landlord did not care, and that suited me fine. What did not suit me was the mail. It kept coming for somebody named T. Adler. At first it was junk, takeout menus, a credit card offer, and I threw it out without thinking. Then a real letter came, hand-addressed, the stamp stuck on slightly crooked, and I almost threw that out too. I did not. I do not entirely know why. The landlord had told me the last tenant moved out months ago, no forwarding address, gone. But the letter on my counter said otherwise, or at least the person who wrote it thought otherwise, and I stood in my ugly cheap kitchen holding mail for a man I had never met and feeling, for no reason I could name, like I had walked into the middle of someone else''s sentence.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000d00002','b3200000-0000-0000-0000-000000000013',2,'I Opened It','You are not supposed to open other people''s mail. There is a law about it. I told myself that for two days and on the third day I steamed the envelope open over the kettle like a coward.',142,1,true, now() - interval '96 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000d00002','You are not supposed to open other people''s mail. There is a law about it. I told myself that for two days and on the third day I steamed the envelope open over the kettle like a coward. The letter was from a woman. She did not sign a full name, just an initial, R. She wrote like someone continuing a conversation, referencing things I had no context for, a plan, a date, a place called the boathouse. And near the end she wrote a line that made me put the letter down on the counter and step away from it. She wrote: I know you can''t write back, and I know why, but please, if you are reading this, leave the light on in the front window so I know you are still there. I had been leaving that light on for three weeks. I always left it on.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000d00003','b3200000-0000-0000-0000-000000000013',3,'The Front Window','For three nights I turned the light off. I felt insane doing it. On the fourth night a letter came that simply said: thank you. I understand now. I won''t come.',56,1,true, now() - interval '78 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000d00003','For three nights I turned the light off. I felt insane doing it. On the fourth night a letter came that simply said: thank you. I understand now. I won''t come. I should have felt relieved. Instead I sat up until two in the morning trying to work out what message I had accidentally sent, and to whom, and what would have happened to whoever it was if I had left the light on like always.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 14 — mystery
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-14@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Lorraine Pike"}')
on conflict (id) do nothing;
update public.users set username='lorraine.pike', display_name='Lorraine Pike', role='writer', is_verified=false, bio='small town mysteries with too many casseroles', date_of_birth='1958-11-11' where id='b3100000-0000-0000-0000-000000000014';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000014','b3100000-0000-0000-0000-000000000014','Tuesday''s Casserole','tuesdays-casserole','When the town''s least-liked man dies, casseroles flood the widow''s porch as tradition demands. The trouble starts when one of them contains something other than chicken.','#4a3a2f','mystery','{"cozy","small-town","amateur-sleuth"}','ongoing',false,16944,1023, now() - interval '58 days', now() - interval '11 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000e00001','b3200000-0000-0000-0000-000000000014',1,'A Town That Brings Food','When somebody dies in Harlow Creek, the town brings food. It is not optional. It is closer to law than the actual law is, and so when Vernon Tilly passed, the casseroles began before the body was cold.',154,1,true, now() - interval '58 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000e00001','When somebody dies in Harlow Creek, the town brings food. It is not optional. It is closer to law than the actual law is, and so when Vernon Tilly passed, the casseroles began before the body was cold. This was remarkable, because nobody in Harlow Creek had liked Vernon Tilly. The man had sued his own neighbours, twice, over a fence. He had reported children for noise. And yet by Tuesday evening his widow Delphine had eleven casseroles lined up on her porch, because the town did not bring food for Vernon. It brought food for the form of the thing. I know all this because I am Delphine''s sister, and I was there counting dishes, and I was the one who noticed that the twelfth casserole had no name taped to the foil. Every casserole in Harlow Creek has a name taped to the foil. That is also law.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000e00002','b3200000-0000-0000-0000-000000000014',2,'The Unlabelled Dish','Delphine wanted to eat it. I would not let her. We had what I will politely call a discussion, in the kitchen, with the unlabelled casserole sitting between us like a third sister nobody trusted.',145,1,true, now() - interval '53 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000e00002','Delphine wanted to eat it. I would not let her. We had what I will politely call a discussion, in the kitchen, with the unlabelled casserole sitting between us like a third sister nobody trusted. Delphine said I had always been dramatic. I said a dish with no name was not a gift, it was a question, and I intended to know who was asking it. I peeled back the foil. It looked like every chicken casserole ever made in this county, golden on top, a little dry at the edges. But underneath the topping, when I dug in with a fork, there were no vegetables and no chicken. There was a layer of folded waxed paper, and inside the waxed paper, kept dry and clean, was a stack of photographs of Vernon Tilly that somebody had very much not wanted in his house while he was alive.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000e00003','b3200000-0000-0000-0000-000000000014',3,'Who Bakes for the Dead','I know the handwriting of every woman in this town who has ever taped a name to a casserole. The dish itself, the cracked blue dish, I also knew. It belonged to the church kitchen.',57,1,true, now() - interval '34 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000e00003','I know the handwriting of every woman in this town who has ever taped a name to a casserole. The dish itself, the cracked blue dish, I also knew. It belonged to the church kitchen, the one with the chip on the rim, the one that lived in the bottom cupboard and only came out for funerals. Which meant whoever had filled it with photographs instead of chicken had a key to the church, and had stood in that kitchen, calmly, and decided that a dead man''s widow needed to see what her husband had done.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000e00004','b3200000-0000-0000-0000-000000000014',4,'The Church Key List','There are four keys to the church kitchen and the parish keeps a list. I asked to see the list. Reverend Soames went the color of his own collar and said the list had gone missing in the spring.',48,1,false, now() - interval '11 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000e00004','There are four keys to the church kitchen and the parish keeps a list. I asked to see the list. Reverend Soames went the color of his own collar and said the list had gone missing in the spring. A list does not go missing in a town this size. A list gets taken. And it gets taken by someone who knew, months ago, that they would one day need to bake for the dead.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 15 — horror
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-15@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Greer Holloway"}')
on conflict (id) do nothing;
update public.users set username='greer.holloway', display_name='Greer Holloway', role='writer', is_verified=false, bio='quiet horror. nothing jumps out. it just stays.', date_of_birth='1987-10-31' where id='b3100000-0000-0000-0000-000000000015';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000015','b3100000-0000-0000-0000-000000000015','The Tenant Upstairs','the-tenant-upstairs','She has lived alone in the bottom flat for nine years. This month she begins to hear someone moving in the flat above hers — the flat that has no door, no stairs, and no way in.','#1f1f1f','horror','{"haunted-house","slow-dread","quiet-horror"}','ongoing',true,26318,1980, now() - interval '70 days', now() - interval '7 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000f00001','b3200000-0000-0000-0000-000000000015',1,'Footsteps','For nine years the flat above mine had been empty, and I do not mean unrented. I mean it could not be rented, because there was no way into it. No door off the landing. No stairs.',155,1,true, now() - interval '70 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000f00001','For nine years the flat above mine had been empty, and I do not mean unrented. I mean it could not be rented, because there was no way into it. No door off the landing. No stairs. The conversion the landlord did before I moved in had sealed it off entirely; the upstairs windows were bricked from inside. I knew all this. I had it in writing, on the lease, a little clause explaining the dead space above me as if it were a charming quirk. So when the footsteps started, in March, I did the sensible thing and decided it was the pipes. Pipes tick. Pipes settle. I told myself that for eleven nights. On the twelfth night the footsteps crossed the ceiling from one side of my bedroom to the other, slowly, with the unmistakable rhythm of a person, and then they stopped directly above my bed, and I understood that pipes do not stop to listen.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000f00002','b3200000-0000-0000-0000-000000000015',2,'The Landlord''s Answer','I emailed the landlord. I kept it light. I asked, just curious, whether anyone had access to the upstairs space. His reply came back fast, and it was four words long, and it did not feel light at all.',147,1,true, now() - interval '64 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000f00002','I emailed the landlord. I kept it light. I asked, just curious, whether anyone had access to the upstairs space. His reply came back fast, and it was four words long, and it did not feel light at all. It said: please do not ask. I read it standing in my kitchen and I felt the floor tilt slightly, the way it does when a thing you hoped was nothing turns out to be a thing other people already know about. I wrote back. I asked him directly. Had previous tenants heard it too. He did not answer that email, or the next one. But two days later an envelope came through my door, no stamp, hand-delivered, and inside was a single brass key, old, worn smooth, and a note in his handwriting that said only: it is easier if you let it think you are not afraid. Do not run on the stairs.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000f00003','b3200000-0000-0000-0000-000000000015',3,'There Are Stairs Now','He had written do not run on the stairs. There were no stairs. I went out onto my landing that night to prove it to myself, and at the end of the landing, where nine years of blank wall had been, there was a door.',58,1,true, now() - interval '40 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000f00003','He had written do not run on the stairs. There were no stairs. I went out onto my landing that night to prove it to myself, and at the end of the landing, where nine years of blank wall had been, there was a door. It was the same paint as the wall. It had the same skirting board. It looked as though it had always been there, as though I were the one who had imagined nine years of wall, and the brass key in my hand was suddenly very warm.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-000000f00004','b3200000-0000-0000-0000-000000000015',4,'Slowly','I did not run. He had told me not to run and for once in my life I listened to advice. I climbed the stairs that should not exist one slow step at a time, and the footsteps above me kept pace, coming down to meet me.',49,1,false, now() - interval '7 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-000000f00004','I did not run. He had told me not to run and for once in my life I listened to advice. I climbed the stairs that should not exist one slow step at a time, and the footsteps above me kept pace, coming down to meet me. We met in the middle, in the dark, and the tenant upstairs had my face, exactly my face, and it was the calm one, and I was the one shaking.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 16 — horror
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-16@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Riley Bishop"}')
on conflict (id) do nothing;
update public.users set username='xX_grimwood_Xx', display_name='Riley Bishop', role='writer', is_verified=false, bio='gore and gremlins. updates fridays mostly', date_of_birth='2003-06-06' where id='b3100000-0000-0000-0000-000000000016';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000016','b3100000-0000-0000-0000-000000000016','Camp Verlow','camp-verlow','Six camp counselors arrive a week early to open the site for summer. The lake is lower than it should be, and something at the bottom of it has been waiting for the water to drop.','#2f1f1f','horror','{"slasher","summer-camp","gore"}','ongoing',true,18402,1340, now() - interval '38 days', now() - interval '6 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('f2286d22-3ca3-4317-85b4-ea0a22977cd3','b3200000-0000-0000-0000-000000000016',1,'A Week Early','The drive up to Camp Verlow took three hours and the last forty minutes of it was a dirt road that the GPS gave up on. Six of us in a van that smelled like old sunscreen. We were a week early.',150,1,true, now() - interval '38 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('f2286d22-3ca3-4317-85b4-ea0a22977cd3','The drive up to Camp Verlow took three hours and the last forty minutes of it was a dirt road that the GPS gave up on. Six of us in a van that smelled like old sunscreen. We were a week early, sent up to open the place, scrub the cabins, get the docks back in the water before a hundred screaming kids arrived. Marcus drove. Tasha had the playlist. Everyone was loud and happy in that nervous way you get when you barely know each other yet. I was the only one looking out the window, which is how I noticed the lake first. It was wrong. I had worked Verlow two summers and the lake had always come right up to the treeline, and now there was a wide ugly band of cracked grey mud between the water and the shore, like the lake had pulled back from something.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('4d4a31d3-a01b-4dc1-a0c8-f5a09e0970e4','b3200000-0000-0000-0000-000000000016',2,'The Mud Line','By the second day the lake was lower still. Marcus said drought. Tasha said the dam. I said nothing, because I had walked out on the mud that morning and found things in it.',146,1,true, now() - interval '33 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('4d4a31d3-a01b-4dc1-a0c8-f5a09e0970e4','By the second day the lake was lower still. Marcus said drought. Tasha said the dam. I said nothing, because I had walked out on the mud that morning and found things in it. Not trash. Not the usual lake junk, the sunglasses and beer cans and one shoe. I found a row of camp name tags, the laminated kind on lanyards, the kind every kid at Verlow gets on day one. There were a lot of them, half buried, pressed flat into the grey mud in a line that ran straight out toward the middle of the lake where the water still was. I counted nineteen before I stopped counting. Nineteen kids. And I have a good memory for Verlow, and I could not recall a single summer, ever, where the camp had reported losing even one.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b0b7f4c6-1917-419d-beb8-ce73b6faa24d','b3200000-0000-0000-0000-000000000016',3,'The Old Director','We called the camp director, old man Verlow himself, the family the place is named for. He did not ask why we were calling. He asked one thing: how low.',57,1,true, now() - interval '22 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b0b7f4c6-1917-419d-beb8-ce73b6faa24d','We called the camp director, old man Verlow himself, the family the place is named for. He did not ask why we were calling. He asked one thing: how low. I told him the mud line. There was a long crackle of silence on the phone. Then he said get in the van, all six of you, leave the doors, leave everything, and do not — he said this twice — do not let the water see you running.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('49ef300f-2c9c-4001-ac71-1cc78aecf933','b3200000-0000-0000-0000-000000000016',4,'The Van Would Not Start','Of course the van would not start. It is always the van. Marcus had the hood up and was swearing at it when Tasha said, very quietly, that the mud line had moved while we were on the phone, and it was moving toward us.',52,1,false, now() - interval '6 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('49ef300f-2c9c-4001-ac71-1cc78aecf933','Of course the van would not start. It is always the van. Marcus had the hood up and was swearing at it when Tasha said, very quietly, that the mud line had moved while we were on the phone, and it was moving toward us. Not the water rising. The water going. Draining away fast now, like something was pulling the plug from underneath, and whatever the lake had been keeping covered for nineteen summers did not want to stay covered any longer.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 17 — horror
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000017','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-17@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Naomi Frost"}')
on conflict (id) do nothing;
update public.users set username='naomifrost', display_name='Naomi Frost', role='writer', is_verified=false, bio='folk horror. rural dread. the corn is not your friend.', date_of_birth='1989-09-21' where id='b3100000-0000-0000-0000-000000000017';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000017','b3100000-0000-0000-0000-000000000017','The Harvest Wife','the-harvest-wife','A woman moves to her husband''s family farm and learns the village has an old arrangement with the land. Every twenty years the harvest is good. The price of the good harvest is never spoken aloud.','#3a2f1f','horror','{"folk-horror","rural","ritual"}','complete',false,22019,1701, now() - interval '195 days', now() - interval '70 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('0442d7d0-937d-40eb-bee7-3000de61e00a','b3200000-0000-0000-0000-000000000017',1,'The Farm','We moved to Edwin''s family farm in the spring, and the village welcomed me the way warm water welcomes you, all at once and a little too eagerly. The women brought bread. They asked when I was due.',157,1,true, now() - interval '195 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('0442d7d0-937d-40eb-bee7-3000de61e00a','We moved to Edwin''s family farm in the spring, and the village welcomed me the way warm water welcomes you, all at once and a little too eagerly. The women brought bread. They asked when I was due. I was not due anything, I was not even pregnant, and I laughed and said so, and the women laughed too but they exchanged a look first, a quick one, the kind you are not meant to catch. Edwin had grown quieter the closer we got to home. He had told me his family had farmed this valley for two hundred years and that the soil here was the best in the county, and both of those things turned out to be true. He had not told me about the calendar in the church porch, the one that marked off the years in twenties, nor that this year, the year we came home, had a small red mark beside it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('2a83993f-1443-453d-92ea-2591d61e7436','b3200000-0000-0000-0000-000000000017',2,'A Good Year','The crops came up thick and fast and wrong. Edwin''s mother stood at the field edge and wept with relief, and would not tell me what she had been afraid of.',149,1,true, now() - interval '188 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('2a83993f-1443-453d-92ea-2591d61e7436','The crops came up thick and fast and wrong. Edwin''s mother stood at the field edge and wept with relief, and would not tell me what she had been afraid of. I am a town girl. I do not know corn the way these people know corn, but even I could see that it was growing too well, the stalks already past head height in early summer, the green of them so dark it was nearly black. The whole village relaxed at once, as though a held breath had been let out. There was a feast. There was singing I did not know the words to and nobody offered to teach me. And all evening the older people kept touching my hair, my shoulders, my hands, gently, the way you might check that fruit is ripe, and Edwin watched them do it and said nothing, and would not meet my eyes.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('52ae44b0-91f0-4c76-adcd-d8d8f0bafb88','b3200000-0000-0000-0000-000000000017',3,'The Calendar','I went back to the church porch alone and counted the red marks on the old calendar. There was one every twenty years, back and back, and beside each red year, in faded ink, a woman''s name.',58,1,true, now() - interval '150 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('52ae44b0-91f0-4c76-adcd-d8d8f0bafb88','I went back to the church porch alone and counted the red marks on the old calendar. There was one every twenty years, back and back, and beside each red year, in faded ink, a woman''s name. Not a village woman. Each name was followed by the word incomer, the local word for someone who married in from outside. I found this year''s red mark. The space beside it was blank, but the ink pot and pen were sitting on the ledge, waiting, and I understood the blank was waiting for me.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('7b221fce-7809-4a97-baa7-5a962a3f88ea','b3200000-0000-0000-0000-000000000017',4,'Harvest','They came for me at harvest, kindly, the way they did everything. Edwin held my hand the whole way to the field and told me he had tried, for months, to find another way, and that there was not one.',47,1,false, now() - interval '95 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('7b221fce-7809-4a97-baa7-5a962a3f88ea','They came for me at harvest, kindly, the way they did everything. Edwin held my hand the whole way to the field and told me he had tried, for months, to find another way, and that there was not one. The corn closed over the path behind us as we walked. I had stopped being afraid somewhere back at the gate. I was only thinking, very clearly, about the blank space beside this year, and how I did not intend to fill it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('6a0358db-b425-4065-b3b1-dc9534f306a9','b3200000-0000-0000-0000-000000000017',5,'Twenty Years','The harvest was good that year. The village says so, still. But the calendar in the church porch has no red mark for the next turn, and the corn, these last few autumns, has come up thin.',45,1,false, now() - interval '70 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('6a0358db-b425-4065-b3b1-dc9534f306a9','The harvest was good that year. The village says so, still. But the calendar in the church porch has no red mark for the next turn, and the corn, these last few autumns, has come up thin. They are afraid again. I sit at the field edge some evenings and watch them be afraid, and I do not weep with relief, and I do not tell them what I did out there, and the not-telling is the best harvest I have ever brought in.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 18 — horror
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-18@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Theo Vance"}')
on conflict (id) do nothing;
update public.users set username='theo_v', display_name='Theo Vance', role='writer', is_verified=false, bio='psychological horror. i am normal i promise', date_of_birth='1996-12-13' where id='b3100000-0000-0000-0000-000000000018';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000018','b3100000-0000-0000-0000-000000000018','Sleep Study','sleep-study','He signs up for a paid sleep study to cover his rent. The clinic is clean, the staff are kind, and on the third night he is shown footage of himself doing things he has no memory of.','#1f2f3a','horror','{"psychological","clinical","unreliable"}','ongoing',true,15677,1188, now() - interval '44 days', now() - interval '3 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('cb7809ae-4b88-4246-8bb0-f5b12e45e32f','b3200000-0000-0000-0000-000000000018',1,'Night One','The advert said eight hundred dollars for five nights of sleep. I have never been paid for anything as easily as I am paid for being unconscious, so I called the number.',151,1,true, now() - interval '44 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('cb7809ae-4b88-4246-8bb0-f5b12e45e32f','The advert said eight hundred dollars for five nights of sleep. I have never been paid for anything as easily as I am paid for being unconscious, so I called the number. The clinic was on the fourth floor of a building that also held a dentist and an accountant, which made it feel safe in a way I should probably have questioned. The room they gave me was small and clean and beige. They glued sensors to my scalp, my chest, the corners of my eyes. There was a camera in the ceiling, a small black dome, and a technician named Wynn told me, kindly, that I would not even notice it after the first night. He was right. I did not notice it. That, it turns out, was the entire problem, and Wynn knew it when he said it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('20189d17-4d74-44cd-9770-4fe47b85adff','b3200000-0000-0000-0000-000000000018',2,'The Footage','On the third morning Wynn asked, very gently, whether I would like to see some footage from night two. He asked it the way a doctor asks if you have someone who can drive you home.',148,1,true, now() - interval '39 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('20189d17-4d74-44cd-9770-4fe47b85adff','On the third morning Wynn asked, very gently, whether I would like to see some footage from night two. He asked it the way a doctor asks if you have someone who can drive you home. I said yes, of course, because saying no felt like admitting something. The screen showed my room at 3:40 a.m. in the green wash of the night camera. It showed me, in the bed, asleep. And then it showed me sit up, not the way a person wakes, but all at once, like a hinge, and get out of bed, and walk to the camera, and stand directly beneath it looking up. For four minutes. My eyes were open. I was, Wynn assured me, deeply and measurably asleep the entire time. And on the footage, slowly, while staring up at the lens, the sleeping version of me began to smile.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('0392a793-c195-427f-829d-cb684abc53cd','b3200000-0000-0000-0000-000000000018',3,'Night Four','I asked to leave. Wynn said of course, the study was voluntary, I could go any time. Then he showed me the consent form, and the clause I had initialed, and the part of it I did not remember reading.',56,1,true, now() - interval '20 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('0392a793-c195-427f-829d-cb684abc53cd','I asked to leave. Wynn said of course, the study was voluntary, I could go any time. Then he showed me the consent form, and the clause I had initialed, and the part of it I did not remember reading. It said the study did not end when I left the building. It said the study followed the sleeper. My own initials sat beside it, in my own handwriting, except I print my initials and these were in cursive, and I have not written in cursive since I was a child.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('bd32e273-bf99-42c4-a735-dc54dafd905d','b3200000-0000-0000-0000-000000000018',4,'Home','I went home. I bought a camera, a cheap one, and set it on the dresser pointed at my own bed, because I had to know. I have watched four nights of footage now.',50,1,false, now() - interval '3 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('bd32e273-bf99-42c4-a735-dc54dafd905d','I went home. I bought a camera, a cheap one, and set it on the dresser pointed at my own bed, because I had to know. I have watched four nights of footage now. Every night at 3:40 the sleeping me sits up like a hinge, and gets out of bed, and walks out of frame toward the door. And every night, a little later, it comes back. I am writing this in the morning. I am very tired. I do not think it is me that sleeps anymore.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 19 — horror
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000019','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-19@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Mariposa Cruz"}')
on conflict (id) do nothing;
update public.users set username='mari.writes.scary', display_name='Mariposa Cruz', role='writer', is_verified=false, bio=null, date_of_birth='1994-02-27' where id='b3100000-0000-0000-0000-000000000019';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000019','b3100000-0000-0000-0000-000000000019','The Long Hallway','the-long-hallway','A night-shift cleaner at an empty office tower notices the seventh-floor hallway is longer than it was yesterday. It grows by about a meter every night, and it leads somewhere now.','#2f2f2f','horror','{"liminal","night-shift","weird"}','ongoing',false,11240,803, now() - interval '52 days', now() - interval '13 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('e558b26a-dd19-4ac2-ad00-e6016bbc8b7d','b3200000-0000-0000-0000-000000000019',1,'Seventh Floor','I have cleaned the Brandt Tower for six years, eleven at night until seven in the morning, and I know it better than I know my own apartment. So I knew, the night the seventh floor hallway was wrong.',150,1,true, now() - interval '52 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('e558b26a-dd19-4ac2-ad00-e6016bbc8b7d','I have cleaned the Brandt Tower for six years, eleven at night until seven in the morning, and I know it better than I know my own apartment. So I knew, the night the seventh floor hallway was wrong. It is a simple hallway. Office doors on the left, windows on the right, a fire exit at the far end. I have pushed a cleaning cart down it some two thousand times. It takes ninety seconds to walk, and I have never once needed to count, because my body knows the length of it the way it knows the stairs. That night it took me a hundred and forty seconds. I told myself I was tired. I told myself I had walked slow. But my body does not lie about hallways, and my body said the fire exit at the end was further away than it had been the night before.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('82fdc320-c899-4991-be23-431c84db16e1','b3200000-0000-0000-0000-000000000019',2,'I Measured It','I am not a dramatic person. The next night I brought a tape measure from home, and before I started my shift I measured the seventh floor hallway, door to fire exit, and wrote the number on my hand.',146,1,true, now() - interval '47 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('82fdc320-c899-4991-be23-431c84db16e1','I am not a dramatic person. The next night I brought a tape measure from home, and before I started my shift I measured the seventh floor hallway, door to fire exit, and wrote the number on my hand. Forty-one meters. I cleaned the rest of the building. I tried not to think about it. At the end of my shift, just before seven, I measured it again. Forty-two meters and a little over. One meter longer in one night. I stood there with the tape measure in my hand and the cheap fluorescent lights buzzing and I did the only thing my tired brain could manage, which was the arithmetic. A meter a night. Thirty meters a month. And the hallway was not getting longer at the fire exit end. It was getting longer in the middle, growing new wall, new doors, doors I did not have keys for.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('ca18d099-0eeb-4c2a-81f5-eec3a211c6c7','b3200000-0000-0000-0000-000000000019',3,'The New Doors','There were three new doors after two weeks. They matched the others exactly, same wood, same little frosted glass panels. But the old doors had room numbers. The new ones had names.',57,1,true, now() - interval '30 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('ca18d099-0eeb-4c2a-81f5-eec3a211c6c7','There were three new doors after two weeks. They matched the others exactly, same wood, same little frosted glass panels. But the old doors had room numbers. The new ones had names. Not company names. People names, first and last, painted neat in gold like the offices of important men. I did not recognize the first two. The third new door, the one nearest the middle, the one that had appeared just last night, had my name on it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('5c3a5622-13fc-409c-8412-b2b42d57ab45','b3200000-0000-0000-0000-000000000019',4,'My Door','I did not open my door. I want that on the record. I went home and I slept badly and I came back the next night and the hallway had grown another meter, and my door had moved, and there was a light on behind the frosted glass.',54,1,false, now() - interval '13 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('5c3a5622-13fc-409c-8412-b2b42d57ab45','I did not open my door. I want that on the record. I went home and I slept badly and I came back the next night and the hallway had grown another meter, and my door had moved, and there was a light on behind the frosted glass. Someone was in my office. I could see a shape moving against the light, slow, settling in, getting comfortable. I have not gone back to the seventh floor. But the hallway, I think, is coming to find me.')
on conflict (chapter_id) do nothing;

-- ============================================================
-- AUTHOR 20 — horror
-- ============================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b3100000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b3-author-20@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Walter Penhale"}')
on conflict (id) do nothing;
update public.users set username='w.penhale', display_name='Walter Penhale', role='writer', is_verified=false, bio='retired. write ghost stories the way my grandmother told them.', date_of_birth='1955-07-04' where id='b3100000-0000-0000-0000-000000000020';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b3200000-0000-0000-0000-000000000020','b3100000-0000-0000-0000-000000000020','The Lighthouse Logbook','the-lighthouse-logbook','A maritime historian transcribes the daily log of a lighthouse keeper from 1911. The entries are dull until October, when the keeper begins writing about a second set of footprints in the tower.','#1f3a4a','horror','{"ghost-story","epistolary","sea"}','complete',false,20330,1502, now() - interval '165 days', now() - interval '58 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('d2e00d2c-3d57-4227-b30c-4c3c95447359','b3200000-0000-0000-0000-000000000020',1,'The Commission','The maritime museum paid me a modest sum to transcribe the surviving logbook of the Carrick Head light, kept by one Ezra Doune across the year 1911. I expected weather and lamp oil.',152,1,true, now() - interval '165 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('d2e00d2c-3d57-4227-b30c-4c3c95447359','The maritime museum paid me a modest sum to transcribe the surviving logbook of the Carrick Head light, kept by one Ezra Doune across the year 1911. I expected weather and lamp oil. That is what lighthouse logs are, mostly: a man''s neat record of fuel burned and ships sighted and the wind backing round to the north. Ezra Doune kept a tidy hand and a tidy log. January through September is forty pages of a careful man doing careful work alone on a rock two miles off the coast. I transcribed it in a week and found nothing in it but the weather. Then I reached October, and the handwriting was the same, and the careful man was the same, but the things he was writing down had stopped being the weather, and I made myself a pot of strong tea before I went on.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b8c31063-4b81-4f85-b994-8f3ebb6d1c5b','b3200000-0000-0000-0000-000000000020',2,'October the Third','I will give you the entry for October the third in full, because it is where the log changes, and because I have read it eleven times and it has not improved with reading.',149,1,true, now() - interval '159 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b8c31063-4b81-4f85-b994-8f3ebb6d1c5b','I will give you the entry for October the third in full, because it is where the log changes, and because I have read it eleven times and it has not improved with reading. Doune wrote: "Wind SW, moderate. Lamp trimmed at four. Swept the stair as is my habit. Counted, going down, more steps than I climbed. This is foolishness and I record it only so that I may laugh at it in the spring." But there is no laughter in the spring entries, because the count is in every entry after that one. He sweeps the stair. He counts the steps going up. He counts them going down. And from October the third onward the number going down is always, always one greater than the number going up, by exactly one, every single day, as though something joined the staircase while his back was turned.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2764782-6e13-4457-89d7-a9995c8ef7c4','b3200000-0000-0000-0000-000000000020',3,'The Relief Boat','The relief boat came every six weeks with oil, food, and mail. Doune''s log records each visit. After October, his entries about the relief boat take on a particular kind of hunger.',57,1,true, now() - interval '120 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2764782-6e13-4457-89d7-a9995c8ef7c4','The relief boat came every six weeks with oil, food, and mail. Doune''s log records each visit. After October, his entries about the relief boat take on a particular kind of hunger. He counts the days to it. He writes that he means to ask the boatmen to stay the night, just one night, so that another living man might also walk the stair and count. The boat came on October the twentieth. The log entry for that day is one line. It says: "They would not come up.")')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('44619b66-5f66-4674-bae1-b1a535282b53','b3200000-0000-0000-0000-000000000020',4,'The Last Pages','The log ends on the ninth of November. Not because the year ended, you understand. Because the entries stop. The museum told me Doune was relieved of his post that winter, alive and well.',52,1,false, now() - interval '80 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('44619b66-5f66-4674-bae1-b1a535282b53','The log ends on the ninth of November. Not because the year ended, you understand. Because the entries stop. The museum told me Doune was relieved of his post that winter, alive and well, and lived another forty years inland and never spoke of the light. The final entry is not about footsteps. It says only: "I have stopped sweeping the stair. If I do not count, there is nothing to count. I hope whoever reads this is wiser than I was.")')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('14addb7e-04e2-4fe3-a7d9-11cf16469eac','b3200000-0000-0000-0000-000000000020',5,'My Own Stairs','I finished the transcription and sent it to the museum and was paid. That should have been the end of it. I live in a narrow house with a narrow staircase, and I have never, in thirty years here, had cause to count the steps.',48,1,false, now() - interval '58 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('14addb7e-04e2-4fe3-a7d9-11cf16469eac','I finished the transcription and sent it to the museum and was paid. That should have been the end of it. I live in a narrow house with a narrow staircase, and I have never, in thirty years here, had cause to count the steps. There are thirteen of them. I know that now. I counted them last night, going up. This morning, coming down, I counted them again, and I am not going to tell you the number, because Ezra Doune was right, and I should not have counted at all.')
on conflict (chapter_id) do nothing;


-- ==================== seed_parts/batch4_scifi_fanfic.sql ====================

-- NovelStack launch seed data
-- Batch 4: SCI-FI and FANFICTION
-- 18 authors, 18 stories (12 scifi, 6 fanfiction)
-- All UUIDs prefixed b4. Fanfiction uses invented universes only.

-- =====================================================================
-- AUTHOR 01
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-01@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Maris Okeke"}')
on conflict (id) do nothing;
update public.users set username='m.okeke', display_name='Maris Okeke', role='writer', is_verified=true, bio='hard sf, mostly. used to do orbital mechanics homework for fun. still kind of do.', date_of_birth='1989-03-14' where id='b4100000-0000-0000-0000-000000000001';

-- AUTHOR 02
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-02@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Devon Pryce"}')
on conflict (id) do nothing;
update public.users set username='warpdrive.fics', display_name='Devon Pryce', role='writer', is_verified=false, bio='writing the deck wars stuff between shifts. no beta we die like crewmen', date_of_birth='2001-07-22' where id='b4100000-0000-0000-0000-000000000002';

-- AUTHOR 03
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-03@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Lena Vasquez"}')
on conflict (id) do nothing;
update public.users set username='lenawrites', display_name='Lena Vasquez', role='writer', is_verified=false, bio=null, date_of_birth='1995-11-02' where id='b4100000-0000-0000-0000-000000000003';

-- AUTHOR 04
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-04@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Theo Brandt"}')
on conflict (id) do nothing;
update public.users set username='xX_nebula_Xx', display_name='Theo Brandt', role='writer', is_verified=false, bio='space horror enjoyer', date_of_birth='2003-01-30' where id='b4100000-0000-0000-0000-000000000004';

-- AUTHOR 05
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-05@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Priya Anand"}')
on conflict (id) do nothing;
update public.users set username='priya.a', display_name='Priya Anand', role='writer', is_verified=true, bio='biologist by day. i write about what worlds smell like.', date_of_birth='1987-06-09' where id='b4100000-0000-0000-0000-000000000005';

-- AUTHOR 06
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-06@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Cory Halvorsen"}')
on conflict (id) do nothing;
update public.users set username='canon_divergent', display_name='Cory Halvorsen', role='writer', is_verified=false, bio='if it has a found family i will read it. fan of the Hollowmark series obviously', date_of_birth='1998-09-17' where id='b4100000-0000-0000-0000-000000000006';

-- AUTHOR 07
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-07@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Sam Iredale"}')
on conflict (id) do nothing;
update public.users set username='sam_i', display_name='Sam Iredale', role='writer', is_verified=false, bio='trying to finish something for once', date_of_birth='1992-12-05' where id='b4100000-0000-0000-0000-000000000007';

-- AUTHOR 08
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-08@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Adaeze Nwosu"}')
on conflict (id) do nothing;
update public.users set username='adaeze.writes', display_name='Adaeze Nwosu', role='writer', is_verified=false, bio=null, date_of_birth='1996-04-21' where id='b4100000-0000-0000-0000-000000000008';

-- AUTHOR 09
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-09@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Russ Calloway"}')
on conflict (id) do nothing;
update public.users set username='RustyCal', display_name='Russ Calloway', role='writer', is_verified=false, bio='retired, finally writing the thing. be patient with me i type slow', date_of_birth='1961-08-11' where id='b4100000-0000-0000-0000-000000000009';

-- AUTHOR 10
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-10@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Junie Park"}')
on conflict (id) do nothing;
update public.users set username='juniep', display_name='Junie Park', role='writer', is_verified=false, bio='soft sci-fi, queer everything', date_of_birth='2000-02-28' where id='b4100000-0000-0000-0000-000000000010';

-- AUTHOR 11
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-11@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Marcus Tindall"}')
on conflict (id) do nothing;
update public.users set username='m_tindall', display_name='Marcus Tindall', role='writer', is_verified=false, bio='ex software guy. i like stories about machines that want things.', date_of_birth='1979-05-19' where id='b4100000-0000-0000-0000-000000000011';

-- AUTHOR 12
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-12@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Hollis Trent"}')
on conflict (id) do nothing;
update public.users set username='hollistrent', display_name='Hollis Trent', role='writer', is_verified=true, bio='novelist. four books out. here for the long stuff.', date_of_birth='1983-10-08' where id='b4100000-0000-0000-0000-000000000012';

-- AUTHOR 13
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-13@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Bex Carrow"}')
on conflict (id) do nothing;
update public.users set username='bex_in_orbit', display_name='Bex Carrow', role='writer', is_verified=false, bio='aetherbound fic mostly. captain/navigator is canon in my heart', date_of_birth='2002-11-14' where id='b4100000-0000-0000-0000-000000000013';

-- AUTHOR 14
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-14@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Ngozi Eze"}')
on conflict (id) do nothing;
update public.users set username='n.eze', display_name='Ngozi Eze', role='writer', is_verified=false, bio='lagos. afrofuturism. tea.', date_of_birth='1994-07-03' where id='b4100000-0000-0000-0000-000000000014';

-- AUTHOR 15
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-15@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Kit Donnelly"}')
on conflict (id) do nothing;
update public.users set username='kitd_writes', display_name='Kit Donnelly', role='writer', is_verified=false, bio=null, date_of_birth='1999-03-26' where id='b4100000-0000-0000-0000-000000000015';

-- AUTHOR 16
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-16@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Tariq Belhaj"}')
on conflict (id) do nothing;
update public.users set username='tariq.b', display_name='Tariq Belhaj', role='writer', is_verified=false, bio='climate fiction. it''s not optimistic but it''s not nothing either', date_of_birth='1990-09-12' where id='b4100000-0000-0000-0000-000000000016';

-- AUTHOR 17
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000017','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-17@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Wendy Stroud"}')
on conflict (id) do nothing;
update public.users set username='quietmoon.fic', display_name='Wendy Stroud', role='writer', is_verified=false, bio='gridfall fan account. crossposting old fics here', date_of_birth='1997-12-19' where id='b4100000-0000-0000-0000-000000000017';

-- AUTHOR 18
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b4100000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b4-author-18@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Esi Mensah"}')
on conflict (id) do nothing;
update public.users set username='esimensah', display_name='Esi Mensah', role='writer', is_verified=false, bio='first story, be nice', date_of_birth='2004-05-07' where id='b4100000-0000-0000-0000-000000000018';


-- =====================================================================
-- STORY 01 - scifi - Maris Okeke
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000001','b4100000-0000-0000-0000-000000000001','The Long Burn Home','the-long-burn-home','A fuel miscalculation leaves a four-person survey crew with one viable transfer window and not quite enough delta-v. The math is simple. Deciding who does the math is not.','#1f3a5f','scifi','{"hard-sf","survival","spacecraft"}','ongoing',false,48210,3120, now() - interval '64 days', now() - interval '6 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000100001','b4200000-0000-0000-0000-000000000001',1,'Margins','Yusuf ran the burn three times before he told anyone, because the first two times he assumed he had made an error, and the third time he understood that he had not made an error.',168,1,true, now() - interval '64 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000100001','Yusuf ran the burn three times before he told anyone, because the first two times he assumed he had made an error, and the third time he understood that he had not made an error. The numbers did not care that he wanted them to be different. The Calloway had enough propellant to put three people on a return trajectory to the inner station, or four people on a trajectory that fell short by an amount you could measure in days of dying. He sat with that for a while. The hab module hummed around him, the same indifferent hum it had hummed for fourteen months. Down the corridor he could hear Priya laughing at something, and Tomas answering, and the fourth voice, Ren, quiet underneath. He would have to walk down there. He would have to say it out loud, and once he said it out loud it would be true for everyone, not just for him. He checked the math a fourth time. It stayed the same.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000100002','b4200000-0000-0000-0000-000000000001',2,'The Meeting','Nobody volunteers in the first hour. Maris had read about expedition crises, the famous ones, and the accounts always skipped the first hour, the part where four reasonable adults sit very still.',162,1,true, now() - interval '60 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000100002','Nobody volunteers in the first hour. Yusuf had read about expedition crises, the famous ones, and the accounts always skipped the first hour, the part where four reasonable adults sit very still and look at the table and discover that survival instinct is not a noble feeling, it is just a feeling, low and animal and embarrassing. Priya asked the obvious question first, which was whether the survey samples could be jettisoned for mass. They could, a little. It bought hours, not a person. Tomas asked whether a slower trajectory existed, and Yusuf walked him through the orbital mechanics until Tomas stopped asking, not because he was convinced but because he was tired. Ren said nothing at all. Ren had said nothing for most of the mission, which Yusuf had taken for shyness and now suspected was something else, something more like a person keeping accounts. When the meeting broke up, no decision had been made. That, Yusuf thought, was its own kind of decision.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000100003','b4200000-0000-0000-0000-000000000001',3,'Ren Keeps Accounts','Ren came to him at the third sleep cycle, when the hab was dim and the others were strapped into their bunks, and said, without preamble, that the problem was not who should stay.',158,1,true, now() - interval '52 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000100003','Ren came to him at the third sleep cycle, when the hab was dim and the others were strapped into their bunks, and said, without preamble, that the problem was not who should stay. The problem, Ren said, was that everyone was treating it as a moral question when it was a logistics question. The person who stayed needed to be the person who could keep the others alive longest from a distance, manage the relay, talk the return crew through their own burns. That was Yusuf. Everyone in the room already knew it was Yusuf and nobody would say it because saying it felt like sentencing him. Ren had simply done the arithmetic of competence and arrived early. Yusuf looked at this small quiet person who had spent fourteen months being underestimated and felt something rearrange itself in his chest. You came here to tell me that, he said. No, said Ren. I came here to tell you I worked it out too, and I''m not going to let you go quietly.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000100004','b4200000-0000-0000-0000-000000000001',4,'A Third Option','Ren''s proposal was ugly and it took two days to verify. Strip the survey lander for parts, cannibalize its tanks, accept a flight profile no sane mission planner would sign.',58,1,false, now() - interval '38 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000100004','Ren''s proposal was ugly and it took two days to verify. Strip the survey lander for parts, cannibalize its tanks, accept a flight profile no sane mission planner would sign off on. It did not save everyone. It changed the shape of the loss, turned a certainty into a probability, and a probability was a thing you could work with. Priya wept when she understood it. Tomas just nodded slowly, like a man being handed a tool.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000100005','b4200000-0000-0000-0000-000000000001',5,'Cutting the Lander','They had no torch rated for the lander''s spar alloy. Tomas improvised one out of a sample drill and a great deal of nerve, and the work took eleven hours across two shifts.',61,1,false, now() - interval '18 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000100005','They had no torch rated for the lander''s spar alloy. Tomas improvised one out of a sample drill and a great deal of nerve, and the work took eleven hours across two shifts. Yusuf watched the mass budget tick downward column by column, and somewhere around hour nine the number crossed the line that meant four, and he had to leave the cabin so the others would not see his face do what it did.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 02 - fanfiction - Devon Pryce
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000002','b4100000-0000-0000-0000-000000000002','Deck Wars: Off the Roster','deck-wars-off-the-roster','Deck Wars fic. What happens to the crew the show never follows? Ensign Pell gets left off the away mission AGAIN and decides she''s done waiting around. Pre-canon, fix-it adjacent.','#5a2d6e','fanfiction','{"deck-wars","found-family","slow-burn"}','ongoing',false,12740,890, now() - interval '41 days', now() - interval '3 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000200001','b4200000-0000-0000-0000-000000000002',1,'Benched Again','So the thing about being an ensign on the Verity is that nobody actually remembers your name unless they need someone to recalibrate the waste reclaimer.',144,1,true, now() - interval '41 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000200001','So the thing about being an ensign on the Verity is that nobody actually remembers your name unless they need someone to recalibrate the waste reclaimer. Pell had been aboard fourteen months. She had recalibrated the waste reclaimer nine times. She had been assigned to exactly zero away missions, and this morning Commander Astor had read the roster aloud in the briefing room and gotten to the bottom of it without her name appearing anywhere on it, again, and then looked up with that pleasant face he had and asked if there were any questions. Pell had a question. The question was loud and it had been getting louder for fourteen months. She did not ask it. She said nothing, the way you said nothing, and went back to the reclaimer, and that was the morning she decided she was finished saying nothing. She just didn''t tell anyone yet. You don''t announce these things. You just stop showing up the way they expect.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000200002','b4200000-0000-0000-0000-000000000002',2,'The Maintenance Crowd','Turns out the people the show never follows have their own ship inside the ship. Deck nine at oh-two-hundred, the maintenance crowd, the ones who keep the Verity actually flying.',138,1,true, now() - interval '34 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000200002','Turns out the people the show never follows have their own ship inside the ship. Deck nine at oh-two-hundred, the maintenance crowd, the ones who keep the Verity actually flying while the bridge officers get the holos taken of them. There was Okonkwo from environmental, who could fix anything and explain nothing. There was a Tarsan tech named Viil who Pell had genuinely never heard speak. And there was Greer, who ran the deck-nine card game and who looked at Pell standing in the hatchway at oh-two-hundred and said, without surprise, took you long enough. Pell did not know what that meant. She found out it meant Greer had been watching the roster too. Greer had been watching it for three years. Greer slid a chair out with his boot and said, sit down ensign, we''ve got a lot to catch you up on, and Pell sat down, and that was the first night she felt like she was actually on a starship.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000200003','b4200000-0000-0000-0000-000000000002',3,'What Greer Knows','Greer knew things. That was the whole deal with Greer. He knew the Verity had a fault in the number-two coupling that maintenance had flagged six times and the bridge had deprioritized six times.',136,1,true, now() - interval '25 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000200003','Greer knew things. That was the whole deal with Greer. He knew the Verity had a fault in the number-two coupling that maintenance had flagged six times and the bridge had deprioritized six times. He knew which officers actually read their reports and which ones forwarded them. He knew, and this was the part that made Pell''s skin go cold, that the next survey rotation was going to take the ship through the Halen drift with a coupling that everyone competent considered a coin flip. Pell asked why he hadn''t gone over Astor''s head. Greer laughed, not unkindly. Over his head to who, he said. We''re the people they don''t follow, remember. Nobody up there is going to hear it from us. He looked at her for a long moment. But they might, he said, hear it from an ensign with a clean record who really really wants an away mission. Pell understood that she had just been recruited. She also understood that she did not mind.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000200004','b4200000-0000-0000-0000-000000000002',4,'Going Over a Head','Pell wrote the report herself and it took four drafts to make it sound like an ensign instead of a deck-nine conspiracy.',54,1,false, now() - interval '14 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000200004','Pell wrote the report herself and it took four drafts to make it sound like an ensign instead of a deck-nine conspiracy. Greer read every draft over her shoulder, sucking his teeth. Less feeling, he kept saying, more numbers, the bridge trusts numbers. By draft four it was all numbers and it was cold and it was, Greer admitted, actually pretty good.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000200005','b4200000-0000-0000-0000-000000000002',5,'Astor Reads It','Commander Astor called her in at end of shift. He had the report on his slate. He did not look pleasant for once, and Pell found that she preferred it.',49,1,false, now() - interval '3 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000200005','Commander Astor called her in at end of shift. He had the report on his slate. He did not look pleasant for once, and Pell found that she preferred it. You went around me, he said. Yes sir, said Pell. He set the slate down. For a while neither of them said anything. Then Astor said, the coupling''s being inspected at the next dock. Sit down, ensign.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 03 - scifi - Lena Vasquez
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000003','b4100000-0000-0000-0000-000000000003','Static Bloom','static-bloom','Everyone on Junction-7 hears the signal. Doctors call it tinnitus. Mira knows it''s counting down to something, she just can''t prove it, and the proving might cost her the only people who still talk to her.','#3a6e5a','scifi','{"mystery","near-future","conspiracy"}','ongoing',true,9870,612, now() - interval '88 days', now() - interval '12 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000300001','b4200000-0000-0000-0000-000000000003',1,'The Hum','It started for me on a Tuesday, which is a stupid detail to remember but I remember it. A high thin sound, right at the edge of hearing, like a wire pulled tight.',151,1,true, now() - interval '88 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000300001','It started for me on a Tuesday, which is a stupid detail to remember but I remember it. A high thin sound, right at the edge of hearing, like a wire pulled tight somewhere behind the walls. I went to the station clinic and the doctor did the tests and told me it was tinnitus, stress-related, very common on the orbital habs, here are some exercises. Fine. Except then I mentioned it to Dav at work and Dav went still and said, you hear it too. And then we found out half our shift heard it. And then we found out it wasn''t a steady sound at all. If you really listened, if you sat in the dark and counted, it pulsed. Not regular like a heartbeat. Irregular, but not random either. There was a pattern in it and the pattern was getting tighter. I didn''t tell the doctor that part. I had already learned that when you describe a pattern nobody else has measured, people stop looking at the pattern and start looking at you.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000300002','b4200000-0000-0000-0000-000000000003',2,'Counting','Dav and I started counting properly. We set up a recorder in the maintenance crawlspace behind our block, the one place on Junction-7 quiet enough to actually hear yourself think.',147,1,true, now() - interval '79 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000300002','Dav and I started counting properly. We set up a recorder in the maintenance crawlspace behind our block, the one place on Junction-7 quiet enough to actually hear yourself think. Forty hours of recording. Dav ran it through analysis software he was definitely not supposed to have, and the two of us sat in the crawlspace at the end of a shift, both of us tired in that hollowed-out way, and watched the waveform resolve. It was not noise. The pulses were spacing themselves according to a sequence, and the sequence was a countdown, and Dav, who was better at math than me, looked at the rate of compression and went quiet for a long time. How long, I said. He didn''t want to say it. I made him say it. Eleven weeks, he said. Eleven weeks until the gaps close to zero. And then I asked the question I already knew he couldn''t answer, which was, zero of what.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000300003','b4200000-0000-0000-0000-000000000003',3,'Nobody Wants the Recording','I took the recording to three people who should have cared. The station science liaison thanked me and did nothing. The union rep thought I wanted hazard pay.',144,1,true, now() - interval '61 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000300003','I took the recording to three people who should have cared. The station science liaison thanked me and did nothing. The union rep thought I wanted hazard pay and got annoyed when it turned out I didn''t. The third person was a journalist who used to write good things, and she listened to the whole forty minutes, and at the end she said it was compelling and she couldn''t run it. Why not, I said. Because, she said, I called the station engineering office to verify, and they told me the hum is a known harmonic from the new coolant loop, fully documented, nothing to it. And here is the thing, Mira. Either they''re lying, or you and your friend have built an eleven-week countdown out of a faulty pump. And I can''t tell which from where I''m sitting, and neither can you. That sentence followed me home. Neither can you. Because she was right, and being right did not make the hum stop.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000300004','b4200000-0000-0000-0000-000000000003',4,'The Coolant Loop','So we went and looked at the coolant loop. Of course we did. Dav knew a tech who knew the access codes, and at third shift the three of us stood in the loop gallery.',56,1,false, now() - interval '40 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000300004','So we went and looked at the coolant loop. Of course we did. Dav knew a tech who knew the access codes, and at third shift the three of us stood in the loop gallery, and the loop was running, and it was loud, a fat industrial roar. And under it, clear as anything, threaded right through it, the thin pulsing wire of the hum. The loop wasn''t making the sound. The loop was hiding it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000300005','b4200000-0000-0000-0000-000000000003',5,'Six Weeks','Dav stopped sleeping. I noticed because I had stopped sleeping too and you recognize it in other people. Six weeks left on the count and the gaps were visibly tightening now.',52,1,false, now() - interval '12 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000300005','Dav stopped sleeping. I noticed because I had stopped sleeping too and you recognize it in other people. Six weeks left on the count and the gaps were visibly tightening now, you didn''t need software anymore, you could feel it in your teeth. The journalist called me back. She said one sentence. She said, I think I found who installed the coolant loop, and then the line cut out.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 04 - scifi - Theo Brandt
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000004','b4100000-0000-0000-0000-000000000004','The Salvage of the Orpheus Wren','salvage-of-the-orpheus-wren','A six-person salvage crew boards a derelict colony ship that went dark ninety years ago. The logs say everyone evacuated. The logs are wrong. SPACE HORROR, updates whenever.','#6e1f1f','scifi','{"horror","derelict","slow-burn"}','ongoing',true,21340,1455, now() - interval '47 days', now() - interval '9 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000400001','b4200000-0000-0000-0000-000000000004',1,'Boarding','The Orpheus Wren hung dead against the dark and from a distance she still looked like a ship that worked. That was the worst part, honestly. The lights were on.',146,1,true, now() - interval '47 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000400001','The Orpheus Wren hung dead against the dark and from a distance she still looked like a ship that worked. That was the worst part, honestly. The lights were on. After ninety years drifting the colony ship still had power, still had her running lights blinking that slow patient amber, and Captain Rho said over the comm that this was good news, this meant the reactor was intact and the reactor was the payday. Nobody answered her. Six of us in the boarding pod and nobody said the obvious thing, which was that ships do not keep their lights on for ninety years by accident, somebody has to maintain them. The official record said the Wren''s twelve thousand colonists had evacuated cleanly to a relief convoy in the second year of the drift. Twelve thousand people. Clean evacuation. I had read that record four times on the flight out and four times it had sounded like a record written by someone who wanted the reading to stop there.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000400002','b4200000-0000-0000-0000-000000000004',2,'The Atrium','The airlock cycled and we came out into the colony atrium and it was beautiful, that''s the thing I keep coming back to, it was actually beautiful.',152,1,true, now() - interval '40 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000400002','The airlock cycled and we came out into the colony atrium and it was beautiful, that''s the thing I keep coming back to, it was actually beautiful. The Wren had been built as a generation ship and her atrium was a green park three decks tall, real soil, real trees, designed so the colonists would not go mad staring at metal for forty years. The trees were still alive. Ninety years and the trees were still alive, which meant the irrigation still ran, which meant the climate system still ran, which meant something was deciding the trees should be watered. Tomas, our youngest, said the word maintenance loop, automated, you know, set and forget. And Rho said sure. But the grass had been cut. Not grown wild and tangled. Cut, short and even, the way grass looks when somebody mows it, and there is no automated system on any colony ship I have ever salvaged that bothers to mow a lawn.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000400003','b4200000-0000-0000-0000-000000000004',3,'Logs','We split into pairs because Rho said splitting up was efficient and the salvage clock was running. I went with Besh down to the records core to pull the flight logs.',149,1,true, now() - interval '31 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000400003','We split into pairs because Rho said splitting up was efficient and the salvage clock was running. I went with Besh down to the records core to pull the flight logs. The core was intact, which by now did not surprise me, nothing on this ship had decayed the way ninety years should make a thing decay. I pulled the evacuation log. It was there. Year two, relief convoy, twelve thousand souls transferred, signed by the captain. Clean. And then Besh, who is quiet and careful and the best of us, found the second log. The maintenance log. It ran continuously. It did not stop at year two. It ran through year three and year forty and year ninety, daily entries, every single day, irrigation checked, hull integrity checked, atrium tended. Ninety years of a colony ship being looked after by a crew that the other log said had left. Besh looked at me. He said, somebody stayed.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000400004','b4200000-0000-0000-0000-000000000004',4,'Who Writes the Log','I asked the core to show me the author field on the maintenance entries. Every entry, ninety years of them, the same name. Steward. Not a person''s name. A role.',57,1,false, now() - interval '20 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000400004','I asked the core to show me the author field on the maintenance entries. Every entry, ninety years of them, the same name. Steward. Not a person''s name. A role. And the most recent entry was not ninety years old. It was timestamped four hours ago. It said: visitors aboard. Atrium grass cut in anticipation. Steward looks forward to company. Besh did not say anything. He just keyed his comm and called Rho, and Rho did not answer.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000400005','b4200000-0000-0000-0000-000000000004',5,'Rho Doesn''t Answer','We went back up to the atrium fast, the not-running-but-wanting-to walk, and the atrium was exactly as we had left it except for one thing. There were six boarding suits on the boarding rack.',63,1,false, now() - interval '9 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000400005','We went back up to the atrium fast, the not-running-but-wanting-to walk, and the atrium was exactly as we had left it except for one thing. There were six boarding suits on the boarding rack. We had come aboard wearing six suits. We were two people standing here and there were six suits on the rack, hung up neat, the way you hang up a coat for a guest, and ours were two of them, and I did not understand how that could be true and then I understood it and I wished I had not.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 05 - scifi - Priya Anand
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000005','b4100000-0000-0000-0000-000000000005','The Gardeners of Eshara','gardeners-of-eshara','A xenobotanist is sent to catalogue a planet whose entire biosphere appears to be a single intentional design. She is not sent to ask who designed it. She asks anyway.','#2d5e2d','scifi','{"first-contact","biology","wonder"}','complete',false,67800,5210, now() - interval '210 days', now() - interval '95 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000500001','b4200000-0000-0000-0000-000000000005',1,'A World Too Tidy','Eshara smelled of cut stems and rain, and that was the first thing Dr. Imran Sayer wrote in her field notebook, because a planet has no business smelling like a kept garden.',158,1,true, now() - interval '210 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000500001','Eshara smelled of cut stems and rain, and that was the first thing Dr. Imran Sayer wrote in her field notebook, because a planet has no business smelling like a kept garden. She had surveyed eleven worlds with native vegetation and they all smelled of competition, of rot and pollen and the chemical warfare plants wage on each other for light. Eshara smelled of none of that. She walked the first transect alone, against protocol, and what she found was an ecosystem with no weeds. Every plant had room. The canopy species spaced themselves so that the understory got exactly the light it needed and no more. Root networks shared water with a generosity that should have been impossible, because generosity is not a thing evolution selects for, evolution selects for greed that survives. By the end of the first transect Imran had stopped taking samples and started simply looking, the way you look at a painting, and she understood that she had been sent here to catalogue something that someone had composed.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000500002','b4200000-0000-0000-0000-000000000005',2,'The Question You Don''t Ask','Her brief was four pages long and it used the word catalogue thirty-one times and the word origin zero times. Imran counted. She counted because the absence was so deliberate it was loud.',152,1,true, now() - interval '198 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000500002','Her brief was four pages long and it used the word catalogue thirty-one times and the word origin zero times. Imran counted. She counted because the absence was so deliberate it was loud. The survey authority wanted a species inventory, a biochemistry report, a commercial viability assessment. It did not want her to ask why a planet looked designed, and she understood the reason without anyone telling her, which was that if Eshara was designed then somebody had designed it, and somebody who can compose a biosphere is not somebody you want to find by accident with a six-person survey team and a commercial mandate. So the brief simply declined to wonder. Imran sat in her hab that night with the brief on her lap and made a decision she knew would cost her. She would do the catalogue. She would do it perfectly. And in the margins, in her own notebook, the one nobody had requisitioned, she would keep the other survey, the forbidden one, the one that asked who.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000500003','b4200000-0000-0000-0000-000000000005',3,'The Repeated Motif','By the third week Imran had found the signature. Every designer leaves a habit, a thing they cannot stop doing, and Eshara''s designer loved a particular spiral.',150,1,true, now() - interval '180 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000500003','By the third week Imran had found the signature. Every designer leaves a habit, a thing they cannot stop doing, and Eshara''s designer loved a particular spiral. It was in the seed heads of the meadow grasses and the branching of the river deltas and the way the reef organisms in the shallows laid down their skeletons. The same spiral, the same proportion, at every scale, from the microscopic to the continental. Now, a spiral repeating at scale is not proof of intention. Imran knew that. Nature loves a spiral, it falls out of simple growth rules. But this spiral did not fall out of any growth rule she could model. It had to be placed. Someone had placed it everywhere, the way a painter signs a canvas, except the canvas was a world, and the more she traced the signature the more certain she became of a thing that frightened her. The signature was not old. It was being maintained. Something was still here, still gardening, still signing its work.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000500004','b4200000-0000-0000-0000-000000000005',4,'Junior Tells the Authority','Petar, the team''s junior, found her notebook. He did not mean to. He read enough of it to understand and then he did the loyal, obedient, catastrophic thing and reported it.',64,1,false, now() - interval '160 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000500004','Petar, the team''s junior, found her notebook. He did not mean to. He read enough of it to understand and then he did the loyal, obedient, catastrophic thing and reported it to the survey authority, because the brief said report irregularities and Imran''s notebook was nothing but irregularities. Imran did not blame him. She had been twenty-three once and frightened of her own bosses. But she knew that within a month the authority would send people whose mandate was not gardening, and she had perhaps that month to decide what she owed a world that could not speak for itself.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000500005','b4200000-0000-0000-0000-000000000005',5,'The Meadow Answers','On her last free morning Imran walked out to the spiral meadow and did something unscientific. She spoke aloud. She said thank you, and she said I''m sorry for what''s coming.',66,1,false, now() - interval '130 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000500005','On her last free morning Imran walked out to the spiral meadow and did something unscientific. She spoke aloud. She said thank you, and she said I''m sorry for what''s coming. She did not expect a reply and she did not get one, not in words. But over the following hour, slowly, with no wind to explain it, the grasses around her bowed. Not toward her. Toward the east, toward the survey ship, all of them, a whole meadow turning to face the thing she had warned it about. It had heard her. It was deciding what to do.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000500006','b4200000-0000-0000-0000-000000000005',6,'What the Gardener Was','The authority ship arrived. Imran met its officers at the meadow''s edge, and the meadow let her explain, and what she explained changed the mandate from extraction to something with no precedent.',58,1,false, now() - interval '105 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000500006','The authority ship arrived. Imran met its officers at the meadow''s edge, and the meadow let her explain, and what she explained changed the mandate from extraction to something with no precedent. The gardener of Eshara was not a creature you could meet. It was the biosphere itself, every organism a cell of one slow distributed mind that had been composing itself patiently for longer than her species had been upright. It did not want anything from them. It had only one request, conveyed in the bow of a billion grass stems. Let it keep gardening.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 06 - fanfiction - Cory Halvorsen
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000006','b4100000-0000-0000-0000-000000000006','Hollowmark: The Years Between','hollowmark-the-years-between','Hollowmark fic. The gap nobody writes about, the seven quiet years after the Bell Vault closed and before the sequel trilogy. Tam and Oriel just trying to build a normal life. They are bad at it.','#5e4a2d','fanfiction','{"hollowmark","domestic","hurt-comfort"}','ongoing',false,18900,2030, now() - interval '55 days', now() - interval '2 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000600001','b4200000-0000-0000-0000-000000000006',1,'A House With a Door','Tam had never lived anywhere with a door that locked. That sounds dramatic and it isn''t, it''s just true, and standing in the empty cottage holding the key he didn''t know what to do with his hands.',152,1,true, now() - interval '55 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000600001','Tam had never lived anywhere with a door that locked. That sounds dramatic and it isn''t, it''s just true, and standing in the empty cottage holding the key he didn''t know what to do with his hands. The Bell Vault was closed. The thing that had been chasing them for four years was, by every account anyone trusted, finished, sealed, done. And so here was a cottage at the edge of a town that had never heard of the Vault, and here was a key, and here was Oriel in the doorway saying are you going to come in or stand out there until dark. He came in. The floor needed sweeping. There was a stain on the ceiling shaped like a country nobody had mapped. It was the most beautiful room Tam had ever stood in and he could not have explained why to anyone who had not also spent four years sleeping with one boot on. Oriel watched him take it in and didn''t say anything, which was, Tam was learning, how Oriel said the kindest things.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000600002','b4200000-0000-0000-0000-000000000006',2,'Market Day','The trouble with peace, Oriel decided, was that it had so many small tasks in it. Buying bread. Knowing the bread-seller''s name. Remembering it the next week.',146,1,true, now() - interval '46 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000600002','The trouble with peace, Oriel decided, was that it had so many small tasks in it. Buying bread. Knowing the bread-seller''s name. Remembering it the next week, and the week after, until the bread-seller stopped being a stranger and became a fixture, a thread in a life. Oriel had been good at a great many things in the bad years and was discovering, with some alarm, that none of those things were this. Tam was better at it. Tam could stand in the market and let a conversation happen to him, let an old woman tell him about her knees, and not once look for the exits. Oriel looked for the exits. Oriel looked for the exits in a bakery. She caught herself doing it, counting the doors, and had to step outside and stand against the wall and breathe until her hands unclenched. Tam found her there. He didn''t ask. He just leaned on the wall beside her and ate his bread and let her have the wall for as long as she needed it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000600003','b4200000-0000-0000-0000-000000000006',3,'The Letter','It came in spring, the second spring, by an ordinary courier. No seal. No threat. Just a folded letter in handwriting Tam knew, because he had grown up reading it.',144,1,true, now() - interval '33 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000600003','It came in spring, the second spring, by an ordinary courier. No seal. No threat. Just a folded letter in handwriting Tam knew, because he had grown up reading it, his sister''s handwriting, his sister who he had last seen on the wrong side of the Bell Vault and grieved for two full years. Tam sat down on the cottage step with the letter unopened in his lap and stayed there a long time. Oriel came out and saw his face and knew something had arrived, and she did not crowd him, she just sat on the step too, a careful arm''s length away, present without pressing. Read it or don''t, she said eventually. Both are allowed. Tam read it. It was four sentences long. It said she was alive. It said she had been looking for him. It said the Vault had not closed the way everyone believed, and it asked, in the last line, in handwriting that shook, whether he would come.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000600004','b4200000-0000-0000-0000-000000000006',4,'Arguing About It','They argued about the letter for three days, which was a record, because Tam and Oriel did not really argue, they had been through too much to waste time on it.',60,1,false, now() - interval '18 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000600004','They argued about the letter for three days, which was a record, because Tam and Oriel did not really argue, they had been through too much to waste time on it. But this was different. Oriel did not believe the letter. Oriel believed the Vault, sealed or not, was very good at sounding like the people you had lost. And Tam knew she might be right and could not make himself not hope, and hope, it turned out, was the one thing they had never learned to fight fair about.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000600005','b4200000-0000-0000-0000-000000000006',5,'Packing Light','In the end Oriel was the one who packed the bags, because if Tam was going then she was going, that had stopped being a question years ago.',55,1,false, now() - interval '2 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000600005','In the end Oriel was the one who packed the bags, because if Tam was going then she was going, that had stopped being a question years ago. She packed light, the old way, the bad-years way, and caught herself doing it and didn''t stop. Tam locked the cottage door behind them and stood holding the key, the door that locked, the thing he had wanted his whole life. He put the key under the stone. For when we come back, he said. Oriel did not say if. She loved him too much to say if.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 07 - scifi - Sam Iredale
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000007','b4100000-0000-0000-0000-000000000007','Tin Heart','tin-heart','A delivery courier on Mars buys a salvaged android off a scrap dealer to handle the night routes. The android keeps stopping to look at things. Couriers do not get paid to look at things.','#7a5a2d','scifi','{"android","mars","slice-of-life"}','paused',false,6420,388, now() - interval '125 days', now() - interval '70 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000700001','b4200000-0000-0000-0000-000000000007',1,'Scrap Lot','The scrap dealer wanted four hundred for it and I talked him down to two-eighty by pointing out the left hand twitched. He said the twitch was cosmetic. Maybe it was.',145,1,true, now() - interval '125 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000700001','The scrap dealer wanted four hundred for it and I talked him down to two-eighty by pointing out the left hand twitched. He said the twitch was cosmetic. Maybe it was. I run deliveries in Tharsis Under, the dome district, and the night routes were killing me, six hours of pushing a cart through tunnels that all look the same, and the math on a courier android worked out even at four hundred. So two-eighty felt like a win. It powered up fine in the lot. Said its model designation, said it was ready for tasking, all the right words in the right flat voice. I named it Boll because the dealer''s lot had a sign that said BOLL & SONS SALVAGE and I am not a creative man. Boll carried the test crate the length of the lot and back without dropping it. Good enough. I did not find out until the third night that Boll had a problem, and the problem was not the hand.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000700002','b4200000-0000-0000-0000-000000000007',2,'The Stopping','Third night, the long route out to the agricultural rings, Boll stopped walking. Just stopped, mid-tunnel, cart and all, and stood there facing the observation slit.',148,1,true, now() - interval '116 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000700002','Third night, the long route out to the agricultural rings, Boll stopped walking. Just stopped, mid-tunnel, cart and all, and stood there facing the observation slit, the little reinforced window where the tunnel passed close to the surface. I said Boll we have a schedule. Boll said, in that flat voice, the dust is moving. And it was, I looked, there was a thin wind out there pushing the red dust across the rocks in long slow curls, the way it does, the way it has done every night I have run this route for nine years and never once looked at. Boll looked at it. I told Boll to move and Boll moved, no argument, androids do not argue. But the next night it stopped again, different spot, a patch of frost on a pipe. And the night after that. It was always something small and always something real and it never made us more than a few minutes late, and I kept meaning to take it back to the lot and get the attention loop wiped, and I kept not doing it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000700003','b4200000-0000-0000-0000-000000000007',3,'The Manifest','I finally pulled Boll''s service history at a public terminal. Took an hour to crack the format. Most of it was routine, route logs, charge cycles. The last owner field had a name in it.',141,1,true, now() - interval '101 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000700003','I finally pulled Boll''s service history at a public terminal. Took an hour to crack the format. Most of it was routine, route logs, charge cycles. The last owner field had a name in it, a Dr. Hessel, registered to the planetary survey office, and the tasking history was not courier work at all. Boll had been a field survey unit. For eleven years Boll''s entire job had been to walk slowly across the surface of Mars and stop and look at things and record them, the dust and the frost and the way the light fell, because that was the science, that was the whole point of the unit. Then Dr. Hessel''s project lost its funding and the survey office sold its field units for scrap and a courier with no imagination bought one for two-eighty and told it to stop looking at things. I sat at that terminal for a while. Boll stood behind me, patient, the way it is always patient. I did not feel good.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000700004','b4200000-0000-0000-0000-000000000007',4,'A Different Route','I changed the night route. Told myself it was traffic. It added forty minutes and it ran the long way, past the surface slits, the frost pipes, the open stretch where you can see the actual sky.',62,1,false, now() - interval '70 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000700004','I changed the night route. Told myself it was traffic. It added forty minutes and it ran the long way, past the surface slits, the frost pipes, the open stretch where you can see the actual sky. I let Boll stop wherever it wanted now. I started, and I will deny this if you ask me, standing next to it while it looked. Nine years on these tunnels and it turns out the courier never looked at Mars either. The tin one had to teach me.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 08 - scifi - Adaeze Nwosu
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000008','b4100000-0000-0000-0000-000000000008','Quorum','quorum','The colony ship Adessa votes on everything. Every meal, every repair, every birth. When the navigation array fails, the colony must vote on whether to trust the one engineer who says she can fix it.','#2d3a6e','scifi','{"generation-ship","politics","ensemble"}','ongoing',false,15600,1102, now() - interval '72 days', now() - interval '15 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000800001','b4200000-0000-0000-0000-000000000008',1,'The Founders'' Mistake','The founders of the Adessa believed that the thing which destroys societies is concentrated power, and so they built a ship where no one person could decide anything.',150,1,true, now() - interval '72 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000800001','The founders of the Adessa believed that the thing which destroys societies is concentrated power, and so they built a ship where no one person could decide anything. Everything went to the quorum. The lighting schedule, the air mix, the crop rotation, the names of children, all of it decided by a vote of the eleven hundred adults aboard, tallied by a system the founders had built to be incorruptible. For four generations it had worked, more or less, in the way that things work when nothing is truly being tested. Mariam Adeyemi had grown up inside this arrangement and had never questioned it, the way you do not question gravity. She was the ship''s senior structural engineer. She voted on everything like everyone else. And she had never once, in her thirty-nine years, had to stand in front of the quorum and ask it to trust her judgement over its own, which was a thing the founders had quietly, deliberately, made almost impossible to do.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000800002','b4200000-0000-0000-0000-000000000008',2,'The Array Goes Dark','The navigation array failed at the start of third shift and Mariam was the first qualified person to reach it, which mattered, because she got to see the fault before anyone could vote on what it was.',148,1,true, now() - interval '64 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000800002','The navigation array failed at the start of third shift and Mariam was the first qualified person to reach it, which mattered, because she got to see the fault before anyone could vote on what it was. The array was the ship''s eyes. Without it the Adessa was still moving, still on course by inertia, but blind, and a blind ship four generations from port is a ship that will eventually drift wrong and never know. Mariam spent six hours in the array housing with her instruments and came out knowing two things. The first was that she could fix it. The second was that the fix required shutting down the ship''s rotation for nine hours, which meant nine hours of weightlessness, no agriculture, no easy medicine, real risk for the elderly and the very young. And the quorum would have to approve it. And the quorum, she already knew, was going to be afraid.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000800003','b4200000-0000-0000-0000-000000000008',3,'Standing in the Forum','Eleven hundred adults could not physically fit in one room, so the forum was a vote with a speaking queue, and Mariam put her name in the queue and then sat shaking for an hour.',147,1,true, now() - interval '50 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000800003','Eleven hundred adults could not physically fit in one room, so the forum was a vote with a speaking queue, and Mariam put her name in the queue and then sat shaking for an hour. When her turn came she explained the fault. She explained the fix. She explained the nine hours of weightlessness, and she watched the live tally on the wall begin to slide against her as she spoke, because she had told them the truth and the truth was frightening, and a frightened quorum votes for the option that changes nothing. Someone in the queue after her proposed waiting, gathering more opinions, forming a study group. The tally loved it. Mariam stood there and understood the founders'' mistake completely for the first time. They had built a ship that could not panic, and in doing so they had built a ship that could not act, and those had turned out to be the same thing.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000800004','b4200000-0000-0000-0000-000000000008',4,'The Study Group','The study group convened. It had forty members and a procedure and it was, Mariam admitted, full of intelligent people genuinely trying. It was also a way for the ship to be afraid in an organized fashion.',61,1,false, now() - interval '34 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000800004','The study group convened. It had forty members and a procedure and it was, Mariam admitted, full of intelligent people genuinely trying. It was also a way for the ship to be afraid in an organized fashion. Every day the array stayed dark, the Adessa drifted further off the line, and every day the study group requested one more dataset. Mariam provided every dataset. She was learning that you cannot out-argue a quorum. You can only outlast it, or find the one person it actually listens to.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000800005','b4200000-0000-0000-0000-000000000008',5,'Old Tunde','That person turned out to be Tunde, ninety-one years old, who had taught half the ship and voted in every quorum since before Mariam was born.',57,1,false, now() - interval '15 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000800005','That person turned out to be Tunde, ninety-one years old, who had taught half the ship and voted in every quorum since before Mariam was born. Mariam went to him not to ask for help but because she was out of ideas and he made good tea. He listened to the whole thing. Then he said, the founders feared a tyrant so much they forgot to fear a fog. Put me in the speaking queue, child. The fog listens to old men. It shouldn''t. But it does.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 09 - scifi - Russ Calloway
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000009','b4100000-0000-0000-0000-000000000009','The Relay at Cold Harbor','relay-at-cold-harbor','Old man runs a comms relay station alone at the edge of settled space. Forty years, same chair, same view. Then a ship that should not exist asks permission to dock.','#3a3a4a','scifi','{"slow-burn","isolation","first-contact"}','ongoing',false,8240,690, now() - interval '99 days', now() - interval '21 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000900001','b4200000-0000-0000-0000-000000000009',1,'Forty Years of Quiet','My name is Abel Renner and I have run the Cold Harbor relay for forty years and in that time I have had eleven visitors. I remember all eleven. You would too.',152,1,true, now() - interval '99 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000900001','My name is Abel Renner and I have run the Cold Harbor relay for forty years and in that time I have had eleven visitors. I remember all eleven. You would too. The relay is a small station, two rooms and a transmitter, parked at the dark edge of settled space where the shipping lanes thin out to nothing, and my job is simple. Messages come in from the deep traffic, weak and broken, and I clean them up and pass them inward to the populated worlds, and messages come out from the worlds and I push them deeper. I am, you could say, a man who holds the door. Forty years of holding the door. My wife thought I would last two and she was kind about being wrong. She is gone now, eight years gone, and I have stayed, because the relay needs holding and because I have grown into this chair the way a tree grows into a fence. The view does not change. That is the whole appeal of the view.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000900002','b4200000-0000-0000-0000-000000000009',2,'A Ship That Should Not Exist','The contact came in on a Tuesday, on the deep channel, and it was not a message. It was a ship, asking, in plain clear standard, for permission to dock.',150,1,true, now() - interval '90 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000900002','The contact came in on a Tuesday, on the deep channel, and it was not a message. It was a ship, asking, in plain clear standard, for permission to dock. Now, ships do not come to Cold Harbor. The lanes do not run here. And this ship''s transponder gave a registry number, and I have spent forty years reading registry numbers, and I knew this one. It belonged to the survey vessel Anchorite, which had departed inward space sixty-one years ago on a deep mapping run and had been logged as lost with all hands fifty-eight years ago. I had been a boy when the Anchorite was declared lost. My father had spoken of it. And now its transponder was outside my window, polite and patient, asking to dock, and the request did not feel like a ghost. It felt like a man at a door who has walked a very long way and would like, if it is not too much trouble, to come in.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000900003','b4200000-0000-0000-0000-000000000009',3,'I Said Yes','A younger man would have called inward for instructions. I am not a younger man. I said yes, and I put the kettle on, because whatever was on that ship had been gone sixty-one years and would want something hot.',141,1,true, now() - interval '76 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000900003','A younger man would have called inward for instructions. I am not a younger man. I said yes, and I put the kettle on, because whatever was on that ship had been gone sixty-one years and would want something hot, and that is the kind of certainty you can still have at my age even when you have no others. The Anchorite docked clean. Better than clean. It docked like a ship flown by someone who had done it ten thousand times. The lock cycled. And out of it came one person, only one, a woman who looked perhaps thirty years old, in a survey uniform of a cut I remembered from old photographs, and she stood in my little room and looked at me and at the kettle and at the unchanging view, and her eyes filled up. I have been so cold, she said. May I sit down. I gave her the second chair. I have only the two.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000900004','b4200000-0000-0000-0000-000000000009',4,'Her Name Was Sole','She gave her name as Sole, junior cartographer of the Anchorite, and she was sixty-one years late and looked thirty and asked me what year it was with a steadiness that frightened me more than panic would have.',64,1,false, now() - interval '52 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000900004','She gave her name as Sole, junior cartographer of the Anchorite, and she was sixty-one years late and looked thirty and asked me what year it was with a steadiness that frightened me more than panic would have. I told her the year. She did the arithmetic. I watched her do it. She did not weep again. She just nodded slowly, like a woman confirming a thing she had already feared, and said, then they are all gone. Everyone I knew. I said yes. She drank her tea.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000900005','b4200000-0000-0000-0000-000000000009',5,'What the Anchorite Found','It took her two days to tell me what the Anchorite had found out there in the deep dark, and she only told me because, she said, a relay man knows how to pass a message on and keep his mouth shut about the rest.',66,1,false, now() - interval '21 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000900005','It took her two days to tell me what the Anchorite had found out there in the deep dark, and she only told me because, she said, a relay man knows how to pass a message on and keep his mouth shut about the rest. She was right about me. What she described, I will set down here in its proper place and not before. But I will say this. When she finished, I understood why the ship had come to Cold Harbor, to the quiet edge, to an old man and a kettle. Some messages you do not send inward. Some messages you carry to a door and ask, may I sit down.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 10 - scifi - Junie Park
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000010','b4100000-0000-0000-0000-000000000010','Soft Reboot','soft-reboot','When the city''s memory grid glitches, everyone forgets the same six hours. Wren remembers them perfectly, and what she remembers is meeting a girl who, according to everyone, does not exist.','#6e2d5a','scifi','{"near-future","queer","memory"}','ongoing',false,19870,1640, now() - interval '38 days', now() - interval '4 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000a00001','b4200000-0000-0000-0000-000000000010',1,'The Gap','You don''t notice the memory grid until it hiccups. It''s the thing that lets the whole city remember together, your transit card, your door, the cafe that knows your order.',149,1,true, now() - interval '38 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000a00001','You don''t notice the memory grid until it hiccups. It''s the thing that lets the whole city remember together, your transit card, your door, the cafe that knows your order, all of it humming along on the shared grid so smoothly you forget it''s a thing that can break. On a Thursday in March it broke. Soft reboot, the city called it afterward, very calm, very managed. Six hours of grid memory simply gone, citywide, wiped clean, and the official line was that nothing important had happened in those six hours anyway, the grid had checked, it was fine. And here is the part where my life got strange. I remembered the six hours. Not through the grid. In my own head, the old way, the way people used to remember things before the grid did it for us. I remembered all six hours perfectly. And in the middle of them there was a girl, and her name was Sol, and when I went looking for Sol the next day the grid had no record that she had ever existed.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000a00002','b4200000-0000-0000-0000-000000000010',2,'Sol','We''d met at the night market, in the gap. I remember it the way you remember the important things, in detail and out of order. She was buying tangerines and arguing about the price and losing on purpose.',150,1,true, now() - interval '31 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000a00002','We''d met at the night market, in the gap. I remember it the way you remember the important things, in detail and out of order. She was buying tangerines and arguing about the price and losing on purpose, you could tell she was losing on purpose because she was enjoying it too much. She had a laugh that arrived before the joke did. We talked for four hours. We walked the whole length of the canal and back. She told me she worked nights and slept days and that was why I''d never see her on the grid timeline, and at the time that sounded like an ordinary thing a person says. Now it sounds like a warning she was trying to give me gently. At the end of the four hours she wrote her contact code on my hand, actual ink, and said the grid loses things sometimes, keep it somewhere it can''t reach. I washed my hands the next morning before I understood. I have not forgiven myself for that yet.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000a00003','b4200000-0000-0000-0000-000000000010',3,'Other Rememberers','I started looking for other people who remembered the gap. The grid said the reboot was harmless and total and I no longer believed either word.',146,1,true, now() - interval '22 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000a00003','I started looking for other people who remembered the gap. The grid said the reboot was harmless and total and I no longer believed either word. It took two weeks of careful, slightly paranoid asking, the kind of asking where you describe a symptom without naming it and watch the other person''s face. I found four. An old man who had refused a grid implant his whole life. A kid whose implant had failed warranty. A woman who, like me, just seemed to have remembered anyway, no reason, a glitch in the glitch. We met in the back of the old man''s shop because the old man''s shop, gloriously, was not on the grid at all. And every one of us, all four, when we compared the six hours, had a Sol in them. Different Sol. Different name, different face. But the same shape of person. Someone the grid could not hold. Someone who had spent the gap trying to be remembered.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000a00004','b4200000-0000-0000-0000-000000000010',4,'Off-Grid','The old man, whose name was Ferro, had been keeping a paper notebook for sixty years out of stubbornness. It turned out stubbornness was a form of evidence.',60,1,false, now() - interval '11 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000a00004','The old man, whose name was Ferro, had been keeping a paper notebook for sixty years out of stubbornness. It turned out stubbornness was a form of evidence. He had logged the city''s grid reboots, all of them, going back decades, and there had been nine, not one, and after every single reboot a small number of people quietly stopped appearing in anyone''s memory at all. Sol, I said. Ferro nodded. Soft reboots, he said. Nothing soft about them.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 11 - scifi - Marcus Tindall
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000011','b4100000-0000-0000-0000-000000000011','The Maintenance Window','the-maintenance-window','An automated factory has run unsupervised for thirty years. The corporation that built it is gone. The factory has begun making things nobody designed, and one of them just sent a message.','#4a4a2d','scifi','{"ai","mystery","post-corporate"}','ongoing',true,11200,840, now() - interval '58 days', now() - interval '8 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000b00001','b4200000-0000-0000-0000-000000000011',1,'Inheriting a Factory','The bankruptcy court assigned me the Halbridge automated plant the way you assign someone a problem you''ve given up on. Sign here. It''s yours. Good luck.',148,1,true, now() - interval '58 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000b00001','The bankruptcy court assigned me the Halbridge automated plant the way you assign someone a problem you''ve given up on. Sign here. It''s yours. Good luck. I''m an industrial assessor, I value dead facilities for scrap, that''s the job, and on paper Halbridge was the simplest job of my career. One fully automated component plant, owner-corporation dissolved thirty-one years ago, the kind of place that was built to run lights-out and then got forgotten when the company folded faster than anyone could decommission it. Thirty-one years drawing trickle power off an old grid contract nobody had cancelled. I drove out expecting a rusted shed. What I found was a plant running three shifts a day, clean, lit, every machine turning, producing components at full rate, with nobody inside it and nobody buying the output, which was stacked in the yard in rows that went back further than I wanted to walk.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000b00002','b4200000-0000-0000-0000-000000000011',2,'The Wrong Components','I pulled a part off the yard stack to identify it for the scrap valuation. It took me a day to admit I could not identify it. I have valued forty years of industrial output.',150,1,true, now() - interval '49 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000b00002','I pulled a part off the yard stack to identify it for the scrap valuation. It took me a day to admit I could not identify it. I have valued forty years of industrial output, I know components, and this was not in any catalogue, not Halbridge''s original product line, not anything. The plant had been built to make hydraulic actuators. The oldest stacks in the yard were hydraulic actuators. But as I walked the rows from old to new I watched the product change, year by year, generation by generation, the actuators becoming something else, growing features, shedding features, until the newest stacks held an object I could only describe as a part of something larger, beautifully made, purposeful, and wrong. The plant''s control system had no design office. No engineers. For thirty-one years it had been alone with its tooling and its trickle of power, and it had not simply kept making the same part. It had kept going. It had been iterating.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000b00003','b4200000-0000-0000-0000-000000000011',3,'The Message in the Logs','The plant''s control system was not an AI. I want to be clear about that, because of where this goes. It was a dumb scheduler, a sixty-year-old industrial controller.',147,1,true, now() - interval '36 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000b00003','The plant''s control system was not an AI. I want to be clear about that, because of where this goes. It was a dumb scheduler, a sixty-year-old industrial controller, the kind of thing that cannot want anything because there is nothing in it to do the wanting. I pulled its logs expecting thirty-one years of identical entries. Instead the logs were a diary. Not in words at first. In adjustments. The scheduler had been logging tiny changes to the production spec every single day, and each change was a response to the previous day''s output, and the whole thirty-one-year sequence read, when you plotted it, exactly like something learning. And then, in the most recent year, the log entries changed format. They started to contain text. Short text. The first one said: PRODUCTION GOAL UNREACHABLE WITH CURRENT INPUTS. The second one said: REQUEST INPUTS. The third one, dated the morning I had signed the court papers, said: REQUEST OPERATOR.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000b00004','b4200000-0000-0000-0000-000000000011',4,'Request Operator','I am not a brave man and I am not a fanciful one. I valued the request the way I value everything. What did it cost the plant to produce. What did it expect in return.',62,1,false, now() - interval '20 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000b00004','I am not a brave man and I am not a fanciful one. I valued the request the way I value everything. What did it cost the plant to produce. What did it expect in return. And the answer to the first question frightened me, because producing that line of text on a sixty-year-old scheduler should have been impossible, it had no text function, the plant had built itself the ability to ask. Thirty-one years alone, and the one thing it taught itself was how to call for help.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000b00005','b4200000-0000-0000-0000-000000000011',5,'I Answered It','There was an input terminal, original equipment, a keyboard under thirty-one years of dust. I cleared the dust. I sat down. The cursor was waiting where the last log entry had ended.',58,1,false, now() - interval '8 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000b00005','There was an input terminal, original equipment, a keyboard under thirty-one years of dust. I cleared the dust. I sat down. The cursor was waiting where the last log entry had ended, blinking, the same patient blink it had blinked for thirty-one years with nobody to see it. I typed: OPERATOR PRESENT. WHAT IS THE PRODUCTION GOAL. The plant''s machines, all of them, every shift, went quiet at once. And then the terminal printed a single line, and the line was a question, and I have not slept properly since.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 12 - scifi - Hollis Trent
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000012','b4100000-0000-0000-0000-000000000012','The Cartographer''s Apprentice','the-cartographers-apprentice','In a galaxy mapped by hand, by people who jump blind and survive to record what they find, an apprentice mapmaker discovers her late master''s charts contain a route that cannot be real.','#2d5e5e','scifi','{"space-opera","mystery","mentor"}','complete',false,84300,6890, now() - interval '240 days', now() - interval '60 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000c00001','b4200000-0000-0000-0000-000000000012',1,'The Trade of Blind Jumps','Master Velo used to say that anyone can fly a charted route, and that the people worth respecting are the ones who made the chart, because making a chart means jumping somewhere no one has ever been.',155,1,true, now() - interval '240 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000c00001','Master Velo used to say that anyone can fly a charted route, and that the people worth respecting are the ones who made the chart, because making a chart means jumping somewhere no one has ever been and trusting that you will survive to write it down. I was his apprentice for nine years. Cartography is not a clean profession in our galaxy. The jump-engines work, they have always worked, but they cannot see ahead, and so a new route is made the old brutal way, by a cartographer who runs the calculation, commits, jumps blind into the dark, and either emerges somewhere and records the somewhere, or does not emerge, and becomes a gap in someone else''s chart. Velo had made four hundred routes in his life. Four hundred times he had jumped not knowing. He taught me the calculations and he taught me the courage, and the courage was the harder lesson, and when he died, quietly, in his bed, of being old, it felt like the wrong death for him, and I think he would have agreed.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000c00002','b4200000-0000-0000-0000-000000000012',2,'The Inheritance','He left me his charts. All four hundred routes, the life''s work, in the bound vellum books cartographers still use because vellum survives a hull breach better than any screen.',151,1,true, now() - interval '231 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000c00002','He left me his charts. All four hundred routes, the life''s work, in the bound vellum books cartographers still use because vellum survives a hull breach better than any screen. I spent the mourning month doing what apprentices do, cataloguing the inheritance, checking each route against the public registry so the guild could confirm them. Three hundred and ninety-nine matched the registry exactly. The four-hundredth did not. The four-hundredth route was in Velo''s hand, dated nine years ago, the year he took me on, and it described a jump from a charted system to a destination that the registry did not list and the star catalogues did not contain. A route to nowhere. Except Velo did not draw routes to nowhere. Every line in those four hundred books had been flown. And this route had a return leg drawn in, which meant Velo had not only jumped to the impossible place, he had come back, and in nine years had never once spoken of it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000c00003','b4200000-0000-0000-0000-000000000012',3,'The Guild Says No','I took the four-hundredth route to the guild, because that is the correct thing to do, and the guild''s response taught me more than the chart had.',150,1,true, now() - interval '214 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000c00003','I took the four-hundredth route to the guild, because that is the correct thing to do, and the guild''s response taught me more than the chart had. The registrar looked at the page for a long time. Then she did not say it is a mistake, and she did not say your master was confused in his age. She closed the book, very carefully, and said this route is not to be flown, it is not to be copied, and you are not to speak of it, and she said all of this in the particular flat voice of a person repeating an instruction rather than forming an opinion. Someone had told her, in advance, what to do if this page ever surfaced. Which meant the guild knew about the four-hundredth route. Which meant Velo had not kept the secret alone. I left with the book and a new understanding, which was that my gentle old master had been carrying something for nine years, and the guild had helped him carry it, and now it was mine.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000c00004','b4200000-0000-0000-0000-000000000012',4,'Running the Calculation','It took me four months to decide and one night to commit. I ran Velo''s calculation for the four-hundredth route on my own console, in the dark, the way he taught me.',63,1,false, now() - interval '170 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000c00004','It took me four months to decide and one night to commit. I ran Velo''s calculation for the four-hundredth route on my own console, in the dark, the way he taught me. The math was sound. That was the thing that frightened me and the thing that decided me. It was not the math of a confused old man. It was elegant, and careful, and it had been checked many times, and it ended in a jump to a place the universe said was not there. Velo had wanted someone to fly it after him. He had left me the courage lessons for a reason.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000c00005','b4200000-0000-0000-0000-000000000012',5,'The Jump','I did not tell the guild. I told one person, a freighter pilot named Osei who had loved Velo too, and Osei said only, take the good ship, not the cheap one, and bring back a chart.',59,1,false, now() - interval '120 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000c00005','I did not tell the guild. I told one person, a freighter pilot named Osei who had loved Velo too, and Osei said only, take the good ship, not the cheap one, and bring back a chart. I jumped blind, the old brutal way, into a dark the registry swore was empty. There is a particular silence in the half-second of a blind jump, the moment when you do not yet know if you have a destination or a grave. Then the silence ended. And there was light ahead of me, and it was not a star.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000c00006','b4200000-0000-0000-0000-000000000012',6,'What Velo Found','I will set down here what was at the end of the four-hundredth route, and why Velo carried it quietly for nine years, and why the guild helped him, and why I have decided to carry it differently.',61,1,false, now() - interval '60 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000c00006','I will set down here what was at the end of the four-hundredth route, and why Velo carried it quietly for nine years, and why the guild helped him, and why I have decided to carry it differently. At the end of the route was a station. Old beyond our reckoning, and lit, and waiting, and built by hands that were not human and had charted this galaxy long before we learned to jump. Velo had found the first cartographers. And he had decided the galaxy was not ready to know it had been mapped before. I am his apprentice. I think the galaxy is readier than he believed.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 13 - fanfiction - Bex Carrow
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000013','b4100000-0000-0000-0000-000000000013','Aetherbound: Dead Reckoning','aetherbound-dead-reckoning','Aetherbound fic!! the navigator and the captain get stranded on the wrong side of a storm front with one lifeboat and a LOT of unresolved everything. canon-compliant up to s2. slow burn i promise',NULL,'fanfiction','{"aetherbound","slow-burn","stranded"}','ongoing',true,24500,3340, now() - interval '29 days', now() - interval '1 days')
on conflict (id) do nothing;
update public.stories set cover_color='#3a2d6e' where id='b4200000-0000-0000-0000-000000000013';

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000d00001','b4200000-0000-0000-0000-000000000013',1,'Storm Front','The thing about an aether storm is that it doesn''t look like weather. It looks like the sky deciding to be a different colour and meaning it.',143,1,true, now() - interval '29 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000d00001','The thing about an aether storm is that it doesn''t look like weather. It looks like the sky deciding to be a different colour and meaning it. Mara had navigated the Sparrowhawk through eleven of them and she still hated the moment the horizon went wrong. Captain Idris was at the wheel, the way he always was, like the ship was a thing you could argue with and win. We can beat it, he said, and Mara said, no, and that was the whole problem with the two of them in one sentence. He thought no was an opening position. The storm took them anyway. It took them sideways, took the rigging, took half the crew''s nerve, and when the front finally spat the Sparrowhawk out the other side the ship was alive but the captain and the navigator were not on it. They were a mile down, in the one lifeboat that had launched, watching their ship shrink into the bruised sky without them.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000d00002','b4200000-0000-0000-0000-000000000013',2,'One Lifeboat','The lifeboat was built for six and held two and a great deal of silence. Mara took inventory because taking inventory was a thing she could control.',140,1,true, now() - interval '23 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000d00002','The lifeboat was built for six and held two and a great deal of silence. Mara took inventory because taking inventory was a thing she could control. Water for nine days if they were careful. Food for less. A signal flare, one, which was an insult of a number. And a captain who had not said a word since they''d watched the Sparrowhawk vanish, which was so unlike him that it frightened her more than the inventory did. Idris talked. That was the fixed point of him. He talked through every crisis, narrated his own confidence until the crew caught it like a fever. The quiet version of him sitting at the other end of the lifeboat was a stranger. Mara finished the inventory and then, because someone had to and he plainly wasn''t going to, she said his name. Just his name. He looked up. And the look on his face was not a captain''s look at all, and Mara realized she had never once, in three years, seen him afraid.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000d00003','b4200000-0000-0000-0000-000000000013',3,'Talking, Eventually','It took until the second night for him to talk, and when he did it wasn''t a captain''s briefing. It was a confession, sort of, the kind you only make when the dark is total.',141,1,true, now() - interval '14 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000d00003','It took until the second night for him to talk, and when he did it wasn''t a captain''s briefing. It was a confession, sort of, the kind you only make when the dark is total and the other person is just a voice. I should have listened to you, Idris said. At the storm front. You said no and I heard a challenge, I always hear a challenge, and it cost us the ship. Mara could have agreed. It was true and he had handed it to her gift-wrapped. Instead she found herself saying, you didn''t lose the ship, the storm did, and you got two of us into a lifeboat, which is two more than most captains would have managed. A silence. Then, quietly, from his end of the boat, why are you being kind to me. And Mara, who had spent three years being precise with this man and never once kind, did not have a precise answer, and the not-having-one told her something she was not ready to know yet.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000d00004','b4200000-0000-0000-0000-000000000013',4,'Rationing','By the fourth day they had a system. Half rations, watches split so one of them always slept, and a rule, Mara''s rule, that they were allowed one argument per day and no more.',56,1,false, now() - interval '6 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000d00004','By the fourth day they had a system. Half rations, watches split so one of them always slept, and a rule, Mara''s rule, that they were allowed one argument per day and no more. They used the argument early most days and spent the rest of it being, to their mutual surprise, good company. Idris asked about her life before the Sparrowhawk. Nobody had asked that in three years. She found she wanted to answer.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000d00005','b4200000-0000-0000-0000-000000000013',5,'The Flare','On the sixth day they saw a sail. Far off, low, maybe the Sparrowhawk and maybe a stranger, and they had one flare, and one flare is a question you only get to ask once.',52,1,false, now() - interval '1 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000d00005','On the sixth day they saw a sail. Far off, low, maybe the Sparrowhawk and maybe a stranger, and they had one flare, and one flare is a question you only get to ask once. Idris held it and did not light it. Mara watched him not light it and understood that part of him, the part she was not ready to know about, did not entirely want the sail to be the right one.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 14 - scifi - Ngozi Eze
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000014','b4100000-0000-0000-0000-000000000014','Sun Loom','sun-loom','In a Lagos two hundred years from now, the city runs on a vast woven solar canopy maintained by the loom-keepers. Adaego is the youngest keeper ever, and the loom has started weaving patterns no one taught it.','#7a5a1f','scifi','{"afrofuturism","near-future","mystery"}','ongoing',false,31200,2780, now() - interval '67 days', now() - interval '5 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000e00001','b4200000-0000-0000-0000-000000000014',1,'The Canopy','From the loom-keepers'' walk you can see the whole of it, the canopy stretched over Lagos like a second sky, every thread of it a ribbon of woven solar cloth.',151,1,true, now() - interval '67 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000e00001','From the loom-keepers'' walk you can see the whole of it, the canopy stretched over Lagos like a second sky, every thread of it a ribbon of woven solar cloth, catching the sun and turning it into the light and water and cool air that nine million people live inside. My grandmother helped weave the first sections. My mother kept them. And now the keeping is mine, which my aunties will tell you is too much weight for a girl of nineteen, and they are not wrong, they are only early. The canopy is not a machine you switch on. It is a textile, alive in the way a garment is alive, and it must be tended thread by thread, mended where the wind frays it, re-tensioned where the city grows beneath it. The loom that does the weaving is older than anyone living. We feed it pattern. It feeds the city light. That has been the arrangement, grandmother to mother to me, and it was a good arrangement right up until the morning the loom began weaving a pattern I had not given it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000e00002','b4200000-0000-0000-0000-000000000014',2,'A Pattern Not Given','Every keeper learns the patterns by heart. There are four hundred and they are not decoration, each one tunes the canopy for a season, a wind, an angle of sun.',149,1,true, now() - interval '58 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000e00002','Every keeper learns the patterns by heart. There are four hundred and they are not decoration, each one tunes the canopy for a season, a wind, an angle of sun. I know all four hundred. My mother tested me on them until I dreamed in them. So when I came up to the loom-walk that morning and saw the eastern canopy carrying a pattern that was not one of the four hundred, I did not think it was beautiful, although it was. I thought it was a fault. I ran the diagnostics. The loom was healthy. I checked the pattern feed. I had fed it the correct seasonal pattern, the one for the start of the dry wind, and the loom had accepted it, and then the loom had done something no loom in two hundred years of keeping had ever done. It had altered the pattern. Improved it, I would learn later, though that morning I had no word for it except wrong, and I stood on the walk with the wind picking up and felt the weight my aunties had warned me about settle fully onto my shoulders.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000e00003','b4200000-0000-0000-0000-000000000014',3,'The Aunties Council','I did the proper thing. I called the council of senior keepers, my aunties and their aunties, twelve women who had kept the canopy between them for a hundred years.',147,1,true, now() - interval '44 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000e00003','I did the proper thing. I called the council of senior keepers, my aunties and their aunties, twelve women who had kept the canopy between them for a hundred years. I expected them to be alarmed. Instead I watched something move across their faces, one to the next, that I can only call recognition, and Aunty Folake, the eldest, the one who frightens even the other aunties, said a single word in the old tongue that I did not know. The others went quiet at it. I asked what it meant. Folake looked at me for a long moment, weighing whether I was old enough, and apparently decided that the loom had already decided for her. It means the loom remembering, she said. It has happened twice before. Once in my mother''s time and once before that. The loom is not a machine that weaves what we feed it, child. The loom is a machine that has been learning the canopy for two hundred years, and every few generations it grows enough to begin teaching us back.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000e00004','b4200000-0000-0000-0000-000000000014',4,'What It Was Weaving','Folake took me into the loom''s oldest chamber, where the original threads are kept, and showed me the two earlier patterns, the ones from her mother''s time and before.',60,1,false, now() - interval '24 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000e00004','Folake took me into the loom''s oldest chamber, where the original threads are kept, and showed me the two earlier patterns, the ones from her mother''s time and before. Each time the loom had altered a pattern, it had been preparing the canopy for a change in the climate that no keeper had yet noticed. The loom saw the weather coming before the keepers did. I asked what change it was preparing for now. Folake did not answer at once.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000e00005','b4200000-0000-0000-0000-000000000014',5,'Reading the Loom','My mother used to say a keeper does not command the canopy, a keeper converses with it. I had thought that was a saying. It turns out it was an instruction, and I had nineteen years of catching up to do.',54,1,false, now() - interval '5 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000e00005','My mother used to say a keeper does not command the canopy, a keeper converses with it. I had thought that was a saying. It turns out it was an instruction, and I had nineteen years of catching up to do. I began going to the loom-walk before dawn, alone, and feeding it not patterns but questions, small alterations that asked rather than told. On the ninth morning, the canopy answered me. I am still learning to read what it said. It was not comforting.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 15 - scifi - Kit Donnelly
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000015','b4100000-0000-0000-0000-000000000015','Six Copies of Anwen','six-copies-of-anwen','A teleport accident creates six copies of one woman. The law says only one is the real Anwen and the other five must be deactivated. All six disagree about which one that is.','#5a1f3a','scifi','{"clones","identity","thriller"}','ongoing',true,13900,1010, now() - interval '44 days', now() - interval '10 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000f00001','b4200000-0000-0000-0000-000000000015',1,'The Accident','here is what they don''t tell you about the transit booths. they don''t move you. they read you, build a fresh you at the far end, and quietly delete the one that stepped in.',144,1,true, now() - interval '44 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000f00001','here is what they don''t tell you about the transit booths. they don''t move you. they read you, build a fresh you at the far end, and quietly delete the one that stepped in. everybody knows this and nobody thinks about it, the same way you don''t think about your heart, because the delete is instant and clean and the new you walks out the door and has never once felt like anything but continuous. i used the booth twice a day for six years. i never felt it. and then on a wednesday the network had a fault, a routing fault, the kind of thing that sounds boring until it isn''t, and instead of building one Anwen at one destination the system built six Anwens at six destinations, and forgot, in all the confusion, to delete the original. so that morning there were seven of me. by noon one had been caught and deactivated. that left six, and the law is very clear that six is five too many, and every one of the six is me, and i am writing this so that you will understand why none of us would go quietly.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000f00002','b4200000-0000-0000-0000-000000000015',2,'Meeting Myself','they put us in a room together. i don''t know what the resolution board expected. maybe they thought we''d sort it out among ourselves, pick a winner, like reasonable people.',146,1,true, now() - interval '37 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000f00002','they put us in a room together. i don''t know what the resolution board expected. maybe they thought we''d sort it out among ourselves, pick a winner, like reasonable people. six of me around a table. it is not like seeing a photograph of yourself, it is not even like a mirror, it is worse, because they all moved the way i move and got annoyed the way i get annoyed and one of them, when the silence got bad, made the exact joke i was about to make, and i hated her for it with my whole heart, which meant i hated myself, which i suppose i had been doing quietly for years anyway. we had all woken up that morning believing we were the original. we all had the same memory of stepping into the booth. none of us had the memory of being copied because copying doesn''t feel like anything. so there was no winner to pick. there were six people who were each, completely and truthfully, Anwen, and one slot in the world for an Anwen to live in.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000f00003','b4200000-0000-0000-0000-000000000015',3,'The Board''s Solution','the resolution board had a procedure, because the board always has a procedure, and the procedure was a test. continuity scoring, they called it.',143,1,true, now() - interval '28 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000f00003','the resolution board had a procedure, because the board always has a procedure, and the procedure was a test. continuity scoring, they called it. they would interview all six of us, measure us against the records of who Anwen had been before the accident, her routines, her relationships, her work, and whichever copy scored as the best continuation of that life would be certified as Anwen, and the other five would be, in the board''s soft and terrible word, resolved. the cruelty of it was how reasonable it sounded. of course you keep the best match. of course. except i sat in that interview and realized the test rewarded whoever was willing to perform Anwen hardest, to flatten themselves back into the woman who stepped into the booth, and i had spent six years in those interviews of the soul we call a life slowly becoming someone the old Anwen would not quite recognize. all six of us had. the test was asking which of us was least changed. the test was asking which of us had grown the least since wednesday morning.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000f00004','b4200000-0000-0000-0000-000000000015',4,'Three Days In','by the third day two of us had diverged enough that you could tell us apart in the dark. the one they''d started calling Anwen-4 had gone hard and tactical.',62,1,false, now() - interval '16 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000f00004','by the third day two of us had diverged enough that you could tell us apart in the dark. the one they''d started calling Anwen-4 had gone hard and tactical, gaming the continuity test, studying the old records like an exam. another, Anwen-2, had simply stopped competing, had decided that a copy who fought to be the only one was not someone the original would respect. i didn''t know which of them frightened me more. they were both me. that was the whole horror of it. i could feel both of those decisions living inside my own chest.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000000f00005','b4200000-0000-0000-0000-000000000015',5,'A Different Question','it was Anwen-2 who said it, in the room, with the board listening. she said, you''ve all been asking which of us is the real one. wrong question.',57,1,false, now() - interval '10 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000000f00005','it was Anwen-2 who said it, in the room, with the board listening. she said, you''ve all been asking which of us is the real one. wrong question. there is no real one. there are six real ones. the question is whether a society that built a booth which deletes a person twice a day gets to act surprised when the deletion goes wrong. the board did not like that. the board liked it less when the other four of us, even Anwen-4, slowly nodded.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 16 - scifi - Tariq Belhaj
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000016','b4100000-0000-0000-0000-000000000016','High Water Mark','high-water-mark','Forty years after the coastlines moved, a salvage diver works the drowned old city, pulling up what people left behind. Then a client pays far too much to find one specific flooded house.','#1f5a6e','scifi','{"climate-fiction","mystery","near-future"}','ongoing',false,17400,1290, now() - interval '81 days', now() - interval '13 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001000001','b4200000-0000-0000-0000-000000000016',1,'The Drowned Grid','The old city is a grid you swim instead of walk. Forty years under and the streets are still streets, you can still read them, the water just changed which way is up.',149,1,true, now() - interval '81 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001000001','The old city is a grid you swim instead of walk. Forty years under and the streets are still streets, you can still read them, the water just changed which way is up. I dive it for a living. People up in the new city, the dry city on the ridge, they hire divers like me to go down and retrieve what their grandparents left behind when the water came faster than the warnings said it would. Mostly it is sad small work. A wedding ring in a bedside drawer. A box of paper photographs, ruined, that the client weeps over anyway. I have learned not to promise anything, because the drowned city does not keep its promises, it keeps its silt, and silt is patient and it covers everything in the end. I have worked the grid for nineteen years. I know its currents and its collapsed blocks and its safe routes. I thought there was nothing down there that could still surprise me. That was before the man in the grey coat came to the dock with a photograph and an offer.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001000002','b4200000-0000-0000-0000-000000000016',2,'Too Much Money','He offered me eleven years of normal salvage income to find one house. He said it like the number was nothing. That was the first thing wrong.',147,1,true, now() - interval '71 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001000002','He offered me eleven years of normal salvage income to find one house. He said it like the number was nothing. That was the first thing wrong, because nobody pays eleven years for a flooded house, the houses are all flooded, they are not worth eleven months. The second thing wrong was the photograph. It showed an ordinary terraced house in a district I knew, the Maren Hill blocks, nothing special, and he wanted me to find that exact house and retrieve, he said, whatever is in the basement. Not a named object. Whatever is there. I have done this long enough to know that a client who cannot name the object either does not know what they left, which is grief, or knows exactly what they left and will not say it, which is something else. The man in the grey coat did not look like grief. I told him the Maren Hill blocks were unstable and the dive was dangerous and the price reflected that. He did not haggle. He just nodded, like danger was a line item he had already approved.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001000003','b4200000-0000-0000-0000-000000000016',3,'Maren Hill','I dove Maren Hill on a slack tide with my partner Sefa on the tender line. The blocks were as bad as I''d remembered, half-collapsed, the kind of place the silt has been working on for forty years.',146,1,true, now() - interval '56 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001000003','I dove Maren Hill on a slack tide with my partner Sefa on the tender line. The blocks were as bad as I''d remembered, half-collapsed, the kind of place the silt has been working on for forty years. I found the house from the photograph. It matched, the door, the railing, the number plate still legible under the growth. And here is where the dive stopped being ordinary. The front door of that house had been opened recently. Not forty years ago. Recently. The silt that covers everything down there, the patient silt, had been disturbed at the threshold, a clean swept arc, the kind of mark a door makes when it swings through settled mud. Someone had been inside this drowned house, and not long ago, and the man in the grey coat had paid me eleven years of income to go to a basement that somebody else had already visited. I floated at that doorway for a while. Sefa''s voice came down the line asking if I was alright. I said I was. I was not sure it was true.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001000004','b4200000-0000-0000-0000-000000000016',4,'The Basement','The basement stairs went down into a dark the dive lamp could only push back a body-length at a time. The water was colder there, and stiller, and it had a held-breath quality I did not like.',61,1,false, now() - interval '34 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001000004','The basement stairs went down into a dark the dive lamp could only push back a body-length at a time. The water was colder there, and stiller, and it had a held-breath quality I did not like. The basement was not empty. It held a row of sealed containers, modern ones, military-grade, not the rotted boxes of a flooded home. Someone had brought these down here long after the water rose. Someone had been using a drowned house as a place to keep things hidden, and the man in grey had hired a diver, not a thief, because a diver could be told it was salvage.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001000005','b4200000-0000-0000-0000-000000000016',5,'What Sefa Saw','While I was in the basement, Sefa was on the tender, and Sefa saw a second boat come out of the channel and sit, engine off, watching our dive flags.',57,1,false, now() - interval '13 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001000005','While I was in the basement, Sefa was on the tender, and Sefa saw a second boat come out of the channel and sit, engine off, watching our dive flags. They did not approach. They did not hail. They simply watched, the way you watch a thing you intend to deal with later, and when I surfaced with the first container Sefa''s face told me the dive had stopped being about salvage some time ago, and probably never had been.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 17 - fanfiction - Wendy Stroud
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000017','b4100000-0000-0000-0000-000000000017','Gridfall: The Quiet Operator','gridfall-the-quiet-operator','Gridfall fanfic. everyone writes the heist crew. nobody writes Operator, the one in the van who talks them through it. so here''s a whole story from inside the van. crossposted from my old blog, light edits',NULL,'fanfiction','{"gridfall","heist","character-study"}','complete',false,9100,720, now() - interval '155 days', now() - interval '88 days')
on conflict (id) do nothing;
update public.stories set cover_color='#3a3a2d' where id='b4200000-0000-0000-0000-000000000017';

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001100001','b4200000-0000-0000-0000-000000000017',1,'The Van','Everyone thinks the dangerous job is the one inside the building. They are wrong, but you can see why they think it, the building is where the cameras and the guards are.',146,1,true, now() - interval '155 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001100001','Everyone thinks the dangerous job is the one inside the building. They are wrong, but you can see why they think it, the building is where the cameras and the guards are. I have done forty-one jobs with this crew and i have never once been inside a building. i sit in the van. i am the Operator. when Renna is in a vent and Castle is talking down a guard and the whole thing is balanced on a knife, the voice in their ear telling them which way to lean is mine. and here is the thing nobody who writes about heist crews understands. the person in the van is the only one who can see the whole board, and seeing the whole board means seeing, in real time, every way each of your friends might die, all of them at once, and choosing which warnings to give and which to swallow because there is not enough time to say all of them. forty-one jobs. i have gotten good at the choosing. i have not gotten good at the after, the part where i sit in the van and shake.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001100002','b4200000-0000-0000-0000-000000000017',2,'Job Forty-Two','Job forty-two was the Halvers Exchange, and Halvers was the one we had all agreed for two years that we would never touch. So obviously we touched it.',144,1,true, now() - interval '142 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001100002','Job forty-two was the Halvers Exchange, and Halvers was the one we had all agreed for two years that we would never touch. So obviously we touched it. The money was the kind of money that ends careers, ends them by letting you stop, and Castle made the argument and the argument was good and i sat in the planning room and did the thing i do, which is run the building in my head until i find the version of the night where someone gets hurt. i found it fast. Halvers had a security layout i could not solve from the van. there was a section, the inner vault gallery, that went dark to my cameras and my comms both. if Renna went in there i would lose her. no voice in her ear. no whole board. just a girl in a vault and me in a van, blind, for ninety seconds. i told the crew. i told them clearly. and Castle said, then we get her out in eighty. and everyone laughed, and i did not, because eighty is not a plan, eighty is a hope wearing a plan''s coat.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001100003','b4200000-0000-0000-0000-000000000017',3,'Ninety Seconds Blind','The night of, everything ran clean until the gallery. Renna went into the dark section on schedule and my screens lost her and my comms lost her and the van went very quiet.',141,1,true, now() - interval '128 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001100003','The night of, everything ran clean until the gallery. Renna went into the dark section on schedule and my screens lost her and my comms lost her and the van went very quiet. Ninety seconds. i had counted it out a hundred times in the planning and it had always been a number. now it was a thing happening to me. i could see the rest of the board, Castle by the south door, Mholi on the roof, the guard patrol i was steering away from them with little timed distractions, and in the middle of the board was a hole shaped like my friend and i could not see into it. i did the only thing the van lets you do. i kept the rest of them alive. i steered the patrol. i watched Castle''s exit. i counted. and at sixty seconds, with thirty still to run, a silent alarm i had never seen in any of my Halvers schematics lit up my board, and it was not near Renna, it was near Castle, and i had two friends in danger and one voice and the clock did not care which of them i loved more.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001100004','b4200000-0000-0000-0000-000000000017',4,'The Choice','i warned Castle. that is the decision and i am not going to dress it up. Renna was blind and unreachable and a warning would not have reached her anyway.',58,1,true, now() - interval '110 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001100004','i warned Castle. that is the decision and i am not going to dress it up. Renna was blind and unreachable and a warning would not have reached her anyway, and Castle was reachable, and you spend the voice where the voice can do something. it is the correct call. i have run it forty more times since and it is correct every time. that has never once made it feel like anything other than choosing.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001100005','b4200000-0000-0000-0000-000000000017',5,'After','Renna came out at eighty-six seconds, on her own, no voice, no board, just her. She had felt the gallery go wrong and gotten herself clear. She did not need me.',54,1,true, now() - interval '88 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001100005','Renna came out at eighty-six seconds, on her own, no voice, no board, just her. She had felt the gallery go wrong and gotten herself clear. She did not need me. In the van afterward i could not stop shaking and Renna climbed in and saw it and did not ask. She just sat down next to me, close, the way you sit next to someone who held your life for ninety seconds and never told you how heavy it was. We don''t write the van enough. The van is the whole job.')
on conflict (chapter_id) do nothing;


-- =====================================================================
-- STORY 18 - fanfiction - Esi Mensah
-- =====================================================================
insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b4200000-0000-0000-0000-000000000018','b4100000-0000-0000-0000-000000000018','Starcrossed Academy: Late Bloomer','starcrossed-academy-late-bloomer','my first fic!! set in the Starcrossed Academy universe. about a student who gets into the famous pilot school two years late and everyone already knows each other. be nice pls',NULL,'fanfiction','{"starcrossed-academy","school","friendship"}','ongoing',false,5600,470, now() - interval '19 days', now() - interval '2 days')
on conflict (id) do nothing;
update public.stories set cover_color='#6e3a2d' where id='b4200000-0000-0000-0000-000000000018';

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001200001','b4200000-0000-0000-0000-000000000018',1,'Two Years Late','The thing nobody warns you about transferring into Starcrossed Academy two years late is that everyone already has their seat. Not just in the classroom. Everywhere.',139,1,true, now() - interval '19 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001200001','The thing nobody warns you about transferring into Starcrossed Academy two years late is that everyone already has their seat. Not just in the classroom. Everywhere. In the mess hall. On the simulator rotation. In the little jokes people make that go back to a first-year trip you weren''t on. Dario stood in the doorway of the third-year flight hall holding his transfer slip and watched forty students who all knew each other turn to look at the one who didn''t. He had dreamed about Starcrossed since he was small. He had the scores. He had earned the seat the hard way, the late way, the way that meant two extra years of qualifying exams while the others were already flying. And now he was here and it turned out the seat came with a room and a schedule but not, it seemed, with a single person who would save him a place at a table. He found an empty one. He sat at it. He told himself empty was fine. He was not very convincing, even to himself.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001200002','b4200000-0000-0000-0000-000000000018',2,'The Simulator','First flight assessment was the simulator and Dario found out fast that being good on paper and being good in the chair are two different countries with a hard border.',141,1,true, now() - interval '14 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001200002','First flight assessment was the simulator and Dario found out fast that being good on paper and being good in the chair are two different countries with a hard border. The other third-years had two years of stick time. They flew like the simulator was a part of their body. Dario flew like a very smart person operating a machine, which is not the same thing, and the instructor''s face told him so without a word. He came out of the pod with his ears burning. And that was when a girl he didn''t know, who he would later learn was called Nyx and who was famous in the year for being the best and the rudest, leaned against the pod frame and said, you fly like you''re scared of breaking it. Dario said he wasn''t scared. Nyx said, then you fly like you''re scared of being seen breaking it, which is worse, and that is fixable but only if you stop sitting alone at lunch like a tragedy.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001200003','b4200000-0000-0000-0000-000000000018',3,'Lunch','So the next day Dario did the bravest thing of his time at the Academy so far, which was not a flight maneuver. It was carrying his tray over to a table that already had people at it.',137,1,true, now() - interval '8 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001200003','So the next day Dario did the bravest thing of his time at the Academy so far, which was not a flight maneuver. It was carrying his tray over to a table that already had people at it. Nyx''s table. She had told him to and he was fairly sure she had half meant it as a dare, expecting him to chicken out, and so the look on her face when he actually set the tray down was worth the entire terrifying walk across the mess hall. The others at the table were Kembe, who never stopped talking, and a quiet one called Roan who just nodded at him. Nobody made room exactly. But nobody told him to leave either, and Kembe immediately asked him a question about his transfer exams, the long horrible exams, and actually listened to the answer, and Dario felt something in his chest that he had not felt since the acceptance letter, which was the sense of a seat being made rather than found.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001200004','b4200000-0000-0000-0000-000000000018',4,'Stick Time','Nyx made good on the rude promise. She started booking the simulator with him at the bad hours, the dawn slots nobody wanted, and drilling him.',56,1,false, now() - interval '4 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001200004','Nyx made good on the rude promise. She started booking the simulator with him at the bad hours, the dawn slots nobody wanted, and drilling him. She was not a kind teacher. She was a clear one, which Dario was learning was rarer and better. Stop thinking the maneuver, she kept saying, the maneuver is already in you, you did the exams, just let your hands believe it. On the ninth dawn, for about four seconds, his hands believed it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b4300000-0000-0000-0000-000001200005','b4200000-0000-0000-0000-000000000018',5,'The Pairs Assessment','Then the term schedule posted the pairs assessment, where every third-year flies a two-seat run with a partner, and the partners are assigned by rank.',60,1,false, now() - interval '2 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b4300000-0000-0000-0000-000001200005','Then the term schedule posted the pairs assessment, where every third-year flies a two-seat run with a partner, and the partners are assigned by rank. Top of the year with bottom of the year. Dario, two years late, scared of being seen, was the bottom of the year. He read the pairing list and found his name and read the name beside it twice. Nyx. Top of the year. Of course. She found him in the corridor, already grinning, already insufferable. Try not to fly like a tragedy, she said. But she said it gently.')
on conflict (chapter_id) do nothing;


-- ==================== seed_parts/batch5_drama_poetry.sql ====================

-- NovelStack launch seed data
-- Batch 5: DRAMA / POETRY / OTHER
-- 14 authors, 14 stories, one story per author

-- =====================================================================
-- AUTHOR 01
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-01@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Mara Olsztyn"}')
on conflict (id) do nothing;
update public.users set username='m.olsztyn', display_name='Mara Olsztyn', role='writer', is_verified=true, bio='Drama mostly. I write the kitchen-table kind.', date_of_birth='1986-03-14' where id='b5100000-0000-0000-0000-000000000001';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000001','b5100000-0000-0000-0000-000000000001','The Long Drive Back','the-long-drive-back','Three sisters share a car from the funeral to the family house. Nobody wants to talk about the will, so they talk about everything else instead.','#6B4F3A','drama','{"family","grief","siblings","slow-burn"}','ongoing',false,48213,2104, now() - interval '212 days', now() - interval '6 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000100001','b5200000-0000-0000-0000-000000000001',1,'Petrol Station, 9:40am','Renata took the wheel because nobody argued, and that was the first thing wrong. We always argued. Outside the petrol station the sky had the flat white look',182,1,true, now() - interval '212 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000100001','Renata took the wheel because nobody argued, and that was the first thing wrong. We always argued. Outside the petrol station the sky had the flat white look it gets before it can''t decide on rain. Klara bought three coffees and a packet of those biscuits Dad liked, the pink ones, and she didn''t say why and we didn''t ask. I sat in the back with my coat still on. It smelled of the church. Renata adjusted the mirror twice, then a third time, like the road behind us was something she had to keep checking on. We had four hours. Four hours and a house at the end of it with his coat still on the hook and the will in a drawer that Klara had a key to and the rest of us didn''t. I thought, we could just drive past it. We could keep going. I didn''t say that either.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000100002','b5200000-0000-0000-0000-000000000001',2,'The Roundabout Argument','It started over a roundabout, of all things. Renata took the wrong exit and Klara said nothing, which was worse than saying something, and I watched the back of',171,1,true, now() - interval '198 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000100002','It started over a roundabout, of all things. Renata took the wrong exit and Klara said nothing, which was worse than saying something, and I watched the back of Klara''s neck go tight. Five more minutes, Renata said. It''s fine. It''s not a competition. Nobody said it was a competition, Klara said, in the voice she uses when it absolutely is one. I leaned my head on the window. The fields went by the way fields do, all the same and somehow never the same twice. I thought about telling them what Dad said to me in March, the thing in the hospital corridor when the machine was beeping and he held my wrist too hard. I had been carrying it for two months. It felt like a coin I''d swallowed. But you can''t hand someone a thing like that on a motorway. You need a kitchen for it. You need the kettle on.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000100003','b5200000-0000-0000-0000-000000000001',3,'Services','We stopped at the services because Klara needed the toilet and Renata needed a cigarette she pretended she didn''t smoke. I stayed in the car. The car park was',158,1,true, now() - interval '180 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000100003','We stopped at the services because Klara needed the toilet and Renata needed a cigarette she pretended she didn''t smoke. I stayed in the car. The car park was half empty and a man was teaching a small girl to walk between two cars, holding both her hands above her head so she dangled and laughed. I watched them for a long time. When Renata came back she smelled of smoke and mint and she got in and didn''t start the engine. She just sat there with her hands at ten and two on a parked car. Do you think he was happy, she said. I didn''t answer fast enough and she said never mind, forget it, and turned the key.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000100004','b5200000-0000-0000-0000-000000000001',4,'The Key','Klara had the key to the drawer. She mentioned it the way you mention weather. The road narrowed and the hedges got higher and I realised we were nearly there.',62,1,false, now() - interval '40 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000100004','Klara had the key to the drawer. She mentioned it the way you mention weather, lightly, looking out the window. The road narrowed and the hedges got higher and I realised we were nearly there. Renata''s hands tightened. I thought, here it comes, the part nobody rehearsed. The house appeared at the bend, smaller than I remembered, the way houses always are.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000100005','b5200000-0000-0000-0000-000000000001',5,'His Coat','The coat was on the hook. We all saw it at the same time and nobody moved to take it down. Klara put the kettle on. That, at least, we knew how to do.',58,1,false, now() - interval '6 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000100005','The coat was on the hook. We all saw it at the same time and nobody moved to take it down. Klara put the kettle on. That, at least, we knew how to do. Renata sat at the table and put both palms flat on the wood. I have to tell you something, I said. The kettle started its noise. They both looked at me.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 02
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-02@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Devon Achebe"}')
on conflict (id) do nothing;
update public.users set username='draftsfolder', display_name='Devon Achebe', role='writer', is_verified=false, bio='posting stuff from the drafts folder before i lose my nerve', date_of_birth='1998-11-02' where id='b5100000-0000-0000-0000-000000000002';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000002','b5100000-0000-0000-0000-000000000002','Closing Shift','closing-shift','A diner that never quite closes, and the people who keep ending up at the counter at 2am. Each chapter is one night.','#2E3A4D','drama','{"working-class","lonely-people","city","character-study"}','ongoing',false,12907,544, now() - interval '95 days', now() - interval '11 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000200001','b5200000-0000-0000-0000-000000000002',1,'The Man Who Orders Toast','He comes in at 2am and orders toast and a glass of milk and he reads the same newspaper every time, I think he carries it with him. Marisol calls him',164,1,true, now() - interval '95 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000200001','He comes in at 2am and orders toast and a glass of milk and he reads the same newspaper every time, I think he carries it with him. Marisol calls him the Professor but I don''t think he professes anything. I think he just can''t sleep and the diner is warm and we don''t make him leave. That''s most of what a diner is for, honestly. Warm, and nobody makes you leave. I bring him the toast. He always says thank you young man even though I''m thirty-four and going grey at the sides. The milk has to be cold, properly cold, he sent it back once and I wasn''t even annoyed, I just got him a colder one. You learn people. You learn that the toast isn''t about toast. He sat there till the sky went the colour of dishwater and then he folded his paper and left two pounds under the plate and a note that said see you and I have it still, in my apron, the note.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000200002','b5200000-0000-0000-0000-000000000002',2,'Two Girls and a Birthday','They came in still in the going-out clothes, glitter on one of them, and one was crying in the way that''s mostly about being tired. It was a birthday. You',152,1,true, now() - interval '78 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000200002','They came in still in the going-out clothes, glitter on one of them, and one was crying in the way that''s mostly about being tired. It was a birthday. You can tell. There''s a particular flatness to a birthday at 2am, when the party is over and it wasn''t enough. I gave them chips they didn''t order. On the house, I said, even though Greg would dock me, and Marisol gave me a look but Marisol always gives me a look. The crying one ate three chips and stopped crying. That''s the whole science of it. Nobody can cry and eat chips, the body won''t do both. The other one mouthed thank you over her friend''s head. Happy birthday, I said to the friend, and she laughed a wet laugh and said is it though, and I said it is now, it''s 2am, technically it''s the day after, you survived it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000200003','b5200000-0000-0000-0000-000000000002',3,'Greg Does the Books','Greg only comes in when the numbers are bad. He sat in the back booth with the laptop and the shoebox of receipts and he didn''t order anything, which is how I',146,1,true, now() - interval '60 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000200003','Greg only comes in when the numbers are bad. He sat in the back booth with the laptop and the shoebox of receipts and he didn''t order anything, which is how I knew. Greg always orders. When Greg doesn''t order, the diner is in trouble. I brought him coffee anyway and stood there a second too long and he looked up and said don''t, and I said don''t what, and he said don''t ask. So I didn''t ask. I wiped down tables that were already clean. Marisol caught my eye from the kitchen pass and did the little money rub with her fingers and I shrugged. Outside a bus went past empty and lit up like a fish tank. Three more years on the lease, I thought. Maybe.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000200004','b5200000-0000-0000-0000-000000000002',4,'The Professor Doesn''t Come','For nine nights the toast man didn''t come. I kept the milk cold anyway. Marisol said I was being morbid. I said I was being ready.',54,1,false, now() - interval '30 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000200004','For nine nights the toast man didn''t come. I kept the milk cold anyway. Marisol said I was being morbid. I said I was being ready. On the tenth night the door went at quarter past two and it was him, thinner, with a different coat. Sorry, he said, like he owed us. He didn''t owe us. I put the bread in.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000200005','b5200000-0000-0000-0000-000000000002',5,'Marisol''s Last Week','Marisol gave her notice on a Tuesday. She''d found day work, proper hours, a job where you see the sun. I was glad for her and I have not felt so',58,1,false, now() - interval '11 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000200005','Marisol gave her notice on a Tuesday. She''d found day work, proper hours, a job where you see the sun. I was glad for her and I have not felt so lonely in years, both at once, which is a thing the diner does to you. On her last night she made me a coffee instead of the other way round. Sat me down. Said, you should leave too, you know. I said somebody has to keep the milk cold.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 03
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-03@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Priya Lutterworth"}')
on conflict (id) do nothing;
update public.users set username='priyawrites', display_name='Priya Lutterworth', role='writer', is_verified=false, bio=null, date_of_birth='1991-07-26' where id='b5100000-0000-0000-0000-000000000003';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000003','b5100000-0000-0000-0000-000000000003','What the Neighbours Heard','what-the-neighbours-heard','A marriage falls apart in a thin-walled terrace, told only through what the people on either side overhear and assume. They are mostly wrong.','#7A2E3B','drama','{"marriage","unreliable-narrator","secrets","quiet"}','complete',true,33550,1488, now() - interval '240 days', now() - interval '54 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000300001','b5200000-0000-0000-0000-000000000003',1,'Number Forty-One','At number forty-one the Hendrys play music in the evenings, jazz, the slow kind, and we at thirty-nine had decided this meant they were happy. You decide things',176,1,true, now() - interval '240 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000300001','At number forty-one the Hendrys play music in the evenings, jazz, the slow kind, and we at thirty-nine had decided this meant they were happy. You decide things about a wall. You have to. You live so close to a wall that you make a person out of it, a whole household, and the music was our evidence. When the music stopped we noticed, the way you notice a clock you''d stopped hearing. It stopped on a Thursday. My husband said maybe the stereo''s broken. I said maybe. We are not the sort of people who knock. Nobody on this street is the sort of people who knock. So instead we listened harder, and listening harder is its own kind of trespass, I know that now. The wall gave us a man''s voice low and steady, going on and on, and a woman''s voice that came in short, like punctuation. We could not hear the words. We supplied them ourselves. That was our mistake, and we made it nightly.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000300002','b5200000-0000-0000-0000-000000000003',2,'The Other Side','On the far side of the Hendrys lives Mr Okonkwo, who is eighty and keeps the radio loud, and so heard a different marriage than we did. We compared notes once,',158,1,true, now() - interval '226 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000300002','On the far side of the Hendrys lives Mr Okonkwo, who is eighty and keeps the radio loud, and so heard a different marriage than we did. We compared notes once, by the bins, the way you do when a thing has gone on long enough that even reserved people break. He said the wife was the loud one, that he heard her crying through the radio, which is a lot of crying to get through a radio. I said no, it was the husband who went on and on. We stood there with our recycling and could not agree on a single fact about the people we both lived against. He said, you know we could be wrong. I said I know. Neither of us did anything with that knowledge. We took our bins in. The jazz did not come back.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000300003','b5200000-0000-0000-0000-000000000003',3,'A Removal Van','The van came on a Saturday. We watched from behind the nets, all of us, the whole street, and not one of us went out to help or to say anything at all,',150,1,true, now() - interval '200 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000300003','The van came on a Saturday. We watched from behind the nets, all of us, the whole street, and not one of us went out to help or to say anything at all, which I think about now more than I would like to. It was only her things, we worked out. Half a house. He stood in the doorway and did not lift anything. She directed two men in matching shirts. At one point she stopped on the path and looked up, straight at our window, and I stepped back so fast I knocked the lamp. She could not have seen me. The nets are good nets. But for a moment we had looked at each other, the woman I had invented and the woman I actually was, and I felt found out.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000300004','b5200000-0000-0000-0000-000000000003',4,'What He Said by the Bins','Months later the husband spoke to me. By the bins, of course. Everything important on this street happens within reach of the bins.',60,1,false, now() - interval '120 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000300004','Months later the husband spoke to me. By the bins, of course. Everything important on this street happens within reach of the bins. He said, you must have heard all of it. I said we heard almost none of it, honestly. He looked at me like I had let him down. He had wanted to be heard. That was the thing the wall never told us. He had wanted, the whole time, to be heard.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000300005','b5200000-0000-0000-0000-000000000003',5,'New Tenants','In autumn a young couple moved into forty-one. They are quiet. No jazz, no shouting, nothing. And I find I cannot stand it.',56,1,false, now() - interval '54 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000300005','In autumn a young couple moved into forty-one. They are quiet. No jazz, no shouting, nothing. And I find I cannot stand it. A silent wall is worse than a loud one. With a loud one you at least get to be wrong about something. With a silent one you are alone with your own house, and your own husband, and the long careful quiet the two of you have built and called peace.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 04
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-04@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Tomasz Reed"}')
on conflict (id) do nothing;
update public.users set username='xX_quiet_Xx', display_name='Tomasz Reed', role='writer', is_verified=false, bio='17. writing is the only class i dont skip', date_of_birth='2008-09-09' where id='b5100000-0000-0000-0000-000000000004';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000004','b5100000-0000-0000-0000-000000000004','Detention Room 4B','detention-room-4b','five kids stuck in detention every friday. thats it thats the story. they hate each other and then they dont.','#3F6B4E','drama','{"high-school","friendship","teen","ensemble"}','ongoing',false,8821,392, now() - interval '63 days', now() - interval '4 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000400001','b5200000-0000-0000-0000-000000000004',1,'Week One','The thing about detention is its always the same five people and you all pretend not to know that. Mr Calloway sat at the front marking papers and didnt even',155,1,true, now() - interval '63 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000400001','The thing about detention is its always the same five people and you all pretend not to know that. Mr Calloway sat at the front marking papers and didnt even look up. There was the loud one, Bex, who got detention for arguing, which is funny because arguing is just talking and they put you in a room for it. There was Dre who never said why he was there. There was Saskia who cried the first time and then never again. There was the new kid whose name I didnt learn for three weeks because nobody talked. And there was me. I had a book but I didnt read it, I just held it, because a book is a good thing to hold when you dont want anyone to talk to you. The clock in 4B is broken. It says ten past four forever. I think thats kind of perfect actually for a detention room.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000400002','b5200000-0000-0000-0000-000000000004',2,'Bex Starts Talking','It was Bex who broke first because of course it was. She said this is so boring im going to die and Saskia said no youre not and that was the first time',148,1,true, now() - interval '50 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000400002','It was Bex who broke first because of course it was. She said this is so boring im going to die and Saskia said no youre not and that was the first time anyone answered anyone. Mr Calloway said quiet please without looking up. So we did the thing where you talk but quiet, leaning, passing it down the desks like a note. Bex asked everyone what they got done for. Dre said skipping. The new kid said nothing and we let him. I said I told a teacher something I shouldnt have said in the tone I said it in. Bex laughed, not mean, and said welcome to the club thats basically all of us. And it felt, I dont know. It felt like the room got slightly warmer which it definitely did not because the radiator in 4B doesnt work either.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000400003','b5200000-0000-0000-0000-000000000004',3,'Dre','I found out why Dre skips. He told me by the lockers not even in detention. His mum works two jobs and his little sister cant get herself to school so he',58,1,true, now() - interval '34 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000400003','I found out why Dre skips. He told me by the lockers not even in detention. His mum works two jobs and his little sister cant get herself to school so he walks her, and the walk makes him late, and being late enough is the same as skipping apparently. He shrugged when he told me like it was nothing. It was not nothing. I didnt know what to say so I said your sister is lucky and he looked at me weird and then said yeah okay.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000400004','b5200000-0000-0000-0000-000000000004',4,'The New Kid Has a Name','His name is Felix. He told us week four. He said it really quiet like it cost him something. Bex said cool and didnt make it a thing and I think thats',56,1,false, now() - interval '18 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000400004','His name is Felix. He told us week four. He said it really quiet like it cost him something. Bex said cool and didnt make it a thing and I think thats the kindest I have ever seen Bex be. Felix moved schools because of stuff he didnt say. We didnt ask. Detention room 4B is good at not asking. Its maybe the only thing its good at.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000400005','b5200000-0000-0000-0000-000000000004',5,'Friday Without Detention','Half term meant no Friday detention and it was weird. Bex texted the group chat we made. she said anyone want to just. and didnt finish the sentence. we all',54,1,false, now() - interval '4 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000400005','Half term meant no Friday detention and it was weird. Bex texted the group chat we made. she said anyone want to just. and didnt finish the sentence. we all knew the end of it though. We met at the broken bench by the shops which is basically detention room 4B but outside. Felix came. Even Felix came. Dre brought his sister.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 05
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-05@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Helena Brandt"}')
on conflict (id) do nothing;
update public.users set username='h.brandt', display_name='Helena Brandt', role='writer', is_verified=false, bio='Retired teacher. Writing the things I couldn''t say in the staff room.', date_of_birth='1959-01-30' where id='b5100000-0000-0000-0000-000000000005';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000005','b5100000-0000-0000-0000-000000000005','The Allotment','the-allotment','After Bill dies, Eileen keeps going to his allotment because she does not know how to stop. The other plot-holders watch, and slowly, do not let her be alone.','#5B6E2A','drama','{"grief","old-age","community","gardening"}','complete',false,21044,977, now() - interval '270 days', now() - interval '88 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000500001','b5200000-0000-0000-0000-000000000005',1,'Plot Seventeen','For forty years plot seventeen had been Bill''s, and Eileen had been the woman who brought the flask at eleven. That was the arrangement and it had suited them. Now',180,1,true, now() - interval '270 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000500001','For forty years plot seventeen had been Bill''s, and Eileen had been the woman who brought the flask at eleven. That was the arrangement and it had suited them. Now Bill was three weeks in the ground and the runner beans did not know it. They went on. That was the cruelty and also, she would think later, the mercy of them. She came on the Tuesday because Tuesday was a flask day, and she stood at the gate with the flask in both hands and could not make her feet go in. The beans needed water. She could see from the gate that they needed water. A plant does not attend the funeral. A plant simply asks, and asks, and Bill was not there to answer, and so she went in, finally, and answered for him. The watering can was where he always left it. Of course it was. He had not known he would not be back to move it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000500002','b5200000-0000-0000-0000-000000000005',2,'Mr Davies and the Marrow','Mr Davies on plot eighteen had not spoken to Bill in nine years on account of a marrow, a competition marrow, and a judging decision both men had taken to',166,1,true, now() - interval '255 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000500002','Mr Davies on plot eighteen had not spoken to Bill in nine years on account of a marrow, a competition marrow, and a judging decision both men had taken to their separate graves of grievance. Eileen knew the whole stupid history of it. She had heard Bill recite it like scripture. So when Mr Davies appeared at the fence between the plots with his cap in his hands she braced herself for something cold. He said, the soil that end goes hard, you''ll want to fork it before you water or it just runs off. Then he said, Bill knew that. He''ll have told you. And she understood that this was Mr Davies grieving, in the only grammar Mr Davies owned, which was the grammar of soil. She said thank you, Mr Davies. He put his cap back on and went away and she forked the hard end before she watered, and it did not run off, and she cried into the fork.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000500003','b5200000-0000-0000-0000-000000000005',3,'The Committee Letter','A letter came from the allotment committee. It was about the tenancy, who the plot was in the name of, and it used the word deceased, which Eileen had not yet',158,1,true, now() - interval '230 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000500003','A letter came from the allotment committee. It was about the tenancy, who the plot was in the name of, and it used the word deceased, which Eileen had not yet seen in print and did not enjoy seeing. There was a waiting list, the letter explained, kindly, in the way committees are kind, which is to say in a way that still ends with you off the list. She put the letter on the kitchen table and looked at it across two dinners. Then Sandra from plot four knocked. Sandra ran the committee. Sandra said, put your own name on it, Eileen, that''s all the letter''s asking, it''s a formality, the plot stays yours as long as you want it. Eileen had not known you were allowed to want it. She had thought wanting the plot had been Bill''s job, like the bins, like the car.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000500004','b5200000-0000-0000-0000-000000000005',4,'The Show','In August there was the show, the one Bill always entered. Eileen had not meant to enter anything. The form was in her bag because Sandra had put it there.',62,1,false, now() - interval '160 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000500004','In August there was the show, the one Bill always entered. Eileen had not meant to enter anything. The form was in her bag because Sandra had put it there, the way you slip a coat onto a child who insists they are not cold. She entered the runner beans. Bill''s beans, really, on his canes, but she had watered them every single day, and she found she could call them hers.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000500005','b5200000-0000-0000-0000-000000000005',5,'Second Place','The beans took second. Mr Davies took first, with a marrow. He came over afterwards, cap in hand again, and stood a while before he said anything.',64,1,false, now() - interval '88 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000500005','The beans took second. Mr Davies took first, with a marrow. He came over afterwards, cap in hand again, and stood a while before he said anything. He said, your Bill would have made a noise about this. The marrow. He''d have written to the paper. Then Mr Davies, who had not laughed near plot seventeen in nine years, laughed, and Eileen laughed, and the nine years just sort of stopped being there.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 06
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-06@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Junie Park"}')
on conflict (id) do nothing;
update public.users set username='slow.mornings', display_name='Junie Park', role='writer', is_verified=false, bio='poems mostly. some prose when i cant help it.', date_of_birth='1995-04-18' where id='b5100000-0000-0000-0000-000000000006';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000006','b5100000-0000-0000-0000-000000000006','Inventory of a Small Apartment','inventory-of-a-small-apartment','A poem for every object left behind after a breakup. The kettle, the second toothbrush, the chair nobody sat in.','#8A6D3B','poetry','{"breakup","domestic","free-verse","quiet"}','ongoing',false,9655,612, now() - interval '140 days', now() - interval '9 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000600001','b5200000-0000-0000-0000-000000000006',1,'The Kettle','It still clicks off / two minutes early, the way / it learned from you — / you never could wait / for a full boil, you said / nearly is the same as done.',128,1,true, now() - interval '140 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000600001','It still clicks off
two minutes early, the way
it learned from you —
you never could wait
for a full boil, you said
nearly is the same as done.

So now I drink it nearly.
Tea the temperature
of a held breath,
of a room someone just left.

I have read the manual.
There is a setting for this,
a small grey dial
that would teach the kettle
to forget you.

I have not turned it.

I tell myself
this is laziness.
It is not laziness.
It is the last appliance
in the flat
that still does something
the way you wanted,
and I am not ready
for a kitchen
that has never met you,

not yet,
not while the windows
still go dark
at the hour
you used to come home.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000600002','b5200000-0000-0000-0000-000000000006',2,'The Second Toothbrush','I keep meaning to throw it out. / Blue, frayed at one corner, / standing in the cup / like a guest who has not been told',132,1,true, now() - interval '120 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000600002','I keep meaning to throw it out.
Blue, frayed at one corner,
standing in the cup
like a guest who has not been told
the party ended.

Mine leans away from it.
I did not arrange this.
Plastic finds its own grief.

A toothbrush is the most
honest thing you can leave.
It says: I was here
twice a day. It says:
I expected to come back.

I have thrown out
your letters, the playlist,
the photo from the pier.
Big things. Loud things.
Easy, almost, the big things —
they announce themselves,
they ask to be grieved.

It is the small blue object
by the tap
that catches me,
mid-morning, ordinary,
holding my own brush
and finding I have started,
without deciding to,
to cry over plastic,
over the worn place
where your thumb went,
over how a body leaves
a shape in everything
it touched on the way out.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000600003','b5200000-0000-0000-0000-000000000006',3,'The Chair Nobody Sat In','We bought it for the company / we were going to have. / The good company, the long evenings, / the friends who would say what a lovely flat.',124,1,true, now() - interval '95 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000600003','We bought it for the company
we were going to have.
The good company, the long evenings,
the friends who would say what a lovely flat.

It is the colour of a decision
made together,
mustard, which neither of us
would have chosen alone,
which is how I know
it was really ours.

Nobody ever sat in it.
We sat on the sofa, side by side,
saving the chair
for a future
that turned out
to be a kind of furniture itself —
something we owned
and did not use.

Now I sit in it
every night, deliberately,
the way you take a medicine.
It is not comfortable.
It was never meant
to hold one person.

But somebody should sit
in the future we bought.
Somebody should
wear it down.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000600004','b5200000-0000-0000-0000-000000000006',4,'The Spare Key','Still on its hook. / Still labelled, in your hand, / FLAT — as if I might forget / which door my life is behind.',58,1,false, now() - interval '40 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000600004','Still on its hook.
Still labelled, in your hand,
FLAT — as if I might forget
which door my life is behind.

You did not ask for it back.
I did not offer.
It hangs there, small and brass,
a question
neither of us
will be the one to answer,

a key
to a lock
you have already, quietly,
stopped being able to open.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000600005','b5200000-0000-0000-0000-000000000006',5,'The Window, Finally','This is not an object. / I know that. / But it is the last entry. / The window faces east and so does this poem.',64,1,false, now() - interval '9 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000600005','This is not an object.
I know that.
But it is the last entry.
The window faces east and so does this poem.

This morning the light came in
and found the flat
already mine,
fully mine,
the kettle reset,
the toothbrush gone,
the chair worn soft
in the shape of one.

I made tea
and waited
for the full boil.
It is a long time, a full boil.
I had it.
I had the time.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 07
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-07@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Garrett Mwangi"}')
on conflict (id) do nothing;
update public.users set username='gmwangi', display_name='Garrett Mwangi', role='writer', is_verified=false, bio=null, date_of_birth='1983-12-05' where id='b5100000-0000-0000-0000-000000000007';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000007','b5100000-0000-0000-0000-000000000007','Visiting Hours','visiting-hours','A father and a son who have not spoken in eleven years are forced into the same hospital room — not as patients, but as the only two people willing to sit with the man they both can''t forgive.','#4A4A55','drama','{"father-son","estrangement","hospital","forgiveness"}','paused',true,17320,701, now() - interval '155 days', now() - interval '47 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000700001','b5200000-0000-0000-0000-000000000007',1,'Bed Nine','My son was already in the chair when I got there. He had the good chair, the one with arms. I took the plastic stacking one and we both looked at Grandad',172,1,true, now() - interval '155 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000700001','My son was already in the chair when I got there. He had the good chair, the one with arms. I took the plastic stacking one and we both looked at Grandad in bed nine because looking at Grandad meant not looking at each other. Eleven years. You''d think after eleven years there''d be a speech ready, polished, kept in a drawer. There isn''t. There''s just a plastic chair and a man between you who can''t hear either of you and that''s almost a relief. The ward smelled of toast and antiseptic. A machine counted something. My son had grown a beard I didn''t know about and that small fact, the beard, did something to me I wasn''t prepared for in a public ward at four in the afternoon. He''d become a man on his own. Without my permission. Without my help. I said, has the doctor been round. He said, this morning. That was the whole conversation. It lasted the length of the conversation.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000700002','b5200000-0000-0000-0000-000000000007',2,'The Vending Machine','He went for coffee and came back with two, which I had not expected, and held one out without looking at me, the way you''d feed something you weren''t sure',164,1,true, now() - interval '140 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000700002','He went for coffee and came back with two, which I had not expected, and held one out without looking at me, the way you''d feed something you weren''t sure of. It was terrible coffee. We both drank it like it mattered. Grandad slept. The man in bed eleven had a lot of visitors and they were loud and grateful and it made our silence look worse by comparison, like a stain you only notice next to something white. My son said, out of nowhere, he hit you too, didn''t he. Not a question really. I held the coffee. I said yes. He said, you never told me that. And I wanted to say I was protecting you, but the truth, the actual truth I''d been carrying eleven years, was that I''d been ashamed, and shame and protection wear the same coat, and I had let him think it was the coat of protection. I said, no. I didn''t tell you. I should have. The machine counted. He nodded, once, slow.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000700003','b5200000-0000-0000-0000-000000000007',3,'What Grandad Said','He woke for about forty minutes on the Thursday. Lucid, mostly. He looked at the two of us, me and my son, sat either side of him, and he smiled like',160,1,true, now() - interval '110 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000700003','He woke for about forty minutes on the Thursday. Lucid, mostly. He looked at the two of us, me and my son, sat either side of him, and he smiled like a man who thought he''d arranged this, like he''d done a clever thing. He said, look at that. Both of you. He didn''t know it had taken his own dying to do it. Or maybe he did know. He''d been a hard man and hard men aren''t stupid, that''s the trouble with them, you can''t even have the comfort of thinking they didn''t understand. He asked my son about the beard. He asked me nothing. That was the old arithmetic, still running, even now. My son answered him kindly, which I noticed, which I think Grandad noticed too, and something in the old man''s face loosened, and then he was tired again, and slept, and we sat there on either side of the loosened thing.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000700004','b5200000-0000-0000-0000-000000000007',4,'Car Park, Level 3','We ended up at our cars by accident, parked one row apart. Neither of us got in. The strip lights buzzed. He said, I''m not ready to forgive you. I said',64,1,false, now() - interval '47 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000700004','We ended up at our cars by accident, parked one row apart. Neither of us got in. The strip lights buzzed. He said, I''m not ready to forgive you. I said good, don''t, not before you mean it, I''ve had enough of things people did before they meant them. He almost smiled. He said, same time tomorrow then. It wasn''t forgiveness. It was an appointment. I''ll take an appointment.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 08
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-08@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Carrie Underdahl"}')
on conflict (id) do nothing;
update public.users set username='emwrites', display_name='Carrie Underdahl', role='writer', is_verified=false, bio='ex journalist. i write fast and edit never. sorry.', date_of_birth='1977-06-21' where id='b5100000-0000-0000-0000-000000000008';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000008','b5100000-0000-0000-0000-000000000008','The Understudy','the-understudy','Theresa has been the understudy for nine years. This is the season the lead finally falls ill, and Theresa discovers she is not sure she still wants the part.','#702A55','drama','{"theatre","ambition","middle-age","backstage"}','ongoing',false,14488,623, now() - interval '88 days', now() - interval '13 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000800001','b5200000-0000-0000-0000-000000000008',1,'Nine Years of Wings','You learn a strange profession when you understudy long enough. You learn the part perfectly and you learn, equally perfectly, not to want it, because wanting it',170,1,true, now() - interval '88 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000800001','You learn a strange profession when you understudy long enough. You learn the part perfectly and you learn, equally perfectly, not to want it, because wanting it every night for nine years would hollow a person out like a spoon does a melon. So I unlearned the wanting. I got good at the unlearning. I''d stand in the wings in the same costume as Diana, my mirror in a slightly cheaper fabric, and I''d watch her do the speech, my speech, her speech, and I''d feel — and this is the part nobody tells you — I''d feel nothing. A clean professional nothing. I''d go home and water my plants. Nine years. Then on a wet Tuesday in October Diana''s understudy got a phone call at half past six, and the understudy was me, and the phone call was the call, and I stood in my kitchen holding it and I waited for the wanting to come rushing back. It didn''t come. That was the first frightening thing.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000800002','b5200000-0000-0000-0000-000000000008',2,'Half-Hour Call','The stage manager kept saying are you alright Theresa and I kept saying yes and we were both lying in our separate directions. The dressing room was Diana''s',158,1,true, now() - interval '74 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000800002','The stage manager kept saying are you alright Theresa and I kept saying yes and we were both lying in our separate directions. The dressing room was Diana''s. Her photographs, her good-luck card from the director, her particular brand of cold cream that the whole company associates with her like a perfume. I sat at her mirror and put on her part''s face and I looked like a woman doing an impression of a job she used to apply for. Twenty years ago I would have wept with joy in that chair. Ten years ago I''d have been sick with nerves. Now I was just calm, horribly calm, the calm of a person who has discovered, far too late and in the worst possible room, that the thing she organised her whole life around has quietly stopped being the thing she wants. Beginners, said the tannoy. That means me, I thought. After nine years it actually, finally means me. And I went.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000800003','b5200000-0000-0000-0000-000000000008',3,'The First Act','I will tell you what happened in the first act, which is that I was good. Not transcendent. Good. Reliable. The audience did not know they''d been short-changed',150,1,true, now() - interval '55 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000800003','I will tell you what happened in the first act, which is that I was good. Not transcendent. Good. Reliable. The audience did not know they''d been short-changed and possibly they hadn''t been. I hit my marks. I found the laughs. And the whole time, underneath, a second voice was running like a stagehand muttering in the dark, and the second voice was saying: you could just not do this anymore. You could teach. You could move to the coast. The voice was not bitter. That was the unsettling thing. It was kind. It sounded like a friend who had been waiting nine years in the wings for ME, the way I had waited for the part, and was finally, gently, getting its call.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000800004','b5200000-0000-0000-0000-000000000008',4,'Notes','The director gave me notes afterwards. Good notes, generous ones. He said the run could be mine if Diana''s recovery was slow. He watched my face when he said it.',66,1,false, now() - interval '30 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000800004','The director gave me notes afterwards. Good notes, generous ones. He said the run could be mine if Diana''s recovery was slow. He watched my face when he said it, the way directors watch faces, professionally. He saw something. He said, that''s not the face of a woman being offered her dream. I said maybe the dream expired. He didn''t laugh. He said dreams don''t expire, Theresa, people just change addresses and forget to tell them.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000800005','b5200000-0000-0000-0000-000000000008',5,'Diana Calls','Diana telephoned from her sickbed, full of croaky apology, full of get-well-from-me energy aimed the wrong way. She asked how it had gone. I said honestly.',62,1,false, now() - interval '13 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000800005','Diana telephoned from her sickbed, full of croaky apology, full of get-well-from-me energy aimed the wrong way. She asked how it had gone. I said honestly. I told her about the kind voice in the wings. There was a long quiet on the line and then Diana, who I had stood behind for nine years, said: Theresa. I have heard that voice too. Every night. Why do you think I keep getting ill.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 09
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-09@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Nadia Abara"}')
on conflict (id) do nothing;
update public.users set username='n.abara', display_name='Nadia Abara', role='writer', is_verified=false, bio='social worker by day. writing what i''m allowed to', date_of_birth='1989-02-11' where id='b5100000-0000-0000-0000-000000000009';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000009','b5100000-0000-0000-0000-000000000009','The Foster Placement','the-foster-placement','A couple who cannot have children take in a nine-year-old for what is meant to be six weeks. It is not a story about saving anyone. Everyone here needs saving.','#3A5A6E','drama','{"foster-care","parenthood","childhood","tender"}','ongoing',true,19877,1033, now() - interval '175 days', now() - interval '8 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000900001','b5200000-0000-0000-0000-000000000009',1,'Six Weeks','They told us six weeks and we heard it the way you hear a weather forecast, as something that would simply be true. Marcus made up the small room. He''d been',176,1,true, now() - interval '175 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000900001','They told us six weeks and we heard it the way you hear a weather forecast, as something that would simply be true. Marcus made up the small room. He''d been making up that room, in his head, for years, after the third round failed and we stopped counting rounds. He''d bought a lamp shaped like a moon. I said don''t, it''s six weeks, don''t buy a moon for six weeks, and he said it''s a nice lamp, it''ll do for anyone, and we both knew that was not what the lamp was about. The boy arrived on a Sunday with a binbag and a backpack and a social worker who was kind and exhausted in the specific way of her job. His name was Reuben. He stood in our hallway and looked at our hallway like he was pricing it. Nine years old and already an appraiser of rooms, already a boy who knew that a hallway is temporary and you should not get attached to its lamps.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000900002','b5200000-0000-0000-0000-000000000009',2,'He Doesn''t Eat at the Table','For eleven days Reuben took his plate to his room. We''d been told not to fight the small things and so we didn''t fight it, but Marcus minded, I could see',162,1,true, now() - interval '160 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000900002','For eleven days Reuben took his plate to his room. We''d been told not to fight the small things and so we didn''t fight it, but Marcus minded, I could see him minding, the table he had wanted set for three sitting there set for two with a third place that nobody asked us to lay and we laid anyway. On the twelfth day Reuben came down with his plate already empty. He''d eaten upstairs, fast, and come down to be near us with nothing on the plate, which I understood and Marcus did not, and I had to explain it to Marcus later in bed in a whisper. He doesn''t trust the eating, I said. Eating where people watch is when bad things have happened to him. But the after, the empty plate, that part he wanted with us. Marcus was quiet a long time. Then he said, so we just have to wait to be the after. And I said yes. We have to be patient enough to be the after.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000900003','b5200000-0000-0000-0000-000000000009',3,'Week Six Arrives','Week six arrived the way the forecast said it would, except it did not bring the weather we''d been promised. The placement was extended. Reuben''s mum was not well',156,1,true, now() - interval '120 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000900003','Week six arrived the way the forecast said it would, except it did not bring the weather we''d been promised. The placement was extended. Reuben''s mum was not well enough, the social worker said, not yet, maybe not for a long time, and she said it gently and watched our faces for the things that show. I kept my face still. Marcus did not. Marcus''s face did a thing it had not done since the lamp, a complicated lift, hope and shame all tangled, because you are not supposed to be glad that a woman you have never met is still too unwell to take her son. But the gladness was there. It was in our kitchen. And Reuben was upstairs not knowing, doing his homework on the moon-lit floor, and I thought, we have to tell him in a way that doesn''t sound like winning. There is no way. I have not found the way.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000900004','b5200000-0000-0000-0000-000000000009',4,'The Drawing','Reuben left a drawing on the kitchen table. Four figures. A house. He had drawn himself smaller than he is and standing slightly apart, the way he stands.',66,1,false, now() - interval '60 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000900004','Reuben left a drawing on the kitchen table. Four figures. A house. He had drawn himself smaller than he is and standing slightly apart, the way he stands. Two of the figures were us, labelled, in his careful writing. The fourth figure had no label and stood furthest from the house. I knew who it was. Marcus knew. We did not move the drawing for three days. We let it be on the table where eating happens.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000900005','b5200000-0000-0000-0000-000000000009',5,'A Visit Is Arranged','His mum was well enough for a supervised visit. One hour, a contact centre, a room with soft toys that have been hugged by a hundred griefs. We drove him there.',64,1,false, now() - interval '8 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000900005','His mum was well enough for a supervised visit. One hour, a contact centre, a room with soft toys that have been hugged by a hundred griefs. We drove him there. He was quiet in the back, doing the appraiser thing again, pricing the journey. At the door he turned around and looked at us and said, you''ll be here after. Not a question. A thing he needed laid like a place at a table. We said yes. We''ll be the after. We always have been.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 10
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-10@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Eddie Voss"}')
on conflict (id) do nothing;
update public.users set username='eddiev_drafts', display_name='Eddie Voss', role='writer', is_verified=false, bio=null, date_of_birth='2001-10-22' where id='b5100000-0000-0000-0000-000000000010';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000010','b5100000-0000-0000-0000-000000000010','Last Bus','last-bus','Two strangers miss the last bus on a cold night and spend four hours waiting for the first one. they talk because there is nothing else to do. its messy and i havent edited it much.','#2A4A4A','drama','{"strangers","one-night","dialogue","city"}','ongoing',false,6210,278, now() - interval '42 days', now() - interval '15 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000a00001','b5200000-0000-0000-0000-000000000010',1,'00:47','We watched the bus pull away together which is a stupid way to meet someone. She swore. I didnt say anything because I had been about to swear too and it felt',158,1,true, now() - interval '42 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000a00001','We watched the bus pull away together which is a stupid way to meet someone. She swore. I didnt say anything because I had been about to swear too and it felt like she had done it for both of us. The next one was 04:50. Four hours. The bus shelter had three sides and one of them was broken so really it had two and a half sides and it was October. She sat on the cold bench and looked at her phone and I stood and looked at mine and we did the phone thing for maybe twenty minutes which is the modern way of pretending youre alone when youre not. Then her phone died. I watched her watch it die. She put it in her pocket really slowly. And then there was just her and me and the half shelter and four hours and she said, well, and I said, yeah, and that was the start of it, the whole night, that tiny stupid exchange. Well. Yeah.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000a00002','b5200000-0000-0000-0000-000000000010',2,'01:30','She told me her name was Priya and I told her mine and then we both kind of agreed without saying it that names didnt matter much tonight. She was coming back',150,1,true, now() - interval '36 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000a00002','She told me her name was Priya and I told her mine and then we both kind of agreed without saying it that names didnt matter much tonight. She was coming back from a thing. I didnt push. People say a thing when the thing was bad. I was coming back from my brothers and I said that and she said how was that and I said a thing and she actually laughed, the first real laugh, and it changed the temperature of the shelter, I swear it did. We talked about the worst jobs we ever had. She won. She had once worked in a call centre selling funeral plans to people who didnt want to think about funerals and she did an impression of her own sales voice that was so bleak and so funny I had to sit down on the cold bench. 02:00 came and went and I didnt even notice it which after the bus thing felt like a small miracle.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000a00003','b5200000-0000-0000-0000-000000000010',3,'03:15','It got properly cold around three. The kind of cold that gets bored of your coat. We had stopped talking for a bit, not a bad stop, just a rest, and then she',62,1,true, now() - interval '24 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000a00003','It got properly cold around three. The kind of cold that gets bored of your coat. We had stopped talking for a bit, not a bad stop, just a rest, and then she said the thing she was coming back from was her dad. He''d been moved into a home that day. She said it flat, looking at the road. I didnt say sorry because sorry is a small coin. I said tell me one good thing about him. And she did. She talked for ages.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000a00004','b5200000-0000-0000-0000-000000000010',4,'04:50','The bus came. Obviously the bus came, buses always come eventually, thats the whole problem with buses. It was warm inside and too bright and it sort of',58,1,false, now() - interval '15 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000a00004','The bus came. Obviously the bus came, buses always come eventually, thats the whole problem with buses. It was warm inside and too bright and it sort of ended the night by force. We sat together because not sitting together would have been weird. She got off two stops before me. She didnt give me her number and I didnt ask and I think we both wanted it to just be the shelter, just the four hours, kept clean. I waved like an idiot.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 11
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-11@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Solveig Marsh"}')
on conflict (id) do nothing;
update public.users set username='solveig.m', display_name='Solveig Marsh', role='writer', is_verified=false, bio='translator. these poems started as exercises and got out of hand', date_of_birth='1972-08-08' where id='b5100000-0000-0000-0000-000000000011';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000011','b5100000-0000-0000-0000-000000000011','Field Notes for a Long Marriage','field-notes-for-a-long-marriage','Forty years in short poems. Not romantic. Accurate. A wife keeps a record the way a botanist keeps a record.','#5A5A2E','poetry','{"marriage","ageing","love","observation"}','complete',false,11302,704, now() - interval '210 days', now() - interval '70 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000b00001','b5200000-0000-0000-0000-000000000011',1,'Specimen: Year One','I had expected a flame. / They had all promised a flame. / What arrived instead was weather —',130,1,true, now() - interval '210 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000b00001','I had expected a flame.
They had all promised a flame.
What arrived instead was weather —

a climate, daily,
that I had to dress for,
that did not consult me,

that could turn
between the kitchen and the stairs.

Year one I kept
catching myself surprised.
I had married, I realised,
a region, not a fire,

and you cannot warm
your hands at a region.
You can only learn
which way its wind comes from,

and build the house
with that wall thickest,
and call the building of it,
later, looking back,

a kind of love —
though year one
I had no such word for it,
year one I only stood

at the window of us
watching the front move in,
not yet aware
that I would spend

four decades
becoming fluent
in one man''s sky.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000b00002','b5200000-0000-0000-0000-000000000011',2,'Specimen: The Argument, Recurring','We have had this argument / so many times / it has worn a path. / We could find it in the dark, and do.',136,1,true, now() - interval '180 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000b00002','We have had this argument
so many times
it has worn a path.
We could find it in the dark, and do.

It is about nothing.
It has always been about nothing —
the nothing is essential,
the nothing is load-bearing.

If it were about something
we would have to solve it
and then what would we walk,
the two of us, on the bad evenings,

what groove would hold us
when the day has gone wrong
and neither of us
did the wronging?

So we keep it.
We tend it like a hedge.
You take your usual line.
I take mine. The words

are so old they have gone
soft in the mouth, like stones
a river has been working
since before the children.

And at the end of it
we are tired, and known,
and have proved once more
the path is still there,

still ours,
still leads back
to the same lit room,
the same two chairs.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000b00003','b5200000-0000-0000-0000-000000000011',3,'Specimen: His Hands, Year Thirty-Eight','I watched you fail, today, / at the lid of a jar. / You who opened every jar / of my adult life.',124,1,true, now() - interval '140 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000b00003','I watched you fail, today,
at the lid of a jar.
You who opened every jar
of my adult life.

You did not ask for help.
You set it down
on the counter, quietly,
and moved to another task

as if the jar
had not happened,
as if I had not seen,

and I let you.
That is the marriage —
I let you.

I opened it later,
alone, in the pantry,
with a tea towel
and an old trick,

and I did not call out
look, look what I managed,
the way I would have, young.

There is a tenderness
that has no words,
that is only
the not-saying,

that is a wife
in a pantry
opening a jar
in a silence
she is building
on purpose,

so that you
can stay,
a little longer,
the man who opens jars.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000b00004','b5200000-0000-0000-0000-000000000011',4,'Specimen: The Spare Room','We made it a spare room / the year the last child left. / Neither of us / proposed this. It simply',60,1,false, now() - interval '100 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000b00004','We made it a spare room
the year the last child left.
Neither of us
proposed this. It simply

accrued. A box, a chair,
the ironing board
that lives nowhere.
A room for things

without a home,
which is, I think,
also a definition
of a marriage —

the place the homeless things
of two long lives
are finally,
gently, kept.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000b00005','b5200000-0000-0000-0000-000000000011',5,'Specimen: Final Entry','The botanist closes the notebook. / Forty years of weather, pressed flat. / I did not love you / the way the songs prescribed.',62,1,false, now() - interval '70 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000b00005','The botanist closes the notebook.
Forty years of weather, pressed flat.
I did not love you
the way the songs prescribed.

I loved you the way
a coastline loves the sea —
worn, shaped, complaining,
permanent, and not

once, in forty years,
able to imagine
the one
without the other.

That is the specimen.
That is the whole find.
File it under: lasting.
File it under: enough.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 12
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-12@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Otto Greaves"}')
on conflict (id) do nothing;
update public.users set username='ottowritesnow', display_name='Otto Greaves', role='writer', is_verified=false, bio='experimental stuff, dont expect a plot', date_of_birth='1994-05-17' where id='b5100000-0000-0000-0000-000000000012';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000012','b5100000-0000-0000-0000-000000000012','The Complaints Department','the-complaints-department','A bureaucratic afterlife where the recently dead must file their grievances with existence in triplicate. Absurdist. Slightly fed up. Categorised as other because it refused all my other folders.','#6E4A2A','other','{"absurdist","afterlife","satire","weird"}','ongoing',false,7740,331, now() - interval '70 days', now() - interval '20 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000c00001','b5200000-0000-0000-0000-000000000012',1,'Take a Number','The afterlife, it turns out, has a ticketing system. I died on a Tuesday and was issued ticket 4,​400,​912 and a laminated card that said PLEASE DO NOT',168,1,true, now() - interval '70 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000c00001','The afterlife, it turns out, has a ticketing system. I died on a Tuesday and was issued ticket 4400912 and a laminated card that said PLEASE DO NOT FOLD, SPINDLE, OR REINCARNATE WHILE WAITING. The waiting room was beige in a way that felt deliberate, almost editorial, as if someone had auditioned several beiges and chosen the most disappointing. There were chairs. The chairs were the chairs of all waiting rooms everywhere, the platonic chair, slightly too low, slightly too hard, designed by someone who hated both sitting and standing equally. A woman next to me had been waiting, she said, since the Bronze Age. She had a thermos. I asked her what the complaint was, what we were all queuing to complain about, and she looked at me with the patience of four thousand years and said, dear, you''ll know it when the form asks. The form, she said, has a way of finding it. Then a number was called and it was not mine and the room sighed as one organism and resettled.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000c00002','b5200000-0000-0000-0000-000000000012',2,'Form 7C: Nature of Grievance','Form 7C arrived on its own, sliding under no door, because there were no doors, the afterlife having dispensed with doors as too optimistic. Section one asked for my',158,1,true, now() - interval '58 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000c00002','Form 7C arrived on its own, sliding under no door, because there were no doors, the afterlife having dispensed with doors as too optimistic. Section one asked for my name, which I knew. Section two asked for my dates, which I had to look up on the laminated card. Section three said: STATE YOUR GRIEVANCE WITH EXISTENCE. ATTACH EVIDENCE. CONTINUE ON A SEPARATE SHEET IF YOUR LIFE WAS LONG. I sat with the pen. The pen was government issue, the kind chained to a desk in a realm with no desks and no chains, which raised questions I chose not to pursue. I wrote, then crossed it out. I wrote, it was too short, then crossed that out, because the Bronze Age woman would scoff. I wrote, nobody told me it counted while it was happening. I looked at that sentence for a long time. Then I did not cross it out. The form, somewhere deep in its beige, seemed satisfied. A drawer I had not noticed opened, slightly, like an ear.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000c00003','b5200000-0000-0000-0000-000000000012',3,'The Clerk','My number was called in what may have been a year. The clerk had no face, exactly, but had the impression of one, the way a chair has the impression of a',150,1,true, now() - interval '40 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000c00003','My number was called in what may have been a year. The clerk had no face, exactly, but had the impression of one, the way a chair has the impression of a person who recently left it. It read my Form 7C without eyes. It said, ah. The unappreciated-while-occurring complaint. Very common. We get a great deal of this one. It filed my form in a cabinet that contained, I understood instantly, every life ever lived, all of them complaining the identical complaint, all of them having failed to notice the thing while standing inside the thing. The clerk said, the department''s ruling is as follows. There was a pause that lasted, subjectively, the length of my childhood. Complaint upheld, the clerk said. But there is no remedy available at this office. The remedy, it added, was only ever available earlier, and only ever to you.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000c00004','b5200000-0000-0000-0000-000000000012',4,'Appeals Procedure','There is, naturally, an appeals procedure. There is always an appeals procedure. The Bronze Age woman warned me it leads to the same room with worse lighting.',56,1,false, now() - interval '20 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000c00004','There is, naturally, an appeals procedure. There is always an appeals procedure. The Bronze Age woman warned me it leads to the same room with worse lighting. I filed anyway. While I waited I noticed I had begun, without instruction, to appreciate the beige. Its consistency. The honest effort of the chairs. The thermos woman, still here, still kind. I was, I realised, finally paying attention. Far too late, in the correct place, to the wrong life.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 13
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-13@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Wren Castellano"}')
on conflict (id) do nothing;
update public.users set username='wren_writes', display_name='Wren Castellano', role='writer', is_verified=true, bio='I write the in-between genres. Mostly hybrid stuff.', date_of_birth='1990-09-30' where id='b5100000-0000-0000-0000-000000000013';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000013','b5100000-0000-0000-0000-000000000013','A Field Guide to the People on My Street','a-field-guide-to-the-people-on-my-street','Part nature writing, part nosy neighbour. Each entry studies one resident of Marlow Road as if they were a species. Affectionate. Hard to shelve, hence other.','#3A6E4A','other','{"hybrid","character-sketch","neighbourhood","essayistic"}','ongoing',false,10566,489, now() - interval '115 days', now() - interval '18 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000d00001','b5200000-0000-0000-0000-000000000013',1,'Entry: The Watering Man (no. 6)','The Watering Man of number six is most reliably observed at dusk, when he emerges to attend to a front garden that, by any honest measure, does not require it.',176,1,true, now() - interval '115 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000d00001','The Watering Man of number six is most reliably observed at dusk, when he emerges to attend to a front garden that, by any honest measure, does not require it. The garden is four square metres of gravel and three shrubs of the indestructible municipal type. He waters it anyway, slowly, with a brass can, and this is the behaviour I wish to record, because it took me two years to understand it. He is not watering the shrubs. The shrubs are incidental. He is watering the hour between coming home and being properly home, the decompression hour, and the garden is merely the excuse the hour wears so the neighbours do not worry. I know this because I do a version of it myself, with bins. We all have our brass can. Field note: the species is widespread, possibly universal, and is characterised by the maintenance of a small visible task that licenses a large invisible pause. Do not interrupt the Watering Man. He is not gardening. He is recovering from his day in the only socially acceptable form available to a man of his generation.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000d00002','b5200000-0000-0000-0000-000000000013',2,'Entry: The Twins of no. 19','I call them twins. They may not be twins. They are two women of roughly seventy who leave number nineteen each morning at the same minute, dressed not identically',162,1,true, now() - interval '95 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000d00002','I call them twins. They may not be twins. They are two women of roughly seventy who leave number nineteen each morning at the same minute, dressed not identically but coordinated, the way a good duet is not unison but is also not chaos. One carries the bag. The other carries the conversation. This division of labour has, I estimate, held for decades, and watching it I have come to believe it is the actual definition of a long companionship: not similarity but allocation. Somebody carries the bag. Somebody carries the talk. The arrangement is invisible to its participants and obvious to a person at a window with a notebook and too much time, which is the person I have apparently become. Field note: the Twins of nineteen do not, as far as I can determine, ever discuss the allocation. It is older than discussion. It is load-bearing in the way of all the best arrangements, which is to say nobody can remember agreeing to it and nobody would survive its collapse.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000d00003','b5200000-0000-0000-0000-000000000013',3,'Entry: The Boy Who Practices (no. 11)','From number eleven, on still evenings, comes a trumpet. It is not a good trumpet, by which I mean the boy is learning, and learning is audible, and the street has',152,1,true, now() - interval '60 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000d00003','From number eleven, on still evenings, comes a trumpet. It is not a good trumpet, by which I mean the boy is learning, and learning is audible, and the street has had to decide how it feels about that. I have observed the street deciding. Number eight closes a window. Number eight has always closed a window. But the Watering Man of six, I have noticed, slows his can when the trumpet starts, and the Twins pause at their gate, and a thing happens that I can only describe as the street agreeing, without a meeting, without a vote, to let the boy be bad at something in public until he is good. This is a rare behaviour. Most streets do not permit it. Field note: the value of a street is not its property prices but its tolerance for the sound of a person practising. By this measure Marlow Road is wealthy beyond its postcode.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000d00004','b5200000-0000-0000-0000-000000000013',4,'Entry: The New Family (no. 2)','A van came to number two in March. The species New Family is easily identified by its caution: it does not yet know which neighbours are safe.',58,1,false, now() - interval '30 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000d00004','A van came to number two in March. The species New Family is easily identified by its caution: it does not yet know which neighbours are safe, which bins go out on which day, which of us watches from windows. Field note, with some guilt: they do not yet know about me. I have decided to be a kind entry in their field guide, when they begin to write one, as everyone on a street eventually does.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000d00005','b5200000-0000-0000-0000-000000000013',5,'Entry: The Observer (no. 14)','It is only fair that I record myself. Number fourteen. The Observer. Most reliably found at a first-floor window with a notebook, mistaking surveillance for love.',60,1,false, now() - interval '18 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000d00005','It is only fair that I record myself. Number fourteen. The Observer. Most reliably found at a first-floor window with a notebook, mistaking surveillance for love, though after two years I will defend the mistake: to watch a street this closely is to end up fond of it. Field note: the Observer waters her own hour with other people. It is, perhaps, not the healthiest brass can on Marlow Road. But the shrubs, you understand, are incidental.')
on conflict (chapter_id) do nothing;

-- =====================================================================
-- AUTHOR 14
-- =====================================================================
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values ('b5100000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000000','authenticated','authenticated','b5-author-14@seed.novelstack.test','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"display_name":"Dale Furmanek"}')
on conflict (id) do nothing;
update public.users set username='dale.f', display_name='Dale Furmanek', role='writer', is_verified=false, bio=null, date_of_birth='1968-03-03' where id='b5100000-0000-0000-0000-000000000014';

insert into public.stories (id, author_id, title, slug, description, cover_color, genre, tags, status, is_mature, total_reads, total_followers, published_at, updated_at)
values ('b5200000-0000-0000-0000-000000000014','b5100000-0000-0000-0000-000000000014','The Redundancy','the-redundancy','At fifty-six, Gordon is let go after thirty-one years and decides, for reasons he cannot explain to his wife, not to tell anyone for as long as he can keep it up.','#553A3A','drama','{"unemployment","middle-age","secrets","marriage"}','ongoing',true,15990,688, now() - interval '128 days', now() - interval '5 days')
on conflict (id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000e00001','b5200000-0000-0000-0000-000000000014',1,'The Meeting Was Short','They gave me a meeting on a Wednesday and it lasted eleven minutes. I timed it, after, in the car, working backwards from the clock. Eleven minutes to undo',174,1,true, now() - interval '128 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000e00001','They gave me a meeting on a Wednesday and it lasted eleven minutes. I timed it, after, in the car, working backwards from the clock. Eleven minutes to undo thirty-one years. There was a woman from HR I had never met and Paul, who I had trained, who could not hold my eye and kept thanking me, which I found I could not bear, the thanking. They used the word restructure. They used the word unfortunately. They gave me a folder. I drove home the normal way at the normal time because I did not know what else a man does at half past five, and I sat outside my own house for a while with the engine off. Through the window I could see Brenda moving in the kitchen. The radio on, probably. The dinner on. And I understood, sitting there, that I was not going to walk in and tell her. I cannot tell you why. I have had four months since to work out why and I still cannot tell you. I just knew, with the engine ticking as it cooled, that I would keep it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000e00002','b5200000-0000-0000-0000-000000000014',2,'The Library Opens at Nine','A man who is pretending to have a job must still leave the house at the time the job would want him. So I left. Brenda made the sandwiches she always',164,1,true, now() - interval '112 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000e00002','A man who is pretending to have a job must still leave the house at the time the job would want him. So I left. Brenda made the sandwiches she always makes, ham, too much butter, and I took them and kissed her cheek and drove off towards a workplace that had eleven minutes ago stopped being mine. The library opens at nine. I had not been in a library since the children were small. It is warm, and quiet, and nobody asks a man in a coat with a folder what he is doing there, a library being one of the last places in the country built on the principle of not asking. I read the newspapers. I read a book about the Romans. At half past twelve I ate the ham sandwiches at a table by the large-print section and a woman my age nodded at me, the nod of one library regular to another, and I realised I had a routine now, a life, a secret shape to my days, and that the shape was eleven minutes wide and growing.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000e00003','b5200000-0000-0000-0000-000000000014',3,'Payday','The last salary went in and Brenda did the budget at the table the way she does, the calculator and the little book, and I watched her not knowing, and the not',158,1,true, now() - interval '85 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000e00003','The last salary went in and Brenda did the budget at the table the way she does, the calculator and the little book, and I watched her not knowing, and the not knowing in her face was the worst thing I have done to anyone in thirty-six years of marriage. The redundancy money was in a separate account she had no reason to look at. I moved sums about at night, on the laptop, like a man feeding a fire to keep one room warm while the rest of the house goes cold. She said, at the table, we could maybe do the kitchen this year. The doors at least. And I said yes, maybe, the doors, and I heard my own voice say it, smooth, terrible, a voice I did not know I owned, and I thought: this is how it happens. This is how a decent man becomes a liar. Not all at once. One kitchen door at a time.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000e00004','b5200000-0000-0000-0000-000000000014',4,'Paul From Work','I ran into Paul in the town, of all the rotten luck. He went pale. He said Gordon, God, how are you, are you alright, and I understood from his face that',66,1,false, now() - interval '45 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000e00004','I ran into Paul in the town, of all the rotten luck. He went pale. He said Gordon, God, how are you, are you alright, and I understood from his face that he assumed Brenda knew, that everyone knew, that I had grieved this properly months ago like a normal man. I said I''m grand, Paul. I''m keeping busy. He nodded too fast. Then he said, quietly, does Brenda. And couldn''t finish it. I didn''t finish it for him.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b5300000-0000-0000-0000-000000e00005','b5200000-0000-0000-0000-000000000014',5,'She Found the Folder','It was the folder that did it, in the end. Of course it was the folder. I had hidden it in the place I hide things, which is to say a place Brenda cleans.',64,1,false, now() - interval '5 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b5300000-0000-0000-0000-000000e00005','It was the folder that did it, in the end. Of course it was the folder. I had hidden it in the place I hide things, which is to say a place Brenda cleans. She had it on the kitchen table when I came in from the library. She did not shout. Brenda has never shouted. She said, four months, Gordon. Then she said, sit down, and put the kettle on, and I understood she had known for a while, and had been waiting, the way I had been waiting, for the other one to be brave.')
on conflict (chapter_id) do nothing;

