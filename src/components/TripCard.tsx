import { Trip, TripType } from '../types'

const TYPE_EMOJI: Record<TripType, string> = {
  beach: '🏖️',
  ski: '⛷️',
  city: '🏙️',
  hiking: '🥾',
  camping: '⛺',
  business: '💼',
}

interface Props {
  trip: Trip
  onClick: () => void
  onDelete: () => void
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export default function TripCard({ trip, onClick, onDelete }: Props) {
  const total = trip.items.length
  const packed = trip.items.filter(i => i.packed).length
  const pct = total === 0 ? 0 : Math.round((packed / total) * 100)

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (confirm(`Delete "${trip.name}"?`)) onDelete()
  }

  return (
    <div className="trip-card" onClick={onClick}>
      <div className="trip-card-header">
        <span className="trip-type-emoji">{TYPE_EMOJI[trip.type]}</span>
        <div className="trip-card-meta">
          <span className="trip-name">{trip.name}</span>
          <span className="trip-destination">{trip.destination}</span>
          <span className="trip-dates">
            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
          </span>
        </div>
        <button className="btn-icon delete-btn" onClick={handleDelete} aria-label="Delete trip">
          ✕
        </button>
      </div>
      <div className="trip-progress-bar">
        <div className="trip-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="trip-progress-label">
        {total === 0 ? 'No items yet' : `${packed} / ${total} packed`}
      </div>
    </div>
  )
}
