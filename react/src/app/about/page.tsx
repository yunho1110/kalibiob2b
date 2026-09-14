'use client';

import Image from 'next/image';
import { useLocale, Html } from '@/lib/i18n';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';

const GOALS = ['vision.goal1', 'vision.goal2', 'vision.goal3'];
const VALUES = ['about.value1', 'about.value2', 'about.value3', 'about.value4', 'about.value5'];
const TIMELINE = ['about.tl1', 'about.tl2', 'about.tl3', 'about.tl4', 'about.tl5', 'about.tl6'];

export default function AboutPage() {
  const { t } = useLocale();

  return (
    <>
      {/* Intro */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="font-mono text-xs font-semibold tracking-[0.14em] text-brand-lime-text uppercase">
              {t('about.eyebrow')}
            </span>
            <h1 className="mt-3 font-kr text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
              {t('about.title')}
            </h1>
            <div className="mt-6 space-y-4 font-kr text-[15px] leading-relaxed text-zinc-600">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
            </div>
          </div>
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image src="/images/office.webp" alt="" fill sizes="40vw" className="object-cover" />
          </Reveal>
        </div>
      </section>

      {/* Origin */}
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:aspect-[4/5]">
            <Image src="/images/feldspar-powder.webp" alt="" fill sizes="40vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-kr text-2xl font-black tracking-tight text-zinc-950">{t('about2.originTitle')}</h2>
            <div className="mt-5 space-y-4 font-kr text-[15px] leading-relaxed text-zinc-600">
              <p>{t('about2.originP1')}</p>
              <p>{t('about2.originP2')}</p>
              <p>{t('about2.originP3')}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision & Goals */}
      <section className="bg-brand-green-deep py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal>
            <span className="font-mono text-xs font-semibold tracking-[0.14em] text-brand-lime uppercase">
              {t('vision.eyebrow')}
            </span>
            <p className="mt-4 max-w-2xl font-kr text-xl font-bold leading-snug text-white md:text-2xl">
              {t('vision.statement')}
            </p>
            <p className="mt-6 max-w-xl font-kr text-sm leading-relaxed text-white/60">
              <Html path="vision.goalStatement" />
            </p>
          </Reveal>
          <StaggerGroup className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-white/10 md:grid-cols-3">
            {GOALS.map((base, i) => (
              <StaggerItem key={base} className="bg-brand-green-deep p-7">
                <span className="font-mono text-xs text-white/40">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-kr text-base font-bold text-white">{t(`vision.goal${i + 1}t`)}</h3>
                <p className="mt-2 font-kr text-[13px] leading-relaxed text-white/60">{t(base)}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-4xl px-6 py-24 sm:px-8">
        <Reveal>
          <h2 className="font-kr text-2xl font-black tracking-tight text-zinc-950">{t('about2.prinTitle')}</h2>
          <p className="mt-2 font-kr text-sm text-zinc-500">{t('about2.prinIntro')}</p>
        </Reveal>
        <StaggerGroup className="mt-10 divide-y divide-zinc-200">
          {VALUES.map((key, i) => (
            <StaggerItem key={key} className="flex gap-6 py-5">
              <span className="font-mono text-sm text-brand-lime-text">{String(i + 1).padStart(2, '0')}</span>
              <p className="font-kr text-[15px] leading-relaxed text-zinc-700">{t(key)}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <p className="mt-6 font-kr text-xs text-zinc-400">{t('about.valuesDisclaimer')}</p>
      </section>

      {/* Milestones */}
      <section className="bg-zinc-50 py-24">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Reveal>
            <span className="font-mono text-xs font-semibold tracking-[0.14em] text-brand-lime-text uppercase">
              {t('about.milestonesEyebrow')}
            </span>
            <h2 className="mt-3 font-kr text-2xl font-black tracking-tight text-zinc-950">
              {t('about.milestonesTitle')}
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 space-y-0 border-l border-zinc-300 pl-8">
            {TIMELINE.map((key) => (
              <StaggerItem key={key} className="relative pb-8 last:pb-0">
                <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-lime" />
                <p className="font-kr text-[15px] leading-relaxed text-zinc-700">{t(key)}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  );
}
