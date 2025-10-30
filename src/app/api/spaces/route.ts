import { NextResponse } from 'next/server'
import type {
  ApiBuildingResponse,
  ApiRoomStatsResponse,
  ApiStudySpaceStatsEntry,
  ApiStudySpaceStatsResponse,
  Building,
  BuildingStudySpace,
  Room,
  TimeSlot,
} from '@/lib/types'
import { getOpeningHours, getClosingDate, isOpenAt } from '@/data/opening-hours'

const BUILDINGS_API = 'https://www.bris.ac.uk/where-is-my/find/api/v1/building?extended'
const STATS_API = 'https://www.bris.ac.uk/where-is-my/find/api/v1/free-room-stats'
const STUDY_SPACE_STATS_API = 'https://www.bris.ac.uk/where-is-my/find/api/v1/study-space-stats'

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
    endOfDay.setHours(23, 59, 59, 999)

    const fromDate = now.toISOString().slice(0, 16)
    const toDate = endOfDay.toISOString().slice(0, 16)

    const [buildingsRes, roomStatsRes, studySpaceStatsRes] = await Promise.all([
      fetch(BUILDINGS_API, { next: { revalidate: 3600 } }),
      fetch(`${STATS_API}?fromDate=${fromDate}&toDate=${toDate}`, { next: { revalidate: 300 } }),
      fetch(`${STUDY_SPACE_STATS_API}?fromDate=${fromDate}&toDate=${toDate}`, { next: { revalidate: 300 } }),
    ])

    if (!buildingsRes.ok || !roomStatsRes.ok || !studySpaceStatsRes.ok) {
      throw new Error('API fetch failed')
    }

    const buildingsData: ApiBuildingResponse[] = await buildingsRes.json()
    const statsData: ApiRoomStatsResponse = await roomStatsRes.json()
    const studySpaceStatsData: ApiStudySpaceStatsResponse = await studySpaceStatsRes.json()

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
    const teachingHoursCache = new Map<number, ReturnType<typeof getOpeningHours>>()

    Object.entries(statsData).forEach(([roomId, bookings]) => {
      const roomInfo = roomMap.get(Number(roomId))
      if (!roomInfo || !roomInfo.splusName) return

      const slots: TimeSlot[] = []
      const sortedBookings = bookings.sort(
        (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
      )

      const startTime = new Date(fromDate)
      const endTime = new Date(toDate)
      let teachingHours = teachingHoursCache.get(roomInfo.buildingId)
      if (teachingHours === undefined) {
        teachingHours = getOpeningHours(roomInfo.buildingName, false)
        teachingHoursCache.set(roomInfo.buildingId, teachingHours)
      }
      const closingDate = getClosingDate(teachingHours, now)
      const effectiveEndTime = closingDate && closingDate < endTime ? new Date(closingDate) : endTime

      let currentTime = startTime

      for (const booking of sortedBookings) {
        if (currentTime >= effectiveEndTime) {
          break
        }

        const bookingStart = new Date(booking.startDateTime)
        const bookingEnd = new Date(booking.endDateTime)
        if (bookingStart >= effectiveEndTime) {
          break
        }

        const clampedStart = bookingStart < startTime ? new Date(startTime) : bookingStart
        const clampedEnd = bookingEnd > effectiveEndTime ? new Date(effectiveEndTime) : bookingEnd

        if (currentTime < clampedStart) {
          const freeEnd = clampedStart
          if (currentTime < freeEnd) {
            slots.push({
              start: currentTime.toISOString(),
              end: freeEnd.toISOString(),
              status: 'free',
            })
          }
          currentTime = new Date(freeEnd)
        }

        if (clampedEnd > currentTime) {
          slots.push({
            start: clampedStart.toISOString(),
            end: clampedEnd.toISOString(),
            status: 'booked',
          })
          currentTime = new Date(clampedEnd)
        }
      }

      if (currentTime < effectiveEndTime) {
        slots.push({
          start: currentTime.toISOString(),
          end: effectiveEndTime.toISOString(),
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

    const studySpaceStatsMap = new Map<number, ApiStudySpaceStatsEntry>()
    Object.values(studySpaceStatsData).forEach((entry) => {
      if (!entry || typeof entry.studySpaceId !== 'number') return
      studySpaceStatsMap.set(entry.studySpaceId, entry)
    })

    const buildings: Building[] = buildingsData
      .map((buildingInfo) => {
        const roomList = buildingRoomsMap.get(buildingInfo.id) ?? []
        const validRooms = roomList.filter((room) => room.name && room.name.trim() !== '')

        const studySpaces: BuildingStudySpace[] = [...(buildingInfo.studySpaces ?? [])]
          .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER))
          .map((space) => {
            const spaceName = space.name?.trim()
            if (!spaceName) return null

            const stats = studySpaceStatsMap.get(space.id)
            const capacity = stats?.totalDesks ?? space.spaces ?? null

            return {
              id: space.id,
              name: spaceName,
              available: stats?.freeDesks ?? null,
              capacity,
              updatedAt: stats?.datetime ?? null,
            } satisfies BuildingStudySpace
          })
          .filter((space): space is BuildingStudySpace => space !== null)

        if (validRooms.length === 0 && studySpaces.length === 0) {
          return null
        }

        const hasAvailableRoom = validRooms.some((room) =>
          room.slots.some((slot) => slot.status === 'free')
        )
        const hasAvailableStudySpace = studySpaces.some((space) => (space.available ?? 0) > 0)
        const studyOpeningHours =
          studySpaces.length > 0 ? getOpeningHours(buildingInfo.name, true) : null
        const teachingOpeningHours =
          validRooms.length > 0
            ? teachingHoursCache.get(buildingInfo.id) ?? getOpeningHours(buildingInfo.name, false)
            : null
        const studyIsOpen =
          studySpaces.length > 0 ? isOpenAt(studyOpeningHours, now) ?? true : null
        const teachingIsOpen =
          validRooms.length > 0 ? isOpenAt(teachingOpeningHours, now) ?? true : null
        const studyClosed = studySpaces.length > 0 && studyIsOpen === false
        const teachingClosed = validRooms.length > 0 && teachingIsOpen === false
        const isClosed =
          (studySpaces.length === 0 || studyClosed) && (validRooms.length === 0 || teachingClosed)
        const effectiveHasAvailableRoom = teachingClosed ? false : hasAvailableRoom
        const effectiveHasAvailableStudySpace = studyClosed ? false : hasAvailableStudySpace
        let status: Building['status']
        if (isClosed) {
          status = 'closed'
        } else if (effectiveHasAvailableRoom || effectiveHasAvailableStudySpace) {
          status = 'available'
        } else {
          status = 'unavailable'
        }

        return {
          id: buildingInfo.id,
          name: buildingInfo.name,
          status,
          lat: buildingInfo.lat,
          lng: buildingInfo.lng,
          studyOpeningHours,
          teachingOpeningHours,
          studyIsOpen,
          teachingIsOpen,
          rooms: validRooms,
          studySpaces,
        } satisfies Building
      })
      .filter((building): building is Building => building !== null)
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
