import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex bg-canvas">
      {/* Desktop brand panel */}
      <aside
        className="hidden lg:flex lg:w-[400px] xl:w-[460px] flex-shrink-0 flex-col relative overflow-hidden"
        style={{ backgroundColor: '#2a6049' }}
      >
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(245,239,228,0.07) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
          aria-hidden="true"
        />

        {/* Decorative circles */}
        <div
          className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{
            border: '1px solid rgba(245,239,228,0.07)',
          }}
          aria-hidden="true"
        />

        <div
          className="absolute -bottom-20 -right-20 w-[340px] h-[340px] rounded-full pointer-events-none"
          style={{
            border: '1px solid rgba(245,239,228,0.05)',
          }}
          aria-hidden="true"
        />

        {/* Logo */}
        <div className="relative p-10 xl:p-12">
          <div className="flex items-center gap-3">
            <RumaMark />
            <span
              className="text-cream text-2xl font-semibold tracking-tight"
              style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
            >
              Ruma
            </span>
          </div>
        </div>

        {/* Brand content */}
        <div className="relative flex-1 flex flex-col justify-center px-10 xl:px-12">
          <div
            className="w-8 h-px mb-7"
            style={{ backgroundColor: '#c4963e' }}
            aria-hidden="true"
          />

          <blockquote
            className="text-cream/90 leading-[1.12] tracking-tight mb-5"
            style={{
              fontFamily: 'var(--font-fraunces), Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            }}
          >
            Curated living,
            <br />
            considered choices.
          </blockquote>

          <p
            className="text-sm leading-relaxed max-w-[270px]"
            style={{ color: '#9ecab8' }}
          >
            Discover premium brands and unique collections from the world&apos;s
            finest makers — all in one place.
          </p>
        </div>

        {/* Footer */}
        <div className="relative px-10 xl:px-12 pb-10 pt-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs" style={{ color: '#7eb5a0' }}>
              Multi-brand marketplace
            </span>

            <span style={{ color: '#3a7a5e' }} aria-hidden="true">
              ·
            </span>

            <span className="text-xs" style={{ color: '#7eb5a0' }}>
              Curated collections
            </span>
          </div>

          <p className="text-xs" style={{ color: '#4a8a70' }}>
            © 2026 Ruma. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <section className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-2.5 px-6 py-5 border-b border-line">
          <RumaMark color="#2a6049" />

          <span
            className="text-brand text-xl font-semibold tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ruma
          </span>
        </header>

        {/* Form area */}
        <div className="flex-1 flex items-start justify-center py-12 px-6 lg:px-14 lg:py-16">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </section>
    </main>
  );
}

function RumaMark({ color = '#f5efe4' }: { color?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="13"
        cy="13"
        r="11.5"
        stroke={color}
        strokeWidth="1.25"
      />
      <circle cx="13" cy="13" r="4" fill={color} />
    </svg>
  );
}