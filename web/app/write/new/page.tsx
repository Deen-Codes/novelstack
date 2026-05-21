import { createStory } from '../actions';
import { AppHeader } from '@/components/AppHeader';
import { GENRES } from '@/lib/genres';

export const metadata = { title: 'New story — NovelStack' };

export default function NewStory() {
  return (
    <>
      <AppHeader />
      <main className="max-w-xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl font-medium mb-6">New story</h1>
        <form action={createStory} className="space-y-4">
          <div>
            <label className="text-[13px] text-ink-muted block mb-1">Title</label>
            <input
              name="title"
              required
              className="w-full border border-border-soft rounded-lg px-3.5 py-2.5 text-[15px] bg-white"
            />
          </div>
          <div>
            <label className="text-[13px] text-ink-muted block mb-1">Genre</label>
            <select
              name="genre"
              className="w-full border border-border-soft rounded-lg px-3.5 py-2.5 text-[15px] bg-white capitalize"
            >
              {GENRES.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[13px] text-ink-muted block mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              className="w-full border border-border-soft rounded-lg px-3.5 py-2.5 text-[15px] bg-white"
            />
          </div>
          <button
            type="submit"
            className="bg-signal text-paper px-5 py-2.5 rounded-full font-medium text-sm"
          >
            Create story
          </button>
        </form>
      </main>
    </>
  );
}
