import { useRef, useState } from 'react'
import { PackItem, PRESET_CATEGORIES } from '../types'
import { compressImage } from '../imageUtils'

interface Props {
  defaultCategory?: string
  onSave: (item: PackItem) => void
  onClose: () => void
}

export default function AddItemModal({ defaultCategory = '', onSave, onClose }: Props) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState<number | ''>('')
  const [category, setCategory] = useState(defaultCategory)
  const [photo, setPhoto] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setLoading(true)
    try {
      setPhoto(await compressImage(file))
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const qty = typeof quantity === 'number' && quantity > 1 ? quantity : undefined
    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      packed: false,
      photo,
      quantity: qty,
      category: category.trim() || 'Misc',
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Item</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Item name
            <input
              autoFocus
              type="text"
              placeholder="e.g. Blue striped shirt"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Category
            <input
              type="text"
              list="category-presets"
              placeholder="e.g. Toiletries"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
            <datalist id="category-presets">
              {PRESET_CATEGORIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </label>
          <label>
            Quantity (optional)
            <input
              type="number"
              min={2}
              placeholder="Leave blank for 1"
              value={quantity}
              onChange={e => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </label>

          {/* Photo */}
          <div className="photo-section">
            {photo ? (
              <div className="photo-preview-wrap">
                <img src={photo} alt="item preview" className="photo-preview" />
                <button type="button" className="btn-icon photo-remove" onClick={() => setPhoto(undefined)}>✕</button>
              </div>
            ) : (
              <div className="photo-buttons">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={loading}
                  onClick={() => cameraRef.current?.click()}
                >
                  📷 Camera
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={loading}
                  onClick={() => galleryRef.current?.click()}
                >
                  🖼️ Gallery
                </button>
              </div>
            )}
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden-input"
              onChange={e => handleFile(e.target.files?.[0])}
            />
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              className="hidden-input"
              onChange={e => handleFile(e.target.files?.[0])}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={!name.trim() || loading}>
            Add to List
          </button>
        </form>
      </div>
    </div>
  )
}
