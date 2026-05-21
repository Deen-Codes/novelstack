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
update public.users set username='xX_raven_Xx', display_name='Devon Reyes', role='writer', is_verified=false, bio='dark mysteries. 17. constructive crit only pls', date_of_birth='2008-04-12' where id='b3100000-0000-0000-0000-000000000009';

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
values ('b3300000-0000-0000-0000-0000010000001','b3200000-0000-0000-0000-000000000016',1,'A Week Early','The drive up to Camp Verlow took three hours and the last forty minutes of it was a dirt road that the GPS gave up on. Six of us in a van that smelled like old sunscreen. We were a week early.',150,1,true, now() - interval '38 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000010000001','The drive up to Camp Verlow took three hours and the last forty minutes of it was a dirt road that the GPS gave up on. Six of us in a van that smelled like old sunscreen. We were a week early, sent up to open the place, scrub the cabins, get the docks back in the water before a hundred screaming kids arrived. Marcus drove. Tasha had the playlist. Everyone was loud and happy in that nervous way you get when you barely know each other yet. I was the only one looking out the window, which is how I noticed the lake first. It was wrong. I had worked Verlow two summers and the lake had always come right up to the treeline, and now there was a wide ugly band of cracked grey mud between the water and the shore, like the lake had pulled back from something.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000010000002','b3200000-0000-0000-0000-000000000016',2,'The Mud Line','By the second day the lake was lower still. Marcus said drought. Tasha said the dam. I said nothing, because I had walked out on the mud that morning and found things in it.',146,1,true, now() - interval '33 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000010000002','By the second day the lake was lower still. Marcus said drought. Tasha said the dam. I said nothing, because I had walked out on the mud that morning and found things in it. Not trash. Not the usual lake junk, the sunglasses and beer cans and one shoe. I found a row of camp name tags, the laminated kind on lanyards, the kind every kid at Verlow gets on day one. There were a lot of them, half buried, pressed flat into the grey mud in a line that ran straight out toward the middle of the lake where the water still was. I counted nineteen before I stopped counting. Nineteen kids. And I have a good memory for Verlow, and I could not recall a single summer, ever, where the camp had reported losing even one.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000010000003','b3200000-0000-0000-0000-000000000016',3,'The Old Director','We called the camp director, old man Verlow himself, the family the place is named for. He did not ask why we were calling. He asked one thing: how low.',57,1,true, now() - interval '22 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000010000003','We called the camp director, old man Verlow himself, the family the place is named for. He did not ask why we were calling. He asked one thing: how low. I told him the mud line. There was a long crackle of silence on the phone. Then he said get in the van, all six of you, leave the doors, leave everything, and do not — he said this twice — do not let the water see you running.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000010000004','b3200000-0000-0000-0000-000000000016',4,'The Van Would Not Start','Of course the van would not start. It is always the van. Marcus had the hood up and was swearing at it when Tasha said, very quietly, that the mud line had moved while we were on the phone, and it was moving toward us.',52,1,false, now() - interval '6 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000010000004','Of course the van would not start. It is always the van. Marcus had the hood up and was swearing at it when Tasha said, very quietly, that the mud line had moved while we were on the phone, and it was moving toward us. Not the water rising. The water going. Draining away fast now, like something was pulling the plug from underneath, and whatever the lake had been keeping covered for nineteen summers did not want to stay covered any longer.')
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
values ('b3300000-0000-0000-0000-0000011000001','b3200000-0000-0000-0000-000000000017',1,'The Farm','We moved to Edwin''s family farm in the spring, and the village welcomed me the way warm water welcomes you, all at once and a little too eagerly. The women brought bread. They asked when I was due.',157,1,true, now() - interval '195 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000011000001','We moved to Edwin''s family farm in the spring, and the village welcomed me the way warm water welcomes you, all at once and a little too eagerly. The women brought bread. They asked when I was due. I was not due anything, I was not even pregnant, and I laughed and said so, and the women laughed too but they exchanged a look first, a quick one, the kind you are not meant to catch. Edwin had grown quieter the closer we got to home. He had told me his family had farmed this valley for two hundred years and that the soil here was the best in the county, and both of those things turned out to be true. He had not told me about the calendar in the church porch, the one that marked off the years in twenties, nor that this year, the year we came home, had a small red mark beside it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000011000002','b3200000-0000-0000-0000-000000000017',2,'A Good Year','The crops came up thick and fast and wrong. Edwin''s mother stood at the field edge and wept with relief, and would not tell me what she had been afraid of.',149,1,true, now() - interval '188 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000011000002','The crops came up thick and fast and wrong. Edwin''s mother stood at the field edge and wept with relief, and would not tell me what she had been afraid of. I am a town girl. I do not know corn the way these people know corn, but even I could see that it was growing too well, the stalks already past head height in early summer, the green of them so dark it was nearly black. The whole village relaxed at once, as though a held breath had been let out. There was a feast. There was singing I did not know the words to and nobody offered to teach me. And all evening the older people kept touching my hair, my shoulders, my hands, gently, the way you might check that fruit is ripe, and Edwin watched them do it and said nothing, and would not meet my eyes.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000011000003','b3200000-0000-0000-0000-000000000017',3,'The Calendar','I went back to the church porch alone and counted the red marks on the old calendar. There was one every twenty years, back and back, and beside each red year, in faded ink, a woman''s name.',58,1,true, now() - interval '150 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000011000003','I went back to the church porch alone and counted the red marks on the old calendar. There was one every twenty years, back and back, and beside each red year, in faded ink, a woman''s name. Not a village woman. Each name was followed by the word incomer, the local word for someone who married in from outside. I found this year''s red mark. The space beside it was blank, but the ink pot and pen were sitting on the ledge, waiting, and I understood the blank was waiting for me.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000011000004','b3200000-0000-0000-0000-000000000017',4,'Harvest','They came for me at harvest, kindly, the way they did everything. Edwin held my hand the whole way to the field and told me he had tried, for months, to find another way, and that there was not one.',47,1,false, now() - interval '95 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000011000004','They came for me at harvest, kindly, the way they did everything. Edwin held my hand the whole way to the field and told me he had tried, for months, to find another way, and that there was not one. The corn closed over the path behind us as we walked. I had stopped being afraid somewhere back at the gate. I was only thinking, very clearly, about the blank space beside this year, and how I did not intend to fill it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000011000005','b3200000-0000-0000-0000-000000000017',5,'Twenty Years','The harvest was good that year. The village says so, still. But the calendar in the church porch has no red mark for the next turn, and the corn, these last few autumns, has come up thin.',45,1,false, now() - interval '70 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000011000005','The harvest was good that year. The village says so, still. But the calendar in the church porch has no red mark for the next turn, and the corn, these last few autumns, has come up thin. They are afraid again. I sit at the field edge some evenings and watch them be afraid, and I do not weep with relief, and I do not tell them what I did out there, and the not-telling is the best harvest I have ever brought in.')
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
values ('b3300000-0000-0000-0000-0000012000001','b3200000-0000-0000-0000-000000000018',1,'Night One','The advert said eight hundred dollars for five nights of sleep. I have never been paid for anything as easily as I am paid for being unconscious, so I called the number.',151,1,true, now() - interval '44 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000012000001','The advert said eight hundred dollars for five nights of sleep. I have never been paid for anything as easily as I am paid for being unconscious, so I called the number. The clinic was on the fourth floor of a building that also held a dentist and an accountant, which made it feel safe in a way I should probably have questioned. The room they gave me was small and clean and beige. They glued sensors to my scalp, my chest, the corners of my eyes. There was a camera in the ceiling, a small black dome, and a technician named Wynn told me, kindly, that I would not even notice it after the first night. He was right. I did not notice it. That, it turns out, was the entire problem, and Wynn knew it when he said it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000012000002','b3200000-0000-0000-0000-000000000018',2,'The Footage','On the third morning Wynn asked, very gently, whether I would like to see some footage from night two. He asked it the way a doctor asks if you have someone who can drive you home.',148,1,true, now() - interval '39 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000012000002','On the third morning Wynn asked, very gently, whether I would like to see some footage from night two. He asked it the way a doctor asks if you have someone who can drive you home. I said yes, of course, because saying no felt like admitting something. The screen showed my room at 3:40 a.m. in the green wash of the night camera. It showed me, in the bed, asleep. And then it showed me sit up, not the way a person wakes, but all at once, like a hinge, and get out of bed, and walk to the camera, and stand directly beneath it looking up. For four minutes. My eyes were open. I was, Wynn assured me, deeply and measurably asleep the entire time. And on the footage, slowly, while staring up at the lens, the sleeping version of me began to smile.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000012000003','b3200000-0000-0000-0000-000000000018',3,'Night Four','I asked to leave. Wynn said of course, the study was voluntary, I could go any time. Then he showed me the consent form, and the clause I had initialed, and the part of it I did not remember reading.',56,1,true, now() - interval '20 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000012000003','I asked to leave. Wynn said of course, the study was voluntary, I could go any time. Then he showed me the consent form, and the clause I had initialed, and the part of it I did not remember reading. It said the study did not end when I left the building. It said the study followed the sleeper. My own initials sat beside it, in my own handwriting, except I print my initials and these were in cursive, and I have not written in cursive since I was a child.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000012000004','b3200000-0000-0000-0000-000000000018',4,'Home','I went home. I bought a camera, a cheap one, and set it on the dresser pointed at my own bed, because I had to know. I have watched four nights of footage now.',50,1,false, now() - interval '3 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000012000004','I went home. I bought a camera, a cheap one, and set it on the dresser pointed at my own bed, because I had to know. I have watched four nights of footage now. Every night at 3:40 the sleeping me sits up like a hinge, and gets out of bed, and walks out of frame toward the door. And every night, a little later, it comes back. I am writing this in the morning. I am very tired. I do not think it is me that sleeps anymore.')
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
values ('b3300000-0000-0000-0000-0000013000001','b3200000-0000-0000-0000-000000000019',1,'Seventh Floor','I have cleaned the Brandt Tower for six years, eleven at night until seven in the morning, and I know it better than I know my own apartment. So I knew, the night the seventh floor hallway was wrong.',150,1,true, now() - interval '52 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000013000001','I have cleaned the Brandt Tower for six years, eleven at night until seven in the morning, and I know it better than I know my own apartment. So I knew, the night the seventh floor hallway was wrong. It is a simple hallway. Office doors on the left, windows on the right, a fire exit at the far end. I have pushed a cleaning cart down it some two thousand times. It takes ninety seconds to walk, and I have never once needed to count, because my body knows the length of it the way it knows the stairs. That night it took me a hundred and forty seconds. I told myself I was tired. I told myself I had walked slow. But my body does not lie about hallways, and my body said the fire exit at the end was further away than it had been the night before.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000013000002','b3200000-0000-0000-0000-000000000019',2,'I Measured It','I am not a dramatic person. The next night I brought a tape measure from home, and before I started my shift I measured the seventh floor hallway, door to fire exit, and wrote the number on my hand.',146,1,true, now() - interval '47 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000013000002','I am not a dramatic person. The next night I brought a tape measure from home, and before I started my shift I measured the seventh floor hallway, door to fire exit, and wrote the number on my hand. Forty-one meters. I cleaned the rest of the building. I tried not to think about it. At the end of my shift, just before seven, I measured it again. Forty-two meters and a little over. One meter longer in one night. I stood there with the tape measure in my hand and the cheap fluorescent lights buzzing and I did the only thing my tired brain could manage, which was the arithmetic. A meter a night. Thirty meters a month. And the hallway was not getting longer at the fire exit end. It was getting longer in the middle, growing new wall, new doors, doors I did not have keys for.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000013000003','b3200000-0000-0000-0000-000000000019',3,'The New Doors','There were three new doors after two weeks. They matched the others exactly, same wood, same little frosted glass panels. But the old doors had room numbers. The new ones had names.',57,1,true, now() - interval '30 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000013000003','There were three new doors after two weeks. They matched the others exactly, same wood, same little frosted glass panels. But the old doors had room numbers. The new ones had names. Not company names. People names, first and last, painted neat in gold like the offices of important men. I did not recognize the first two. The third new door, the one nearest the middle, the one that had appeared just last night, had my name on it.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000013000004','b3200000-0000-0000-0000-000000000019',4,'My Door','I did not open my door. I want that on the record. I went home and I slept badly and I came back the next night and the hallway had grown another meter, and my door had moved, and there was a light on behind the frosted glass.',54,1,false, now() - interval '13 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000013000004','I did not open my door. I want that on the record. I went home and I slept badly and I came back the next night and the hallway had grown another meter, and my door had moved, and there was a light on behind the frosted glass. Someone was in my office. I could see a shape moving against the light, slow, settling in, getting comfortable. I have not gone back to the seventh floor. But the hallway, I think, is coming to find me.')
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
values ('b3300000-0000-0000-0000-0000014000001','b3200000-0000-0000-0000-000000000020',1,'The Commission','The maritime museum paid me a modest sum to transcribe the surviving logbook of the Carrick Head light, kept by one Ezra Doune across the year 1911. I expected weather and lamp oil.',152,1,true, now() - interval '165 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000014000001','The maritime museum paid me a modest sum to transcribe the surviving logbook of the Carrick Head light, kept by one Ezra Doune across the year 1911. I expected weather and lamp oil. That is what lighthouse logs are, mostly: a man''s neat record of fuel burned and ships sighted and the wind backing round to the north. Ezra Doune kept a tidy hand and a tidy log. January through September is forty pages of a careful man doing careful work alone on a rock two miles off the coast. I transcribed it in a week and found nothing in it but the weather. Then I reached October, and the handwriting was the same, and the careful man was the same, but the things he was writing down had stopped being the weather, and I made myself a pot of strong tea before I went on.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000014000002','b3200000-0000-0000-0000-000000000020',2,'October the Third','I will give you the entry for October the third in full, because it is where the log changes, and because I have read it eleven times and it has not improved with reading.',149,1,true, now() - interval '159 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000014000002','I will give you the entry for October the third in full, because it is where the log changes, and because I have read it eleven times and it has not improved with reading. Doune wrote: "Wind SW, moderate. Lamp trimmed at four. Swept the stair as is my habit. Counted, going down, more steps than I climbed. This is foolishness and I record it only so that I may laugh at it in the spring." But there is no laughter in the spring entries, because the count is in every entry after that one. He sweeps the stair. He counts the steps going up. He counts them going down. And from October the third onward the number going down is always, always one greater than the number going up, by exactly one, every single day, as though something joined the staircase while his back was turned.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000014000003','b3200000-0000-0000-0000-000000000020',3,'The Relief Boat','The relief boat came every six weeks with oil, food, and mail. Doune''s log records each visit. After October, his entries about the relief boat take on a particular kind of hunger.',57,1,true, now() - interval '120 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000014000003','The relief boat came every six weeks with oil, food, and mail. Doune''s log records each visit. After October, his entries about the relief boat take on a particular kind of hunger. He counts the days to it. He writes that he means to ask the boatmen to stay the night, just one night, so that another living man might also walk the stair and count. The boat came on October the twentieth. The log entry for that day is one line. It says: "They would not come up.")')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000014000004','b3200000-0000-0000-0000-000000000020',4,'The Last Pages','The log ends on the ninth of November. Not because the year ended, you understand. Because the entries stop. The museum told me Doune was relieved of his post that winter, alive and well.',52,1,false, now() - interval '80 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000014000004','The log ends on the ninth of November. Not because the year ended, you understand. Because the entries stop. The museum told me Doune was relieved of his post that winter, alive and well, and lived another forty years inland and never spoke of the light. The final entry is not about footsteps. It says only: "I have stopped sweeping the stair. If I do not count, there is nothing to count. I hope whoever reads this is wiser than I was.")')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b3300000-0000-0000-0000-0000014000005','b3200000-0000-0000-0000-000000000020',5,'My Own Stairs','I finished the transcription and sent it to the museum and was paid. That should have been the end of it. I live in a narrow house with a narrow staircase, and I have never, in thirty years here, had cause to count the steps.',48,1,false, now() - interval '58 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b3300000-0000-0000-0000-0000014000005','I finished the transcription and sent it to the museum and was paid. That should have been the end of it. I live in a narrow house with a narrow staircase, and I have never, in thirty years here, had cause to count the steps. There are thirteen of them. I know that now. I counted them last night, going up. This morning, coming down, I counted them again, and I am not going to tell you the number, because Ezra Doune was right, and I should not have counted at all.')
on conflict (chapter_id) do nothing;
