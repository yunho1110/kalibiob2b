'use client';

import Link from 'next/link';
import { ArrowRight, Buildings } from '@phosphor-icons/react';
import { useLocale, Html } from '@/lib/i18n';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';

const PARTNERS = ['partners.p1', 'partners.p2', 'partners.p3', 'partners.p4', 'partners.p5', 'partners.p6', 'partners.p7'];

export default function PartnershipPage() {
  const { t } = useLocale();

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 sm:px-8">
        <span className="font-mono text-xs font-semibold tracking-[0.14em] text-brand-lime-text uppercase">
          {t('partners.eyebrow')}
        </span>
        <h1 className="mt-3 font-kr text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
          {t('partners.title')}
        </h1>
        <p className="mt-4 max-w-xl font-kr text-[15px] leading-relaxed text-zinc-500">{t('partners.subtitle')}</p>
      </section>

      {/* Regional partners — asymmetric list, note as a pull quote */}
      <section className="border-t border-zinc-200 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 className="font-kr text-xl font-bold text-zinc-950">{t('partners.regionalTitle')}</h2>
            <p className="mt-3 font-kr text-sm leading-relaxed text-zinc-500">{t('partners.regionalNote')}</p>
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PARTNERS.map((key) => (
              <StaggerItem
                key={key}
                className="flex items-center gap-3 rounded-2xl border border-zinc-200 px-5 py-4"
              >
                <Buildings size={18} className="shrink-0 text-brand-lime-text" />
                <span className="font-kr text-sm font-medium text-zinc-700">{t(key)}</span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Core partnership philosophy */}
      <section className="bg-brand-green-deep py-24">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <Reveal>
            <h2 className="font-kr text-lg font-bold text-brand-lime">{t('partners.coreTitle')}</h2>
            <p className="mt-4 font-kr text-xl leading-relaxed font-semibold text-white md:text-2xl">
              <Html path="partners.coreNote" />
            </p>
          </Reveal>
        </div>
      </section>

      {/* Global recruitment CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-10 md:flex-row md:items-center md:p-14">
          <div>
            <span className="font-kr text-xs font-semibold text-zinc-400">{t('part2.globalTitle')}</span>
            <h2 className="mt-2 max-w-md font-kr text-2xl font-black tracking-tight text-zinc-950 md:text-3xl">
              {t('partners.p8')}
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 font-kr text-sm font-bold text-white transition active:scale-[0.98]"
          >
            {t('nav.cta')}
            <ArrowRight size={16} weight="bold" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
