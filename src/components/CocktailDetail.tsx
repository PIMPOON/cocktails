import type { Cocktail } from '../types/alcoholMap';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wine, GlassWater } from 'lucide-react';

interface CocktailDetailProps {
    cocktail: Cocktail | null;
    open: boolean;
    onClose: () => void;
  }
  
  const CocktailDetail = ({ cocktail, open, onClose }: CocktailDetailProps) => {
    if (!cocktail) return null;
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{cocktail.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="relative h-80 overflow-hidden rounded-lg">
              <img
                src={cocktail.image}
                alt={cocktail.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="capitalize">
                <Wine className="mr-1 h-4 w-4" />
                {cocktail.alcoholTypes.join(' / ')}
              </Badge>
              <Badge variant="outline" className="capitalize">
                <GlassWater className="mr-1 h-4 w-4" />
                {cocktail.glass_type}
              </Badge>
            </div>
            
            {/* <p className="text-muted-foreground">{cocktail.description}</p> */}
            
            <Separator />
            
            <div>
              <h3 className="mb-3 text-lg font-semibold">Ingredients</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {cocktail.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="mb-3 text-lg font-semibold">Instructions</h3>
              <ol className="space-y-3">
                {cocktail.preparation.map((preparation, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-muted-foreground">{preparation}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default CocktailDetail;
  