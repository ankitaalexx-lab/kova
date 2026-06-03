import { useState } from 'react'
import Footer from './Footer.jsx'

const FIELDS = [
  {
    id: 'category',
    label: 'Product category',
    placeholder: 'e.g. Revenue intelligence, Project management, CDPs…',
    multiline: false,
  },
  {
    id: 'competitors',
    label: 'Your product name + up to 3 competitors',
    placeholder: 'e.g. Gong, Chorus, Salesloft, Clari',
    multiline: false,
  },
  {
    id: 'buyerRole',
    label: 'Target buyer role and industry',
    placeholder: 'e.g. VP of Sales at B2B SaaS companies',
    multiline: false,
  },
  {
    id: 'misunderstanding',
    label: 'What do buyers most misunderstand about this category?',
    placeholder: "e.g. They think it’s just for recording calls, not deal intelligence…",
    multiline: true,
  },
]

export default function HomePage({ onSubmit }) {
  const [form, setForm] = useState({ category: '', competitors: '', buyerRole: '', misunderstanding: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const e = {}
    FIELDS.forEach(({ id }) => { if (!form[id].trim()) e[id] = 'Required' })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(evt) {
    evt.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    await onSubmit(form)
    setSubmitting(false)
  }

  function onChange(id, val) {
    setForm((p) => ({ ...p, [id]: val }))
    if (errors[id]) setErrors((p) => ({ ...p, [id]: undefined }))
  }

  const inputBase =
    'w-full bg-background border rounded-xl px-4 py-3 font-sans text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-150 focus:ring-1 focus:ring-accent/30'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center px-4 py-14 md:py-20">

        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-px h-7 bg-accent opacity-70" />
            <h1 className="font-syne font-bold text-[2rem] md:text-[2.5rem] tracking-[0.25em] text-text-primary leading-none">
              KOVA
            </h1>
            <div className="w-px h-7 bg-accent opacity-70" />
          </div>
          <p className="font-syne text-text-muted text-sm md:text-base tracking-wide">
            The intelligence your competitors do not have.
          </p>
        </div>

        {/* Form card */}
        <div className="w-full max-w-2xl">
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-10 glow-accent-sm">
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-5">
                {FIELDS.map(({ id, label, placeholder, multiline }) => (
                  <div key={id} className="flex flex-col gap-1.5">
                    <label htmlFor={id} className="font-sans font-medium text-sm text-text-primary">
                      {label}
                    </label>
                    {multiline ? (
                      <textarea
                        id={id}
                        rows={3}
                        placeholder={placeholder}
                        value={form[id]}
                        onChange={(e) => onChange(id, e.target.value)}
                        className={`${inputBase} resize-none ${errors[id] ? 'border-red-500/50 focus:border-red-500/50' : 'border-border focus:border-accent'}`}
                      />
                    ) : (
                      <input
                        id={id}
                        type="text"
                        placeholder={placeholder}
                        value={form[id]}
                        onChange={(e) => onChange(id, e.target.value)}
                        className={`${inputBase} ${errors[id] ? 'border-red-500/50 focus:border-red-500/50' : 'border-border focus:border-accent'}`}
                      />
                    )}
                    {errors[id] && (
                      <p className="text-red-400 font-sans text-xs">{errors[id]}</p>
                    )}
                  </div>
                ))}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-syne font-semibold text-sm tracking-wide py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 glow-accent"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Running&hellip;
                      </>
                    ) : (
                      <>
                        Run Kova
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <p className="text-center text-text-muted font-sans text-xs mt-4 leading-relaxed">
            Pulls real buyer signals from Reddit, G2, and review sites via Tavily Search.
            <br className="hidden sm:block" /> No data is stored anywhere.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
