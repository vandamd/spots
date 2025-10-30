export interface Building {
  id: number
  name: string
  status: 'available' | 'unavailable'
  rooms: Room[]
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
  studySpaces: unknown[]
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
