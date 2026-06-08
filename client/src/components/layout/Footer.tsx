
import { useLocale } from '../../context/LocaleContext';

export function Footer() {
  const { strings } = useLocale();
  return (
    <footer className="border-t border-sura-ivory/10 bg-sura-dark/95 px-4 py-8 text-sura-ivory/70 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <div className="text-lg font-semibold">Sura Codex</div>
          <p className="max-w-xl text-sm leading-7">A quiet place for reading, discovery, and thoughtful publishing in two languages.</p>
        </div>
        <div className="space-y-2 text-sm">
          <div>{strings.home}</div>
          <div>{strings.articles}</div>
          <div>{strings.about}</div>
          <div>{strings.contact}</div>
        </div>
      </div>
    </footer>
  );
}
