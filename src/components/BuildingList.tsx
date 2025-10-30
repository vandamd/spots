"use client"

import type { Building } from '@/lib/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

interface BuildingListProps {
  buildings: Building[]
  fetchTimestamp: Date
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

export function BuildingList({ buildings, fetchTimestamp }: BuildingListProps) {
  if (buildings.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No spaces available
      </div>
    )
  }

  return (
    <Accordion type="single" collapsible className="pl-2 pr-4 w-full">
      {buildings.map((building) => (
        <AccordionItem key={building.id} value={`building-${building.id}`}>
          <AccordionTrigger className="py-4 text-lg hover:cursor-pointer underline-offset-8">
            <div className="flex items-center justify-between w-[95%]">
              <span className="text-left flex-1 hover:underline">{building.name}</span>
              <Badge
                className={`
                    ${building.status === 'available'
                    ? 'bg-green-800/20 text-green-300/80 hover:bg-green-800/20 rounded-lg px-2 py-1 text-sm w-fit'
                    : 'bg-red-700/20 text-red-300/80 hover:bg-red-700/20 rounded-lg px-2 py-1 text-sm w-fit'
                    } font-normal`}
              >
                {building.status}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-2">
              {building.rooms.filter(room => room.name && room.name.trim() !== '').map((room) => {
                return (
                  <div key={room.id} className="text-lg flex justify-between items-start">
                      <span className="text-sm pt-1">{room.name}</span>

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
      ))}
    </Accordion>
  )
}
