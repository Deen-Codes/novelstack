'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function makeExcerpt(body: string) {
  return body.trim().split(/\s+/).slice(0, 200).join(' ');
}

export async function createStory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const title = String(formData.get('title') || '').trim();
  const genre = String(formData.get('genre') || 'other');
  const description = String(formData.get('description') || '').trim();
  if (!title) throw new Error('A title is required.');

  const slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`;
  const { data, error } = await supabase
    .from('stories')
    .insert({ author_id: user.id, title, slug, description, genre, status: 'draft' })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  redirect(`/write/${data.id}`);
}

export async function createChapter(storyId: string, _formData?: FormData) {
  const supabase = await createClient();
  const { count } = await supabase
    .from('chapters')
    .select('id', { count: 'exact', head: true })
    .eq('story_id', storyId);
  const number = (count ?? 0) + 1;

  const { data, error } = await supabase
    .from('chapters')
    .insert({ story_id: storyId, number, title: `Chapter ${number}`, is_free: number <= 3 })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  await supabase.from('chapter_content').insert({ chapter_id: data.id, body: '' });
  redirect(`/write/${storyId}/chapter/${data.id}`);
}

export async function saveChapter(formData: FormData) {
  const supabase = await createClient();
  const chapterId = String(formData.get('chapterId'));
  const storyId = String(formData.get('storyId'));
  const title = String(formData.get('title') || '').trim();
  const body = String(formData.get('body') || '');
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  await supabase
    .from('chapters')
    .update({
      title,
      excerpt: makeExcerpt(body),
      word_count: wordCount,
      page_count: Math.max(1, Math.round(wordCount / 250)),
      updated_at: new Date().toISOString(),
    })
    .eq('id', chapterId);
  await supabase.from('chapter_content').upsert({ chapter_id: chapterId, body });
  revalidatePath(`/write/${storyId}/chapter/${chapterId}`);
}

export async function publishChapter(formData: FormData) {
  const supabase = await createClient();
  const chapterId = String(formData.get('chapterId'));
  const storyId = String(formData.get('storyId'));
  await supabase
    .from('chapters')
    .update({ published_at: new Date().toISOString() })
    .eq('id', chapterId);
  await supabase
    .from('stories')
    .update({ status: 'ongoing', published_at: new Date().toISOString() })
    .eq('id', storyId)
    .is('published_at', null);
  revalidatePath(`/write/${storyId}`);
  redirect(`/write/${storyId}`);
}

export async function toggleChapterFree(formData: FormData) {
  const supabase = await createClient();
  const chapterId = String(formData.get('chapterId'));
  const storyId = String(formData.get('storyId'));
  const makeFree = formData.get('makeFree') === 'true';
  await supabase.from('chapters').update({ is_free: makeFree }).eq('id', chapterId);
  revalidatePath(`/write/${storyId}`);
}
