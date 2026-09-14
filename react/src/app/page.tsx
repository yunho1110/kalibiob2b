'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Circle } from '@phosphor-icons/react';
import { useLocale, Html } from '@/lib/i18n';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';

const CYCLE = ['home.cyc1', 'home.cyc2', 'home.cyc3', 'home.cyc4', 'home.cyc5'];
const FACTS = [
  { title: 'hero.f1t', body: 'hero.f1d' },
  { title: 'hero.f2t', body: 'hero.f2d' },
  { title: 'hero.f3t', body: 'hero.f3d' },
];
const CLINICAL = ['homeClinical.c1', 'homeClinical.c2', 'homeClinical.c3', 'homeClinical.c4', 'homeClinical.c5', 'homeClinical.c6'];
const WHY_CARDS = ['why.card1', 'why.card2', 'why.card3'];

export default function Home() {
  const { t } = useLocale();

  return (
    <>
      {/* Hero — asymmetric split, never centered */}
      <section className="relative overflow-hidden bg-brand-green-deep">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-brand-lime/20 blur-3xl" />
        <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-16 pb-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-24 lg:pb-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 font-kr text-xs font-medium text-white/80">
              <Circle weight="fill" size={6} className="text-brand-lime" />
              {t('hero.eyebrow')}
            </span>
            <h1 className="mt-6 font-kr text-4xl leading-[1.15] font-black tracking-tight text-white md:text-6xl md:leading-[1.1]">
              <Html path="hero.headline" />
            </h1>
            <p className="mt-6 max-w-lg font-kr text-base leading-relaxed text-white/70">
              <Html path="hero.sub" />
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-5 py-3 font-kr text-sm font-bold text-brand-green-deep transition active:scale-[0.98]"
              >
                {t('hero.cta1')}
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link
                href="/material"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 font-kr text-sm font-semibold text-white transition active:scale-[0.98]"
              >
                {t('hero.cta2')}
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {(['hero.m1', 'hero.m2', 'hero.m3'] as const).map((key) => (
                <dd key={key} className="font-kr text-[13px] leading-snug text-white/60">
                  {t(key)}
                </dd>
              ))}
            </dl>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] lg:aspect-[3/4]">
            <Image
              src="/images/lineup-scene.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green-deep/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Facts — editorial list, not a 3-card grid */}
      <section className="mx-auto max-w-4xl px-6 py-24 sm:px-8">
        <StaggerGroup className="divide-y divide-zinc-200">
          {FACTS.map((fact, i) => (
            <StaggerItem key={fact.title} className="grid gap-3 py-9 sm:grid-cols-[auto_1fr] sm:gap-8">
              <span className="font-mono text-sm font-medium text-brand-lime-text">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-kr text-xl font-bold tracking-tight text-zinc-950">{t(fact.title)}</h3>
                <p className="mt-2 max-w-2xl font-kr text-[15px] leading-relaxed text-zinc-500">{t(fact.body)}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Cycle — one material, five stages */}
      <section className="bg-zinc-50 py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <Reveal>
            <p className="font-kr text-lg font-semibold text-zinc-950 md:text-xl">
              <Html path="home.subcopy" />
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-4">
              {CYCLE.map((key, i) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 font-kr text-sm font-semibold text-zinc-800">
                    {t(key)}
                  </span>
                  {i < CYCLE.length - 1 && <ArrowRight size={16} className="text-zinc-300" />}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Clinical proof — horizontal data stream */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <Reveal className="max-w-2xl">
            <span className="font-mono text-xs font-semibold tracking-[0.14em] text-brand-lime-text uppercase">
              {t('homeClinical.eyebrow')}
            </span>
            <h2 className="mt-3 font-kr text-2xl font-black tracking-tight text-zinc-950 md:text-3xl">
              {t('homeClinical.title')}
            </h2>
          </Reveal>
          <div className="mt-10 flex snap-x gap-4 overflow-x-auto pb-4">
            {CLINICAL.map((key) => (
              <div
                key={key}
                className="w-64 shrink-0 snap-start rounded-3xl border border-zinc-200 bg-white p-6"
              >
                <p className="font-kr text-[15px] leading-snug font-semibold text-zinc-900">{t(key)}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 font-kr text-xs text-zinc-400">
            <Html path="homeClinical.note" />
          </p>
        </div>
      </section>

      {/* Why KALIBIO */}
      <section className="bg-brand-green-deep py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <Reveal className="max-w-xl">
            <h2 className="font-kr text-2xl font-black tracking-tight text-white md:text-3xl">
              {t('why.title')}
            </h2>
            <p className="mt-3 font-kr text-sm text-white/60">{t('why.subtitle')}</p>
          </Reveal>
          <StaggerGroup className="mt-12 grid gap-px overflow-hidden rounded-[2rem] bg-white/10 md:grid-cols-3">
            {WHY_CARDS.map((base) => (
              <StaggerItem key={base} className="bg-brand-green-deep p-8">
                <h3 className="font-kr text-[15px] font-bold text-white">
                  <Html path={`${base}.title`} />
                </h3>
                <p className="mt-3 font-kr text-[13px] leading-relaxed text-white/60">{t(`${base}.desc`)}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-10 md:flex-row md:items-center md:p-14">
          <div>
            <h2 className="max-w-md font-kr text-2xl font-black tracking-tight text-zinc-950 md:text-3xl">
              {t('nav.cta')}
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 font-kr text-sm font-bold text-white transition active:scale-[0.98]"
          >
            {t('hero.cta1')}
            <ArrowRight size={16} weight="bold" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
