import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plainvest Members',
  description: 'Plainvest member dashboard and premium learning area.',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/assets/plainvest-app-icon.png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Plainvest — Financial Clarity for Beginners',
    description: 'Structured investing education, portfolio tools, and personal guidance — built for beginner investors.',
    url: 'https://members.plainvest.app',
    siteName: 'Plainvest',
    images: [{ url: 'https://members.plainvest.app/og-image.png', width: 1200, height: 630, alt: 'Plainvest' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plainvest — Financial Clarity for Beginners',
    description: 'Structured investing education, portfolio tools, and personal guidance — built for beginner investors.',
    images: ['https://members.plainvest.app/og-image.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#071120" />
      </head>
      <body>{children}</body>
    </html>
  );
}
