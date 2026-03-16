export type TripType =
  | 'beach' | 'ski' | 'city' | 'hiking' | 'camping' | 'business'
  | 'cruise' | 'road-trip' | 'festival' | 'backpacking' | 'wedding' | 'sports'

export interface PackItem {
  id: string
  name: string
  photo?: string // base64 JPEG
  packed: boolean
  quantity?: number // only stored/shown when > 1
  category?: string // defaults to 'Misc' if not set
}

export const PRESET_CATEGORIES = ['Clothes', 'Toiletries', 'Electronics', 'Documents', 'Misc']

export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  type: TripType
  items: PackItem[]
  notes?: string
  createdAt: string
}
