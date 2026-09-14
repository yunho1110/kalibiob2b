'use client';

import { useState, type FormEvent } from 'react';
import { EnvelopeSimple, Phone, MapPin, CaretDown } from '@phosphor-icons/react';
import { useLocale, translate } from '@/lib/i18n';
import { I18N } from '@/lib/i18n-data';
import { Reveal } from '@/components/motion/Reveal';

const CONTACT_EMAIL = 'kalibio1101@naver.com';
const CONTACT_PHONE = '061-725-1031';

const INQUIRY_OPTIONS = ['contact.opt1', 'contact.opt2', 'contact.opt3', 'contact.opt4'] as const;
const FAQ_KEYS = ['1', '2', '3', '4'] as const;

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-kr text-xs font-semibold text-zinc-600">
        {label}
        {required && <span className="ml-1 text-brand-lime-text">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  'rounded-xl border border-zinc-200 bg-white px-4 py-2.5 font-kr text-sm text-zinc-900 outline-none transition focus-visible:border-brand-lime focus-visible:ring-2 focus-visible:ring-brand-lime/30';

export default function ContactPage() {
  const { t, locale } = useLocale();
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>('1');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = [
      `${translate(I18N, 'contact.f1', locale)}: ${data.get('type')}`,
      `${translate(I18N, 'contact.f2', locale)}: ${data.get('company')}`,
      `${translate(I18N, 'contact.lName', locale)}: ${data.get('name')}`,
      `${translate(I18N, 'contact.lEmail', locale)}: ${data.get('email')}`,
      `${translate(I18N, 'contact.lPhone', locale)}: ${data.get('phone') || '-'}`,
      `${translate(I18N, 'contact.f3', locale)}: ${data.get('country')}`,
      `${translate(I18N, 'contact.f4', locale)}: ${data.get('volume') || '-'}`,
      '',
      String(data.get('message') || ''),
    ].join('\n');
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `[KALIBIO] ${data.get('type')} — ${data.get('company')}`
    )}&body=${encodeURIComponent(lines)}`;
    window.location.href = mailto;
    setSent(true);
  }

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 sm:px-8">
        <span className="font-mono text-xs font-semibold tracking-[0.14em] text-brand-lime-text uppercase">
          {t('contact.eyebrow')}
        </span>
        <h1 className="mt-3 font-kr text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
          {t('contact.title')}
        </h1>
        <p className="mt-4 max-w-xl font-kr text-[15px] leading-relaxed text-zinc-500">{t('contact.body')}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Direct contact */}
          <Reveal>
            <h2 className="font-kr text-sm font-bold text-zinc-950">{t('contact.directTitle')}</h2>
            <div className="mt-5 space-y-4">
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 font-mono text-sm text-zinc-700 hover:text-brand-lime-text">
                <EnvelopeSimple size={18} className="shrink-0 text-brand-lime-text" />
                {CONTACT_EMAIL}
              </a>
              <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-3 font-mono text-sm text-zinc-700 hover:text-brand-lime-text">
                <Phone size={18} className="shrink-0 text-brand-lime-text" />
                {CONTACT_PHONE}
              </a>
              <div className="flex items-start gap-3 font-kr text-sm leading-relaxed text-zinc-500">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand-lime-text" />
                {t('footer.addrValue')}
              </div>
            </div>
            <p className="mt-6 rounded-xl bg-zinc-50 px-4 py-3 font-kr text-xs leading-relaxed text-zinc-500">
              {t('contact.moqNote')}
            </p>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.05}>
            {sent ? (
              <div className="rounded-3xl border border-brand-lime/30 bg-brand-lime-tint p-8">
                <p className="font-kr text-sm font-semibold text-brand-green-deep">{t('contact.sent')}</p>
                <p className="mt-2 font-mono text-xs text-brand-green-deep/70">{CONTACT_EMAIL}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                <Field label={t('contact.f1')} required>
                  <select name="type" required defaultValue="" className={inputClass}>
                    <option value="" disabled>
                      —
                    </option>
                    {INQUIRY_OPTIONS.map((key) => (
                      <option key={key} value={t(key)}>
                        {t(key)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t('contact.f2')} required>
                  <input name="company" required className={inputClass} />
                </Field>
                <Field label={t('contact.lName')} required>
                  <input name="name" required placeholder={t('contact.phName')} className={inputClass} />
                </Field>
                <Field label={t('contact.lEmail')} required>
                  <input type="email" name="email" required placeholder={t('contact.phEmail')} className={inputClass} />
                </Field>
                <Field label={t('contact.lPhone')}>
                  <input name="phone" placeholder={t('contact.phPhone')} className={inputClass} />
                </Field>
                <Field label={t('contact.f3')} required>
                  <input name="country" required className={inputClass} />
                </Field>
                <Field label={t('contact.f4')}>
                  <input name="volume" className={inputClass} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label={t('contact.f5')} required>
                    <textarea name="message" required rows={5} className={inputClass} />
                  </Field>
                </div>
                <button
                  type="submit"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 font-kr text-sm font-bold text-white transition active:scale-[0.98] sm:col-span-2"
                >
                  {t('contact.submit')}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-zinc-50 py-24">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Reveal>
            <h2 className="font-kr text-2xl font-black tracking-tight text-zinc-950">{t('faq.title')}</h2>
            <p className="mt-2 font-kr text-sm text-zinc-500">{t('faq.sub')}</p>
          </Reveal>
          <div className="mt-10 divide-y divide-zinc-200 border-t border-zinc-200">
            {FAQ_KEYS.map((n) => {
              const isOpen = openFaq === n;
              return (
                <div key={n}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : n)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-kr text-[15px] font-semibold text-zinc-900">{t(`faq.q${n}`)}</span>
                    <CaretDown
                      size={16}
                      className={`shrink-0 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="pb-5 font-kr text-sm leading-relaxed text-zinc-500">{t(`faq.a${n}`)}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
