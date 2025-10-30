import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlcoholTypes } from '../types/alcoholMap';

interface FilterBarProps {
  selectedAlcohols: string[];
  onAlcoholChange: (alcohol: string | null) => void;
  onClearFilters: () => void;
}

const allAlcohols = AlcoholTypes

const FilterBar = ({ 
  selectedAlcohols, 
  onAlcoholChange, 
  onClearFilters 
}: FilterBarProps) => {
  return (
    <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Alcohol Type</p>
            <div className="flex flex-wrap gap-2">
              {allAlcohols.map(alcohol => (
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
            {/* <p className="mb-2 text-sm font-medium text-muted-foreground">Ingredients</p>
            <div className="flex flex-wrap gap-2">
              {commonIngredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant={selectedIngredients.includes(ingredient) ? "secondary" : "outline"}
                  className="cursor-pointer capitalize transition-all hover:scale-105"
                  onClick={() => onIngredientToggle(ingredient)}
                >
                  {ingredient}
                </Badge>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
