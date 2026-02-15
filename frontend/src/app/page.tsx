import Link from 'next/link';

export default function Home() {
  return (
    <div className="landing">
      {/* Animated gradient blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">No sign-up required</div>
        <h1 className="hero-h1">
          Send any file.<br />
          <span className="text-gradient">Get a link. Done.</span>
        </h1>
        <p className="hero-p">
          Drop a file, pick an expiry, and share the link. Your file is
          encrypted, stored securely, and auto-deleted when the timer runs out.
        </p>
        <div className="hero-actions">
          <Link href="/upload" className="btn-primary btn-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            Send a File
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="steps-section">
        <h2 className="section-heading">How it works</h2>
        <div className="steps-track">
          <div className="step-connector" />
          <div className="step-card">
            <div className="step-num">1</div>
            <div>
              <h3>Drop your file</h3>
              <p>Drag and drop or browse. Up to 50 MB, most file types supported.</p>
            </div>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <div>
              <h3>Set an expiry</h3>
              <p>Choose how long the link stays active — from 1 hour to 7 days.</p>
            </div>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <div>
              <h3>Share the link</h3>
              <p>Copy the link and send it to anyone. They click and download instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust row */}
      <section className="trust-row">
        <div className="trust-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          <div>
            <strong>End-to-end security</strong>
            <span>Pre-signed URLs, no public access</span>
          </div>
        </div>
        <div className="trust-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          <div>
            <strong>Auto-expiring links</strong>
            <span>Files deleted forever after expiry</span>
          </div>
        </div>
        <div className="trust-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          <div>
            <strong>Lightning transfers</strong>
            <span>Direct cloud upload, zero middlemen</span>
          </div>
        </div>
      </section>
    </div>
  );
}
