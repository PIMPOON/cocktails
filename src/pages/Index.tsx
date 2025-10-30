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
import CocktailDetail from '@/components/CocktailDetail'
import Footer from '@/components/Footer'

const Index = () => {
  // Extract alcohol types for each cocktail
  const data = (cocktails as Cocktail[]).map(c => {
    const alcohols = extractAlcohols(c.ingredients)
    // "alcoholTypes" is the same as "alcohols" here, but you can adjust if needed
    return {
      ...c,
      alcohols,
      alcoholTypes: alcohols, // Add alcoholTypes property
    }
  }) as (CocktailWithTags & { alcoholTypes: string[] })[]

  // Sort cocktails alphabetically by name (French locale)
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  }, [data])

  const [selectedAlcohols, setSelected] = useState<string[]>([])
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null)

  const filteredCocktails = useMemo(() => {
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            {filteredCocktails.length} {filteredCocktails.length === 1 ? 'Cocktail' : 'Cocktails'}
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCocktails.map((cocktail) => (
            <CocktailCard 
              key={cocktail.name} 
              cocktail={cocktail}
              onClick={() => setSelectedCocktail(cocktail)}
            />
          ))}
        </div>
      </main>

      <CocktailDetail
        cocktail={selectedCocktail}
        open={!!selectedCocktail}
        onClose={() => setSelectedCocktail(null)}
      />

      <Footer />
      
    </div>
  )
}

export default Index
