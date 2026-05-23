'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import {
  createStory as createStoryMutation,
  createChapter as createChapterMutation,
  updateChapter,
  updateStory,
  setStoryStatus,
} from '@/lib/mutations';
import type { StoryGenre } from '@/lib/types';

export async function createStory(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  const title = String(formData.get('title') || '').trim();
  const genre = String(formData.get('genre') || 'other') as StoryGenre;
  const description = String(formData.get('description') || '').trim();
  const isMature = formData.get('isMature') === 'on';
  if (!title) throw new Error('A title is required.');

  const story = await createStoryMutation(user.id, { title, description, genre, isMature });
  redirect(`/write/${story.id}`);
}

export async function createChapter(storyId: string, _formData?: FormData) {
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  const chapter = await createChapterMutation(user.id, storyId, { title: '', body: '' });
  redirect(`/write/${storyId}/chapter/${chapter.id}`);
}

export async function saveChapter(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return;

  const chapterId = String(formData.get('chapterId'));
  const storyId = String(formData.get('storyId'));
  const title = String(formData.get('title') || '').trim();
  const body = String(formData.get('body') || '');

  await updateChapter(user.id, chapterId, { title, body });
  revalidatePath(`/write/${storyId}/chapter/${chapterId}`);
}

export async function publishChapter(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return;

  const storyId = String(formData.get('storyId'));
  // createChapter already stamps publishedAt; publishing here just moves the
  // story out of draft so it becomes publicly visible.
  await setStoryStatus(user.id, storyId, 'ongoing');
  revalidatePath(`/write/${storyId}`);
  redirect(`/write/${storyId}`);
}

export async function toggleChapterFree(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return;

  const chapterId = String(formData.get('chapterId'));
  const storyId = String(formData.get('storyId'));
  const makeFree = formData.get('makeFree') === 'true';

  await updateChapter(user.id, chapterId, { isFree: makeFree });
  revalidatePath(`/write/${storyId}`);
}
