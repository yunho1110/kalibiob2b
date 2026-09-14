'use client';

import Image from 'next/image';
import { useLocale, Html } from '@/lib/i18n';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';

const COMPONENTS = [
  { key: 'k', noteKey: 'mat.kNote' },
  { key: 'si', noteKey: 'mat.siNote' },
  { key: 'al', noteKey: 'mat.alNote' },
];

const PROPS = [
  { t: 'mat.p1t', d: 'mat.p1d' },
  { t: 'mat.p2t', d: 'mat.p2d', extra: 'mat.p2e' },
  { t: 'mat.p3t', d: 'mat.p3d' },
];

const TESTS = [
  { t: 'mat.t1t', d: 'mat.t1d', m: 'mat.t1m' },
  { t: 'mat.t2t', d: 'mat.t2d', m: 'mat.t2m' },
];

export default function MaterialPage() {
  const { t } = useLocale();

  return (
    <>
      {/* Story — asymmetric split, image left this time to break the hero pattern */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 sm:px-8">
        <span className="font-mono text-xs font-semibold tracking-[0.14em] text-brand-lime-text uppercase">
          {t('mat.eyebrow')}
        </span>
        <h1 className="mt-3 font-kr text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
          {t('mat.title')}
        </h1>
        <p className="mt-4 max-w-xl font-kr text-[15px] text-zinc-500">{t('mat.lead')}</p>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image src="/images/feldspar-rock.webp" alt="" fill sizes="40vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-kr text-xl font-bold text-zinc-950 md:text-2xl">{t('mat.storyTitle')}</h2>
            <div className="mt-4 space-y-4 font-kr text-[15px] leading-relaxed text-zinc-600">
              <p>{t('mat.storyP1')}</p>
              <p>{t('mat.storyP2')}</p>
              <p>{t('mat.storyP3')}</p>
            </div>
            <p className="mt-4 font-mono text-xs text-zinc-400">{t('mat.storyCap')}</p>
          </Reveal>
        </div>
      </section>

      {/* Composition — three components, divider-separated (no cards) */}
      <section className="bg-zinc-50 py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal>
            <h2 className="font-kr text-2xl font-black tracking-tight text-zinc-950">{t('mat.compTitle')}</h2>
            <p className="mt-3 max-w-xl font-kr text-sm leading-relaxed text-zinc-500">
              <Html path="mat.compIntro" />
            </p>
          </Reveal>

          <StaggerGroup className="mt-12 grid divide-y divide-zinc-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            {COMPONENTS.map(({ key, noteKey }) => (
              <StaggerItem key={key} className="px-0 py-6 md:px-8 md:py-0">
                <span className="font-mono text-4xl font-black text-brand-green-deep">{t(`mat.${key}`)}</span>
                <p className="mt-3 font-kr text-sm leading-relaxed text-zinc-500">{t(noteKey)}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-10 rounded-2xl border border-zinc-200 bg-white px-6 py-5">
            <p className="font-mono text-sm text-zinc-800">{t('mat.formula')}</p>
          </Reveal>
          <p className="mt-4 font-kr text-xs text-zinc-400">{t('mat.compNote')}</p>
        </div>
      </section>

      {/* Uses */}
      <section className="mx-auto max-w-4xl px-6 py-24 sm:px-8">
        <Reveal>
          <h2 className="font-kr text-2xl font-black tracking-tight text-zinc-950">{t('mat.usesTitle')}</h2>
          <p className="mt-2 font-kr text-base font-semibold text-brand-lime-text">{t('mat.usesLead')}</p>
          <div className="mt-5 space-y-4 font-kr text-[15px] leading-relaxed text-zinc-600">
            <p>{t('mat.usesP1')}</p>
            <p>{t('mat.usesP2')}</p>
          </div>
        </Reveal>
      </section>

      {/* Properties */}
      <section className="bg-brand-green-deep py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal>
            <h2 className="font-kr text-2xl font-black tracking-tight text-white">{t('mat.propsTitle')}</h2>
          </Reveal>
          <StaggerGroup className="mt-10 divide-y divide-white/10">
            {PROPS.map((p) => (
              <StaggerItem key={p.t} className="py-8">
                <h3 className="font-kr text-lg font-bold text-white">{t(p.t)}</h3>
                <p className="mt-2 max-w-2xl font-kr text-[14px] leading-relaxed text-white/60">
                  <Html path={p.d} />
                </p>
                {p.extra && (
                  <p className="mt-2 max-w-2xl font-kr text-[14px] leading-relaxed text-white/60">
                    <Html path={p.extra} />
                  </p>
                )}
              </StaggerItem>
            ))}
          </StaggerGroup>
          <p className="mt-6 font-kr text-xs text-white/40">{t('mat.propsNote')}</p>
        </div>
      </section>

      {/* Tests */}
      <section className="mx-auto max-w-5xl px-6 py-24 sm:px-8">
        <Reveal>
          <h2 className="font-kr text-2xl font-black tracking-tight text-zinc-950">
            <Html path="mat.testsTitle" />
          </h2>
          <p className="mt-2 max-w-xl font-kr text-sm text-zinc-500">{t('mat.testsIntro')}</p>
        </Reveal>
        <StaggerGroup className="mt-10 grid gap-5 md:grid-cols-2">
          {TESTS.map((test) => (
            <StaggerItem key={test.t} className="rounded-3xl border border-zinc-200 p-7">
              <h3 className="font-kr text-base font-bold text-zinc-950">{t(test.t)}</h3>
              <p className="mt-2 font-kr text-sm leading-relaxed text-zinc-500">{t(test.d)}</p>
              <p className="mt-4 font-mono text-xs text-zinc-400">{t(test.m)}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </>
  );
}
