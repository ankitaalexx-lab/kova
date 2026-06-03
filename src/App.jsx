import { useState } from 'react'
import HomePage from './components/HomePage.jsx'
import LoadingState from './components/LoadingState.jsx'
import ResultsPage from './components/ResultsPage.jsx'
import { generateBuyerIntelligence } from './api/tavily.js'

const VIEWS = { HOME: 'home', LOADING: 'loading', RESULTS: 'results', ERROR: 'error' }

export default function App() {
  const [view, setView] = useState(VIEWS.HOME)
  const [results, setResults] = useState(null)
  const [formData, setFormData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(data) {
    setFormData(data)
    setView(VIEWS.LOADING)
    setErrorMsg('')
    try {
      const cards = await generateBuyerIntelligence(data)
      setResults(cards)
      setView(VIEWS.RESULTS)
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
      setView(VIEWS.ERROR)
    }
  }

  function handleRunAgain() {
    setResults(null)
    setView(VIEWS.HOME)
  }

  if (view === VIEWS.LOADING) return <LoadingState />

  if (view === VIEWS.RESULTS && results) {
    return <ResultsPage results={results} formData={formData} onRunAgain={handleRunAgain} />
  }

  if (view === VIEWS.ERROR) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 7v4M10 13.5v.5M2.5 17.5h15L10 2.5l-7.5 15z" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-syne font-bold text-text-primary text-lg mb-2">Something went wrong</h2>
          <p className="font-sans text-text-muted text-sm mb-6 leading-relaxed">{errorMsg}</p>
          <button
            onClick={handleRunAgain}
            className="w-full bg-accent hover:bg-accent-hover text-white font-syne font-semibold text-sm py-3 px-6 rounded-xl transition-colors duration-150"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return <HomePage onSubmit={handleSubmit} />
}
