
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocale } from '../context/LocaleContext';

interface BookItem {
  id: string;
  title: string;
  author: string;
  price: number;
  format: string;
  coverImage: string;
}

export function StorePage() {
  const { locale } = useLocale();
  const [books, setBooks] = useState<BookItem[]>([]);
  const [cart, setCart] = useState<BookItem[]>([]);

  useEffect(() => {
    axios.get('/api/store').then((res) => setBooks(res.data.books));
  }, []);

  const total = cart.reduce((sum, book) => sum + book.price, 0);

  const checkout = async () => {
    const response = await axios.post('/api/store/checkout', { items: cart }, { withCredentials: true });
    window.location.href = response.data.url;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-8">
        <h1 className="text-4xl font-semibold">{locale === 'ar' ? 'المتجر' : 'Book Store'}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-sura-ivory/80">{locale === 'ar' ? 'شراء نسخ رقمية ومطبوعة مع تسليم آمن وروابط تنزيل.' : 'Purchase digital and physical books with Stripe checkout and downloadable access.'}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1.8fr_0.9fr]">
        <div className="grid gap-6 md:grid-cols-2">
          {books.map((book) => (
            <article key={book.id} className="rounded-3xl border border-sura-ivory/10 bg-black/30 p-6">
              <div className="h-52 overflow-hidden rounded-3xl bg-sura-dark/90">
                <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="mt-2 text-sm text-sura-ivory/70">{book.author} · {book.format}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold text-sura-gold">${book.price.toFixed(2)}</span>
                  <button onClick={() => setCart((current) => current.some((item) => item.id === book.id) ? current : [...current, book])} className="rounded-full bg-sura-gold px-4 py-2 text-sm text-sura-dark">
                    {locale === 'ar' ? 'أضف إلى السلة' : 'Add to cart'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="rounded-3xl border border-sura-ivory/10 bg-sura-ink/80 p-6">
          <div className="text-sm uppercase tracking-[0.3em] text-sura-gold">{locale === 'ar' ? 'سلة التسوق' : 'Shopping cart'}</div>
          <div className="mt-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-sm text-sura-ivory/70">{locale === 'ar' ? 'السلة فارغة.' : 'Your cart is empty.'}</div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="rounded-3xl border border-sura-ivory/10 bg-black/30 p-4">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-sura-ivory/70">{item.format} • ${item.price.toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 flex items-center justify-between text-sm text-sura-ivory/80">
            <span>{locale === 'ar' ? 'المجموع' : 'Total'}</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button onClick={checkout} disabled={cart.length === 0} className="mt-6 w-full rounded-full bg-sura-gold px-4 py-3 text-sm font-semibold text-sura-dark disabled:cursor-not-allowed disabled:opacity-60">
            {locale === 'ar' ? 'الدفع' : 'Checkout'}
          </button>
        </aside>
      </div>
    </div>
  );
}
