import { useState } from 'react'
import { Trip, TripType } from '../types'

const TRIP_TYPES: { value: TripType; label: string; emoji: string }[] = [
  { value: 'beach',       label: 'Beach',       emoji: '🏖️' },
  { value: 'ski',         label: 'Ski',         emoji: '⛷️' },
  { value: 'city',        label: 'City',        emoji: '🏙️' },
  { value: 'hiking',      label: 'Hiking',      emoji: '🥾' },
  { value: 'camping',     label: 'Camping',     emoji: '⛺' },
  { value: 'business',    label: 'Business',    emoji: '💼' },
  { value: 'cruise',      label: 'Cruise',      emoji: '🚢' },
  { value: 'road-trip',   label: 'Road Trip',   emoji: '🚗' },
  { value: 'festival',    label: 'Festival',    emoji: '🎪' },
  { value: 'backpacking', label: 'Backpacking', emoji: '🎒' },
  { value: 'wedding',     label: 'Wedding',     emoji: '💒' },
  { value: 'sports',      label: 'Sports',      emoji: '🏟️' },
]

interface Props {
  initialTrip?: Trip
  onSave: (trip: Trip) => void
  onClose: () => void
}

export default function NewTripModal({ initialTrip, onSave, onClose }: Props) {
  const today = new Date().toISOString().slice(0, 10)
  const [name, setName] = useState(initialTrip?.name ?? '')
  const [destination, setDestination] = useState(initialTrip?.destination ?? '')
  const [startDate, setStartDate] = useState(initialTrip?.startDate ?? today)
  const [endDate, setEndDate] = useState(initialTrip?.endDate ?? today)
  const [type, setType] = useState<TripType>(initialTrip?.type ?? 'city')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !destination.trim()) return
    const trip: Trip = initialTrip
      ? { ...initialTrip, name: name.trim(), destination: destination.trim(), startDate, endDate, type }
      : {
          id: crypto.randomUUID(),
          name: name.trim(),
          destination: destination.trim(),
          startDate,
          endDate,
          type,
          items: [],
          createdAt: new Date().toISOString(),
        }
    onSave(trip)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialTrip ? 'Edit Trip' : 'New Trip'}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Trip name
            <input
              autoFocus
              type="text"
              placeholder="e.g. Summer Vacation"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Destination
            <input
              type="text"
              placeholder="e.g. Cancún, Mexico"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              required
            />
          </label>
          <div className="date-row">
            <label>
              Start
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </label>
            <label>
              End
              <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} required />
            </label>
          </div>
          <div className="type-picker">
            <span className="type-picker-label">Trip type</span>
            <div className="type-chips">
              {TRIP_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  className={`type-chip${type === t.value ? ' selected' : ''}`}
                  onClick={() => setType(t.value)}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={!name.trim() || !destination.trim()}>
            {initialTrip ? 'Save Changes' : 'Create Trip'}
          </button>
        </form>
      </div>
    </div>
  )
}
