import { useState, useEffect } from 'react'

const MESSAGES = [
  'Scanning Reddit and G2…',
  'Reading what buyers say in the dark…',
  'Finding the gap nobody is talking about…',
  'Building your intelligence report…',
]

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length)
        setVisible(true)
      }, 300)
    }, 2800)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-14">
        <span className="font-syne font-bold text-2xl tracking-[0.25em] text-text-primary">
          KOVA
        </span>
      </div>

      {/* Spinner */}
      <div className="relative w-16 h-16 mb-12">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
        </div>
      </div>

      {/* Message */}
      <p
        className="font-sans text-text-muted text-base text-center max-w-xs transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {MESSAGES[msgIndex]}
      </p>

      {/* Dots */}
      <div className="flex gap-2 mt-8">
        {MESSAGES.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === msgIndex ? '#7C3AED' : '#1E1E2E',
              transform: i === msgIndex ? 'scale(1.5)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
