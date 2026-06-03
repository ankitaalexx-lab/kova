import { useState } from 'react'

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2.5 7.5L6 11L12.5 4" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="4.5" y="1" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 5H1.5A1.5 1.5 0 000 6.5v7A1.5 1.5 0 001.5 15h7A1.5 1.5 0 0010 13.5V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="inline-block ml-1 shrink-0 opacity-60">
      <path d="M4 1.5H1.5a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V7M6.5 1h3m0 0v3M9.5 1L4.5 6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function getDomain(url) {
  try {
    const host = new URL(url).hostname.replace('www.', '')
    return host
  } catch {
    return url
  }
}

export default function OutputCard({ card, index }) {
  const [copied, setCopied] = useState(false)

  const textToCopy = card.error
    ? `${card.title}\n\n${card.error}`
    : [
        card.title,
        '',
        ...(card.quotes
          ? card.quotes.flatMap((q) => [`"${q.text}"`, `— ${q.sourceTitle} (${q.sourceUrl})`, ''])
          : card.fallback
          ? [card.fallback]
          : ['No results found.']),
      ].join('\n')

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(textToCopy)
    } catch {
      const el = document.createElement('textarea')
      el.value = textToCopy
      Object.assign(el.style, { position: 'fixed', opacity: '0' })
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col gap-5 transition-colors duration-200 hover:border-[rgba(124,58,237,0.3)]"
      style={{ animation: `slideUp 0.4s ease-out ${index * 80}ms both` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="font-syne font-bold text-[11px] tracking-widest text-accent shrink-0 mt-1">
            {card.icon}
          </span>
          <h3 className="font-syne font-semibold text-text-primary text-base md:text-lg leading-snug">
            {card.title}
          </h3>
        </div>
        <button
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy all'}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted hover:border-[rgba(124,58,237,0.4)] hover:text-text-primary hover:bg-[rgba(124,58,237,0.08)] transition-all duration-150"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>

      <div className="h-px bg-border" />

      {/* Error state */}
      {card.error && (
        <p className="font-sans text-sm text-text-muted italic leading-relaxed">{card.error}</p>
      )}

      {/* Quotes */}
      {!card.error && card.quotes && card.quotes.length > 0 && (
        <div className="flex flex-col gap-4">
          {card.quotes.map((quote, i) => (
            <div key={i} className="flex gap-3">
              {/* Accent bar */}
              <div
                className="w-0.5 shrink-0 rounded-full mt-1"
                style={{ backgroundColor: 'rgba(124,58,237,0.5)', minHeight: '1.25rem' }}
              />
              <div className="flex flex-col gap-1.5 min-w-0">
                <p className="font-sans text-sm md:text-[15px] text-text-primary leading-relaxed">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <a
                  href={quote.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs text-text-muted hover:text-accent transition-colors duration-150 truncate"
                >
                  {getDomain(quote.sourceUrl)}
                  <ExternalLinkIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fallback: AI answer when no quotes extracted */}
      {!card.error && !card.quotes && card.fallback && (
        <p className="font-sans text-sm md:text-[15px] text-text-primary leading-relaxed">
          {card.fallback}
        </p>
      )}

      {/* Empty state */}
      {!card.error && !card.quotes && !card.fallback && (
        <p className="font-sans text-sm text-text-muted italic">
          No results found. Try broadening your inputs.
        </p>
      )}
    </div>
  )
}
