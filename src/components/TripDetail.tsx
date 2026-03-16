import { useState } from 'react'
import { PackItem, Trip, TripType, PRESET_CATEGORIES } from '../types'
import { getSuggestions, getMissingUsuals } from '../suggestions'
import ItemRow from './ItemRow'
import SuggestionPanel from './SuggestionPanel'
import AddItemModal from './AddItemModal'

const TYPE_EMOJI: Record<TripType, string> = {
  beach:       '🏖️',
  ski:         '⛷️',
  city:        '🏙️',
  hiking:      '🥾',
  camping:     '⛺',
  business:    '💼',
  cruise:      '🚢',
  'road-trip': '🚗',
  festival:    '🎪',
  backpacking: '🎒',
  wedding:     '💒',
  sports:      '🏟️',
}

interface Props {
  trip: Trip
  allTrips: Trip[]
  onUpdate: (trip: Trip) => void
  onBack: () => void
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Groups items by category, presets first in defined order, custom cats alpha, Misc last */
function groupByCategory(items: PackItem[]): { category: string; items: PackItem[] }[] {
  const map = new Map<string, PackItem[]>()
  for (const item of items) {
    const cat = item.category || 'Misc'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(item)
  }

  const presetOrder = PRESET_CATEGORIES
  const customCats = Array.from(map.keys())
    .filter(c => !presetOrder.includes(c))
    .sort()

  const order = [
    ...presetOrder.filter(c => map.has(c)),
    ...customCats,
  ]

  return order.map(category => ({ category, items: map.get(category)! }))
}

export default function TripDetail({ trip, allTrips, onUpdate, onBack }: Props) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [addToCategory, setAddToCategory] = useState('')

  const suggestions = getSuggestions(trip, allTrips)
  const missingUsuals = getMissingUsuals(trip, allTrips)

  function addItem(item: PackItem) {
    onUpdate({ ...trip, items: [...trip.items, item] })
    setShowAddModal(false)
  }

  function addItemByName(name: string) {
    const item: PackItem = { id: crypto.randomUUID(), name, packed: false, category: 'Misc' }
    onUpdate({ ...trip, items: [...trip.items, item] })
  }

  function toggleItem(id: string) {
    onUpdate({
      ...trip,
      items: trip.items.map(i => i.id === id ? { ...i, packed: !i.packed } : i),
    })
  }

  function deleteItem(id: string) {
    onUpdate({ ...trip, items: trip.items.filter(i => i.id !== id) })
  }

  function openAddModal(category = '') {
    setAddToCategory(category)
    setShowAddModal(true)
  }

  const packed = trip.items.filter(i => i.packed).length
  const total = trip.items.length
  const groups = groupByCategory(trip.items)

  return (
    <div className="trip-detail">
      <div className="detail-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="detail-title-block">
          <h1>{TYPE_EMOJI[trip.type]} {trip.name}</h1>
          <p className="detail-subtitle">
            {trip.destination} · {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
          </p>
          {total > 0 && (
            <p className="detail-progress">{packed} / {total} packed</p>
          )}
        </div>
      </div>

      <SuggestionPanel
        suggestions={suggestions}
        missingUsuals={missingUsuals}
        onAdd={addItemByName}
      />

      <div className="item-list">
        {trip.items.length === 0 && (
          <p className="empty-list">No items yet — tap + to add something.</p>
        )}
        {groups.map(({ category, items }) => (
          <div key={category} className="category-section">
            <div className="category-header">
              <span className="category-name">{category}</span>
              <span className="category-count">{items.filter(i => i.packed).length}/{items.length}</span>
              <button
                className="btn-icon category-add"
                onClick={() => openAddModal(category)}
                aria-label={`Add item to ${category}`}
              >
                +
              </button>
            </div>
            {items.map(item => (
              <ItemRow
                key={item.id}
                item={item}
                onToggle={() => toggleItem(item.id)}
                onDelete={() => deleteItem(item.id)}
              />
            ))}
          </div>
        ))}
      </div>

      <button className="fab" onClick={() => openAddModal('')} aria-label="Add item">+</button>

      {showAddModal && (
        <AddItemModal
          defaultCategory={addToCategory}
          onSave={addItem}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
