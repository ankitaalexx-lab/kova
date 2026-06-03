const TAVILY_API_URL = 'https://api.tavily.com/search'

async function searchTavily(query) {
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY
  if (!apiKey) {
    throw new Error('Tavily API key is missing. Add VITE_TAVILY_API_KEY to your .env file.')
  }

  const response = await fetch(TAVILY_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'advanced',
      include_answer: true,
      include_raw_content: false,
      max_results: 6,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Tavily error ${response.status}: ${text}`)
  }

  return response.json()
}

// Phrases that indicate boilerplate rather than real buyer content
const BOILERPLATE_PATTERNS = [
  /continue with (email|phone|google|apple)/i,
  /by continuing.{0,60}(agree|terms|privacy|policy)/i,
  /user agreement/i,
  /privacy policy/i,
  /cookie(s)? (notice|policy|settings|consent)/i,
  /accept (all )?cookies/i,
  /sign (in|up) (to|with|using)/i,
  /log ?in (to|with) (your|a)/i,
  /create (a |an )?(free )?account/i,
  /already have an account/i,
  /forgot (your )?password/i,
  /subscribe to (our|the) newsletter/i,
  /terms (of|and) (service|use|conditions)/i,
  /all rights reserved/i,
  /©\s*\d{4}/,
  /^\s*#+\s/,                        // starts with markdown heading
  /\[!\[/,                           // markdown image syntax
]

// Markdown syntax to strip from display text
const MARKDOWN_STRIP = [
  /#{1,6}\s+/g,          // headings
  /\*{1,3}([^*]+)\*{1,3}/g,  // bold/italic — keep inner text
  /_{1,3}([^_]+)_{1,3}/g,    // underscore bold/italic
  /\[([^\]]+)\]\([^)]+\)/g,  // links — keep label
  /`{1,3}[^`]*`{1,3}/g,      // inline code / fenced
  /^\s*[-*+]\s+/gm,          // list bullets
  /^\s*\d+\.\s+/gm,          // numbered lists
  /^\s*>\s+/gm,              // blockquotes
  /\|[^\n]+\|/g,             // table rows
  /^[-=]{3,}$/gm,            // horizontal rules / setext headings
]

function isBoilerplate(text) {
  return BOILERPLATE_PATTERNS.some((re) => re.test(text))
}

function cleanQuote(raw) {
  let text = raw
  // Strip HTML tags
  text = text.replace(/<[^>]+>/g, ' ')
  // Strip markdown
  for (const re of MARKDOWN_STRIP) {
    text = text.replace(re, (_, inner) => inner || ' ')
  }
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim()
  // Trim to ~280 chars at a clean sentence boundary
  if (text.length <= 280) return text
  const truncated = text.slice(0, 280)
  const lastBreak = Math.max(
    truncated.lastIndexOf('. '),
    truncated.lastIndexOf('! '),
    truncated.lastIndexOf('? '),
  )
  return lastBreak > 120 ? truncated.slice(0, lastBreak + 1) : truncated.trimEnd() + '…'
}

function extractQuotes(results) {
  return (results || [])
    .filter((r) => {
      if (!r.content || r.content.trim().length < 60) return false
      if (isBoilerplate(r.content)) return false
      const cleaned = cleanQuote(r.content)
      // Reject if still short or boilerplate after cleaning
      if (cleaned.length < 60) return false
      if (isBoilerplate(cleaned)) return false
      return true
    })
    .slice(0, 3)
    .map((r) => ({
      text: cleanQuote(r.content),
      sourceTitle: r.title || 'Source',
      sourceUrl: r.url,
    }))
}

export async function generateBuyerIntelligence({ category, competitors, buyerRole, misunderstanding }) {
  const sections = [
    {
      id: 'feelings',
      icon: '01',
      title: 'What buyers are really feeling about this category',
      query: `${category} problems frustrations complaints site:reddit.com OR site:g2.com OR site:capterra.com`,
    },
    {
      id: 'questions',
      icon: '02',
      title: 'Questions buyers are asking that nobody is answering',
      query: `${category} "does anyone know" OR "how do I" OR "is there a way to" site:reddit.com OR forum`,
    },
    {
      id: 'trust',
      icon: '03',
      title: 'The exact moment buyers lose trust in your competitors',
      query: `${competitors} negative reviews "switched from" OR "cancelled" OR "disappointed" site:g2.com OR site:reddit.com OR site:trustpilot.com`,
    },
    {
      id: 'phrases',
      icon: '04',
      title: 'Phrases to steal directly for your homepage and outreach',
      query: `${category} buyers "we needed" OR "we were looking for" OR "the problem was" OR "finally found" site:reddit.com OR site:g2.com`,
    },
    {
      id: 'gap',
      icon: '05',
      title: 'The one positioning gap nobody owns — and your first move to claim it',
      query: `${category} "no one offers" OR "wish there was" OR "gap in the market" OR "none of them" site:reddit.com OR forum OR community`,
    },
  ]

  const settled = await Promise.allSettled(
    sections.map(async (section) => {
      const data = await searchTavily(section.query)
      const quotes = extractQuotes(data.results)
      return {
        ...section,
        quotes: quotes.length > 0 ? quotes : null,
        fallback: data.answer && data.answer.trim() ? data.answer : null,
      }
    })
  )

  return settled.map((result, i) => {
    if (result.status === 'fulfilled') return result.value
    return {
      ...sections[i],
      quotes: null,
      fallback: null,
      error: result.reason?.message || 'Could not retrieve results. Check your API key and try again.',
    }
  })
}
