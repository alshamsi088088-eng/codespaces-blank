import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useLocale } from '../context/LocaleContext';
import { ThreadedComments } from '../components/ThreadedComments';

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
  const [search, setSearch] = useState('');
  const [authorFilter, setAuthorFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const pageSize = 6;

  useEffect(() => {
    axios.get('/api/articles').then((res) => setArticles(res.data.articles));
  }, []);

  const allTags = useMemo(() => ['All', ...Array.from(new Set(articles.flatMap((a) => [a.category, a.language])))], [articles]);
  const authors = useMemo(() => ['All', ...Array.from(new Set(articles.map((a) => a.author)))], [articles]);

  const filtered = useMemo(() => {
    const byCategory = selected === 'All' ? articles : articles.filter((item) => item.category === selected);
    const byAuthor = authorFilter === 'All' ? byCategory : byCategory.filter((item) => item.author === authorFilter);
    const byTag = tagFilter === 'All' ? byAuthor : byAuthor.filter((item) => item.category === tagFilter || item.language === tagFilter);
    const text = search.trim().toLowerCase();
    if (!text) return byTag;
    return byTag.filter((item) => `${item.title} ${item.excerpt}`.toLowerCase().includes(text));
  }, [articles, selected, authorFilter, tagFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [selected, authorFilter, tagFilter, search]);

  useEffect(() => {
    if (paginated.length && !paginated.some((a) => a.id === activeArticleId)) {
      setActiveArticleId(paginated[0].id);
    } else if (!paginated.length) {
      setActiveArticleId(null);
    }
  }, [paginated, activeArticleId]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-8">
        <h1 className="text-4xl font-semibold">{strings.articles}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-sura-ivory/80">
          {locale === 'ar'
            ? 'مجموعة المقالات المنظمة مع قراءة أعمق لكل نص.'
            : 'Browse essays with reading time, author details, and curated categories.'}
        </p>
      </header>
      <div className="flex flex-col gap-4 rounded-3xl border border-sura-ivory/10 bg-sura-ink/70 p-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelected('All')} className={`rounded-full px-4 py-2 text-sm ${selected === 'All' ? 'bg-sura-gold text-sura-dark' : 'border border-sura-ivory/20 text-sura-ivory/80'}`}>All</button>
          {(Array.isArray(categories) ? categories : []).map((category) => (
            <button key={category} onClick={() => setSelected(category)} className={`rounded-full px-4 py-2 text-sm ${selected === category ? 'bg-sura-gold text-sura-dark' : 'border border-sura-ivory/20 text-sura-ivory/80'}`}>{category}</button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === 'ar' ? 'ابحث في المقالات...' : 'Search title/content...'}
            className="rounded-full border border-sura-ivory/20 bg-sura-dark/80 px-4 py-2 text-sm text-sura-ivory outline-none focus:border-sura-gold"
          />
          <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="rounded-full border border-sura-ivory/20 bg-sura-dark/80 px-4 py-2 text-sm">
            {authors.map((author) => <option key={author} value={author}>{author}</option>)}
          </select>
          <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="rounded-full border border-sura-ivory/20 bg-sura-dark/80 px-4 py-2 text-sm">
            {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </select>
          <div className="flex items-center gap-3 text-sm text-sura-ivory/80">
            <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'font-semibold text-sura-gold' : ''}>Grid</button>
            <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'font-semibold text-sura-gold' : ''}>List</button>
          </div>
        </div>
      </div>
      {viewMode === 'grid' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {(Array.isArray(paginated) ? paginated : []).map((item) => (
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
              <button
                className={`mt-4 rounded-full border px-3 py-1 text-xs ${activeArticleId === item.id ? 'border-sura-gold text-sura-gold' : 'border-sura-ivory/20 text-sura-ivory/80'}`}
                onClick={() => setActiveArticleId(item.id)}
              >
                {locale === 'ar' ? 'عرض التعليقات' : 'Open comments'}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(Array.isArray(paginated) ? paginated : []).map((item) => (
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
              <button
                className={`mt-4 rounded-full border px-3 py-1 text-xs ${activeArticleId === item.id ? 'border-sura-gold text-sura-gold' : 'border-sura-ivory/20 text-sura-ivory/80'}`}
                onClick={() => setActiveArticleId(item.id)}
              >
                {locale === 'ar' ? 'عرض التعليقات' : 'Open comments'}
              </button>
            </article>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="rounded-full border border-sura-ivory/20 px-4 py-2 text-sm disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-sura-ivory/80">{page} / {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="rounded-full border border-sura-ivory/20 px-4 py-2 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {activeArticleId ? <ThreadedComments entityId={activeArticleId} entityType="article" /> : null}
    </div>
  );
}
