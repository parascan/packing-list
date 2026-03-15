import { Trip, TripType } from './types'

// Hardcoded starter sets per trip type — used when no history exists
const TEMPLATES: Record<TripType, string[]> = {
  beach: ['Sunscreen', 'Swimsuit', 'Flip flops', 'Sunglasses', 'Beach towel', 'Hat', 'Aloe vera'],
  ski: ['Ski jacket', 'Ski pants', 'Gloves', 'Goggles', 'Base layer', 'Helmet', 'Ski socks', 'Hand warmers'],
  city: ['Walking shoes', 'Umbrella', 'Camera', 'Day bag', 'Guidebook', 'Portable charger'],
  hiking: ['Hiking boots', 'Backpack', 'Water bottle', 'Trail map', 'First aid kit', 'Sunscreen', 'Bug spray', 'Snacks'],
  camping: ['Tent', 'Sleeping bag', 'Flashlight', 'Matches', 'Camp stove', 'Bug spray', 'Rain jacket', 'Rope'],
  business: ['Dress shirt', 'Dress shoes', 'Laptop', 'Charger', 'Business cards', 'Blazer', 'Belt', 'Notebook'],
}

function normalize(name: string) {
  return name.toLowerCase().trim()
}

/**
 * Returns suggested item names for a trip being built.
 * Uses past trip history if available, falls back to templates.
 */
export function getSuggestions(currentTrip: Trip, allTrips: Trip[]): string[] {
  const pastTrips = allTrips.filter(
    t => t.id !== currentTrip.id && t.type === currentTrip.type
  )
  const currentNames = new Set(currentTrip.items.map(i => normalize(i.name)))

  if (pastTrips.length === 0) {
    // No history — offer the template, excluding what's already added
    return TEMPLATES[currentTrip.type].filter(
      name => !currentNames.has(normalize(name))
    )
  }

  // Count how many past trips each item appeared on
  const freq: Map<string, { display: string; count: number }> = new Map()
  for (const trip of pastTrips) {
    for (const item of trip.items) {
      const key = normalize(item.name)
      if (!freq.has(key)) {
        freq.set(key, { display: item.name, count: 0 })
      }
      freq.get(key)!.count++
    }
  }

  return Array.from(freq.values())
    .filter(({ count, display }) => count >= 2 && !currentNames.has(normalize(display)))
    .sort((a, b) => b.count - a.count)
    .map(({ display }) => display)
}

/**
 * Returns item names the user usually packs for this trip type
 * but hasn't added yet — used for the "you usually pack..." warning.
 */
export function getMissingUsuals(currentTrip: Trip, allTrips: Trip[]): string[] {
  const pastTrips = allTrips.filter(
    t => t.id !== currentTrip.id && t.type === currentTrip.type
  )
  if (pastTrips.length < 2) return []

  const currentNames = new Set(currentTrip.items.map(i => normalize(i.name)))
  const freq: Map<string, { display: string; count: number }> = new Map()

  for (const trip of pastTrips) {
    for (const item of trip.items) {
      const key = normalize(item.name)
      if (!freq.has(key)) freq.set(key, { display: item.name, count: 0 })
      freq.get(key)!.count++
    }
  }

  // "Usually" = appeared in more than half of past trips
  const threshold = Math.ceil(pastTrips.length / 2)
  return Array.from(freq.values())
    .filter(({ count, display }) => count >= threshold && !currentNames.has(normalize(display)))
    .sort((a, b) => b.count - a.count)
    .map(({ display }) => display)
}
