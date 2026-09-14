'use client';

import Link from 'next/link';
import { Html, useLocale } from '@/lib/i18n';

const CONTACT_EMAIL = 'kalibio1101@naver.com';
const SITE_URL = 'www.kalibio.co.kr';
const BIZ_REG_NO = '803-86-03036';

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="mt-32 border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <span className="font-kr text-lg font-black text-zinc-950">{t('brand.full')}</span>
          <p className="mt-3 max-w-xs font-kr text-sm leading-relaxed text-zinc-500">
            {t('footer.tagline')}
          </p>
        </div>

        <div>
          <h4 className="font-kr text-xs font-bold tracking-[0.14em] text-zinc-400 uppercase">
            {t('footer.companyTitle')}
          </h4>
          <dl className="mt-4 space-y-2 font-kr text-sm text-zinc-600">
            <div className="flex gap-2">
              <dt className="w-14 shrink-0 text-zinc-400">{t('footer.nameLabel')}</dt>
              <dd>{t('footer.nameValue')}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-14 shrink-0 text-zinc-400">{t('footer.repLabel')}</dt>
              <dd>{t('footer.repValue')}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-14 shrink-0 text-zinc-400">{t('footer.addrLabel')}</dt>
              <dd>{t('footer.addrValue')}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className="font-kr text-xs font-bold tracking-[0.14em] text-zinc-400 uppercase">
            <Html path="footer.contactTitle" />
          </h4>
          <dl className="mt-4 space-y-2 font-kr text-sm text-zinc-600">
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-zinc-400">{t('footer.phoneLabel')}</dt>
              <dd className="font-mono text-[13px]">{t('footer.phoneValue')}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-zinc-400">{t('footer.emailLabel')}</dt>
              <dd className="font-mono text-[13px]">
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand-lime-text">
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-zinc-400">{t('footer.siteLabel')}</dt>
              <dd className="font-mono text-[13px]">
                <a href={`https://${SITE_URL}`} target="_blank" rel="noopener" className="hover:text-brand-lime-text">
                  {SITE_URL}
                </a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-zinc-400">{t('footer.bizLabel')}</dt>
              <dd className="font-mono text-[13px]">{BIZ_REG_NO}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-zinc-400">{t('footer.mailorderLabel')}</dt>
              <dd className="font-mono text-[13px]">{t('footer.mailorderValue')}</dd>
            </div>
          </dl>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-full bg-brand-lime px-4 py-2 font-kr text-sm font-semibold text-brand-green-deep transition active:scale-[0.98]"
          >
            {t('nav.cta')}
          </Link>
        </div>
      </div>
      <div className="border-t border-zinc-200 px-6 py-5 text-center font-mono text-xs text-zinc-400 sm:px-8">
        {t('footer.copyright')}
      </div>
    </footer>
  );
}
