export type Cocktail = {
  name: string
  url: string
  ingredients: string[]
  preparation: string[]
  image?: string
}

export type CocktailWithTags = Cocktail & { alcohols: string[] }
