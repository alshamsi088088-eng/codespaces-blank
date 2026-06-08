
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useLocale } from '../context/LocaleContext';

interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;
  readingTime: string;
}

interface Novel {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  chapters: Chapter[];
}

const fontSizes = ['text-base', 'text-lg', 'text-xl', 'text-2xl'];

export function NovelsPage() {
  const { locale } = useLocale();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [activeNovel, setActiveNovel] = useState<Novel | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [fontSize, setFontSize] = useState(1);
  const [nightMode, setNightMode] = useState(true);

  useEffect(() => {
    axios.get('/api/novels').then((res) => {
      setNovels(res.data.novels);
      setActiveNovel(res.data.novels[0]);
      setActiveChapter(res.data.novels[0]?.chapters[0]);
    });
  }, []);

  const progress = useMemo(() => {
    if (!activeNovel || !activeChapter) return 0;
    const index = activeNovel.chapters.findIndex((chap) => chap.id === activeChapter.id);
    return Math.round(((index + 1) / activeNovel.chapters.length) * 100);
  }, [activeNovel, activeChapter]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-8">
        <h1 className="text-4xl font-semibold">{locale === 'ar' ? 'الروايات' : 'Novels'}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-sura-ivory/80">{locale === 'ar' ? 'استكشف الروايات مع قارئ مخصص وفهرس فصول.' : 'Explore serialized novels with a chapter reader, progress tracking, and night mode.'}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4 rounded-3xl border border-sura-ivory/10 bg-black/30 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-sura-gold">{locale === 'ar' ? 'رواياتي' : 'My novels'}</div>
          {novels.map((novel) => (
            <button key={novel.id} onClick={() => { setActiveNovel(novel); setActiveChapter(novel.chapters[0]); }} className="block w-full rounded-3xl border border-sura-ivory/10 bg-sura-dark/80 px-4 py-4 text-left text-sm text-sura-ivory transition hover:border-sura-gold/60">
              <div className="font-semibold">{novel.title}</div>
              <div className="mt-2 text-xs text-sura-ivory/70">{novel.description}</div>
            </button>
          ))}
        </aside>
        <article className={`rounded-3xl border border-sura-ivory/10 p-8 ${nightMode ? 'bg-sura-ink/80' : 'bg-sura-cream text-sura-brown'}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-sura-gold">{activeNovel?.title}</div>
              <h2 className="mt-2 text-3xl font-semibold">{activeChapter?.title || '...'}</h2>
            </div>
            <div className="space-y-3 sm:flex sm:items-center sm:gap-3 sm:space-y-0">
              <button onClick={() => setNightMode((value) => !value)} className="rounded-full border border-sura-ivory/20 px-4 py-2 text-sm">{nightMode ? 'Day reader' : 'Night reader'}</button>
              <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="rounded-full border border-sura-ivory/20 bg-transparent px-4 py-2 text-sm">
                {fontSizes.map((size, index) => (
                  <option key={size} value={index}>{`Font ${index + 1}`}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 rounded-3xl bg-black/20 px-4 py-3 text-sm text-sura-ivory/80">
            {locale === 'ar' ? 'تقدم القراءة' : 'Reading progress'}: {progress}%
          </div>
          <div className={`mt-6 space-y-6 ${fontSizes[fontSize]}`}>
            <p>{activeChapter?.content || '...'}</p>
          </div>
          <div className="mt-8 grid gap-3 rounded-3xl border border-sura-ivory/10 bg-black/20 p-4 sm:grid-cols-3">
            {activeNovel?.chapters.map((chapter) => (
              <button key={chapter.id} onClick={() => setActiveChapter(chapter)} className={`rounded-2xl p-4 text-left text-sm transition ${activeChapter?.id === chapter.id ? 'bg-sura-gold text-sura-dark' : 'bg-sura-dark/80 text-sura-ivory/80 hover:bg-sura-dark/100'}`}>
                <div className="font-semibold">{chapter.title}</div>
                <div className="mt-1 text-xs">{chapter.readingTime}</div>
              </button>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
