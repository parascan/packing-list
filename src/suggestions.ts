import { Trip, TripType } from './types'

function normalize(name: string) {
  return name.toLowerCase().trim()
}

// Items every trip needs — shown regardless of trip type or history
export const UNIVERSAL_ITEMS = [
  'Toothbrush',
  'Toothpaste',
  'Deodorant',
  'Phone charger',
  'Underwear',
  'Socks',
  'Pajamas',
  'Wallet',
  'Hairbrush',
  'Razor',
]

/**
 * Returns universal items not yet in the trip's list.
 */
export function getUniversalSuggestions(currentTrip: Trip): string[] {
  const currentNames = new Set(currentTrip.items.map(i => normalize(i.name)))
  return UNIVERSAL_ITEMS.filter(name => !currentNames.has(normalize(name)))
}

// Hardcoded starter sets per trip type — used when no history exists
const TEMPLATES: Record<TripType, string[]> = {
  beach: [
    'Sunscreen', 'Swimsuit', 'Flip flops', 'Sunglasses', 'Beach towel', 'Hat',
    'Aloe vera', 'Rash guard', 'Beach bag', 'Bug spray', 'After sun lotion', 'Waterproof phone case',
  ],
  ski: [
    'Ski jacket', 'Ski pants', 'Gloves', 'Goggles', 'Base layer', 'Helmet',
    'Ski socks', 'Hand warmers', 'Neck gaiter', 'Lip balm', 'Sunscreen', 'Thermal underwear', 'Après ski boots',
  ],
  city: [
    'Walking shoes', 'Umbrella', 'Camera', 'Day bag', 'Portable charger', 'Sunglasses',
    'Rain jacket', 'Comfortable jeans', 'Smart casual outfit', 'Crossbody bag', 'Guidebook',
  ],
  hiking: [
    'Hiking boots', 'Backpack', 'Water bottle', 'Trail map', 'First aid kit',
    'Sunscreen', 'Bug spray', 'Snacks', 'Headlamp', 'Rain jacket', 'Trekking poles',
    'Compass', 'Emergency whistle', 'Blister pads', 'Gaiters',
  ],
  camping: [
    'Tent', 'Sleeping bag', 'Sleeping pad', 'Flashlight', 'Matches', 'Camp stove',
    'Bug spray', 'Rain jacket', 'Rope', 'Camping chair', 'Cooler', 'Lantern',
    'Pocket knife', 'Bear canister', 'Fire starter',
  ],
  business: [
    'Dress shirt', 'Dress pants', 'Dress shoes', 'Blazer', 'Tie', 'Belt',
    'Laptop', 'Charger', 'Business cards', 'Notebook', 'Pen', 'Portable charger', 'Folder',
  ],
  cruise: [
    'Formal wear', 'Swimsuit', 'Sunscreen', 'Sunglasses', 'Flip flops', 'Casual outfits',
    'Dress shoes', 'Motion sickness medicine', 'Lanyard', 'Day bag', 'Light jacket',
    'Passport', 'Formal dinner outfit', 'Waterproof phone case',
  ],
  'road-trip': [
    'Snacks', 'Water bottle', 'Phone charger', 'Sunglasses', 'Comfortable clothes',
    'Pillow', 'Blanket', 'First aid kit', 'Flashlight', 'Cash', 'Travel mug',
    'Rain jacket', 'Entertainment', 'GPS / maps',
  ],
  festival: [
    'Tent', 'Sleeping bag', 'Rain poncho', 'Wellies', 'Comfortable shoes', 'Sunscreen',
    'Portable charger', 'Earplugs', 'Cash', 'Reusable water bottle', 'Backpack',
    'Hand sanitizer', 'Layers', 'Bin bags', 'Headlamp', 'Wet wipes',
  ],
  backpacking: [
    'Backpack', 'Passport', 'Hostel lock', 'Travel towel', 'Comfortable walking shoes',
    'Lightweight jacket', 'Portable charger', 'Earplugs', 'Eye mask', 'Money belt',
    'First aid kit', 'Reusable water bottle', 'Flip flops', 'Dry bag',
  ],
  wedding: [
    'Dress / suit', 'Dress shoes', 'Tie / accessories', 'Card or gift', 'Camera',
    'Clutch bag', 'Touch up kit', 'Breath mints', 'Phone charger', 'Umbrella',
    'Formal underwear', 'Stain remover pen',
  ],
  sports: [
    'Jersey', 'Comfortable shoes', 'Sunscreen', 'Sunglasses', 'Rain jacket', 'Cap or hat',
    'Portable charger', 'Cash', 'Snacks', 'Reusable water bottle', 'Binoculars',
    'Hand warmers', 'Ear muffs', 'Blanket',
  ],
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
