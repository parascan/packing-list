import { useState } from 'react'
import { Trip } from './types'
import { loadTrips, upsertTrip, deleteTrip } from './storage'
import TripCard from './components/TripCard'
import TripDetail from './components/TripDetail'
import NewTripModal from './components/NewTripModal'

export default function App() {
  const [trips, setTrips] = useState<Trip[]>(() => loadTrips())
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)

  const activeTrip = trips.find(t => t.id === activeId) ?? null

  function handleCreate(trip: Trip) {
    upsertTrip(trip)
    setTrips(loadTrips())
    setActiveId(trip.id)
    setShowNewModal(false)
  }

  function handleUpdate(trip: Trip) {
    upsertTrip(trip)
    setTrips(loadTrips())
  }

  function handleDelete(id: string) {
    deleteTrip(id)
    setTrips(loadTrips())
    if (activeId === id) setActiveId(null)
  }

  function handleDuplicate(id: string) {
    const original = trips.find(t => t.id === id)
    if (!original) return
    const copy: Trip = {
      ...original,
      id: crypto.randomUUID(),
      name: `${original.name} (copy)`,
      items: original.items.map(i => ({ ...i, id: crypto.randomUUID(), packed: false })),
      createdAt: new Date().toISOString(),
    }
    upsertTrip(copy)
    setTrips(loadTrips())
    setActiveId(copy.id)
  }

  if (activeTrip) {
    return (
      <TripDetail
        trip={activeTrip}
        allTrips={trips}
        onUpdate={handleUpdate}
        onBack={() => setActiveId(null)}
      />
    )
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1>🧳 Packing List</h1>
      </header>

      <div className="trip-list">
        {trips.length === 0 && (
          <p className="empty-home">No trips yet — create one below!</p>
        )}
        {trips.map(trip => (
          <TripCard
            key={trip.id}
            trip={trip}
            onClick={() => setActiveId(trip.id)}
            onDelete={() => handleDelete(trip.id)}
            onDuplicate={() => handleDuplicate(trip.id)}
          />
        ))}
      </div>

      <button className="fab" onClick={() => setShowNewModal(true)} aria-label="New trip">+</button>

      {showNewModal && (
        <NewTripModal onSave={handleCreate} onClose={() => setShowNewModal(false)} />
      )}
    </div>
  )
}
