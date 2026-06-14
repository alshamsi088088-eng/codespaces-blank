import { motion } from 'framer-motion';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { auth, db } from '../firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { WeeklyTargetBanner } from '../components/WeeklyTargetBanner';
import { Link } from 'react-router-dom';

interface FeatureCard { title: string; description: string; }
interface ReadingProgressItem { uid: string; progress: number; }

export function HomePage() {
  const { locale, strings } = useLocale();
  const { user } = useAuth();
  const { mode } = useTheme();
  const isLight = mode !== 'dark';
  const [featured, setFeatured] = useState<FeatureCard[]>([]);
  const [weeklyProgressCount, setWeeklyProgressCount] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const c = {
    bg: isLight ? '#FFFFFF' : '#15212c',
    canvas: isLight ? '#FAF9F7' : 'rgba(200,217,230,0.04)',
    card: isLight ? '#FFFFFF' : '#1c2c3a',
    navy: isLight ? '#2F4156' : '#F5EFEB',
    teal: isLight ? '#567C8D' : '#C8D9E6',
    sky: isLight ? '#C8D9E6' : 'rgba(200,217,230,0.16)',
    border: isLight ? '#E7E2DC' : 'rgba(200,217,230,0.12)',
    muted: isLight ? 'rgba(32,48,63,0.6)' : 'rgba(200,217,230,0.65)',
  };

  useEffect(() => {
    axios.get('/api/content/home').then((res) => setFeatured(res.data.featured)).catch(() => {});
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const q = query(collection(db, 'readingProgress'), where('uid', '==', currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => d.data() as ReadingProgressItem);
      if (!items.length) { setWeeklyProgressCount(0); setWeeklyAverage(0); return; }
      setWeeklyProgressCount(items.filter((i) => Number(i.progress || 0) >= 70).length);
      setWeeklyAverage(Math.round(items.reduce((s, i) => s + Number(i.progress || 0), 0) / items.length));
    });
    return () => unsub();
  }, [user?.id]);

  const encouragement = useMemo(() => {
    if (weeklyProgressCount >= 7) return locale === 'ar' ? 'أداء رائع هذا الأسبوع.' : 'Excellent momentum this week.';
    if (weeklyProgressCount >= 3) return locale === 'ar' ? 'استمر، أنت على الطريق الصحيح.' : 'Keep going, you are on track.';
    return locale === 'ar' ? 'ابدأ بهدف بسيط هذا الأسبوع.' : 'Start with a small goal this week.';
  }, [weeklyProgressCount, locale]);

  const sections = [
    { num: '01', label: locale === 'ar' ? 'مقالات' : 'Articles', to: '/articles', desc: locale === 'ar' ? 'مقالات أدبية وفكرية مختارة بعناية' : 'Curated literary & intellectual essays' },
    { num: '02', label: locale === 'ar' ? 'روايات' : 'Novels', to: '/novels', desc: locale === 'ar' ? 'قصص إبداعية وروايات أصيلة' : 'Original novels and creative fiction' },
    { num: '03', label: locale === 'ar' ? 'معرض' : 'Gallery', to: '/gallery', desc: locale === 'ar' ? 'لحظات بصرية ملهمة ومختارة' : 'A curated gallery of visual moments' },
    { num: '04', label: locale === 'ar' ? 'تقنية' : 'Tech', to: '/tech', desc: locale === 'ar' ? 'أحدث المقالات في عالم التقنية' : 'Notes from the world of code' },
  ];

  return (
    <div style={{ background: c.bg, minHeight: '100vh' }} dir={dir}>

      {/* Hero — white, editorial */}
      <section style={{ position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${c.border}` }}>
        <div className="hero-gradient" style={{ padding: '96px 24px 88px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

              <div className="eyebrow" style={{ marginBottom: 28 }}>
                {locale === 'ar' ? 'مرحباً بك في' : 'Welcome to'}
              </div>

              <h1 style={{
                color: c.navy, fontSize: 'clamp(2.6rem, 6vw, 4.6rem)', fontWeight: 700,
                lineHeight: 1.12, marginBottom: 28, letterSpacing: '-0.02em', maxWidth: 760,
              }}>
                {locale === 'ar' ? (
                  <>حيث تتقاطع <span style={{ fontStyle: 'italic', color: c.teal }}>الكلمة</span> بالكود</>
                ) : (
                  <>Where words meet <span style={{ fontStyle: 'italic', color: c.teal }}>code</span></>
                )}
              </h1>

              <p style={{ color: c.muted, fontSize: 18, lineHeight: 1.85, maxWidth: 580, marginBottom: 40, fontFamily: "'Inter', sans-serif" }}>
                {locale === 'ar'
                  ? 'مدونة ومتجر رقمي راقٍ يجمع بين الأدب والمعرفة والثقافة التقنية — مساحة هادئة ومنظمة لكل من يبحث عن القراءة العميقة.'
                  : 'A refined publishing platform and digital store for literature, knowledge, and technical culture — a calm, considered space for deep reading.'}
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/articles" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  {locale === 'ar' ? 'ابدأ القراءة' : 'Start Reading'}
                </Link>
                <Link to="/store" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  {locale === 'ar' ? 'تصفح المتجر' : 'Browse the Store'}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px' }}>

        {/* Sections Grid */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            {locale === 'ar' ? 'استكشف' : 'Explore'}
          </div>
          <h2 style={{ color: c.navy, fontSize: 28, fontWeight: 700, marginBottom: 28 }}>
            {locale === 'ar' ? 'استكشف المحتوى' : 'Explore the Library'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1, marginBottom: 56, border: `1px solid ${c.border}`, borderRadius: 20, overflow: 'hidden' }}>
            {sections.map((s, i) => (
              <Link key={i} to={s.to} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  background: c.card, padding: '32px 24px',
                  borderInlineEnd: i < sections.length - 1 ? `1px solid ${c.border}` : 'none',
                  transition: 'background 0.2s', height: '100%',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = c.canvas; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = c.card; }}>
                  <div style={{ color: c.muted, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', marginBottom: 16 }}>{s.num}</div>
                  <h3 style={{ color: c.navy, fontWeight: 700, marginBottom: 8, fontSize: 19 }}>{s.label}</h3>
                  <p style={{ color: c.muted, fontSize: 13.5, lineHeight: 1.7, fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>{s.desc}</p>
                  <div style={{ color: c.teal, fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                    {locale === 'ar' ? '← اكتشف' : 'Explore →'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <WeeklyTargetBanner />

        {/* Featured */}
        {featured.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ marginTop: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              {locale === 'ar' ? 'مميز' : 'Featured'}
            </div>
            <h2 style={{ color: c.navy, fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
              {locale === 'ar' ? 'محتوى مميز' : 'Featured Content'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {featured.map((card) => (
                <div key={card.title} className="surface-card" style={{ padding: 28 }}>
                  <div style={{ color: c.teal, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>
                    {locale === 'ar' ? 'مميز' : 'Featured'}
                  </div>
                  <h3 style={{ color: c.navy, fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{card.title}</h3>
                  <p style={{ color: c.muted, fontSize: 14, lineHeight: 1.75, fontFamily: "'Inter', sans-serif" }}>{card.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reading Progress */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="surface-card" style={{ padding: 32, marginTop: 48 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                {locale === 'ar' ? 'ملخص الأسبوع' : 'Weekly Summary'}
              </div>
              <h3 style={{ color: c.navy, fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                {locale === 'ar' ? 'تقدم القراءة' : 'Reading Progress'}
              </h3>
              <p style={{ color: c.muted, fontSize: 13.5, fontFamily: "'Inter', sans-serif" }}>{encouragement}</p>
            </div>
            <div style={{ background: c.canvas, border: `1px solid ${c.border}`, borderRadius: 16, padding: '18px 28px', textAlign: 'center' }}>
              <div style={{ color: c.teal, fontSize: 11, fontWeight: 600, marginBottom: 6, fontFamily: "'Inter', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {locale === 'ar' ? 'مكتملة هذا الأسبوع' : 'Completed this week'}
              </div>
              <div style={{ color: c.navy, fontSize: 36, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{weeklyProgressCount}</div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>
              <span style={{ color: c.muted, fontSize: 12.5 }}>{locale === 'ar' ? 'متوسط التقدم' : 'Average progress'}</span>
              <span style={{ color: c.navy, fontSize: 12.5, fontWeight: 700 }}>{weeklyAverage}%</span>
            </div>
            <div style={{ height: 6, background: c.canvas, border: `1px solid ${c.border}`, borderRadius: 999, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, weeklyAverage))}%` }} transition={{ duration: 1, delay: 0.5 }}
                style={{ height: '100%', background: c.navy, borderRadius: 999 }} />
            </div>
          </div>
        </motion.div>

        {/* Editor picks */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 48 }}>
          {[
            { label: strings.featured, title: locale === 'ar' ? 'منشورات مختارة' : 'Featured Stories', desc: locale === 'ar' ? 'تشكيلة من المقالات والقصص المنتقاة بعناية.' : 'A rotation of carefully curated essays and stories.' },
            { label: strings.latest, title: locale === 'ar' ? 'الأحدث' : 'Latest Articles', desc: locale === 'ar' ? 'تابع التدفق اليومي للمحتوى الجديد.' : 'Follow the daily flow of new content.' },
            { label: strings.editorPick, title: locale === 'ar' ? 'اختيارات المحرر' : "Editor's Picks", desc: locale === 'ar' ? 'أفضل ما اختاره فريقنا هذا الأسبوع.' : 'Handpicked reads for slow, thoughtful attention.' },
          ].map((item, i) => (
            <div key={i} className="surface-card" style={{ padding: 28 }}>
              <div style={{ color: c.teal, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>{item.label}</div>
              <h3 style={{ color: c.navy, fontSize: 19, fontWeight: 700, marginBottom: 10 }}>{item.title}</h3>
              <p style={{ color: c.muted, fontSize: 13.5, lineHeight: 1.75, fontFamily: "'Inter', sans-serif" }}>{item.desc}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
