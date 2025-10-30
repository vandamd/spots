import { NextResponse } from 'next/server'
import type {
  ApiBuildingResponse,
  ApiRoomStatsResponse,
  Building,
  Room,
  TimeSlot,
} from '@/lib/types'

const BUILDINGS_API = 'https://www.bris.ac.uk/where-is-my/find/api/v1/building?extended'
const STATS_API = 'https://www.bris.ac.uk/where-is-my/find/api/v1/free-room-stats'

interface RoomInfo {
  buildingId: number
  buildingName: string
  splusName: string
  type: 'teaching' | 'computer'
}

export async function GET() {
  try {
    const now = new Date()
    const endOfDay = new Date(now)
    endOfDay.setHours(18, 0, 0, 0)

    const fromDate = now.toISOString().slice(0, 16)
    const toDate = endOfDay.toISOString().slice(0, 16)

    const [buildingsRes, statsRes] = await Promise.all([
      fetch(BUILDINGS_API, { next: { revalidate: 3600 } }),
      fetch(`${STATS_API}?fromDate=${fromDate}&toDate=${toDate}`, { next: { revalidate: 300 } }),
    ])

    if (!buildingsRes.ok || !statsRes.ok) {
      throw new Error('API fetch failed')
    }

    const buildingsData: ApiBuildingResponse[] = await buildingsRes.json()
    const statsData: ApiRoomStatsResponse = await statsRes.json()

    const roomMap = new Map<number, RoomInfo>()
    buildingsData.forEach((building) => {
      building.freeRooms.forEach((room) => {
        roomMap.set(room.id, {
          buildingId: building.id,
          buildingName: building.name,
          splusName: room.splusName,
          type: 'teaching',
        })
      })
      building.computerRooms.forEach((room) => {
        roomMap.set(room.id, {
          buildingId: building.id,
          buildingName: building.name,
          splusName: room.splusName,
          type: 'computer',
        })
      })
    })

    const buildingRoomsMap = new Map<number, Room[]>()

    Object.entries(statsData).forEach(([roomId, bookings]) => {
      const roomInfo = roomMap.get(Number(roomId))
      if (!roomInfo || !roomInfo.splusName) return

      const slots: TimeSlot[] = []
      const sortedBookings = bookings.sort(
        (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
      )

      const startTime = new Date(fromDate)
      const endTime = new Date(toDate)

      let currentTime = startTime

      sortedBookings.forEach((booking) => {
        const bookingStart = new Date(booking.startDateTime)
        const bookingEnd = new Date(booking.endDateTime)

        if (currentTime < bookingStart) {
          slots.push({
            start: currentTime.toISOString(),
            end: bookingStart.toISOString(),
            status: 'free',
          })
        }

        slots.push({
          start: booking.startDateTime,
          end: booking.endDateTime,
          status: 'booked',
        })

        currentTime = bookingEnd > currentTime ? bookingEnd : currentTime
      })

      if (currentTime < endTime) {
        slots.push({
          start: currentTime.toISOString(),
          end: endTime.toISOString(),
          status: 'free',
        })
      }

      const room: Room = {
        id: Number(roomId),
        name: roomInfo.splusName,
        type: roomInfo.type,
        slots,
      }

      const existingRooms = buildingRoomsMap.get(roomInfo.buildingId) || []
      buildingRoomsMap.set(roomInfo.buildingId, [...existingRooms, room])
    })

    const buildings: Building[] = Array.from(buildingRoomsMap.entries())
      .map(([buildingId, rooms]) => {
        const buildingInfo = buildingsData.find((b) => b.id === buildingId)
        if (!buildingInfo) return null

        const validRooms = rooms.filter((room) => room.name && room.name.trim() !== '')

        if (validRooms.length === 0) return null

        const hasAvailableRoom = validRooms.some((room) =>
          room.slots.some((slot) => slot.status === 'free')
        )

        return {
          id: buildingId,
          name: buildingInfo.name,
          status: hasAvailableRoom ? 'available' : 'unavailable',
          rooms: validRooms,
        } satisfies Building
      })
      .filter((b): b is Building => b !== null)
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({ buildings })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch space data' },
      { status: 500 }
    )
  }
}
