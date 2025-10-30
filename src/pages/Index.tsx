import '../App.css'
import { useMemo, useState } from 'react'
import type { Cocktail } from '../types/alcoholMap';
import { extractAlcohols } from '../types/alcoholMap'
import cocktails from '../data/saq_cocktails.json'
import FilterBar from '@/components/FilterBar'
import CocktailCard from '@/components/CocktailCard'
import CocktailDetail from '@/components/CocktailDetail'
import Footer from '@/components/Footer'
// import Hero from '@/components/Hero';

const Index = () => {
  // Prepare cocktail data with extracted alcohol types
  const data = useMemo(() => (
    (cocktails as Cocktail[]).map((c: Cocktail) => ({
      ...c,
      alcoholTypes: extractAlcohols(c.ingredients),
      preparation: c.preparation || [],
      glass_type: c.glass_type || 'Unknown',
    }))
  ), []);

  // Sort cocktails alphabetically (French locale)
  const sortedData = useMemo(() =>
    [...data].sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  , [data]);

  // State for filters and selection
  const [selectedAlcohols, setSelectedAlcohols] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle alcohol filter
  const handleAlcoholToggle = (alcohol: string) => {
    setSelectedAlcohols((prev) =>
      prev.includes(alcohol)
        ? prev.filter((a) => a !== alcohol)
        : [...prev, alcohol]
    );
  };

  // Toggle ingredient filter
  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedAlcohols([]);
    setSelectedIngredients([]);
    setSearchQuery('');
  };

  // Filtering logic
  const filteredCocktails = useMemo(() => {
    return sortedData.filter((cocktail) => {
      // Alcohol filter: at least one selected alcohol must be present
      const matchesAlcohol =
        selectedAlcohols.length === 0 ||
        selectedAlcohols.some((a) => cocktail.alcoholTypes.includes(a));

      // Ingredient filter: all selected ingredients must be present
      const matchesIngredients =
        selectedIngredients.length === 0 ||
        selectedIngredients.every((ingredient) =>
          cocktail.ingredients.some((ci) =>
            ci.toLowerCase().includes(ingredient.toLowerCase())
          )
        );

      // Search filter: match name, description, or ingredients
      const matchesSearch =
        !searchQuery ||
        cocktail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cocktail.ingredients.some((ing) =>
          ing.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesAlcohol && matchesIngredients && matchesSearch;
    });
  }, [sortedData, selectedAlcohols, selectedIngredients, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* <Hero /> */}

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAlcohols={selectedAlcohols}
        onAlcoholChange={handleAlcoholToggle}
        onClearFilters={handleClearFilters}
        selectedIngredients={selectedIngredients}
        onIngredientToggle={handleIngredientToggle}
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
  );
};

export default Index
