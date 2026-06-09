import { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';

export function WeeklyTargetBanner() {
  const { user } = useAuth();
  const { locale } = useLocale();
  const [target, setTarget] = useState(5);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const targetRef = doc(db, 'weeklyTargets', currentUser.uid);
    const unsubscribe = onSnapshot(targetRef, (snapshot) => {
      const data = snapshot.exists() ? (snapshot.data() as any) : null;
      if (data?.target) setTarget(data.target);
      if (typeof data?.progress === 'number') setProgress(data.progress);
    });
    return () => unsubscribe();
  }, [user?.id]);

  const updateTarget = async (value: number) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'weeklyTargets', currentUser.uid), {
        uid: currentUser.uid,
        target: value,
        progress,
        updatedAt: serverTimestamp()
      });
      setTarget(value);
    } catch (error) {
      console.error('Failed to update weekly target', error);
    } finally {
      setLoading(false);
    }
  };

  const percent = Math.min(100, Math.round((progress / (target || 1)) * 100));

  return (
    <section className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-sura-gold">{locale === 'ar' ? 'هدف القراءة الأسبوعي' : 'Weekly reading target'}</div>
          <h2 className="mt-2 text-3xl font-semibold">{locale === 'ar' ? 'ابقَ على المسار' : 'Stay on track'}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-sura-ivory/80">
            {locale === 'ar'
              ? 'حدد هدفك الأسبوعي وسجّل تقدمك خلال المقالات والروايات.'
              : 'Set your weekly reading goal and keep your progress visible across articles and novels.'}
          </p>
        </div>
        <div className="rounded-3xl bg-black/30 p-4 text-center">
          <div className="text-sm text-sura-ivory/70">{locale === 'ar' ? 'نشاطك هذا الأسبوع' : 'Your activity this week'}</div>
          <div className="mt-2 text-3xl font-semibold text-sura-gold">{progress}/{target}</div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-sura-ivory/10">
            <div className="h-full rounded-full bg-sura-gold" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-3 text-xs text-sura-ivory/70">{percent}% {locale === 'ar' ? 'اكتمال الهدف' : 'goal complete'}</div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {[5, 7, 10, 12].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => updateTarget(value)}
                disabled={loading}
                className="rounded-full border border-sura-border/20 bg-sura-dark/80 px-3 py-2 text-xs text-sura-ivory/80 hover:border-sura-gold/50"
              >
                {value} {locale === 'ar' ? 'يومًا' : 'items'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
