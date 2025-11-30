import { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { QueryProvider } from '@/lib/query/provider';
import { AuthProvider } from '@/features/auth';
import { Header } from '@/components/common/header';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: '국동이',
  description: '국민대학교 동아리 정보 플랫폼',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-50">
        <NuqsAdapter>
          <QueryProvider>
            <AuthProvider>
              <div className="mx-auto min-h-dvh max-w-md bg-white">
                <Header />
                <main>{children}</main>
              </div>
            </AuthProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
