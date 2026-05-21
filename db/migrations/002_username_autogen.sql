-- Migration 002 — auto-generated usernames
-- ------------------------------------------------------------
-- New accounts no longer pick a username or enter a date of birth at
-- sign-in. handle_new_user() now mints a short, friendly handle like
-- "bravelion63" (adjective + noun + 2-digit number), guaranteed unique.
-- Users can change it later in Settings; DOB is collected later, only
-- if missing, for age-gating.
--
-- Run this in the Supabase SQL editor after migration 001.

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  adjectives text[] := array[
    'brave','quiet','lucky','sleepy','swift','clever','gentle','bold','sunny',
    'witty','calm','merry','keen','cosy','spry','jolly','noble','breezy',
    'plucky','snug','wild','fond','bright','rosy','deft'
  ];
  nouns text[] := array[
    'lion','whale','fox','moth','crow','reed','wren','otter','finch','hare',
    'lynx','heron','badger','robin','quail','stoat','vole','newt','sparrow','marten',
    'reader','scribe','pages','inkwell','novel'
  ];
  adj text;
  noun text;
  candidate text;
  tries int := 0;
begin
  loop
    adj  := adjectives[1 + floor(random() * array_length(adjectives, 1))::int];
    noun := nouns[1 + floor(random() * array_length(nouns, 1))::int];
    candidate := adj || noun || (10 + floor(random() * 90)::int)::text;
    exit when not exists (select 1 from public.users where username = candidate);
    tries := tries + 1;
    -- Fallback after many collisions: append part of the user id.
    if tries > 25 then
      candidate := candidate || substr(new.id::text, 1, 4);
      exit;
    end if;
  end loop;

  insert into public.users (id, username, display_name, date_of_birth)
  values (
    new.id,
    candidate,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      initcap(adj) || ' ' || initcap(noun)
    ),
    -- Still honoured if present (e.g. seed data), otherwise null and the
    -- user is treated as a minor until they set it in Settings.
    (new.raw_user_meta_data->>'date_of_birth')::date
  );
  return new;
end;
$$;
