import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f26d1a',
};

export const metadata: Metadata = {
  title: 'BibleNOW - Christian Social Platform',
  description: 'Connect, share, and grow in faith with BibleNOW - the Christian social platform for livestreaming, community, and spiritual growth.',
  keywords: ['Christian', 'Social Media', 'Livestreaming', 'Bible', 'Faith', 'Community'],
  authors: [{ name: 'BibleNOW Team' }],
  icons: {
    icon: '/roundlogo.png',
    apple: '/roundlogo.png',
  },
  openGraph: {
    title: 'BibleNOW - Christian Social Platform',
    description: 'Connect, share, and grow in faith with BibleNOW',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BibleNOW - Christian Social Platform',
    description: 'Connect, share, and grow in faith with BibleNOW',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-dark-900`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
