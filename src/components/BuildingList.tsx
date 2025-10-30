"use client"

import type { Building } from '@/lib/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface BuildingListProps {
  buildings: Building[]
  fetchTimestamp: Date
  activeStudyBuildingId: number | null
  activeRoomBuildingId: number | null
  setActiveStudyBuilding: (id: number | null) => void
  setActiveRoomBuilding: (id: number | null) => void
}

function formatTime(isoString: string, fetchTimestamp: Date): string {
  const date = new Date(isoString)

  if (Math.abs(date.getTime() - fetchTimestamp.getTime()) < 60000) {
    return 'now'
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatStudySpaceAvailability(available: number | null, capacity: number | null): string {
  if (typeof available === 'number' && typeof capacity === 'number' && capacity > 0) {
    return `${available}/${capacity} available`
  }

  if (typeof available === 'number') {
    return `${available} available`
  }

  if (typeof capacity === 'number') {
    return `${capacity} seats`
  }

  return 'No data'
}

function formatUpdatedTooltip(updatedAt: string | null): string {
  if (!updatedAt) return 'Last updated: unknown'

  const date = new Date(updatedAt)

  return `Last updated ${date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

export function BuildingList({
  buildings,
  fetchTimestamp,
  activeStudyBuildingId,
  activeRoomBuildingId,
  setActiveStudyBuilding,
  setActiveRoomBuilding,
}: BuildingListProps) {
  if (buildings.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No spaces available
      </div>
    )
  }

  const studySpaceBuildings = buildings.filter((building) => building.studySpaces.length > 0)
  const roomBuildings = buildings.filter((building) => building.rooms.length > 0)

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-12">
        {studySpaceBuildings.length > 0 && (
          <div className="space-y-0">
            <p className="pl-2 text-xs uppercase tracking-wider">Libraries</p>
            <Accordion
              type="single"
              collapsible
              className="pl-2 pr-4 w-full"
              value={
                activeStudyBuildingId
                  ? `study-building-${activeStudyBuildingId}`
                  : ''
              }
              onValueChange={(value) => {
                if (!value) {
                  setActiveStudyBuilding(null)
                  return
                }

                const idSegment = value.split('-').pop()
                const buildingId = idSegment ? Number.parseInt(idSegment, 10) : NaN

                if (Number.isNaN(buildingId)) {
                  setActiveStudyBuilding(null)
                  setActiveRoomBuilding(null)
                  return
                }

                setActiveStudyBuilding(buildingId)
                setActiveRoomBuilding(null)
              }}
            >
              {studySpaceBuildings.map((building) => {
                const totals = building.studySpaces.reduce(
                  (acc, space) => ({
                    available: acc.available + (space.available ?? 0),
                    capacity: acc.capacity + (space.capacity ?? 0),
                  }),
                  { available: 0, capacity: 0 }
                )
                const isLibraryClosed = building.studyIsOpen === false
                const badgeText = isLibraryClosed
                  ? 'closed'
                  : totals.capacity > 0
                    ? `${totals.available}/${totals.capacity} seats`
                    : `${totals.available} seats`
                const badgeClass = isLibraryClosed
                  ? 'rounded-lg px-2 py-1 text-sm font-normal bg-amber-700/20 text-amber-200/80 hover:bg-amber-700/20'
                  : 'rounded-lg px-2 py-1 text-sm font-normal bg-sky-800/20 text-sky-200/80 hover:bg-sky-800/20'

                return (
                  <AccordionItem key={`study-${building.id}`} value={`study-building-${building.id}`} id={`study-building-${building.id}`}>
                    <AccordionTrigger className="py-4 text-lg hover:cursor-pointer underline-offset-8">
                      <div className="flex items-center justify-between w-[95%]">
                        <span className="text-left flex-1 hover:underline">{building.name}</span>
                        <Badge className={badgeClass}>
                          {badgeText}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {building.studySpaces.map((space) => {
                          const availableCount = space.available ?? 0
                          const isAvailable = !isLibraryClosed && availableCount > 0
                          const dotClass = isLibraryClosed
                            ? 'bg-amber-400'
                            : isAvailable
                              ? 'bg-green-400'
                              : 'bg-red-400'
                          const pillClass = isLibraryClosed
                            ? 'rounded-lg bg-amber-700/20 px-2 py-1 text-xs text-amber-200/80'
                            : 'rounded-lg bg-zinc-800/60 px-2 py-1 text-xs text-zinc-100 hover:cursor-pointer'
                          const pillText = isLibraryClosed
                            ? 'Closed'
                            : formatStudySpaceAvailability(space.available, space.capacity)

                          return (
                            <div key={space.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className={`h-[6px] w-[6px] rounded-full ${dotClass}`} />
                                <span>{space.name}</span>
                              </div>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className={pillClass}>
                                    {pillText}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>{formatUpdatedTooltip(space.updatedAt)}</TooltipContent>
                              </Tooltip>
                            </div>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        )}

        {roomBuildings.length > 0 && (
          <div className="space-y-0">
            <p className="pl-2 text-xs uppercase tracking-wider">Teaching Spaces</p>
            <Accordion
              type="single"
              collapsible
              className="pl-2 pr-4 w-full"
              value={
                activeRoomBuildingId
                  ? `building-${activeRoomBuildingId}`
                  : ''
              }
              onValueChange={(value) => {
                if (!value) {
                  setActiveRoomBuilding(null)
                  return
                }

                const idSegment = value.split('-').pop()
                const buildingId = idSegment ? Number.parseInt(idSegment, 10) : NaN

                if (Number.isNaN(buildingId)) {
                  setActiveStudyBuilding(null)
                  setActiveRoomBuilding(null)
                  return
                }

                setActiveRoomBuilding(buildingId)
                setActiveStudyBuilding(null)
              }}
            >
              {roomBuildings.map((building) => {
                const totalRooms = building.rooms.length
                const isTeachingClosed = building.teachingIsOpen === false
                const availableNowCount = isTeachingClosed
                  ? 0
                  : building.rooms.filter((room) =>
                      room.slots.some((slot) => slot.status === 'free' && formatTime(slot.start, fetchTimestamp) === 'now')
                    ).length

                const badgeText = isTeachingClosed
                  ? 'closed'
                  : availableNowCount === totalRooms && availableNowCount > 0
                    ? 'available'
                    : availableNowCount > 0
                      ? `${availableNowCount}/${totalRooms} available`
                      : 'unavailable'
                const badgeClass = isTeachingClosed
                  ? 'rounded-lg px-2 py-1 text-sm w-fit font-normal bg-amber-700/20 text-amber-200/80 hover:bg-amber-700/20'
                  : availableNowCount > 0
                    ? 'rounded-lg px-2 py-1 text-sm w-fit font-normal bg-green-800/20 text-green-300/80 hover:bg-green-800/20'
                    : 'rounded-lg px-2 py-1 text-sm w-fit font-normal bg-red-700/20 text-red-300/80 hover:bg-red-700/20'

                return (
                  <AccordionItem key={building.id} value={`building-${building.id}`} id={`building-${building.id}`}>
                    <AccordionTrigger className="py-4 text-lg hover:cursor-pointer underline-offset-8">
                      <div className="flex items-center justify-between w-[95%]">
                        <span className="text-left flex-1 hover:underline">{building.name}</span>
                        <Badge className={badgeClass}>
                          {badgeText}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-2">
                        {building.rooms.filter(room => room.name && room.name.trim() !== '').map((room) => {
                          if (isTeachingClosed) {
                            return (
                              <div key={room.id} className="text-lg flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <div className="mt-[3px] h-[6px] w-[6px] rounded-full bg-amber-400" />
                                  <span className="text-sm pt-0.5">{room.name}</span>
                                </div>

                                <div className="rounded-lg bg-amber-700/20 px-2 py-1 text-xs text-amber-200/80">
                                  Closed
                                </div>
                              </div>
                            )
                          }

                          const isAvailableNow = room.slots.some((slot) =>
                            slot.status === 'free' && formatTime(slot.start, fetchTimestamp) === 'now'
                          )

                          return (
                            <div key={room.id} className="text-lg flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className={`mt-[3px] h-[6px] w-[6px] rounded-full ${isAvailableNow ? 'bg-green-400' : 'bg-red-400'}`} />
                                <span className="text-sm pt-0.5">{room.name}</span>
                              </div>

                              <div className="flex flex-col items-end gap-2 text-sm">
                                {room.slots.map((slot, idx) => (
                                  <div
                                    key={idx}
                                    className={`text-sm px-2 py-1 rounded-lg flex w-fit ${
                                      slot.status === 'free'
                                        ? 'bg-green-800/20 text-green-300/80'
                                        : 'bg-red-700/20 text-red-300/80'
                                    }`}
                                  >
                                    {formatTime(slot.start, fetchTimestamp)} - {formatTime(slot.end, fetchTimestamp)}: {slot.status}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
