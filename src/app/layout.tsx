import './globals.css';
import Providers from './providers';
import { Noto_Sans_JP } from 'next/font/google';
import { Plus_Jakarta_Sans } from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-jp',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: 'Font Test',
  description: 'Use Plus Jakarta Sans globally',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${plusJakartaSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}