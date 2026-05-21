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
