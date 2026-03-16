import { useState } from 'react'

interface Props {
  suggestions: string[]
  missingUsuals: string[]
  universals: string[]
  onAdd: (name: string) => void
}

export default function SuggestionPanel({ suggestions, missingUsuals, universals, onAdd }: Props) {
  const [open, setOpen] = useState(true)

  const hasContent = suggestions.length > 0 || missingUsuals.length > 0 || universals.length > 0
  if (!hasContent) return null

  return (
    <div className="suggestion-panel">
      <button className="suggestion-toggle" onClick={() => setOpen(o => !o)}>
        <span>💡 Suggestions</span>
        <span className="suggestion-toggle-arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="suggestion-body">
          {missingUsuals.length > 0 && (
            <div className="suggestion-section">
              <p className="suggestion-section-label">⚠️ You usually pack:</p>
              <div className="suggestion-chips">
                {missingUsuals.map(name => (
                  <button key={name} className="suggestion-chip warning" onClick={() => onAdd(name)}>
                    + {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {universals.length > 0 && (
            <div className="suggestion-section">
              <p className="suggestion-section-label">🧴 Don't forget the basics:</p>
              <div className="suggestion-chips">
                {universals.map(name => (
                  <button key={name} className="suggestion-chip universal" onClick={() => onAdd(name)}>
                    + {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="suggestion-section">
              <p className="suggestion-section-label">
                {missingUsuals.length > 0 ? 'Also consider:' : 'Consider adding:'}
              </p>
              <div className="suggestion-chips">
                {suggestions.map(name => (
                  <button key={name} className="suggestion-chip" onClick={() => onAdd(name)}>
                    + {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
