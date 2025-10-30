import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlcoholTypes } from '../types/alcoholMap';
import { Search } from 'lucide-react';

interface FilterBarProps {
  selectedAlcohols: string[];
  onAlcoholChange: (alcohol: string) => void;
  selectedIngredients?: string[];
  onIngredientToggle?: (ingredient: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onClearFilters: () => void;
}

const commonIngredients = [
  'lime',
  'citron',
  'orange',
  'pamplemousse',
  'ananas',
  'canneberge',
  'pomme',
  'menthe',
  'basilic',
  'sucre',
  'miel',
  'gingembre',
  'concombre',
  'soda',
  'tonique',
  'eau pétillante',
  'grenadine',
  'cerise',
  'olive',
  'amer',
  'blanc d\'œuf',
  'crème',
  'noix de coco',
  'café',
  'vanille',
  'cannelle',
  'angostura',
];

const FilterBar = ({ 
  selectedAlcohols, 
  onAlcoholChange, 
  selectedIngredients, 
  onIngredientToggle,
  searchQuery, 
  onSearchChange, 
  onClearFilters,
}: FilterBarProps) => {
  return (
    <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
    
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Alcohol Type</p>
            <div className="flex flex-wrap gap-2">
              {AlcoholTypes.map(alcohol => (
                <Badge
                  key={alcohol}
                  variant={selectedAlcohols.includes(alcohol) ? "default" : "outline"}
                  className="cursor-pointer capitalize transition-all hover:scale-105"
                  onClick={() => onAlcoholChange(alcohol)}
                >
                  {alcohol}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Ingredients</p>
            <div className="flex flex-wrap gap-2">
              {commonIngredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant={(selectedIngredients ?? []).includes(ingredient) ? "secondary" : "outline"}
                  className="cursor-pointer capitalize transition-all hover:scale-105"
                  onClick={() => onIngredientToggle?.(ingredient)}
                >
                  {ingredient}
                </Badge>
              ))}
            </div>  

            <div className="flex w-full justify-center mt-6">
              <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-card/80 p-2 shadow-lg backdrop-blur-sm">
                <Search className="ml-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent px-2 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
