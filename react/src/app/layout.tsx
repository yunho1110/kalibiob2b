import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_KR, Noto_Sans_SC } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/lib/i18n';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const notoKr = Noto_Sans_KR({
  variable: '--font-noto-kr',
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
});
const notoSc = Noto_Sans_SC({
  variable: '--font-noto-sc',
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: '카리바이오 KALIBIO — 자연이 만든 가치를, 사람의 일상으로',
  description:
    '12억 년 전 전남 순천에서 만들어진 천연 미네랄 칼륨장석. 카리바이오는 이 하나의 원료를 연구해 비누와 치약으로, 그리고 더 넓은 산업의 소재로 넓혀갑니다.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoKr.variable} ${notoSc.variable}`}
    >
      <body className="font-kr antialiased">
        <LocaleProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
