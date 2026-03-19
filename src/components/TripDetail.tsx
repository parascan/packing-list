import { useState } from 'react'
import {
  DndContext, DragEndEvent, PointerSensor, TouchSensor,
  useSensor, useSensors, closestCenter,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PackItem, Trip, TripType, PRESET_CATEGORIES } from '../types'
import { getSuggestions, getMissingUsuals, getUniversalSuggestions } from '../suggestions'
import SortableItemRow from './SortableItemRow'
import SuggestionPanel from './SuggestionPanel'
import AddItemModal from './AddItemModal'
import { inferCategory } from '../emojiUtils'

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

/** Groups items by category, presets first, custom cats alpha, Misc last */
function groupByCategory(items: PackItem[]): { category: string; items: PackItem[] }[] {
  const map = new Map<string, PackItem[]>()
  for (const item of items) {
    const cat = item.category || 'Misc'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(item)
  }
  const presetOrder = PRESET_CATEGORIES
  const customCats = Array.from(map.keys()).filter(c => !presetOrder.includes(c)).sort()
  const order = [...presetOrder.filter(c => map.has(c)), ...customCats]
  return order.map(category => ({ category, items: map.get(category)! }))
}

export default function TripDetail({ trip, allTrips, onUpdate, onBack }: Props) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [addToCategory, setAddToCategory] = useState('')
  const [addWithName, setAddWithName] = useState('')

  const suggestions = getSuggestions(trip, allTrips)
  const missingUsuals = getMissingUsuals(trip, allTrips)
  const universals = getUniversalSuggestions(trip)

  // DnD sensors — pointer for desktop, touch with 250ms delay for mobile
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = trip.items.findIndex(i => i.id === active.id)
    const newIndex = trip.items.findIndex(i => i.id === over.id)
    onUpdate({ ...trip, items: arrayMove(trip.items, oldIndex, newIndex) })
  }

  function addItem(item: PackItem) {
    onUpdate({ ...trip, items: [...trip.items, item] })
    setShowAddModal(false)
    setAddWithName('')
  }

  function openAddModalWithName(name: string) {
    setAddWithName(name)
    setAddToCategory(inferCategory(name))
    setShowAddModal(true)
  }

  function toggleItem(id: string) {
    onUpdate({ ...trip, items: trip.items.map(i => i.id === id ? { ...i, packed: !i.packed } : i) })
  }

  function deleteItem(id: string) {
    onUpdate({ ...trip, items: trip.items.filter(i => i.id !== id) })
  }

  function openAddModal(category = '') {
    setAddWithName('')
    setAddToCategory(category)
    setShowAddModal(true)
  }

  function saveNotes(notes: string) {
    onUpdate({ ...trip, notes })
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

      {/* Notes */}
      <textarea
        className="trip-notes"
        placeholder="✏️  Add notes — hotel address, flight info, reminders..."
        defaultValue={trip.notes ?? ''}
        onBlur={e => saveNotes(e.target.value)}
        rows={2}
      />

      <SuggestionPanel
        suggestions={suggestions}
        missingUsuals={missingUsuals}
        universals={universals}
        onAdd={openAddModalWithName}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
              <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                {items.map(item => (
                  <SortableItemRow
                    key={item.id}
                    item={item}
                    onToggle={() => toggleItem(item.id)}
                    onDelete={() => deleteItem(item.id)}
                  />
                ))}
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>

      <button className="fab" onClick={() => openAddModal('')} aria-label="Add item">+</button>

      {showAddModal && (
        <AddItemModal
          defaultCategory={addToCategory}
          defaultName={addWithName}
          onSave={addItem}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
