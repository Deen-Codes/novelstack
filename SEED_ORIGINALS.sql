-- NovelStack Originals — seed the 5 stories under @novelstackoriginals.
-- Run AFTER SEED_WIPE.sql in the same psql session.
--
-- This script:
--   1. Finds your account by email (deenali3@outlook.com).
--   2. Inserts 5 stories owned by you, each with one chapter published.
--   3. Each chapter's prose is dollar-quoted ($body$…$body$) so no escaping
--      is needed for the markdown / quotes inside.
--
-- After running, log into the iOS app as @novelstackoriginals → Write tab
-- → you'll see all 5 stories. Tap each → Cover tab → Upload cover.
--
-- If anything goes wrong it rolls back — the BEGIN/COMMIT block is atomic.

DO $script$
DECLARE
  v_user_id uuid;
  v_story_id uuid;
  v_chapter_id uuid;
BEGIN
  -- Find the account. Fail loudly if it's missing.
  SELECT id INTO v_user_id FROM users WHERE email = 'deenali3@outlook.com';
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found for deenali3@outlook.com — sign in to the app first to create the account.';
  END IF;

  -- ============================================================
  -- BOOK 1 — The Salt-Wind Almanac (Literary, ongoing for now)
  -- ============================================================
  INSERT INTO stories (author_id, title, slug, description, genre, status, cover_color, is_mature, published_at)
  VALUES (
    v_user_id,
    'The Salt-Wind Almanac',
    'the-salt-wind-almanac-' || substr(md5(random()::text), 1, 6),
    'An archivist in a half-drowned coastal town catalogues the things the tide brings back — letters, glass, a single child''s shoe. When the seventh letter arrives in her dead mother''s handwriting, she begins to suspect the harbour has been keeping a small communal secret for nineteen years.',
    'contemporary',
    'ongoing',
    '#5B2E1C',
    false,
    now()
  )
  RETURNING id INTO v_story_id;

  INSERT INTO chapters (story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
  VALUES (
    v_story_id, 1, 'A small song for the harbour',
    'The first time the tide brought back a letter, Marin filed it under Correspondence, unanswered, salt-damaged. The second time, she made a new drawer for it. By the seventh, she had stopped pretending the archive was for anyone but herself.',
    1435, 6, true, now()
  )
  RETURNING id INTO v_chapter_id;

  INSERT INTO chapter_content (chapter_id, body) VALUES (v_chapter_id, $body$The first time the tide brought back a letter, Marin filed it under *Correspondence, unanswered, salt-damaged*. The second time, she made a new drawer for it. By the seventh, she had stopped pretending the archive was for anyone but herself.

She did the rounds at low tide. That was the rule she had given herself the year the lochs went soft and the salt began to come further inland than it should: walk the seawall at six in the morning when the harbour was at its quietest, pick up whatever the night had brought to her, label it before breakfast, file it before lunch. There was a discipline to it. She told herself there was a discipline to it. The truth was that nobody else had volunteered, and someone had to.

The harbour was quieter that winter than any winter she could remember. Boats stayed in. Children did not come down to the wall. Even the gulls had begun to favour the cathedral roof over the dock, which Marin took personally — she had been feeding them since before her mother had stopped writing back, and now they were forming opinions about her without consulting her.

She walked the seawall in her father's old coat. It was too long for her at the cuffs and too short at the hem and she had loved it for thirty-one years and not for a single one of those years had she been able to bring herself to take it in. There were three pockets — one inner, two outer — and in the inner pocket she carried, by habit, a small linen bag for whatever she found.

That morning the linen bag held nothing for a long time. The tide had been mean. She walked the full length of the wall, north to south, and turned at the lighthouse the way she always did, and was halfway back when she saw it.

A letter, folded once, half-buried in the wet pebble where the slipway met the wall.

She crouched. Her knees made a sound that suggested they were tired of doing this. She picked the letter up by its corner, between two fingers, the way she had been taught at the archive in Edinburgh forty years ago — not the centre, never the centre, the corner — and held it up against the dawn so the watermark would catch.

It was paper she recognised. Cromarty Mills, blue rule, the watermark a fish curled to swallow its own tail. Her mother's stationery. Her mother had bought it by the ream in 1981 because she liked the watermark and had never bought any other stationery again, even after the mills closed in 1996 and the price of what was left went through the roof, even after her father had said for God's sake Eilidh, write on something normal.

Marin held it up to the dawn and the fish-watermark was perfect.

She did not open it on the wall. That was a rule too. You did not open salt-damaged correspondence outside the archive — paper that had been wet had ways of falling apart in a wind, and the only safe place to coax a letter open was on the flat oak table at the back of the small two-room building she had inherited from her father along with the duty of running it. The Carrow Quay Archive was not, strictly speaking, an archive. It was a converted post-office cottage with a brass plaque outside saying *Carrow Quay Records — by appointment*, and Marin had never received an appointment in her life. She kept the brass plaque polished anyway.

She walked back along the wall slowly. The letter was light in her hand, and she found herself adjusting her stride for it as if she were carrying something that could be startled.

* * *

She did open it. Of course she opened it. She is a woman in her sixties who has waited nineteen years for one of these and would no more not open it than not breathe, and you should not imagine that she paused for very long at the door of the archive with the letter in her hand, gathering herself. The pause was almost ceremonial. The pause was about an hour.

She opened it in the back room, at the table, with the green-shaded reading lamp at the angle her father had set it the year before he died. She used the bone knife. She did not unfold it all the way. She read the first three lines and then she sat back in the chair and she covered her mouth with her hand, and then she stood up and she walked to the kitchen at the back and she put the kettle on, and she walked back, and she sat down again, and she did not get up for the tea when the kettle whistled, and the kettle whistled itself out, and she read the first three lines again.

The first three lines were:

> Marin, my love. I owe you an explanation, and the tide will bring it in pieces. Please file them in the order they arrive.

* * *

The town of Carrow Quay holds, at the time of writing, two hundred and forty-three residents. Of those, one hundred and seventy-eight remember Eilidh Tweedie personally. Of the one hundred and seventy-eight, all of them know that Eilidh Tweedie walked into the sea on the eleventh of November in the winter of 2006 and did not come back.

You can ask anyone. The lighthouse keeper, who saw her on the wall that night. The postmistress, who sold her stamps that afternoon. Marin's father, before he died, would have told you. Marin herself, asked at any point in the last nineteen years, would have told you.

Eilidh walked into the sea on the eleventh of November in the winter of 2006 and did not come back.

This is a fact about Carrow Quay. It is a fact in the way that the lighthouse is a fact, in the way that the tide is. It is the kind of fact that small communities hold for each other, the way a child holds a hand crossing the road. You don't ask. You don't push. You let the fact be the fact.

The letter on the oak table at the back of the small two-room building on the wall did not appear to know this.

* * *

Marin sat with the letter for an hour. Then she stood up, and she did the only thing she could think of, which was to walk to the postmistress's cottage on the high street and knock on the door.

Iona Tweedie — no relation, despite the name; half the town was Tweedies if you went back four generations — opened the door in her dressing gown and looked at Marin with the particular look of an eighty-three-year-old woman who has been called to the door before her tea and intends to express herself about it.

'Iona,' Marin said. She held up the linen bag. 'I think I've had a letter from my mother.'

Iona Tweedie looked at the bag for a long time.

Then she said, very quietly, 'Oh. Oh, my love. So it's started.'

Marin opened her mouth, and shut it, and opened it again.

'What's started,' she said.

'You'd better come in,' Iona said. She stood aside.

Marin stepped into the postmistress's hallway, and the small communal secret of Carrow Quay, which had been held by one hundred and seventy-eight people for nineteen years, began, quietly, to come back to her in the order it had been filed.

She did not yet know that there would be six more letters before spring. She did not yet know that each of them was already moving, in the dark water somewhere off the harbour, towards the slipway where she would find them. She did not know that they had been waiting, and they had been patient, and that her mother had written them all in a single sitting on a single night with the kettle whistling itself out in the kitchen, with the bone knife on the table, with the green-shaded reading lamp at the angle that Marin's father had set it, in the small two-room building on the wall.

But the postmistress knew. Iona Tweedie made tea and did not say anything for a long time, and when she did say something, it was: 'Sit down, Marin Tweedie. There's a great deal you don't know about your mother, and I think it's time.'

And outside, on the seawall, the tide was beginning to turn.$body$);

  -- ============================================================
  -- BOOK 2 — Threshold Protocol (LitRPG / Fantasy, ongoing)
  -- ============================================================
  INSERT INTO stories (author_id, title, slug, description, genre, status, cover_color, is_mature, published_at)
  VALUES (
    v_user_id,
    'Threshold Protocol',
    'threshold-protocol-' || substr(md5(random()::text), 1, 6),
    'On the morning the System arrives, Kit Aldrich is in the wrong meeting room. Everyone else gets a class. He gets an error message and a single line: Threshold protocol pending. Survive 72 hours. He has no class, no skills, no map — and eight billion people who do.',
    'fantasy',
    'ongoing',
    '#1E2A4A',
    false,
    now()
  )
  RETURNING id INTO v_story_id;

  INSERT INTO chapters (story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
  VALUES (
    v_story_id, 1, 'The Tuesday the System Came',
    'The System arrived at nine-fourteen on a Tuesday morning, which Kit Aldrich would remember for the rest of his life, because at nine-fourteen on a Tuesday morning Kit Aldrich was in the wrong meeting room on the third floor of an open-plan office.',
    1224, 5, true, now()
  )
  RETURNING id INTO v_chapter_id;

  INSERT INTO chapter_content (chapter_id, body) VALUES (v_chapter_id, $body$The System arrived at nine-fourteen on a Tuesday morning, which Kit Aldrich would remember for the rest of his life, because at nine-fourteen on a Tuesday morning Kit Aldrich was in the wrong meeting room on the third floor of an open-plan office in central London, eating a stale almond croissant, waiting for a quarterly review that had already started on the floor above him.

The croissant was the croissant Sasha brought in on Tuesdays. The wrong room was 3.04 instead of 4.04, a fact Kit would only realise at nine-fifteen, by which point it would no longer matter. The almond was, in fact, hazelnut. He had not yet had any coffee.

This is the man the System chose. Or, more accurately, didn't.

* * *

The light in the room changed first.

Kit looked up because everyone looked up. Sixty-four people on the third floor of a Crowndale Street office building tilted their heads back at the same moment, the way the gulls outside the window did at the sound of bread, and Kit, who was bad at noticing this kind of thing, noticed.

The fluorescents had gone strange. Not dimmer, not brighter. The light had a *quality* now. He could not have explained it to anyone if you'd asked him in the hour after, but if you asked him a year later he would say: *it was as though the air had gained a faint stylesheet,* and you would understand exactly what he meant, because by then everyone did.

And then the boxes appeared.

Sixty-three boxes, to be precise. One per person, except for Kit. Each box hovered six inches in front of the person it belonged to, slightly to the left of their eyeline, the way a heads-up display in a fighter jet would, except that none of these people were in a fighter jet, all of them were in a meeting room or a kitchenette or a bathroom stall, and the boxes were not made of glass or projected by anything Kit could see.

The boxes were just there.

Sasha's box, three seats to Kit's left, said:

> **CLASSIFICATION CONFIRMED**
> Class: **Healer-Mender (Initiate)**
> Specialisation tree: pending
> Welcome to the Threshold.
>
> [ ACCEPT ] [ REVIEW ] [ DECLINE — irrevocable ]

Sasha read it. Kit watched her read it. He watched the colour leave her face and then come back to it, lower and warmer, and he watched her mouth shape the word *Healer.* He saw her reach out, with one finger, and touch the [ ACCEPT ] button on the box that was not there.

A small chime sounded somewhere inside his head. It was the most pleasant sound he had ever heard.

And then a hundred chimes sounded across the room, slightly overlapping, like a small choir warming up, as sixty-three people accepted the offers their boxes had made them. Across the room, Marcus from Legal whooped and punched the air — his box, briefly visible to Kit from across the table, had said **Beast-Tamer (Initiate)** — and Sasha was already crying quietly with her hands over her mouth, and the IT manager whose name Kit had never bothered to learn was staring at his box with a kind of bewildered reverence, lips moving, reading and re-reading the word **Smith**, the way a man might read his own death notice.

Kit Aldrich sat in chair number eight at the long oval table in meeting room 3.04 on the third floor of the office building in Crowndale Street, eating his hazelnut croissant which he had thought was almond, and waited for his box to appear.

It did not appear.

* * *

It took him forty seconds to understand that it was not going to.

It took him another twenty seconds, while the room around him became loud with the excited cross-talk of sixty-three newly-classed initiates, to look down at his hands.

His hands were not glowing.

Sasha's hands were glowing. Faintly, around the fingernails, a colour that was not quite a colour. The IT manager's hands were glowing too. Marcus had cupped his palms in front of his face and was laughing.

Kit looked at his own hands. The almond — hazelnut — was making them sticky. There was no glow.

He stood up. Nobody noticed him stand up. He walked, slowly, to the corner of the meeting room, and he stood by the small empty water jug that was always on the side table because the kitchen had never been refilled, and he closed his eyes and he said, into the soft inside of his head, the word that everyone else seemed to be saying:

*Status.*

And a box appeared.

His box was different. It was smaller. The text was a different colour — not the warm welcoming amber of Sasha's box, but a flat industrial off-white, the colour of nothing in particular. It hovered in front of him at a slightly wrong angle, as if it had been pasted into his field of vision by an algorithm that had not quite finished training.

His box said:

> **CLASSIFICATION ERROR**
> Class: *none assigned*
> Specialisation tree: *unavailable*
>
> Threshold protocol pending. Survive 72 hours.

Kit stared at it.

He blinked. The box did not change.

He thought *Review* and the box did not change. He thought *Accept* and the box did not change. He thought *Decline* and a small new line of text appeared underneath, slightly more politely:

> *Decline option unavailable for this classification.*

He thought *Status* again. The box flickered, but did not change.

The room behind him had now reached the volume of a wedding reception. Sasha was being hugged. Marcus was lifting a chair above his head for some reason. The IT manager was on the phone to his wife, weeping.

Kit Aldrich stood in the corner of meeting room 3.04, with a box hanging six inches in front of his face that said he had been classified as nothing, and that he had seventy-two hours to survive, and that he could not decline.

He took a small bite of the almond croissant. It was still hazelnut. He chewed it slowly.

He thought, with a great calm that surprised him, *I am going to die in this building.*

And then he thought, with an even greater calm that surprised him more, *No, I don't think I am.*

He turned around. He walked back to chair number eight. He sat down. He finished the croissant. Nobody looked at him. The box did not go away. The light still had its stylesheet. Across the table Sasha was being congratulated by Marcus, who had now lowered the chair, and the IT manager had finished crying, and somewhere in the distance the church bell on Crowndale Road was just starting to ring nine-thirty.

Kit watched it all, and his box hung in front of him like a small flat industrial off-white piece of furniture, and a thought arrived in his head fully formed, the way an order arrives at a door:

*The first thing I am going to do, is I am not going to tell anyone.*

The box, as if it had been listening, did something Kit would not have thought possible until that moment.

The box winked.

> *Good answer.*
>
> *Threshold protocol: clock started.*
> *T −72:00:00.*

The countdown began.$body$);

  -- ============================================================
  -- BOOK 3 — Wrong Number (Romance, ongoing)
  -- ============================================================
  INSERT INTO stories (author_id, title, slug, description, genre, status, cover_color, is_mature, published_at)
  VALUES (
    v_user_id,
    'Wrong Number',
    'wrong-number-' || substr(md5(random()::text), 1, 6),
    'Maeve Doyle texts her sister to complain about her new boss. Auto-correct hits the wrong contact. Her boss texts back: I am, in fact, six-foot-two. The rest is debatable. Two weeks of late-night messages later, neither of them has admitted to themselves what''s actually happening.',
    'romance',
    'ongoing',
    '#A2516B',
    false,
    now()
  )
  RETURNING id INTO v_story_id;

  INSERT INTO chapters (story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
  VALUES (
    v_story_id, 1, 'Maeve · I am, in fact, six-foot-two',
    'The problem with Sam Hartigan was not that he was bad at his job, because he was, infuriatingly, very good at his job. The problem with Sam Hartigan was that he stood like a man who had been told once by someone he respected that he had nice shoulders.',
    1331, 6, true, now()
  )
  RETURNING id INTO v_chapter_id;

  INSERT INTO chapter_content (chapter_id, body) VALUES (v_chapter_id, $body$**Maeve, 11:47pm, Tuesday**

The problem with Sam Hartigan, Maeve typed, two glasses of red into a Tuesday she had not planned to drink on, was not that he was bad at his job, because he was, infuriatingly, very good at his job. The problem with Sam Hartigan was that he stood like a man who had been told once by someone he respected that he had nice shoulders, and had spent every subsequent moment of his adult life standing in a way that confirmed it.

She read it back. She smiled. She added: *Also he's six-foot-two and walks around the office as if this is news.*

She hit send.

She put her phone face-down on the coffee table, picked up the glass of red, and said out loud, to her empty flat, in the voice she used for her best lines: 'I am very funny, and Niamh will appreciate this, and I will go to bed in fifteen minutes a happier woman.'

Her phone made the sound a phone makes when an iMessage that has just been sent has, against all expectation, been read within seven seconds.

She picked the phone up. She turned it over.

The message above her own — the one her message had been a reply to — was not Niamh's last message about the wedding seating chart. It was a calendar invite from earlier that afternoon. The header at the top of the thread said:

**Sam Hartigan**
*Read 11:48pm*

Maeve put the phone back down on the coffee table. She put it face-down. She picked up the glass of red. She drank the whole glass in one motion. She put the glass down. She picked the phone up again. The thread had not been a hallucination. The two messages she had sent were sitting in a bubble underneath a calendar invite that read *Tuesday strategy sync — please come prepared with the Q3 forecast*, and underneath both her messages, with the three pulsing dots that mean a person is typing a reply, was the indicator that Sam Hartigan was typing.

Maeve Doyle, twenty-eight, account manager at a marketing firm in Shoreditch, who had not done anything obviously catastrophic at work in three years and who prided herself on this, watched the three dots pulse.

She thought, *I am going to die.*

She thought, *I should not have had the second glass.*

She thought, very clearly, *I am going to be fired by a man with nice shoulders.*

The three dots stopped pulsing. A new message appeared in the bubble below hers.

> *I am, in fact, six-foot-two. The rest is debatable.*

Maeve made a sound. She would, later, when interrogated by her sister, deny having made the sound. The sound she made was not a sound a grown woman makes.

She typed back, immediately, without thinking, the only thing she could think of:

> *Sam I am so sorry that was meant for my sister*

She hit send. The pulsing dots came back. The pulsing dots stopped. The pulsing dots came back. The pulsing dots stopped.

The next message was a long time coming. When it arrived, it was one line.

> *Your sister thinks I have nice shoulders?*

* * *

**Maeve, 11:51pm**

She read it three times. Three times the same nine words, with the same question mark, and three times the same small unbearable curl at the corner of her own mouth that she did not want to be there.

She wrote: *She does now.*

She deleted it.

She wrote: *Please pretend you didn't read that.*

She deleted it.

She wrote: *I'd like to formally resign with immediate effect.*

She deleted it.

She wrote: *I am very drunk and I sent that to the wrong person and I am so sorry,* and then she did not delete it, and she sat with her thumb hovering over send, and she put the phone down again.

She got up. She walked to the kitchen. She refilled the glass. She walked back. She sat down. She picked the phone up.

The message was still there in the chat input, unsent. Above it, Sam Hartigan was not typing.

She thought, *He is sitting somewhere, on a Tuesday night, having read those two messages, and he is doing nothing about it.*

The three dots returned.

> *In Sam's defence — and Sam will not want me to say this — he doesn't think they're nice. He thinks they're "approximately symmetrical, structurally adequate".*

A pause. Then:

> *Direct quote.*

Maeve stared at the phone.

A new message.

> *He also wants me to add that this is the funniest thing that has happened to him in eleven months and he is very, very sorry it has happened to you.*

Maeve put the glass of red back down on the coffee table without drinking from it.

She typed: *Sam are you talking about yourself in the third person.*

The reply came back instantly.

> *Yes.*

Then, after a beat:

> *It is making this easier.*

Maeve laughed. She actually laughed, out loud, alone in her flat at eleven fifty-three on a Tuesday, the laugh of a person who has been ambushed by a small joke and has had no choice in the matter. She put her hand over her mouth as if there were someone in the room to hear it.

She typed: *Sam I genuinely thought I was going to be fired.*

> *No.*

> *I am, however, going to remember this in every single one-on-one for the rest of the calendar year.*

> *I'm sorry to be that kind of person. It's a character flaw.*

* * *

**Maeve, 11:55pm**

She wrote out three replies. She sent none of them. She sat with the phone in her lap and she thought about the way she had been at work for six weeks now, and the careful flat formal cordiality she had constructed in every interaction with the man whose office was twelve feet from her desk, and the way he had matched her formality back, perfectly, the way a good dance partner matches a step, and how the entire constructed elaborate fortress of professional distance she had spent six weeks building had just been demolished, in three lines, by her own thumb, on a Tuesday night, by accident, in front of the man she had been most successfully constructing it against.

She wrote: *Okay then.*

She deleted it.

She wrote: *Goodnight Sam.*

She did not delete that. She did not send it either. She held it.

A new message arrived before she sent.

> *Maeve.*

Then:

> *For what it's worth.*

A pause that felt long.

> *The Q3 forecast is fine. The strategy sync is going to be twenty minutes of me pretending I haven't read this. Get some sleep.*

A beat. Then:

> *And —*

A longer beat.

> *— for the record, your line about my shoulders was the best sentence anyone has written about me since the inscription in my secondary-school yearbook, which read* "Sam is a tall boy". *I'm going to think about your line for the rest of the night and I'm going to be unbearable about it tomorrow. Goodnight, Doyle.*

Maeve held the phone.

She did not type anything for a long time.

She wrote, finally: *Goodnight, Hartigan.*

She sent it.

She put the phone down. She did not pick it up again. She turned off the lamp. She went to bed. She did not sleep for forty minutes, and the sentence she could not stop thinking, the one that would still be there in the morning when she opened her eyes and remembered what she had done, was not anything either of them had typed.

The sentence she could not stop thinking was:

*I'm going to think about your line for the rest of the night.*

She lay in the dark and she thought: *Well, that's a problem.*

And she thought: *I am going to think about that line for the rest of mine.*$body$);

  -- ============================================================
  -- BOOK 4 — The Morning of the Marriage (Thriller, ongoing)
  -- ============================================================
  INSERT INTO stories (author_id, title, slug, description, genre, status, cover_color, is_mature, published_at)
  VALUES (
    v_user_id,
    'The Morning of the Marriage',
    'morning-of-the-marriage-' || substr(md5(random()::text), 1, 6),
    'Joanna Marsh wakes up next to a husband she doesn''t remember marrying. Her wedding album is on the nightstand. Her phone says it''s September. The last thing she remembers is March. Aaron, downstairs making coffee, seems to genuinely love her. Her best friend is delighted she''s "back." Joanna has to figure out which version of her own life is the lie before whoever did this to her notices she''s waking up.',
    'thriller',
    'ongoing',
    '#3F4956',
    false,
    now()
  )
  RETURNING id INTO v_story_id;

  INSERT INTO chapters (story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
  VALUES (
    v_story_id, 1, 'September',
    'I wake up because the light is wrong. The light is wrong, and the side of the bed I am on is wrong, and the weight of the duvet is wrong, and the smell of the room is wrong, and the alarm clock on the nightstand is a wooden one with brass hands.',
    1653, 7, true, now()
  )
  RETURNING id INTO v_chapter_id;

  INSERT INTO chapter_content (chapter_id, body) VALUES (v_chapter_id, $body$I wake up because the light is wrong.

The light is wrong, and the side of the bed I am on is wrong, and the weight of the duvet is wrong, and the smell of the room is wrong, and the alarm clock on the nightstand is a wooden one with brass hands and I have never owned a wooden alarm clock with brass hands in my life.

These observations arrive in this order, in the first four seconds after my eyes open, and I keep them inside the four seconds because I have learned not to move when I do not know where I am.

I do not move.

I lie on my left side and I look at the wooden alarm clock and the brass hands say seven fourteen. I can see, just past the alarm clock, an open book — a hardback, face down, the spine cracked — and I can see, behind the book, a small framed photograph in a silver frame, and I cannot see the photograph because the photograph is angled away from me, towards the empty side of the bed I am not lying on.

The empty side of the bed I am not lying on is warm. I can feel the warmth of someone else against my back through the duvet. Recent warmth. Within-the-last-five-minutes warmth.

I keep not moving.

I listen.

The room has a high ceiling. I can tell from the way my breath sounds. There is no road noise. There is — somewhere — the faint, domestic sound of a kettle reaching the boil and clicking off. There are footsteps, slow, in another room. There is the small companionable clatter of cups on a wooden surface.

There is a man humming. Tunelessly. The kind of humming a person does when they are alone in a kitchen and they think no one can hear them.

I do not recognise the humming.

I move very slowly. I roll onto my back. The duvet is heavy and white and the cover is some kind of soft brushed cotton and I have never owned a duvet cover like this either. There is a long mirror on the far wall and in the long mirror I can see a woman lying on her back in a high-ceilinged bedroom in a soft brushed cotton duvet, and the woman is me.

The woman is me, and the woman is wearing a wedding ring.

I lift my left hand, very slowly, and I look at it.

The ring is a thin gold band. The ring is a thin gold band and there is a smaller diamond ring above it, and the diamond is set in a way I do not recognise, and the rings fit, and they fit in the way rings fit when they have been worn every day for months, with a small smooth indent in the skin underneath them that is the colour of the rest of my finger but slightly paler, the way the skin under a ring goes when the ring has lived there for long enough that the finger has agreed to it.

I have never owned a wedding ring.

* * *

I get up. I do not know what else to do.

I get up the way you get up in a stranger's house — with care, with a feeling that there are eggs in the floor — and I cross the room to the long mirror and I look at myself, properly, in the morning light from the wrong window.

My hair is longer than it was. My hair is six inches longer than it was. I had it cut, in March, into a bob, and I remember the woman who cut it — Mira's hairdresser, the one in De Beauvoir, the small Lithuanian woman who told me my hair was, quote, *wasted on me* — and I remember walking back to Mira's flat afterwards, with the new bob, in March, in a light coat, in a cold spring, and the hair in the mirror now is past my shoulders.

I touch it.

It is mine. It is attached. It has been growing for — I count — at least four months. Possibly five.

I look at my face. I look at my own face for a long time. My face is the face I have always had. My face is also the face of a woman who has been sleeping reasonably well, who has been eating properly, who has — judging by the slight tan at the collarbones — been outside more than I have been outside in any spring I can remember.

I look healthy. I look, in the morning light from the wrong window, in someone else's bedroom, in a thin gold band I do not remember being given, *well*.

This is the most frightening observation of the four seconds since my eyes opened.

* * *

I find a robe on a hook on the back of the door. The robe is a robe I would buy. It is a robe I would buy in a slightly more expensive shop than I would usually go into, and I would buy it in the slate-grey colour, and the robe is slate-grey, and the robe is my size, and the robe is on the back of a door in a bedroom I do not remember.

I put it on.

I walk to the door. I put my hand on the doorknob — also wooden, also brass, also unrecognised — and I stand there for a long time.

Whoever is humming downstairs has stopped humming. Whoever is humming downstairs has — I can hear it — opened a cupboard and taken something out and is now opening a fridge and pouring something. Milk, probably. Into a mug. A mug for me. I do not know how I know this.

I open the door.

* * *

The landing is tasteful. There is a runner. The runner is the colour you would choose if you had asked a slightly more expensive interior designer than I have ever spoken to in my life, and she had asked you what colour you liked, and you had said *warm but not warm,* and she had nodded and gone away and come back with this exact runner.

There is a framed photograph in the hall. I look at it because I cannot help myself. The photograph is of me and a man, in a register office, in front of a small bouquet, and the man is laughing. I am laughing too. We are both laughing in the photograph the way people who have just done a thing they were nervous about and then enjoyed laugh, and I am wearing a cream silk dress I have never owned.

I am wearing my hair past my shoulders. I am wearing the slate-grey of the robe in a slightly different cut on the man's lapel. I am holding the man's hand and the man's hand is the hand of a man I have never seen before in my life.

I make myself look at his face.

The man in the photograph is in his middle thirties. He has dark hair. He is, I would say, kind-looking. He has a small scar above his right eyebrow that is the kind of scar a child gets from falling off a bike at the age of nine and never tells the story of properly because the story is dull. He is looking at me, in the photograph, with the kind of look I do not think anyone has ever looked at me with.

I do not know his name.

I take a breath. I take a long quiet breath, in through my nose, the way I was taught at the only therapy session I ever paid for, in March, the week before the bob, the breath in to a count of four and out to a count of six, and I hold the count, and I let it out.

I walk to the top of the stairs.

I look down.

He is at the bottom of the stairs. The man from the photograph. He is at the bottom of the stairs in a soft grey jumper and pyjama bottoms and bare feet, and he is holding a mug of tea — milk, no sugar, the way I take it — and he is looking up at me with an expression I cannot, at this exact moment, parse.

He smiles at me.

He says, 'Morning, you. I brought you tea. You're up early.'

His voice is kind. His voice is kind and easy and the voice of a person who has said these exact words to me, in this exact order, on a great many other mornings, and has come to enjoy saying them.

I stand at the top of the stairs.

I am wearing a thin gold band on my left hand and a slate-grey robe I do not own and my hair is six inches longer than it was the last time I looked, and the last thing I remember before this morning is sitting on Mira's sofa in De Beauvoir in March eating Chinese takeaway and telling her, with great certainty, that I was never getting married, and the man at the bottom of the stairs has brought me tea, and is waiting for me to come down.

I make the small adjustment I will need to make for the next thirty-six hours.

I smile back.

I say, 'Morning. Thank you. I'll just brush my teeth.'

He nods. He says, 'Take your time. I've got nowhere to be.'

I turn around. I walk back across the landing. I walk into the bathroom I have not seen before. I close the door. I lock the door. I sit down on the floor. I do not cry.

I think, very clearly:

*Whatever I do next, he cannot know.*$body$);

  -- ============================================================
  -- BOOK 5 — Last Sky in Aberlour (Sci-fi / speculative literary, ongoing)
  -- ============================================================
  INSERT INTO stories (author_id, title, slug, description, genre, status, cover_color, is_mature, published_at)
  VALUES (
    v_user_id,
    'Last Sky in Aberlour',
    'last-sky-in-aberlour-' || substr(md5(random()::text), 1, 6),
    'In the year the lochs went sour, the Memory Office in Aberlour opens its doors and starts buying memories from anyone who''ll sell. They pay in cash. The cash is real. The memories — they swear — are stored safely. Iris Tweedie, sixty-seven, widow, has a memory she has been carrying alone for forty-two years. On a Tuesday in May, she walks down to the post office and asks how much.',
    'scifi',
    'ongoing',
    '#A87142',
    false,
    now()
  )
  RETURNING id INTO v_story_id;

  INSERT INTO chapters (story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
  VALUES (
    v_story_id, 1, 'The lochs went sour in April',
    'The lochs went sour in April, and nobody was surprised. The papers had been saying it would happen for ten years, in the careful, dispassionate, professionally-cautious way of papers being told to be careful about climate news, and then it happened.',
    1539, 7, true, now()
  )
  RETURNING id INTO v_chapter_id;

  INSERT INTO chapter_content (chapter_id, body) VALUES (v_chapter_id, $body$The lochs went sour in April, and nobody was surprised. The papers had been saying it would happen for ten years, in the careful, dispassionate, professionally-cautious way of papers being told to be careful about climate news, and then it happened the way these things happen, which is to say one Monday morning the loch at Aberlour was a loch and on Tuesday it was something else — a still, brown, sulphurous body of water that smelled wrong if the wind was off it, and that no fish could live in by the end of the week. The herons left first. The herons always leave first. The herons knew.

By May the Memory Office had opened in what used to be the post office on the high street.

There had been notice. There had been a leaflet through every door. The leaflet had been printed on good paper, which was the first thing the people of Aberlour noticed, because Aberlour was the kind of place where leaflets came on the cheap pulpy stuff that smudged in the rain, and the Memory Office leaflet was a thick cream card stock with the letterhead in a sober dark blue. It looked like the kind of leaflet you might get from a bank. It was, in some senses, exactly that.

The leaflet said:

> *Aberlour Memory Office. Opening 11 May. We pay fair rates for unwanted, painful, or simply surplus memories. All transactions confidential. Walk in, or by appointment.*

There was a phone number. There was a small line at the bottom that said *In partnership with HM Government and the University of Strathclyde, Department of Cognitive Continuity.* The line at the bottom was the one most people read twice.

The Memory Office opened on the eleventh of May, on a Wednesday, on a quiet damp morning where the loch was still loch-shaped but had stopped smelling like a loch, and at half past nine the first person walked in, and at half past nine and three minutes the first person walked out, and by the end of the first week the Memory Office had transacted with fourteen people, and the people of Aberlour had begun, quietly, in shops and at the bus stop, to speak of it.

* * *

Iris Tweedie read the leaflet in her kitchen on the morning of the twelfth.

She read it once at the kitchen table while the kettle was warming up. She set it down. She made the tea. She drank half the cup. She picked the leaflet up again. She read it a second time. She set it down. She finished the cup. She walked to the back door and looked at the garden — the small square of grass, the rose her husband had planted in the eighties that hadn't flowered properly since the year he died, the brown line on the fence that was the new flood mark — and she said, out loud, to the garden:

'Well, then.'

She picked the leaflet up a third time, folded it twice along the creases the postman had given it, slipped it into the pocket of the cardigan she wore to walk into town, and put the cardigan on, and put on her shoes, and walked down the high street to the post office to look at the board in the window.

The board in the window was the second thing the people of Aberlour spoke about. The board listed, in the same sober dark blue, the categories of memory the Memory Office was buying that week, and the rates. The rates were what made you stop on the pavement.

The board read, on the twelfth of May:

> *This week we are buying:*
>
> *General — pleasant, mid-strength, mid-clarity: £80*
> *General — neutral, archival quality: £120*
> *Specific event — distressing, intact: £400*
> *Specific event — distressing, vivid: £900*
> *Long-carried — held privately for over twenty years: rates by valuation*
> *Long-carried, never disclosed: rates by valuation, premium*
>
> *We do not buy childhood-formative memories or memories required for current legal proceedings. We strongly advise against selling memories tied to active grief.*

Iris Tweedie read the board. She read it twice. She read the second-to-last line three times.

She stood on the pavement outside the old post office, sixty-seven, widow, born 1967 in this town to a man who had taught at the school and a woman who had typed at the bank, married in this town to a man who had repaired clocks in a shop now closed, mother to a son who lived in Edinburgh and called her on Sundays, holder of a memory she had been carrying privately for forty-two years and had never disclosed, and she felt the leaflet in her pocket, and she did not go in.

Not that day. She turned around. She walked back up the high street. She passed Mrs Munro coming out of the chemist and Mrs Munro said *Lovely day, Iris,* and Iris said *Lovely day, Marion,* and neither of them said anything about the board in the window because there is a thing small towns have where they will not say a new thing out loud until enough people have looked at it that the saying of it is no longer the first time, and the board in the window had only been up a week.

Iris walked home. She made another cup of tea. She sat at the kitchen table. She read the leaflet a fourth time. She read the line *Long-carried, never disclosed: rates by valuation, premium.*

She thought about what *premium* might mean.

She thought about it for a long time. She thought about the rose that hadn't flowered. She thought about the Sunday phone calls from her son. She thought about a particular Tuesday in October 1983 about which the only living person who knew anything was Iris Tweedie, and the only person who had ever been told anything was Iris's husband, who had died in 2017 and had taken the telling of it with him.

She thought, *Premium would be useful.*

She thought, *But that isn't the reason.*

She held the cup of tea with both hands until it had gone quite cold. She said, again, to the empty kitchen, 'Well, then.'

She did not go down to the office that week.

She did not go down to the office the week after.

She went down on a Tuesday at the end of May, just before noon, when the high street was quiet because Tuesday-late-morning is quiet in Aberlour. She wore her good blouse under the cardigan. She did not know why she wore the good blouse. She walked the length of the high street. She paused outside the post office. She read the board again — the rates had not changed, the last line had not changed — and she pushed open the door.

There was a small brass bell on a curved arm that rang above her head. She had heard that bell every week of her life until they closed the post office in 2019, and the bell sounded exactly the same as it had sounded then, and she found, standing in the doorway, that she had not realised how much she had missed the sound of it.

A man behind a counter looked up. He was about forty. He was wearing a navy jumper and reading glasses on a chain. He smiled at her — a small, careful, professionally-warm smile — and he stood up.

He said, 'Mrs Tweedie, isn't it. From the gardens up by the church.'

She said, 'Yes. Iris.'

He said, 'Robert Ferguson. Pleasure to meet you. Please, come in. Would you like to sit down?'

She sat down. He sat down. There was a wooden table between them and on the table there was a folder and a fountain pen and a small dark-blue card-bound book that said *Aberlour Memory Office — Intake Log* in gold on the cover.

Mr Ferguson said, very gently, 'May I ask what's brought you in today?'

Iris Tweedie took a long breath. She took it the way her mother had taught her to take a breath before saying a difficult thing at the parish council. She put her hands flat on the table.

She said, 'I have a memory I have carried for forty-two years, and I have told no one, and I would like to know what you would pay for it.'

Mr Ferguson did not write anything down.

He looked at her for a long moment, and the careful professional warmth of the smile became something quieter and more attentive, and the air in the small office took on the quality of a room in which the only two people in it have understood the same thing at the same moment.

He said, 'Mrs Tweedie. May I make us both a cup of tea first.'

She said, 'I think you'd better.'

He stood up.

The brass bell on the curved arm above the door, in the still air of the small front room of the old post office in Aberlour, on the last Tuesday in May in the year the lochs went sour, made no sound at all.$body$);

  RAISE NOTICE 'Seeded 5 NovelStack Originals stories for user %', v_user_id;
END;
$script$;
