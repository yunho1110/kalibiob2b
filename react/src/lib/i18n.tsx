'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { I18N, type Locale } from './i18n-data';

const LOCALES: Locale[] = ['ko', 'en', 'zh'];
const STORAGE_KEY = 'kalibio-locale';

type Dict = typeof I18N;

function resolve(dict: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (node, key) =>
        node && typeof node === 'object' ? (node as Record<string, unknown>)[key] : undefined,
      dict
    );
}

/** Look up `path` (e.g. "hero.headline") and return the string for `locale`. */
export function translate(dict: Dict, path: string, locale: Locale): string {
  const node = resolve(dict, path);
  if (node && typeof node === 'object' && locale in (node as Record<string, unknown>)) {
    return String((node as Record<Locale, string>)[locale]);
  }
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[i18n] missing key: ${path}`);
  }
  return path;
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = 'ko',
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore (private mode / disabled storage)
    }
    document.documentElement.lang = l;
  };

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (path: string) => translate(I18N, path, locale),
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

export { LOCALES };
export type { Locale };

/**
 * Renders a translated string that may contain trusted inline markup
 * (<br>, <a href="#...">, <span class="...">) carried over from the
 * original content. Content is static and author-controlled, never
 * user input.
 */
export function Html({ path, className }: { path: string; className?: string }) {
  const { t } = useLocale();
  return <span className={className} dangerouslySetInnerHTML={{ __html: t(path) }} />;
}
