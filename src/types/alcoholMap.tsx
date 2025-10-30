export const alcoholMap = {
  'Absinthe': ['absinthe'],
  'Amaretto': ['amaretto'],
  'Apple Brandy': ['calvados', 'applejack'],
  'Aperitif': ['aperol', 'campari', 'lillet', 'cynar', 'suze', 'byrrh', 'picon'],
  'Beer': [' beer', 'beer ', 'lager', 'ale', 'stout', 'porter', 'ipa', 'pilsner', 'wheat beer'],
  'Brandy': ['brandy', 'cognac', 'armagnac', 'calvados', 'grappa', 'pisco'],
  'Cachaça': ['cachaça', 'cachaca'],
  'Gin': ['gin', 'sloe gin', 'old tom gin'],
  // 'Mezcal': ['mezcal', 'bacanora', 'sotol', 'raicilla'],
  'Ouzo': ['ouzo', 'pastis', 'raki', 'arak'],
  'Pisco': ['pisco'],
  'Rum': [' rum', 'rum ', 'ron', 'rhum', 'overproof rum', 'spiced rum', 'dark rum', 'white rum', 'gold rum'],
  'Sake': ['sake', 'nihonshu'],
  'Sambuca': ['sambuca'],
  'Sparkling Wine': ['champagne', 'prosecco', 'sparkling wine', 'cava', 'franciacorta', 'sekt'],
  'Tequila': ['tequila', 'blanco tequila', 'reposado tequila', 'añejo tequila'],
  'Vermouth': ['vermouth', 'sweet vermouth', 'dry vermouth', 'bianco vermouth'],
  'Vodka': ['vodka'],
  'Whiskey': ['whiskey', 'whisky', 'bourbon', 'scotch', 'rye', 'tennessee whiskey', 'irish whiskey', 'canadian whisky', 'japanese whisky'],
  'Wine': [' red wine', ' white wine', ' wine', 'porto', 'port ', ' sherry', 'marsala', 'madeira', 'vermouth', 'sauternes'],
  
  // Liqueurs
  'Liqueur Anise': ['anisette', 'pastis', 'absinthe', 'ouzo', 'arak', 'sambuca'],
  'Liqueur Chocolate': ['crème de cacao', 'chocolate liqueur', 'mozart'],
  // 'Liqueur Coconut': ['malibu', 'coconut rum'],
  // 'Liqueur Coffee': ['kahlua', 'coffee liqueur', 'tia maria', 'mr black'],
  // 'Liqueur Cream': ['baileys', 'irish cream', 'advocaat', 'amarula', 'rumchata'],
  'Liqueur Fruit': ['cherry heering', 'crème de cassis', 'crème de mûre', 'crème de framboise', 'apricot brandy', 'peach schnapps', 'pear liqueur', 'banana liqueur'],
  'Liqueur Herbal': ['jägermeister', 'jagermeister', 'chartreuse', 'drambuie', 'benedictine', 'fernet', 'strega', 'unicum', 'galliano', 'amaro', 'averna', 'montenegro', 'cynar'],
  'Liqueur Nut': ['frangelico', 'nocino', 'amaretto', 'walnut liqueur', 'hazelnut liqueur'],
  'Liqueur Orange': ['triple sec', 'cointreau', 'grand marnier', ' curaçao', ' curacao', 'blue curaçao', 'orange curaçao'],
  'Liqueur Peppermint': ['crème de menthe', 'peppermint schnapps'],
  'Liqueur Other': ['sloe gin', 'pimms', 'southern comfort', 'tuaca', 'galliano', 'yellow chartreuse', 'green chartreuse', 'midori', 'malibu', 'coconut rum'],
};

export const AlcoholTypes = Object.keys(alcoholMap);

export type Cocktail = {
  id?: number
  name: string
  url?: string
  ingredients: string[]
  preparation?: string[]
  image?: string
  glass_type?: string
  alcoholTypes?: string[]
}

export function extractAlcohols(ingredients: string[]): string[] {
  const found = new Set<string>();
  
  for (const ing of ingredients) {
    const low = ` ${String(ing).toLowerCase()} `;
    
    for (const [label, needles] of Object.entries(alcoholMap)) {
      if (needles.some(n => low.includes(n))) {
        found.add(label);
      }
    }
  }
  return Array.from(found).sort();
}

