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
values ('b2300000-0000-0000-0000-000002000001','b2200000-0000-0000-0000-000000000020','The man at the self-storage place was very keen for Theo to take Unit 114, and Theo, who had a couch and nowhere to put it, was not in a position to ask why.

"Half price," the man said. "First three months. Just — you know. It''s a good unit."

It was a good unit. That was the strange part. Theo had expected damp, or a smell, or a roof problem. Instead Unit 114 was clean and dry and oddly deep, deeper than the units on either side, which Theo only noticed because he had spent a boring year doing measurements for a living.

He moved the couch in. He moved in the boxes, the bike, the lamp his ex had not wanted. And it was while he was stacking the last boxes against the back wall that he understood the unit was not just deep. The back wall was not the back wall.

There was a door in it. A perfectly ordinary door, white-painted, slightly ajar. And cold air was coming under it, and the cold air smelled, very faintly, of a forest after rain.')
on conflict (chapter_id) do nothing;

insert into public.chapters (id, story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
values ('b2300000-0000-0000-0000-000002000002','b2200000-0000-0000-0000-000000000020',2,'The Previous Renter','Theo did not open the door that first day. He went home, and he did not sleep, and in the morning he went to the storage office and asked the only sensible question, which was: what happened to whoever had Unit 114 before me.',157,1,true, now() - interval '54 days')
on conflict (id) do nothing;
insert into public.chapter_content (chapter_id, body)
values ('b2300000-0000-0000-0000-000002000002','b2200000-0000-0000-0000-000000000020','Theo did not open the door that first day. He went home, and he did not sleep, and in the morning he went to the storage office and asked the only sensible question, which was: what happened to whoever had Unit 114 before me.

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
values ('b2300000-0000-0000-0000-000002000003','b2200000-0000-0000-0000-000000000020','They let him into the holding room. Priya''s whole stored life fit into six boxes, and Theo sat on the concrete floor and went through every one of them like an apology to a stranger.

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
