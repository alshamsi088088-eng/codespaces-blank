
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useLocale } from '../context/LocaleContext';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  language: string;
  readingTime: string;
  author: string;
  views: number;
  claps: number;
}

const categories = ['Literature', 'Culture', 'Technology', 'Design', 'Arabic'];

export function ArticlesPage() {
  const { locale, strings } = useLocale();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    axios.get('/api/articles').then((res) => setArticles(res.data.articles));
  }, []);

  const filtered = useMemo(() => selected === 'All' ? articles : articles.filter((item) => item.category === selected), [articles, selected]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-8">
        <h1 className="text-4xl font-semibold">{strings.articles}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-sura-ivory/80">{locale === 'ar' ? 'مجموعة المقالات المنظمة مع قراءة أعمق لكل نص.' : 'Browse essays with reading time, author details, and curated categories.'}</p>
      </header>
      <div className="flex flex-col gap-4 rounded-3xl border border-sura-ivory/10 bg-sura-ink/70 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelected('All')} className={`rounded-full px-4 py-2 text-sm ${selected === 'All' ? 'bg-sura-gold text-sura-dark' : 'border border-sura-ivory/20 text-sura-ivory/80'}`}>All</button>
          {categories.map((category) => (
            <button key={category} onClick={() => setSelected(category)} className={`rounded-full px-4 py-2 text-sm ${selected === category ? 'bg-sura-gold text-sura-dark' : 'border border-sura-ivory/20 text-sura-ivory/80'}`}>{category}</button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm text-sura-ivory/80">
          <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'font-semibold text-sura-gold' : ''}>Grid</button>
          <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'font-semibold text-sura-gold' : ''}>List</button>
        </div>
      </div>
      {viewMode === 'grid' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-3xl border border-sura-ivory/10 bg-black/30 p-6 transition hover:-translate-y-1 hover:bg-black/50">
              <div className="text-xs uppercase tracking-[0.3em] text-sura-gold">{item.category}</div>
              <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-sura-ivory/80">{item.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-sura-ivory/70">
                <span>{item.author}</span>
                <span>•</span>
                <span>{item.readingTime}</span>
                <span>•</span>
                <span>{item.views} views</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-3xl border border-sura-ivory/10 bg-black/30 p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-sura-gold">{item.category}</div>
                  <h2 className="mt-2 text-2xl font-semibold">{item.title}</h2>
                </div>
                <div className="text-sm text-sura-ivory/70">{item.readingTime}</div>
              </div>
              <p className="mt-4 text-sm leading-7 text-sura-ivory/80">{item.excerpt}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-sura-ivory/70">
                <span>{item.author}</span>
                <span>•</span>
                <span>{item.views} views</span>
                <span>•</span>
                <span>{item.claps} claps</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
