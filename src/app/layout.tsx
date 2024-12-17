import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import './globals.css';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { ConvexClientProvider } from '@/components/providers/convex-provider';
import { ModalProvider } from '@/components/providers/modal-provider';
import { EdgeStoreProvider } from '../lib/edgestore';

export const metadata: Metadata = {
  title: 'Notion Clone',
  description: 'The connected workspace where better, faster work happens',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/logo.svg',
        href: '/logo.svg',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/logo.svg',
        href: '/logo.svg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="notion-theme-1"
            >
              <Toaster position="bottom-center" />
              <ModalProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
