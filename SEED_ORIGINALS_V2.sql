-- NovelStack Originals — v2 (commercial / BookTok register)
-- Replaces the 5 literary originals with 5 mass-market hooks:
--   1. The Housekeeper's Lie (thriller, marketing hero)
--   2. Bound by the Don (mafia romance)
--   3. The Frostbound Court (fantasy romance — ACOTAR-coded)
--   4. The Almost (contemporary romance — Emily Henry-coded)
--   5. The Hollow Hour (YA dark academia / paranormal)
--
-- HOW TO RUN (same as before): exit psql back to bash, then
--   curl -sL '<your raw gist URL>' | psql $DATABASE_URL
--
-- This script:
--   a. Finds your @novelstackoriginals account by email.
--   b. Deletes the 5 existing literary stories owned by that account (cascades
--      to their chapters / chapter_content / reads / etc).
--   c. Inserts the 5 new commercial stories with chapter 1 of each.
-- Real reader accounts and non-NovelStack-Originals authors are untouched.

DO $script$
DECLARE
  v_user_id uuid;
  v_story_id uuid;
  v_chapter_id uuid;
  v_deleted int;
BEGIN
  SELECT id INTO v_user_id FROM users WHERE email = 'deenali3@outlook.com';
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found for deenali3@outlook.com — sign into the app first.';
  END IF;

  -- ============================================================
  -- WIPE the old 5 literary originals owned by this account.
  -- ============================================================
  WITH d AS (
    DELETE FROM stories WHERE author_id = v_user_id RETURNING id
  )
  SELECT count(*) INTO v_deleted FROM d;
  RAISE NOTICE 'Deleted % existing stories from @novelstackoriginals', v_deleted;

  -- ============================================================
  -- BOOK 1 — The Housekeeper's Lie (Thriller — MARKETING HERO)
  -- ============================================================
  INSERT INTO stories (author_id, title, slug, description, genre, status, cover_color, is_mature, published_at)
  VALUES (
    v_user_id,
    'The Housekeeper''s Lie',
    'housekeepers-lie-' || substr(md5(random()::text), 1, 6),
    'Maeve takes a job cleaning for a wealthy couple in a Belgravia townhouse. Three weeks in, she finds a photograph of herself in the wife''s bedside drawer, taken when she was twelve. The wife she''s been working for, six days a week, has been waiting for her.',
    'thriller',
    'ongoing',
    '#3F4956',
    false,
    now()
  )
  RETURNING id INTO v_story_id;

  INSERT INTO chapters (story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
  VALUES (
    v_story_id, 1, 'The Drawer',
    'The photograph was in the drawer of the bedside table on the wife''s side of the bed. The one with the lavender hand cream and the rolled-up silk eye mask and the half-empty pack of Nytol that Maeve had been politely not noticing for three weeks.',
    1400, 6, true, now()
  )
  RETURNING id INTO v_chapter_id;

  INSERT INTO chapter_content (chapter_id, body) VALUES (v_chapter_id, $body$The photograph was in the drawer of the bedside table on the wife's side of the bed. The one with the lavender hand cream and the rolled-up silk eye mask and the half-empty pack of Nytol that Maeve had been politely not noticing for three weeks.

She had not meant to look.

She had been changing the sheets. The drawer was open. The drawer had not been open when she came in — Maeve was certain of that, she was always certain of that, it was one of the things she was paid to be certain of — and now the drawer was open, and there was a photograph on top of the silk eye mask, face-up.

Maeve looked at the photograph.

The photograph was of a girl, maybe twelve, maybe thirteen, in a school uniform Maeve recognised. The girl's hair was pulled back in a French plait that someone else had done for her, badly, the left side flattening down where it shouldn't have. There was a small chip in the girl's front tooth, just visible because the girl was almost-smiling, the way kids do when someone they don't quite trust is taking the photo.

The school uniform was St Brigid's. Navy blazer. Red piping. The badge on the breast pocket sewn on slightly crooked because Maeve's mother had sewn it on at eleven o'clock the night before the first day of Year 8, and Maeve's mother had been three glasses in by then, and had said *that's good enough, it's good enough,* and had gone to bed.

Maeve dropped the sheet she was holding.

The girl in the photograph was Maeve.

* * *

Maeve's hands did not shake. This was a thing she had taught them, over years, not to do. They did not shake when her mother died. They did not shake when the man at the council told her there was nothing they could do about the rent. They did not shake when the agency phoned to say the Belgravia couple had specifically asked for her, by name, and the bonus would be three hundred pounds a week on top of the agency rate, and she had said yes before she had finished the call because three hundred pounds a week was three hundred pounds a week.

Her hands did not shake now.

She picked the photograph up by the corner, the way she had picked everything up by the corner her whole life, because that was how you did it if you wanted to keep something nice. She held it up. She turned it over.

On the back, in handwriting Maeve did not recognise, in blue biro, was written:

> Maeve Brennan. Age 12. St Brigid's, autumn term 2009.

Underneath, in a different hand — same blue biro, smaller, sharper:

> Found her.

* * *

The first day Mrs Wakeham had opened the door of the townhouse to Maeve, three weeks ago to the day, she had said, 'Oh. Yes. Come in.'

Mrs Wakeham was in her early fifties. Mrs Wakeham was thin in the way that some women in Belgravia were thin — not from happiness, not from health, from a kind of vigilance. She wore cashmere in a colour that was somewhere between dove and bone. She had small expensive hands.

She had said, that first day, while Maeve stood in the marble hallway with her cleaning kit and her shoes off because the agency notes had said shoes off, 'You're younger than I thought.'

Maeve had said, 'I'm twenty-eight.'

Mrs Wakeham had said, 'No, that's about right. I was thinking of you as a girl, somehow.'

Maeve had not known what to say to that. She had said, 'Where should I start?'

Mrs Wakeham had said, 'Anywhere. You decide. I'm sure you know what you're doing.'

And Mrs Wakeham had walked away down the long marble hallway in her cashmere the colour of bone, and Maeve had thought, *she's lonely, that one,* and had started in the kitchen because the kitchen was always where you started, and had not thought any more about *I was thinking of you as a girl, somehow,* until three weeks later when she opened a drawer she had not opened, and saw a photograph she had not been meant to see, and read, on the back, in handwriting she did not know:

> Found her.

* * *

She had to leave the bedroom. She could not leave the bedroom with the sheets half-done. She had to finish the sheets first. She had to finish the sheets first because if she didn't finish the sheets first, Mrs Wakeham would know that something had happened, and Maeve had not yet decided what Mrs Wakeham was allowed to know.

She put the photograph back into the drawer. She did not slide the drawer shut. She left it the way she had found it — open, the photograph face-up on the silk eye mask, the lavender hand cream upright, the half-empty pack of Nytol slightly askew. She tucked the corner of the fitted sheet around the mattress. She smoothed the duvet. She plumped the four pillows in the order she always plumped them — the two small ones first, then the two large ones, then the small ones back on top — and she stood in the doorway, and she looked at the bed, and she made it look as if no one in this room had done anything other than change the sheets.

Then she went downstairs.

Mrs Wakeham was in the morning room with a cup of green tea and a book she was not reading. Maeve knew Mrs Wakeham was not reading the book because Mrs Wakeham had been on page 47 of *The Salt-Wind Almanac* for nine days, and Maeve had been dusting around the book for nine days, and the bookmark had not moved.

Maeve said, 'Mrs Wakeham, I've finished upstairs. I'll do the front room next.'

Mrs Wakeham looked up from the book she was not reading.

Mrs Wakeham said, 'Maeve, dear. Have you got a moment? Sit down. I think we should have a little chat.'

Maeve's hands did not shake.

She sat down on the small embroidered chair opposite Mrs Wakeham, the chair that Mrs Wakeham had once told her had been her grandmother's, a wedding gift in 1947, *please do sit on it, that's what it's for, dear,* and she folded her hands in her lap.

She said, 'Of course, Mrs Wakeham. What about?'

Mrs Wakeham put her cup of green tea down on the marble side table. The cup made a small definite sound against the marble. The sound was the sound of a woman who had decided, some time ago, exactly when she was going to put the cup down.

Mrs Wakeham said, 'You were a pupil at St Brigid's, weren't you, dear. From 2008. Autumn term, Year 8.'

Maeve looked at Mrs Wakeham.

Mrs Wakeham looked back.

Mrs Wakeham said, very gently, 'I've been waiting for you for a very long time, Maeve. Please don't be frightened. We have rather a lot to talk about.'

And in the morning room of the Belgravia townhouse, on a Tuesday in November, with the cup of green tea on the marble side table making its small definite sound against the silence, Maeve Brennan — who had not let her hands shake when her mother died, who had not let her hands shake when the council man had said *there is nothing we can do*, who had not let her hands shake when she had picked up a photograph of her twelve-year-old self out of a drawer she had not been meant to open — Maeve Brennan felt her hands begin, very quietly, to shake.

She did not stop them.

She said, 'Who are you.'$body$);

  -- ============================================================
  -- BOOK 2 — Bound by the Don (Mafia romance)
  -- ============================================================
  INSERT INTO stories (author_id, title, slug, description, genre, status, cover_color, is_mature, published_at)
  VALUES (
    v_user_id,
    'Bound by the Don',
    'bound-by-the-don-' || substr(md5(random()::text), 1, 6),
    'Sienna Russo''s father owes the Castellanos four million. She''s the collateral. Six months as Niccolò Castellano''s "fiancée," and at the end of it she walks free. The contract is clean, the terms are clear, and her father has signed it. Niccolò Castellano did not get her father''s permission to negotiate the contract Sienna actually signed.',
    'romance',
    'ongoing',
    '#1A1714',
    true,
    now()
  )
  RETURNING id INTO v_story_id;

  INSERT INTO chapters (story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
  VALUES (
    v_story_id, 1, 'The Contract',
    'The Don of the Castellano family was wearing a charcoal three-piece suit, no tie, the top button of his shirt undone, and he was reading a contract. He had been reading it for four minutes and twelve seconds. Sienna had been counting.',
    1450, 6, true, now()
  )
  RETURNING id INTO v_chapter_id;

  INSERT INTO chapter_content (chapter_id, body) VALUES (v_chapter_id, $body$The Don of the Castellano family was wearing a charcoal three-piece suit, no tie, the top button of his shirt undone, and he was reading a contract.

He had been reading it for four minutes and twelve seconds. Sienna had been counting.

She had been counting because the alternative was thinking about the fact that her father, sitting next to her, had not lifted his head once since they had walked into the room. Her father was looking at his shoes. Her father, who had bounced Sienna on his shoulder at her First Communion, who had run a restaurant in Bensonhurst for thirty-one years, who had once made the entire Russo family stand up at a wedding and call her *la regina* until she had cried with laughing — her father was looking at his shoes, in front of a man whose name was a sentence the rest of New York used to end conversations.

Niccolò Castellano turned a page of the contract.

Sienna watched him turn it.

He had — and she hated that she had noticed this, hated it, was filing it under *things to be furious about later* — beautiful hands. The hands of a man who had not done a day of physical labour in his adult life and yet had, somehow, the knuckles of one who had. Long fingers. A signet ring on the smallest finger of his right hand, a Castellano family crest worn down by four generations of Castellano sons turning it absently when they read contracts.

He was turning it now.

Sienna stared at the ring. She stared at the ring because she would not, she absolutely would not, stare at his face.

* * *

The face was a problem.

The face was a problem because the face belonged to a man who, in any other context, in any other life, on the cover of any other magazine, Sienna would have stopped on the street to look at twice. Dark hair, cut short the way men cut their hair when they did not want anyone to comment on it. A jaw that looked engineered. Eyes the colour of espresso left in the cup for a minute too long, which was a thing Sienna had never thought about an eye colour before, and which she would have very much liked to un-think now, please.

He was thirty-four. The internet had told her that, last night, at three in the morning, when she had not been sleeping. He had taken over the family three years ago when his father had been arrested. The internet had also told her that no one called him Nico. The internet, in fact, had implied, in the careful indirect way of internet sources that did not wish to be named, that the last person who had called him Nico had not called anyone anything, since.

He was, the internet had said, ruthless.

Sienna had read the word *ruthless* about him in three separate articles, last night, at three in the morning, and she had thought — sitting in her childhood bedroom in Bensonhurst, with the wallpaper she had picked when she was eleven, with a glass of her father's wine on the bedside table, with the contract that she would sign in eleven hours sitting unopened on the duvet — *good. Let him be ruthless. Ruthless I can work with.*

* * *

He turned the last page.

He closed the contract. He laid it flat on the desk. He placed the fountain pen — a Montblanc, of course it was a Montblanc, Sienna noticed in the part of her brain that was still cataloguing — on top of the contract, parallel to the top edge.

He looked up.

He did not look at her father.

He looked at her.

He said, 'Miss Russo.'

His voice was lower than she had been expecting. Quieter. The voice of a man who had never in his life needed to raise it.

He said, 'Have you read this.'

She said, 'Yes.'

He said, 'All of it.'

She said, 'All of it.'

He said, 'Page seventeen.'

She had been waiting for page seventeen.

She had been waiting for page seventeen since two o'clock in the morning, when she had reached page seventeen for the first time in her childhood bedroom in Bensonhurst, and had read clause 4.2(c) twice, and had sat very still for a long time, and had said — out loud, to the wallpaper she had picked when she was eleven — *oh, you absolute prick.*

She had then, very calmly, picked up her pen, and changed clause 4.2(c).

She had initialled the change.

She had put the contract on top of the duvet.

She had finished her father's wine.

She had gone to sleep.

* * *

Niccolò Castellano was looking at her.

He said, 'You altered clause 4.2(c).'

She said, 'I did.'

He said, 'Your father did not authorise that alteration.'

She said, 'My father is not signing this contract. I am. The terms in 4.2(c) as drafted were unacceptable. I have made them acceptable. If you would also like to make them acceptable, you may initial the change. If you would not, we will go home, and you will collect my father''s debt the long way.'

There was a silence.

The silence was very large.

The silence was, in fact, the largest silence Sienna had ever sat in.

Her father did not move.

Niccolò Castellano did not move.

The clock on the marble mantelpiece behind him made a small mechanical sound.

* * *

Then Niccolò Castellano did something Sienna had not expected.

He smiled.

It was a small smile. It was not a friendly smile. It was the smile, Sienna would think later, of a man who has been bored for a very long time and has, very suddenly, become unbored.

He picked up the Montblanc.

He turned the contract to page seventeen.

He read her amended clause 4.2(c).

He read it twice.

He looked up at her, and the small not-friendly smile became something quieter, and he initialled the change.

He pushed the contract across the desk towards her.

He said, 'Sign it, Miss Russo.'

And then, just as her fingertips touched the pen, he said — softly, in the same quiet voice he had not raised, would not need to raise, would not raise for the entire six months that were about to follow —

'Sienna.'

She looked up.

He was watching her with his espresso eyes.

He said, 'You should read clause 11.4 a little more carefully. You''ll find I altered it, too.'

She did not read clause 11.4.

She did not look down.

She signed.

The pen made a small precise sound against the paper, in the silence of the front room of the Castellano family compound, on the morning of October the seventeenth, in the year that Sienna Russo's life — although she did not yet know this, although she would not know it until she got back to her childhood bedroom in Bensonhurst that evening and finally read clause 11.4 and felt the world tilt forty degrees underneath her — became, in ways she had not authorised, the property of the man across the desk who had smiled at her exactly once, and would do so again, in private, in the back of a black car in the rain, in seventy-three days' time.

She signed her name.

She signed her name and she stood up and she did not look at him again and she left the room, with her father trailing silently behind her, and she got into the back of her father's car, and she said —

'Drive.'

Her father drove.

And it was only when they reached the Verrazzano Bridge, and the lights of Brooklyn were behind them, and her father had not said a single word for forty minutes, that Sienna Russo took the contract out of her bag, and turned to page eleven, and read clause 11.4.

She read it.

She read it again.

She put her head against the cool glass of the car window.

She said, very quietly, to the window, '*Oh, you absolute prick.*'

In her hand, the contract was warm.

In the rear-view mirror, her father's eyes met hers — for the first time that day — and her father, very softly, said:

*'Cara, what have you done.'*$body$);

  -- ============================================================
  -- BOOK 3 — The Frostbound Court (Fantasy romance — ACOTAR)
  -- ============================================================
  -- Body abridged here vs the file — full text is in /originals/08_the_frostbound_court.md
  -- but for the seed we ship the chapter as-is; psql handles long $body$ literals fine.
  INSERT INTO stories (author_id, title, slug, description, genre, status, cover_color, is_mature, published_at)
  VALUES (
    v_user_id,
    'The Frostbound Court',
    'frostbound-court-' || substr(md5(random()::text), 1, 6),
    'When Linnea Vaer crosses into the Frostbound Court to ransom her sister, the High King of Winter offers her a trade: stay one year as his consort, and her sister goes home. The High King has been waiting eight hundred years for someone who isn''t afraid of him. Linnea is the first mortal in eight centuries who hasn''t flinched when his frost reached for her. He intends to find out why.',
    'fantasy',
    'ongoing',
    '#2F3A4A',
    false,
    now()
  )
  RETURNING id INTO v_story_id;

  INSERT INTO chapters (story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
  VALUES (
    v_story_id, 1, 'The Bargain at the Frozen Gate',
    'There were three things every village child along the southern marches knew about the Frostbound Court. The first was that you did not cross the frozen river. The second was that if a sister was taken across by the King of Winter''s wolves, you did not go after them. The third was that the King of Winter had not been seen by a mortal eye in eight hundred years.',
    1550, 7, true, now()
  )
  RETURNING id INTO v_chapter_id;

  INSERT INTO chapter_content (chapter_id, body) VALUES (v_chapter_id, $body$There were three things every village child along the southern marches knew about the Frostbound Court.

The first was that you did not cross the frozen river. Not at the bridge, not in the shallows, not where the ice looked thick and held a child's weight in winter — not ever, not for any reason, not even for the gold that sometimes washed up on the southern bank from the courts on the other side.

The second was that if a sister, or a brother, or a mother, or a husband, was taken across the river by the King of Winter's wolves, you did not go after them. They were gone. You lit a candle, you said the Mourning Prayer, and you let them be gone. To follow them was to be lost.

The third was that the King of Winter had not been seen by a mortal eye in eight hundred years, and that you should pray, every night before you slept, that he never would be again.

Linnea Vaer had been told these three things since she could remember.

She crossed the frozen river anyway.

* * *

The river was four hundred paces wide and it sang under her boots. The ice was thick enough — Linnea had checked at the southern bank, with the iron-tipped staff she had taken from her father's shed — but it was not steady. It hummed. It muttered. Every fifty paces, somewhere far beneath her, the ice cracked with a sound like a hand clap in a great empty hall, and the crack ran away from her under the surface, and Linnea did not stop walking.

She was wearing her sister's winter coat. Her sister was thirteen years old, and her sister was a quarter Linnea's size, and the coat fit her shoulders only because Linnea had hacked the back seam open and tied the sides shut with the leather laces from a pair of her father's boots. The coat did not match her trousers. The coat did not match anything. The coat smelled, faintly, of the soap Linnea's mother had made when their mother was still alive, the one with rosemary and bee balm in it, the soap their mother had used to wash both of them in the wooden tub by the fire when they were small.

Linnea had brought the coat because her sister had not been wearing one when the wolves came.

That was the part Linnea could not stop thinking about. Not the wolves. Not the screaming. Not even the fact that she had been in the back garden when it happened and had run to the gate and watched her sister be carried, very calmly, across the frozen river by an enormous white wolf with eyes the colour of a winter sky.

It was the coat. Her sister had not had the time to put a coat on.

Linnea had brought the coat now. Linnea was going to put the coat on her sister herself, in the throne room of the King of Winter, before she walked her sister back across the river, and if the King of Winter wished to take something in exchange, he could take Linnea, and Linnea would not look back.

She was twenty-two years old.

She had not told her father where she was going.

She had left a note, instead, on the kitchen table, weighted down with the salt pot.

The note had said:

> Da. I have gone to bring Astrid home. Do not follow. I love you.

She had not signed it.

Some things her father would know without signing.

* * *

The northern bank rose out of the mist like something dreaming.

Linnea had not expected the gate.

She had expected — she did not know what she had expected. A wood. A wall of frost. Perhaps a road. She had not expected a gate, taller than any building in her village, taller than the bell tower at Marrow's Cross, made entirely of pale wood the colour of bleached bone, carved into the shape of two enormous interlocking hands holding the world between them.

The gate was open.

The gate had been open, Linnea realised, since the moment she had set foot on the ice.

She walked through it.

* * *

The wolf was waiting on the other side.

It was the wolf. The same wolf. White as new snow, blue-eyed, the size of a small horse. It was sitting — sitting, like a dog at a hearth — on the path beyond the gate, and it was watching her, and it did not move.

Linnea stopped.

She raised the iron-tipped staff. The staff felt, very suddenly, like a stick.

The wolf looked at the staff. The wolf looked at her. The wolf, Linnea would have sworn on her mother's grave, smiled.

A voice — male, low, infinitely amused, coming from somewhere behind the wolf and somewhere inside Linnea's own skull at the same time — said:

*'Put that down, child. You''ll embarrass us both.'*

* * *

The King of Winter was sitting on a chair of black ice.

Linnea did not remember walking to the throne room. She did not remember the wolf turning. She did not remember the gate closing behind her, although she knew it had, because she could no longer hear the river singing.

What she remembered was this.

The King of Winter was sitting on a chair of black ice at the end of a long hall, and the hall was carved from a single piece of pale stone the colour of frost-on-glass, and the King of Winter was holding her sister on his lap.

Her sister was asleep.

Her sister was sleeping with her head against the King of Winter's shoulder, and she was wrapped in a fur the colour of the sky after snow, and she was — Linnea could see, in the great quiet of the hall, in the soft rise and fall of the fur over her sister's small ribs — entirely, completely, unharmed.

The King of Winter was looking down at her sister.

He was holding her, Linnea realised, the way her father had held them both when they were small.

He looked up.

* * *

He was not what she had expected.

He was not, in fact, anything she had been told.

He was old, in the way the mountains were old — not bent, not white, not failing — old in the bones. He had dark hair and skin the colour of pale wood and eyes the colour of the river under the ice she had just walked across, and he was looking at her with an expression that, on any mortal face, Linnea would have called *curious*.

He said, in the voice that had spoken inside her head at the gate, 'Linnea Vaer.'

She did not ask how he knew her name.

She had walked across the frozen river to bargain with the King of Winter. She had assumed he would know her name.

She said, 'I have come for my sister.'

He said, 'I know.'

He said it gently.

He said it the way her father said *I know* when one of them was crying.

* * *

He did not give her sister back.

He stood up, slowly, with her sister in his arms, and he carried her to a small alcove off the side of the throne room where a bed had been made, and he laid her sister down on the furs, and he tucked the furs around her sister's small shoulders, and he stood looking down at her for a long moment.

Then he turned to Linnea.

He said, 'Sit down, Linnea Vaer. I would like to offer you a bargain.'

Linnea did not sit down.

She said, 'You can keep me. Send her home.'

The King of Winter looked at her.

For the first time, Linnea saw something behind the eyes the colour of the river under the ice — something that was not amusement, and was not curiosity, and was not gentleness, and was something else, something she did not have a name for.

He said, 'No.'

He said it quietly.

The King of Winter said:

'I will not keep you. You will not be a prisoner here. You will be my consort. For one year. Beginning at dawn. At the end of which, you will walk freely back across the river, and your sister will be returned to your father at the southern bank, and the wolves of my court will never cross to your village again, in your lifetime or hers.'

He stopped.

He did not extend a hand. He did not reach for her. He stood, in the great quiet of the throne room of the King of Winter, six paces from her, and he looked at her, and he waited.

Linnea said, 'Why.'

The King of Winter looked at her for a very long time.

When he answered, his voice was so quiet that Linnea would not have heard him at all if the hall had not been carved from a single piece of stone that carried sound the way a bell carries it.

He said:

'Because you walked across my river, in your sister''s coat, with an iron stick, and when my wolf met you at the gate you did not flinch. No mortal has come into my hall and not flinched, in eight hundred years. I find I would like to know why.'

* * *

Linnea looked at the King of Winter.

She looked at the alcove, where her sister was sleeping under the furs.

She looked at her own hands, which were holding an iron-tipped staff she had taken from her father's shed, and which were, to her enormous surprise, not shaking.

She said, 'One year.'

The King of Winter inclined his head.

'One year,' he said.

Linnea Vaer took one step forward, and held out her hand.

The King of Winter looked down at her hand.

He did not take it.

He smiled.

He said, 'Not yet, Linnea Vaer. Not until dawn.'

And the lamps in the throne room of the Frostbound Court went out, all at once, in a single quiet exhalation, leaving only the soft blue light of the alcove where her sister was sleeping, and the eyes of the King of Winter, which did not need light to be seen.$body$);

  -- ============================================================
  -- BOOK 4 — The Almost (Contemporary romance — Emily Henry)
  -- ============================================================
  INSERT INTO stories (author_id, title, slug, description, genre, status, cover_color, is_mature, published_at)
  VALUES (
    v_user_id,
    'The Almost',
    'the-almost-' || substr(md5(random()::text), 1, 6),
    'Eva Whitlock has spent four years pretending she''s over her almost-relationship with August Reed. When her sister hires August''s catering company for the wedding Eva is maid-of-honour at, they''ll be working together for nine weekends. Neither of them has told the other what almost happened. Both of them remember it perfectly.',
    'romance',
    'ongoing',
    '#A2516B',
    false,
    now()
  )
  RETURNING id INTO v_story_id;

  INSERT INTO chapters (story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
  VALUES (
    v_story_id, 1, 'Eva · The Catering Quote',
    'Eva was on her sister''s laptop when she saw the name. She had not been looking for the name. She had been looking for the catering quote, because Joss was getting married in seven weeks and Joss had asked Eva to be the maid of honour and Eva had said of course.',
    1550, 7, true, now()
  )
  RETURNING id INTO v_chapter_id;

  INSERT INTO chapter_content (chapter_id, body) VALUES (v_chapter_id, $body$**Eva · 4:47pm, Tuesday**

Eva was on her sister's laptop when she saw the name.

She had not been looking for the name. She had been looking for the catering quote, because Joss was getting married in seven weeks and Joss had asked Eva to be the maid of honour and Eva had said *of course* with the full luminous certainty of a woman who had not yet realised that being the maid of honour involved logistics, and the logistics had now arrived in Eva's lap in the form of a Google Sheet called *J + M Wedding — Vendor Tracking v6* and Eva had been on row seventeen for fifteen minutes pretending to understand the difference between a passed-canapés package and a stationed-canapés package, and then she had clicked the email link in the *vendor* column to confirm a price, and the email had opened in Gmail, and the email had been signed —

*Warmly,*
*August Reed*
*Founder · Reed & Sons Catering*

Eva went very still.

Eva sat in her sister's kitchen with her sister's laptop open in front of her, with a mug of her sister's coffee going cold next to her, with her sister humming in the next room to the playlist her sister had been making for the rehearsal dinner for the last four months, and Eva went very still.

She thought, in the very orderly way she thought about things she did not want to think about, *no.*

She thought, *Joss does not know.*

She thought, *Joss will need to be told. I will tell Joss. I will tell Joss in a minute. I will tell Joss in a minute, but first, I will read this email.*

* * *

The email was about scallops.

The email was three paragraphs long. The first paragraph confirmed the head count — eighty-four — and the per-head rate of the *Coastal Tasting Menu*, which Eva noted was £138 per head, which Eva noted was also £11,592 in total, which Eva noted was a number that had appeared nowhere in Joss's stated wedding budget at any point in the last six months and which Eva would absolutely be addressing later. The second paragraph was an extremely tactful enquiry as to whether the bride and groom had any allergies, dietary preferences, or — and here Eva, despite herself, felt the small smile she had not made in four years tug very faintly at the corner of her mouth — *strongly-held opinions about coriander.*

The third paragraph said:

*Looking forward to working with you on what sounds like a beautiful weekend. Yours warmly, August.*

The signature was a small graphic of a sprig of rosemary.

Eva closed her eyes.

* * *

The first time August Reed had spoken to Eva, four and a half years ago, in the kitchen of a flat in Hackney where neither of them had been entirely sober and Eva had been trying to make a single piece of toast without burning it, August Reed had said —

'You're holding the bread upside down.'

Eva had said, 'Toast doesn't have an upside down.'

August Reed had said, 'It does. The crust on top. The crust gets crispy.'

Eva had said, 'That is the most extra thing I have ever heard a person say about toast.'

August Reed had said, very calmly, 'Eva. I run a catering company.'

That was the first time he had said her name. He had said it before she had told him her name. He had known her name from somewhere — they had been at the same flat warming for two and a half hours and he had been watching her, and she had been pretending not to know, and he had been pretending he wasn't, and the moment he had said *Eva* in the kitchen with the toast had been the moment they had both stopped pretending —

and then Eva had said something witty back, and August had laughed properly, and August's laugh had been the kind of laugh Eva had spent four years not thinking about, and Eva had thought — leaning against the kitchen counter of a flat in Hackney with a piece of toast that was definitely going to burn — *oh. Oh, this is going to be a problem.*

* * *

The problem had lasted seven weeks.

The problem had not been a relationship. They had not slept together. They had not even kissed.

They had eaten dinner together fourteen times.

They had texted, every night, between the hours of eleven pm and one am, for forty-nine consecutive nights.

They had once spent six hours on the phone, in a single call, neither of them sleeping, neither of them quite admitting why they were not sleeping. Eva had been in her flat in Crystal Palace. August had been in his flat in Bow. The phone call had ended at twenty past five in the morning because August's neighbour had begun playing the cello.

They had been, by any honest definition of the word, falling in love.

Then Eva had gone to her mother's for the weekend, and Eva had not come back.

She had not come back because, on the Saturday morning, her mother had said something — small, careless, the kind of thing her mother had been saying Eva's whole life — about the fact that Eva *always did this, Eva, you always do this, you find one and you build the whole thing in your head before you've even met him properly* — and Eva, who had not slept properly in seven weeks, who had been telling no one about August because *there is nothing to tell, Mum, we haven't even, it's not a thing,* had sat at her mother's kitchen table and looked at the cold bowl of porridge in front of her and had realised, with a small bleak certainty, that her mother was right.

Eva had built it all in her head.

August had not said anything. Not once. Not in fourteen dinners, not in forty-nine consecutive nights of texting, not in a six-hour phone call. August had not said *I am falling in love with you*. August had not said *Eva, stay*.

Eva had not come back.

Eva had stopped replying.

Eva had let August's last three text messages sit unread until the read-receipt timer had aged them past the point where reading them would have been anything other than cruel, and then she had read them, and they had said —

*Eva, are you alright.*

*Eva, I'm worried.*

*Eva, please tell me what I did.*

— and Eva had not answered.

That had been four years and three months ago.

* * *

Eva opened her eyes.

She was in her sister's kitchen. Her sister was humming in the next room. The coffee was now definitively cold. The catering quote on the laptop screen said £11,592 for eighty-four people, and the email was signed *August Reed*, and August Reed was going to be at every event in the run-up to her sister's wedding for the next nine weekends, and Eva was going to have to see him.

She was going to have to see him because she had agreed to be the maid of honour.

She was going to have to see him because if she dropped out now, her sister would correctly conclude that Eva had not been okay for a very long time.

She was going to have to see him in eleven days, at the tasting.

Eva put her forehead down on her sister's kitchen table.

The laptop fan ticked, twice.

Eva said, into the wood of her sister's kitchen table, very quietly —

'You absolute idiot, Eva.'

In the next room, Joss called out, cheerfully, '*Eva! How''s the vendor tracker going? Are we on track?*'

Eva did not lift her head.

Eva said, in the voice she had been using for four years, the voice that had successfully concealed every important thing Eva had ever felt from every member of her family —

'*Going great, Joss. Going great.*'

She did, in fact, then begin to cry, very quietly, into the wood of her sister's kitchen table.

She did not stop until the kettle clicked off.

She wiped her face with the sleeve of her cardigan.

She did not tell her sister.

She did, instead, the only thing she could think to do.

She opened a reply to August Reed's email, and she typed, with completely steady hands:

*Hi August,*

*Confirming the head count of 84 and the Coastal Tasting Menu. No allergies. No coriander objections from the bride or groom but I personally would prefer to keep it to a minimum.*

*See you at the tasting.*

*Eva*

She hit send before she could think.

She closed the laptop.

It took August Reed exactly forty-seven seconds to reply.

Her phone, on the kitchen table, made a small bright sound.

She picked it up.

The email was one line.

The email said:

*Eva. It''s good to hear from you. I''ll keep the coriander away.*

There was no signature.

There was no sprig of rosemary.

There was just her name, at the start, in his handwriting-of-an-email, the way he had said it, four and a half years ago, in the kitchen of a flat in Hackney, when she had been holding the bread upside down —

*Eva.*

She put the phone face-down on the table.

She picked it up again immediately.

She put it face-down.

She picked it up again.

She did this seven more times before she made herself stand up, walk into the next room, smile at her sister, and say —

'Joss. Tell me about the canapés.'

Joss told her about the canapés.

Eva did not hear a word.

In her hand, in her pocket, against her thigh — Eva's phone was, for the first time in four years, warm with a message from August Reed.$body$);

  -- ============================================================
  -- BOOK 5 — The Hollow Hour (YA dark academia / paranormal)
  -- ============================================================
  INSERT INTO stories (author_id, title, slug, description, genre, status, cover_color, is_mature, published_at)
  VALUES (
    v_user_id,
    'The Hollow Hour',
    'hollow-hour-' || substr(md5(random()::text), 1, 6),
    'Wren Mercer is admitted to a postgrad institute that doesn''t appear on any map. The other six students all died on the same day, twelve years ago. Wren is the only one who came back.',
    'young_adult',
    'ongoing',
    '#5C2A55',
    false,
    now()
  )
  RETURNING id INTO v_story_id;

  INSERT INTO chapters (story_id, number, title, excerpt, word_count, page_count, is_free, published_at)
  VALUES (
    v_story_id, 1, 'The Letter',
    'The letter arrived on a Tuesday in a black envelope with no return address. Wren found it on the doormat of her bedsit in Camberwell when she came home from her shift at the bookshop, and she carried it up the four flights of stairs to her room without looking at it because she was tired, and the kettle was first.',
    1600, 7, true, now()
  )
  RETURNING id INTO v_chapter_id;

  INSERT INTO chapter_content (chapter_id, body) VALUES (v_chapter_id, $body$The letter arrived on a Tuesday in a black envelope with no return address.

Wren found it on the doormat of her bedsit in Camberwell when she came home from her shift at the bookshop, and she carried it up the four flights of stairs to her room without looking at it because she was tired, and the kettle was first, and the letter could wait.

The kettle boiled.

The letter, on the kitchenette counter, was still black.

Wren made the tea. She sat down on the bed. She looked at the letter.

The letter was addressed:

> *Wren Mercer*
> *Flat 4, 17 Goldthorn Road*
> *London SE5 9JT*

The address was in handwriting. Old handwriting — the kind of handwriting Wren had seen, once, on a card her grandmother had received from a man who had been her grandmother's tutor at Cambridge in the 1950s. Slanting. Confident. A capital W with a flourish that took up more space than it should.

There was no postage stamp.

There was no postmark.

Wren looked at the envelope for a long time.

Then she slid her finger under the flap, and she opened it.

* * *

The letter inside was a single sheet of cream paper.

The cream paper had the weight of something that had been pressed, somewhere, by hand. It had a faint watermark when she held it up to the lamp — two crossed quills inside a circle of laurel — and across the top, in the same slanting capital-W handwriting as the envelope, was a heading:

> ***The Drevenwood Institute***
> *founded 1671*
> *enquiries by letter only*

Wren had never heard of the Drevenwood Institute.

The letter said:

> *Dear Miss Mercer,*
>
> *It is with considerable pleasure that we write to invite you to take up the William Drevenwood Research Fellowship in Comparative Memory at the Institute, commencing the Michaelmas term of this year.*
>
> *The Fellowship is unfunded by external bodies. The Institute provides full lodging, full board, a stipend of £24,000 per annum, and access to the Drevenwood collections. The duration of the Fellowship is one academic year, renewable at the discretion of the Master and Fellows. You will be one of seven Drevenwood Fellows in residence during the academic year.*
>
> *We require no application from you. Your candidacy is settled.*
>
> *If you wish to accept, please be at the corner of Endell Street and Shorts Gardens on the evening of Friday the 28th, at the hour of 8 pm. A car will be sent for you.*
>
> *We do hope you will come.*
>
> *Yours, with very great anticipation,*
>
> *Professor Olwen Brynmor*
> *Master of Drevenwood*

Wren read the letter twice.

She put it down on the bed.

She picked it up.

She read it a third time.

She thought, with the orderly clarity that came over her when she was confronted with something she absolutely did not understand: *this is a scam.*

She turned the letter over.

On the back, in pencil, in a different hand — a hurried hand, a hand that had written quickly because it had not wanted to be seen — was a single line.

The line said:

> Wren. Come. We have been waiting twelve years.

* * *

Wren did not sleep that night.

She made another cup of tea. She made a third. At three in the morning she opened her laptop and she typed *Drevenwood Institute* into the search bar, and the search bar returned nothing — no Wikipedia, no university register, no Google Map result, no news article, no Reddit thread, no Companies House registration, nothing — and Wren sat looking at the blank search results for fifteen minutes, and at the end of the fifteen minutes she added the word *postgrad* to the search, and the search bar still returned nothing, and at the end of another fifteen minutes she added the word *missing* to the search, and the third result was a local newspaper from a town called Lower Hartmoor, in Shropshire, dated June 2013, with the headline:

**Six students of the Drevenwood Institute confirmed deceased after Hollow Hour fire**

Wren stopped breathing.

She did not click on the article for thirty seconds.

When she clicked on it, the article said:

> *Lower Hartmoor — A fire at the historic Drevenwood Institute on the evening of Sunday, the 9th of June, has claimed the lives of all six postgraduate Fellows in residence. A seventh Fellow, Miss W. Mercer, age 5, daughter of the late Professor Halford Mercer, is the only known survivor and was recovered from the south wing in the early hours of Monday morning.*

Wren read the article three times.

Wren had never been to Shropshire.

Wren had never heard of the Drevenwood Institute.

Wren had been five years old, in June 2013. Wren's father — who had been an academic, who had been a quiet man with thinning hair and a smell of pipe tobacco and books, who had once carried her on his shoulders through the British Museum and let her name the bones of every dinosaur — Wren's father had been *Professor Halford Mercer*, but Wren's father had died, the family had always said, in a car accident on the M6 in 2013, on his way home from a research trip he had not told anyone about.

Wren did not remember her father.

Wren did not, in fact, remember anything before her sixth birthday.

She had been told this was because of the trauma of losing her father. She had been told this by every family member, every counsellor, every paediatrician she had been taken to between the ages of six and fourteen. She had been told this so many times that she had stopped, at fifteen, asking, and had begun simply to nod when anyone brought it up.

She had never been told about a fire.

She had never been told about a place called Drevenwood.

She had never been told that she had been *five* years old, in *June 2013,* in the south wing of an institute that no longer existed, that she had been the only one to come back from a fire that had killed six people.

* * *

She read the article a fourth time.

The article was the same.

She read the line — *the only known survivor and was recovered from the south wing in the early hours of Monday morning* — six times.

She sat for a long time on her bed in her bedsit in Camberwell, with the letter on her knees and the laptop open beside her, and she said, into the very quiet room —

'But I'm not dead.'

The laptop screen flickered, twice.

Wren did not move.

The laptop screen settled.

She read the line on the back of the letter again.

> Wren. Come. We have been waiting twelve years.

* * *

On the Friday evening, at eight o'clock, Wren stood on the corner of Endell Street and Shorts Gardens in a coat she had bought from a charity shop that afternoon because none of her own coats had felt right, with a small overnight bag at her feet containing two changes of clothes and the letter and the article she had printed out at the library, and she waited.

She had told her flatmate she was going to a friend's wedding for the weekend.

She had not told anyone else.

The car was a black saloon. It pulled up at exactly eight pm. The driver did not get out. The back door opened by itself.

Wren picked up the bag.

She walked to the car.

She stopped at the open door.

She looked into the back seat.

The back seat was empty.

She got in.

The door closed.

The car pulled away from the kerb.

* * *

The driver did not speak.

The car did not turn on the radio.

The car drove north for what Wren's phone — when she finally remembered to check it, twenty miles up the M1 — said was forty-three minutes. Then the phone lost signal.

Then the phone lost the time.

Then the phone went black.

Wren sat in the back of a black saloon car, on a Friday night in October, somewhere north of London, with no phone and no signal and no map and a letter in her bag from an institute that had burned down twelve years ago, and at some point she realised — calmly, the way she realised most things — that the driver had not, in fact, said where they were going.

She had not asked.

She did not ask now.

The car drove on, into the dark, north and then west and then, when the road narrowed and the trees began, north again — and at some point in the third hour, when the lamps of the last village were behind them, when there were no other cars on the road, when the only sound was the soft hum of the engine and the wet sound of the tyres on a road that had begun, very gradually, to feel less like a road and more like a path — Wren saw, ahead, between the trees, the first lights of the Drevenwood Institute.

The lights of the Drevenwood Institute were not yellow, the way village lights were yellow. They were not white, the way streetlights were white.

The lights of the Drevenwood Institute were, every one of them, a faint and unmistakable blue.

The car slowed.

The car stopped.

The driver, for the first time in the journey, turned in his seat.

The driver was — Wren saw, in the small overhead lamp that had just come on — a young man, perhaps thirty, with a kind, tired face, and he was wearing a dark suit and a small silver pin on his lapel in the shape of two crossed quills inside a circle of laurel.

He smiled at her.

He said, in a voice she had never heard before — warm, slightly amused, a voice that felt as though it had been waiting a very long time to say what it was about to say —

'Welcome home, Wren.'

The door of the car opened by itself.

Wren picked up her bag, and she stepped out, and the lights of the Drevenwood Institute, all of them, blue, rose up around her like a quiet held breath.$body$);

  RAISE NOTICE 'Seeded 5 NEW commercial NovelStack Originals stories for user %', v_user_id;
END;
$script$;
