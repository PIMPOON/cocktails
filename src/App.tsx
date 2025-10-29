import { useMemo, useState } from 'react'
import './App.css'
import './app.css'
import cocktails from './data/saq_cocktails.json'
import type { Cocktail, CocktailWithTags } from './types'
import { extractAlcohols } from './utils/alcohol'
import { FilterBar } from './components/FilterBar'
import { CocktailCard } from './components/CocktailCard'

function App() {
  const data = (cocktails as Cocktail[]).map(c => ({
    ...c,
    alcohols: extractAlcohols(c.ingredients),
  })) as CocktailWithTags[]

  const [selected, setSelected] = useState<string[]>([])

  const allAlcohols = useMemo(() => {
    const set = new Set<string>()
    data.forEach(c => c.alcohols.forEach(a => set.add(a)))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'))
  }, [data])

  const filtered = useMemo(() => {
    if (selected.length === 0) return data
    return data.filter(c => selected.every(a => c.alcohols.includes(a)))
  }, [data, selected])

  const toggle = (a: string) =>
    setSelected(prev => (prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]))

  return (
    <div className="app container">
      <header className="header">
        <div>
          <h1 className="title">Cocktails</h1>
          <p className="subtitle">Filtrez par types d’alcools. Données SAQ.</p>
        </div>
        <div className="count">{filtered.length} / {data.length}</div>
      </header>

      <section className="panel">
        <FilterBar
          allAlcohols={allAlcohols}
          selected={selected}
          onToggle={toggle}
          onReset={() => setSelected([])}
        />
      </section>

      <main className="grid">
        {filtered.map(c => (
          <CocktailCard key={c.name} cocktail={c} />
        ))}
      </main>
    </div>
  )
}

export default App
