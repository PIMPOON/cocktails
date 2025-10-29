import React from 'react'

type Props = {
  allAlcohols: string[]
  selected: string[]
  onToggle: (a: string) => void
  onReset: () => void
}

export function FilterBar({ allAlcohols, selected, onToggle, onReset }: Props) {
  return (
    <div>
      <div className="filters">
        {allAlcohols.map(a => (
          <label key={a} className="filter-item">
            <input
              type="checkbox"
              checked={selected.includes(a)}
              onChange={() => onToggle(a)}
            />
            <span>{a}</span>
          </label>
        ))}
      </div>
      <div className="actions">
        <div className="chips">
          {selected.length === 0 ? (
            <span className="chip">Aucun filtre</span>
          ) : (
            selected.map(a => <span key={a} className="chip">{a}</span>)
          )}
        </div>
        <button
          className="btn"
          onClick={onReset}
          disabled={selected.length === 0}
          aria-disabled={selected.length === 0}
          title="Réinitialiser"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  )
}
