import type { Metadata } from 'next';
import './globals.css';
import { NextAuthProvider } from './providers/SessionProvider';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'blog',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
