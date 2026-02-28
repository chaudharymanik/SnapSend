import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'SnapSend — Send Files Fast',
  description:
    'Send files to anyone with a single link. Secure, fast, and no sign-up needed. Files auto-expire for your privacy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-shell">
          {/* Navigation */}
          <header className="header">
            <div className="header-inner">
              <Link href="/" className="logo">
                <div className="logo-mark">S</div>
                <span className="logo-text">SnapSend</span>
              </Link>
              <nav className="header-nav">
                <Link href="/upload" className="nav-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  Send a File
                </Link>
              </nav>
            </div>
          </header>

          {/* Main */}
          <main className="main">{children}</main>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <div className="logo-mark sm">S</div>
                <span>SnapSend</span>
              </div>
              <p className="footer-note">
                Files are encrypted in transit and auto-deleted after expiry.
              </p>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
