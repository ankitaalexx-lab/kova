import OutputCard from './OutputCard.jsx'
import Footer from './Footer.jsx'

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1.5 7a5.5 5.5 0 109.9-1M11 1.5v3.5H7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11 7H3M6 3.5L2.5 7 6 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ResultsPage({ results, formData, onRunAgain }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 md:py-16">

        {/* Top nav */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <button
            onClick={onRunAgain}
            className="flex items-center gap-2 text-text-muted hover:text-text-primary font-sans text-sm transition-colors duration-150 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-150">
              <BackIcon />
            </span>
            New report
          </button>

          <span className="font-syne font-bold text-lg tracking-[0.2em] text-text-primary">
            KOVA
          </span>

          <button
            onClick={onRunAgain}
            className="hidden md:flex items-center gap-2 text-accent hover:text-accent-hover font-syne font-semibold text-sm tracking-wide border border-[rgba(124,58,237,0.3)] hover:bg-[rgba(124,58,237,0.08)] px-4 py-2 rounded-xl transition-all duration-150"
          >
            <RefreshIcon />
            Run Again
          </button>
        </div>

        {/* Report header */}
        <div className="mb-8 animate-fade-in">
          <h2 className="font-syne font-bold text-xl md:text-2xl text-text-primary mb-1">
            Buyer Intelligence Report
          </h2>
          {formData?.category && (
            <div className="flex flex-col gap-0.5 mt-1">
              {[formData.category, formData.competitors, formData.buyerRole, formData.misunderstanding]
                .filter(Boolean)
                .map((line, i) => (
                  <p key={i} className="font-sans text-sm text-text-muted leading-snug">
                    {line}
                  </p>
                ))}
            </div>
          )}
        </div>

        <div className="h-px bg-border mb-8" />

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {results.map((card, i) => (
            <OutputCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            onClick={onRunAgain}
            className="w-full md:w-auto flex items-center justify-center gap-2 text-accent hover:text-accent-hover font-syne font-semibold text-sm tracking-wide border border-[rgba(124,58,237,0.3)] hover:bg-[rgba(124,58,237,0.08)] px-8 py-4 rounded-xl transition-all duration-150"
          >
            <RefreshIcon />
            Run Again
          </button>
          <p className="font-sans text-xs text-text-muted">
            Try different inputs to explore other buyer angles.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
