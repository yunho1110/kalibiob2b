'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { List, X } from '@phosphor-icons/react';
import { LOCALES, useLocale } from '@/lib/i18n';

const NAV_ITEMS = [
  { href: '/material', key: 'nav.material' },
  { href: '/business', key: 'nav.business' },
  { href: '/products', key: 'nav.products' },
  { href: '/about', key: 'nav.about' },
  { href: '/partnership', key: 'nav.partners' },
  { href: '/contact', key: 'nav.contact' },
] as const;

const LOCALE_LABEL: Record<string, string> = { ko: 'KO', en: 'EN', zh: '中文' };

export function Navbar() {
  const { t, locale, setLocale } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-zinc-200/80 bg-white/80 px-5 py-2.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src="/images/logo-kali-mark.png" alt="" width={28} height={28} className="h-7 w-7" />
          <span className="font-kr text-[1.05rem] font-black tracking-tight text-zinc-950">
            {t('brand.full')}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-3.5 py-2 font-kr text-sm font-medium transition-colors ${
                  active ? 'text-brand-green-deep' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-brand-lime-tint"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative">{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-0.5 rounded-full border border-zinc-200 bg-zinc-50 p-0.5 sm:flex">
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  locale === l ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                {LOCALE_LABEL[l]}
              </button>
            ))}
          </div>
          <Link
            href="/contact"
            className="hidden rounded-full bg-brand-green-deep px-4 py-2 font-kr text-sm font-semibold text-white transition active:scale-[0.98] lg:inline-block"
          >
            {t('nav.cta')}
          </Link>
          <button
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-zinc-200 p-2 text-zinc-700 lg:hidden"
          >
            {open ? <X size={18} /> : <List size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-zinc-200 bg-white p-3 shadow-lg lg:hidden"
          >
            <nav className="flex flex-col">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 font-kr text-base font-medium ${
                    pathname === item.href ? 'bg-brand-lime-tint text-brand-green-deep' : 'text-zinc-700'
                  }`}
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="mt-1 flex items-center gap-1 px-4 py-2">
                {LOCALES.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      locale === l ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {LOCALE_LABEL[l]}
                  </button>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
