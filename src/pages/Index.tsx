// import { useState } from 'react';
// import { cocktails } from '@/data/cocktails';
// import { Cocktail, AlcoholType } from '@/types/cocktail';
// import Hero from '@/components/Hero';
// import FilterBar from '@/components/FilterBar';
// import CocktailCard from '@/components/CocktailCard';
// import CocktailDetail from '@/components/CocktailDetail';


import { useMemo, useState } from 'react'
import '../App.css'
import cocktails from '../data/saq_cocktails.json'
import type { Cocktail, CocktailWithTags } from '../lib//utils'
import { extractAlcohols } from '../types/alcoholMap'
import FilterBar from '@/components/FilterBar'
import CocktailCard from '@/components/CocktailCard'
import Footer from '@/components/Footer'

const Index = () => {
  const data = (cocktails as Cocktail[]).map(c => ({
    ...c,
    alcohols: extractAlcohols(c.ingredients),
  })) as CocktailWithTags[]

  // Sort cocktails alphabetically by name (French locale)
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  }, [data])

  const [selectedAlcohols, setSelected] = useState<string[]>([])
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null)


  const filtered = useMemo(() => {
    if (selectedAlcohols.length === 0) return sortedData
    return sortedData.filter(c => selectedAlcohols.some(a => c.alcohols.includes(a)))
  }, [sortedData, selectedAlcohols])

  const setSelectedAlcohols = (alcohol: string) => {
    setSelected((prev) => 
      prev.includes(alcohol) 
        ? prev.filter((i) => i !== alcohol) 
        : [...prev, alcohol]
    )
  }
    
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* <header className="header">
        <div>
          <h1 className="title">Cocktails</h1>
          <p className="subtitle">Filtrez par types d’alcools. Données SAQ.</p>
        </div>
        <div className="count">{filtered.length} / {data.length}</div>
      </header> */}

      <FilterBar
        selectedAlcohols={selectedAlcohols}
        onAlcoholChange={setSelectedAlcohols}
        onClearFilters={() => setSelected([])}
      />

      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cocktail) => (
            <CocktailCard 
              key={cocktail.name} 
              cocktail={cocktail}
              onClick={() => setSelectedCocktail(cocktail)}
            />
          ))}
        </div>
      </main>

      <Footer />
      
    </div>
  )
}

export default Index
