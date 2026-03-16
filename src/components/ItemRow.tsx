import { PackItem } from '../types'
import { itemEmoji } from '../emojiUtils'

interface Props {
  item: PackItem
  onToggle: () => void
  onDelete: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export default function ItemRow({ item, onToggle, onDelete, dragHandleProps }: Props) {
  return (
    <div className={`item-row${item.packed ? ' packed' : ''}`}>
      {dragHandleProps && (
        <div className="drag-handle" {...dragHandleProps} aria-label="Drag to reorder">
          ⠿
        </div>
      )}
      <div className="item-photo-slot" onClick={onToggle}>
        {item.photo ? (
          <img src={item.photo} alt={item.name} className="item-photo" />
        ) : (
          <div className="item-photo-placeholder">{itemEmoji(item.name, item.category)}</div>
        )}
      </div>
      <div className="item-info" onClick={onToggle}>
        <span className="item-name">{item.name}</span>
        {item.quantity && item.quantity > 1 && (
          <span className="item-qty">×{item.quantity}</span>
        )}
      </div>
      <input
        type="checkbox"
        className="item-checkbox"
        checked={item.packed}
        onChange={onToggle}
        aria-label={`Mark ${item.name} as packed`}
      />
      <button
        className="btn-icon item-delete"
        onClick={onDelete}
        aria-label={`Remove ${item.name}`}
      >
        ✕
      </button>
    </div>
  )
}
