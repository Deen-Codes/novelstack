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
