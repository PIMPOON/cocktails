import type { Cocktail } from '../types/alcoholMap';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
import { Wine } from 'lucide-react';

interface CocktailCardProps {
  cocktail: Cocktail;
  onClick: () => void;
};

const CocktailCard = ({ cocktail, onClick }: CocktailCardProps) => {
  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={cocktail.image}
          alt={cocktail.name}
          className="h-50 w-50 position-relative object-cover transition-transform duration-300 group-hover:scale-105 mx-auto"
        />
        <div className="absolute inset-0" />
        <Badge 
          variant="secondary" 
          className="absolute right-3 top-3 capitalize backdrop-blur-sm"
        >
          <Wine className="mr-1 h-3 w-3" />
          {cocktail.alcoholTypes.join(' / ')}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <h3 className="text-xl font-bold text-foreground">{cocktail.name}</h3>
      </CardHeader>
      
      {/* <CardContent className="pb-3">
        <div className="flex flex-wrap gap-1.5">
          {cocktail.ingredients.slice(0, 4).map((ingredient, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {ingredient}
            </Badge>
          ))}
          {cocktail.ingredients.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{cocktail.ingredients.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent> */}
    </Card>
  );
};

export default CocktailCard;


// import type { CocktailWithTags } from '../lib//utils'

// const CocktailCard = ({ cocktail }: { cocktail: CocktailWithTags }) => {
//   return (
//     <article className="card">
//       <div className="thumb">
//         {cocktail.image ? (
//           <img src={cocktail.image} alt={cocktail.name} loading="lazy" />
//         ) : (
//           <span>🍸</span>
//         )}
//       </div>
//       <div className="body">
//         <div className="name">{cocktail.name}</div>
//         {/* <div className="meta">
//           {cocktail.alcohols.map(a => (
//             <span className="chip" key={a}>{a}</span>
//           ))}
//         </div> */}
//         {/* <div className="ing">
//           {cocktail.ingredients.slice(0, 2).join(' • ')}
//           {cocktail.ingredients.length > 2 ? ' • …' : ''}
//         </div>
//         <div className="footer">
//           <a className="link" href={cocktail.url} target="_blank" rel="noreferrer">
//             Voir la recette →
//           </a>
//         </div> */}
//       </div>
//     </article>
//   );
// };

// export default CocktailCard;