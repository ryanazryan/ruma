interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-canvas">
      {/* Brand panel */}
      <div
        className="hidden lg:flex lg:w-100 xl:w-115 shrink-0 flex-col relative overflow-hidden"
        style={{ background: '#2a6049' }}
      >
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(245,239,228,0.07) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Decorative circles */}
        <div
          className="absolute -bottom-40 -right-40 w-130 h-130 rounded-full pointer-events-none"
          style={{
            border: '1px solid rgba(245,239,228,0.07)',
          }}
        />

        <div
          className="absolute -bottom-20 -right-20 w-85 h-85 rounded-full pointer-events-none"
          style={{
            border: '1px solid rgba(245,239,228,0.05)',
          }}
        />

        {/* Logo */}
        <div className="relative p-10 xl:p-12">
          <div className="flex items-center gap-3">
            <RumaMark />

            <span
              className="text-cream text-2xl font-semibold tracking-tight"
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
              }}
            >
              Ruma
            </span>
          </div>
        </div>

        {/* Brand content */}
        <div className="relative flex-1 flex flex-col justify-center px-10 xl:px-12">
          <div
            className="w-8 h-px mb-7"
            style={{ background: '#c4963e' }}
          />

          <blockquote
            className="text-cream/90 leading-[1.12] tracking-tight mb-5"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
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
            className="text-sm leading-relaxed max-w-67.5"
            style={{ color: '#9ecab8' }}
          >
            Discover premium brands and unique collections from the
            world&apos;s finest makers — all in one place.
          </p>
        </div>

        {/* Footer */}
        <div className="relative px-10 xl:px-12 pb-10 pt-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {[
              'Free returns',
              '200+ brands',
              'Worldwide shipping',
            ].map((text, index) => (
              <span key={text} className="flex items-center gap-2">
                {index > 0 && (
                  <span style={{ color: '#3a7a5e' }}>·</span>
                )}

                <span
                  className="text-xs"
                  style={{ color: '#7eb5a0' }}
                >
                  {text}
                </span>
              </span>
            ))}
          </div>

          <p
            className="text-xs"
            style={{ color: '#4a8a70' }}
          >
            © 2025 Ruma. All rights reserved.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-2.5 px-6 py-5 border-b border-line">
          <RumaMark color="#2a6049" />

          <span
            className="text-brand text-xl font-semibold tracking-tight"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
            }}
          >
            Ruma
          </span>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-start justify-center py-12 px-6 lg:px-14 lg:py-16">
          <div className="w-full max-w-105">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function RumaMark({
  color = '#f5efe4',
}: {
  color?: string
}) {
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

      <circle
        cx="13"
        cy="13"
        r="4"
        fill={color}
      />
    </svg>
  )
}