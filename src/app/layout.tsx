import './globals.css';
import Providers from './providers';
import { Noto_Sans_JP } from 'next/font/google';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Box from '@mui/material/Box';

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
  title: 'ほんだけん',
  description: 'ディーラーを活用したわんちゃんの一時預かりサービス',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className={`${notoSansJP.variable} ${plusJakartaSans.variable}`}>
          <Providers>
            <Box
              sx={{
                width: {
                  xs: '100%',
                  sm: '80%',
                  md: '60%',
                },
                margin: '0 auto',
              }}
            >
              {children}
            </Box>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}