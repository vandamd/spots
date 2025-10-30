export interface Building {
  id: number
  name: string
  status: 'available' | 'unavailable' | 'closed'
  lat: number
  lng: number
  rooms: Room[]
  studySpaces: BuildingStudySpace[]
  studyOpeningHours: OpeningSlot[] | null
  teachingOpeningHours: OpeningSlot[] | null
  studyIsOpen: boolean | null
  teachingIsOpen: boolean | null
}

export interface Room {
  id: number
  name: string
  type: 'teaching' | 'computer'
  slots: TimeSlot[]
}

export interface TimeSlot {
  start: string
  end: string
  status: 'free' | 'booked'
}

export interface BuildingStudySpace {
  id: number
  name: string
  available: number | null
  capacity: number | null
  updatedAt: string | null
}

export interface OpeningSlot {
  label: string
  closes: 'Closed' | '24/7' | string
}

export interface ApiBuildingResponse {
  id: number
  topdeskUnid: string
  lat: number
  lng: number
  address1: string | null
  address2: string | null
  name: string
  link: string | null
  studySpacesOption: string
  computerRooms: ApiRoom[]
  studySpaces: ApiStudySpace[]
  freeRooms: ApiRoom[]
  buildingStudySpaceCapacity: number
}

export interface ApiRoom {
  id: number
  name: string | null
  topdeskUnid: string
  splusName: string
  buildingId: number
  notes?: string | null
  sortOrder?: number
}

export interface ApiBooking {
  name: string
  startDateTime: string
  endDateTime: string
  isCurrentlyBooked: boolean
}

export type ApiRoomStatsResponse = Record<string, ApiBooking[]>

export interface ApiStudySpace {
  id: number
  name: string | null
  buildingId: number
  spaces: number | null
  notes?: string | null
  sortOrder?: number | null
}

export interface ApiStudySpaceStatsEntry {
  id: number
  studySpaceId: number
  freeDesks: number | null
  datetime: string | null
  event: unknown
  totalDesks: number | null
  notes: string | null
  updatedBy: string | null
  studySpaceName: string | null
  buildingName: string | null
}

export type ApiStudySpaceStatsResponse = Record<string, ApiStudySpaceStatsEntry>
