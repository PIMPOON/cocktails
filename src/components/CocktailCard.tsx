import React from 'react'
import type { CocktailWithTags } from '../types'

export function CocktailCard({ cocktail }: { cocktail: CocktailWithTags }) {
  return (
    <article className="card">
      <div className="thumb">
        {cocktail.image ? (
          <img src={cocktail.image} alt={cocktail.name} loading="lazy" />
        ) : (
          <span>🍸</span>
        )}
      </div>
      <div className="body">
        <div className="name">{cocktail.name}</div>
        <div className="meta">
          {cocktail.alcohols.map(a => (
            <span className="chip" key={a}>{a}</span>
          ))}
        </div>
        <div className="ing">
          {cocktail.ingredients.slice(0, 2).join(' • ')}
          {cocktail.ingredients.length > 2 ? ' • …' : ''}
        </div>
        <div className="footer">
          <a className="link" href={cocktail.url} target="_blank" rel="noreferrer">
            Voir la recette →
          </a>
        </div>
      </div>
    </article>
  )
}
