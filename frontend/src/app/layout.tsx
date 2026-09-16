import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Gativ | AI Proof-of-Work & Role Audit Engine',
  description: 'AI-Native Engineering Readiness & Proof-of-Work Engine. Harvest GitHub signals, run role gap audits, execute 48-hour sprints, and verify live PR submissions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-zinc-950">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
