import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plainvest Members',
  description: 'Plainvest member dashboard and premium learning area.',
  icons: {
    icon: '/assets/plainvest-app-icon.png',
    apple: '/assets/plainvest-app-icon.png',
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
