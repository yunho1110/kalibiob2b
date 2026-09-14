'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from '@phosphor-icons/react';
import { useLocale, Html } from '@/lib/i18n';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';

const SOAPS = [
  { id: 'soap03', img: '/images/soap-03.webp' },
  { id: 'soap05', img: '/images/soap-05.webp' },
  { id: 'soap08', img: '/images/soap-08.webp' },
  { id: 'soap13', img: '/images/soap-13.webp' },
] as const;

export default function ProductsPage() {
  const { t } = useLocale();

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 sm:px-8">
        <span className="font-mono text-xs font-semibold tracking-[0.14em] text-brand-lime-text uppercase">
          {t('products.eyebrow')}
        </span>
        <h1 className="mt-3 font-kr text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
          {t('products.title')}
        </h1>
        <p className="mt-4 max-w-xl font-kr text-[15px] leading-relaxed text-zinc-500">{t('products.subtitle')}</p>
      </section>

      {/* Soap lineup — 2x2 bento, not a 3-col row */}
      <section className="mx-auto max-w-6xl px-6 pb-8 sm:px-8">
        <h2 className="font-kr text-lg font-bold text-zinc-950">{t('navSub.prodSoap')}</h2>
        <StaggerGroup className="mt-6 grid gap-5 sm:grid-cols-2">
          {SOAPS.map(({ id, img }) => (
            <StaggerItem
              key={id}
              className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white transition hover:border-zinc-300"
            >
              <div className="relative aspect-square overflow-hidden bg-zinc-50">
                <Image
                  src={img}
                  alt={t(`products.${id}.name`)}
                  fill
                  sizes="(min-width: 640px) 45vw, 90vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-kr text-xs font-semibold text-brand-green-deep backdrop-blur">
                  {t(`products.${id}.badge`)}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-kr text-lg font-bold text-zinc-950">{t(`products.${id}.name`)}</h3>
                <ul className="mt-3 space-y-1.5">
                  {(['b1', 'b2', 'b3'] as const).map((b) => (
                    <li key={b} className="flex gap-2 font-kr text-[13px] leading-relaxed text-zinc-500">
                      <CheckCircle size={15} weight="fill" className="mt-0.5 shrink-0 text-brand-lime" />
                      {t(`products.${id}.${b}`)}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-xl bg-brand-lime-tint px-3 py-2 font-mono text-[11px] leading-snug text-brand-green-deep">
                  {t(`products.${id}.stat`)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* K.28 — wide asymmetric feature */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <Reveal className="overflow-hidden rounded-[2rem] bg-brand-green-deep">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full">
              <Image src="/images/k28-lineup.webp" alt={t('products.k28.name')} fill sizes="50vw" className="object-cover" />
            </div>
            <div className="p-8 lg:p-12">
              <span className="rounded-full bg-white/10 px-3 py-1 font-kr text-xs font-semibold text-brand-lime">
                {t('products.k28.badge')}
              </span>
              <h3 className="mt-4 font-kr text-2xl font-black text-white">{t('products.k28.name')}</h3>
              <ul className="mt-4 space-y-2">
                {(['b1', 'b2', 'b3'] as const).map((b) => (
                  <li key={b} className="flex gap-2 font-kr text-sm leading-relaxed text-white/70">
                    <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-brand-lime" />
                    {t(`products.k28.${b}`)}
                  </li>
                ))}
              </ul>
              <p className="mt-5 font-mono text-xs text-white/50">{t('products.k28.stat')}</p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-lime px-5 py-2.5 font-kr text-sm font-bold text-brand-green-deep"
              >
                {t('products.cta')}
                <ArrowRight size={15} weight="bold" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Custom / raw material supply */}
      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8">
        <Reveal className="flex flex-col gap-6 rounded-[2rem] border border-zinc-200 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <span className="font-kr text-xs font-semibold text-zinc-400">{t('products.giftset.badge')}</span>
            <h3 className="mt-2 font-kr text-lg font-bold text-zinc-950">
              <Html path="products.giftset.name" />
            </h3>
            <p className="mt-2 max-w-lg font-kr text-sm leading-relaxed text-zinc-500">{t('products.giftset.b4')}</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 font-kr text-sm font-bold text-white"
          >
            {t('products.cta')}
            <ArrowRight size={15} weight="bold" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
