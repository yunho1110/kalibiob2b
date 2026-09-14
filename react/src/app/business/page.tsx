'use client';

import { useLocale, translate } from '@/lib/i18n';
import { I18N } from '@/lib/i18n-data';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';

export default function BusinessPage() {
  const { t, locale } = useLocale();
  const soapLinkRow = translate(I18N, 'biz.gtRow1Soap', locale).replace('#prod-soap', '/products');

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 sm:px-8">
        <span className="font-mono text-xs font-semibold tracking-[0.14em] text-brand-lime-text uppercase">
          {t('biz.eyebrow')}
        </span>
        <h1 className="mt-3 font-kr text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
          {t('biz.title')}
        </h1>
        <p className="mt-4 max-w-xl font-kr text-[15px] leading-relaxed text-zinc-500">{t('biz.sub')}</p>
      </section>

      {/* 01 — Functional Materials */}
      <section className="border-t border-zinc-200 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <span className="font-mono text-sm text-brand-lime-text">01 — {t('biz.t1sum')}</span>
            <h2 className="mt-3 font-kr text-2xl font-black text-zinc-950">{t('biz.b1t')}</h2>
            <p className="mt-2 font-kr text-base font-semibold text-zinc-700">{t('biz.b1h')}</p>
            <p className="mt-4 font-kr text-sm leading-relaxed text-zinc-500">{t('biz.b1lead')}</p>
            <p className="mt-3 font-kr text-sm leading-relaxed text-zinc-500">{t('biz.b1d')}</p>
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
            {(
              [
                ['biz.b1a', 'biz.b1av'],
                ['biz.b1trade', 'biz.b1tradev'],
                ['biz.b1b', 'biz.b1bv'],
                ['biz.b1c', 'biz.b1cv'],
              ] as const
            ).map(([label, value]) => (
              <StaggerItem key={label} className="bg-white p-6">
                <p className="font-kr text-xs font-semibold text-zinc-400">{t(label)}</p>
                <p className="mt-2 font-kr text-sm leading-relaxed text-zinc-800">{t(value)}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* 02 — Household Goods */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <span className="font-mono text-sm text-brand-lime-text">02 — {t('biz.t2sum')}</span>
            <h2 className="mt-3 font-kr text-2xl font-black text-zinc-950">{t('biz.b2t')}</h2>
            <p className="mt-2 font-kr text-base font-semibold text-zinc-700">{t('biz.b2h')}</p>
            <p className="mt-4 font-kr text-sm leading-relaxed text-zinc-500">{t('biz.b2lead')}</p>
            <p className="mt-3 font-kr text-sm leading-relaxed text-zinc-500">{t('biz.b2d')}</p>
          </Reveal>

          <Reveal delay={0.05} className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-5 py-3 font-kr text-xs font-semibold text-zinc-400">{t('biz.gtColItem')}</th>
                  <th className="px-5 py-3 font-kr text-xs font-semibold text-zinc-400">{t('biz.gtColSoap')}</th>
                  <th className="px-5 py-3 font-kr text-xs font-semibold text-zinc-400">{t('biz.gtColPaste')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="px-5 py-4 font-kr text-sm font-medium text-zinc-500">{t('biz.gtRow1Label')}</td>
                  <td
                    className="px-5 py-4 font-kr text-sm text-zinc-700 [&_a]:text-brand-lime-text [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: soapLinkRow }}
                  />
                  <td className="px-5 py-4 font-kr text-sm text-zinc-700">{t('biz.gtRow1Paste')}</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-kr text-sm font-medium text-zinc-500">{t('biz.gtRow2Label')}</td>
                  <td className="px-5 py-4 font-kr text-sm text-zinc-700">{t('biz.gtRow2Soap')}</td>
                  <td className="px-5 py-4 font-kr text-sm text-zinc-700">{t('biz.gtRow2Paste')}</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-kr text-sm font-medium text-zinc-500">{t('biz.gtRow3Label')}</td>
                  <td className="px-5 py-4 font-mono text-[13px] text-zinc-700">{t('biz.gtRow3Soap')}</td>
                  <td className="px-5 py-4 font-mono text-[13px] text-zinc-700">{t('biz.gtRow3Paste')}</td>
                </tr>
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* 03 — OEM/ODM */}
      <section className="border-t border-zinc-200 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <span className="font-mono text-sm text-brand-lime-text">03 — {t('biz.t3sum')}</span>
            <h2 className="mt-3 font-kr text-2xl font-black text-zinc-950">{t('biz.b3t')}</h2>
            <p className="mt-2 font-kr text-base font-semibold text-zinc-700">{t('biz.b3h')}</p>
            <p className="mt-4 font-kr text-sm leading-relaxed text-zinc-500">{t('biz.b3lead')}</p>
            <p className="mt-3 font-kr text-sm leading-relaxed text-zinc-500">{t('biz.b3d')}</p>
          </Reveal>
          <StaggerGroup className="divide-y divide-zinc-200 rounded-3xl border border-zinc-200 p-2">
            {(
              [
                ['biz.b3a', 'biz.b3av'],
                [null, 'biz.b3bv'],
                [null, 'biz.b3cv'],
              ] as const
            ).map(([label, value]) => (
              <StaggerItem key={value} className="p-5">
                {label && <p className="font-kr text-xs font-semibold text-zinc-400">{t(label)}</p>}
                <p className={`font-kr text-sm leading-relaxed text-zinc-800 ${label ? 'mt-2' : ''}`}>
                  {t(value)}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </>
  );
}
