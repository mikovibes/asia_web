import type { Metadata } from 'next';
import { DynaPuff, Nunito } from 'next/font/google';
import './globals.css';

// [HERO] Primary brand font for titles and cartoon effects
const dynapuff = DynaPuff({ subsets: ['latin'], variable: '--font-dynapuff', weight: ['400', '700'] });
// [HERO] Secondary font for readability and body text
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', weight: ['400', '700', '900'] });

export const metadata: Metadata = {
  title: 'Béo Ăn | Vietnamská Restaurace',
  description: 'Rodinné vietnamské bistro v Hustopečích. Skvělé jídlo, funky vibe!',
};

import SmoothScrolling from '@/components/SmoothScrolling';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${dynapuff.variable} ${nunito.variable} font-nunito bg-beo-yellow text-beo-black scroll-smooth`}>
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
