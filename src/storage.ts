import { Trip } from './types'

const KEY = 'packing_trips'

export function loadTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Trip[]) : []
  } catch {
    return []
  }
}

export function saveTrips(trips: Trip[]): void {
  localStorage.setItem(KEY, JSON.stringify(trips))
}

export function upsertTrip(trip: Trip): void {
  const trips = loadTrips()
  const idx = trips.findIndex(t => t.id === trip.id)
  if (idx >= 0) {
    trips[idx] = trip
  } else {
    trips.unshift(trip)
  }
  saveTrips(trips)
}

export function deleteTrip(id: string): void {
  saveTrips(loadTrips().filter(t => t.id !== id))
}
