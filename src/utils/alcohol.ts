export const ALCOHOL_MAP: Array<[RegExp, string]> = [
  [/vodka/i, 'Vodka'],
  [/\bdry\s*gin\b|\bgin\b/i, 'Gin'],
  [/rhum/i, 'Rhum'],
  [/tequila/i, 'Tequila'],
  [/whisk(?:y|ey)/i, 'Whisky'],
  [/pastis|alcool anis[ée]/i, 'Pastis'],
  [/bi[èe]re/i, 'Bière'],
  [/vin mousseux/i, 'Vin mousseux'],
  [/cura[çc]ao|liqueur d['’]agrumes/i, 'Liqueur d’agrumes'],
  [/liqueur de caf[ée]/i, 'Liqueur de café'],
  [/cr[èe]me irlandaise/i, 'Crème irlandaise'],
  [/liqueur d['’]herbe/i, 'Liqueur d’herbe'],
  [/liqueur de citron/i, 'Liqueur de citron'],
  [/liqueur de fraise/i, 'Liqueur de fraise'],
]

export function extractAlcohols(ingredients: string[]): string[] {
  const text = ingredients.join(' • ')
  const found = new Set<string>()
  for (const [rx, label] of ALCOHOL_MAP) {
    if (rx.test(text)) found.add(label)
  }
  return Array.from(found)
}
