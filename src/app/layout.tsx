import type { Metadata } from 'next';

import './globals.css';
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { APP_NAME } from '@/lib/constants';
import { NoiseFilter } from '@/components/ui/NoiseFilter';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant-garamond',
  style: ['normal', 'italic'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  style: ['normal', 'italic'],
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description:
    'A personal archive of unfinished thoughts, quiet transitions, and things that stayed.',
};

/**
 * Root Layout
 *
 * ARCHITECTURE: This is the outermost layout wrapping every page.
 * - Server Component by default (no 'use client')
 * - Providers (QueryProvider) are Client Components imported here
 * - Font configuration happens once at the root level
 * - The suppressHydrationWarning on html is for future dark mode toggle support
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(cormorant.variable, dmSans.variable, dmMono.variable)}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen relative transition-colors duration-700 antialiased animate-in fade-in">
        <NoiseFilter />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
