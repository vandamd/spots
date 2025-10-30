"use client"

import { useCallback, useEffect, useState } from 'react'
import type { Building } from '@/lib/types'
import { BuildingList } from '@/components/BuildingList'
import { Loading } from '@/components/Loading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Map } from '@/components/Map'
import { AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchTimestamp, setFetchTimestamp] = useState<Date>(new Date())
  const [activeStudyBuildingId, setActiveStudyBuildingId] = useState<number | null>(null)
  const [activeRoomBuildingId, setActiveRoomBuildingId] = useState<number | null>(null)

  const fetchSpaceData = () => {
    fetch('/api/spaces')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => {
        setBuildings(data.buildings)
        setFetchTimestamp(new Date())
        setError(null)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchSpaceData()

    const interval = setInterval(() => {
      fetchSpaceData()
    }, 300000)

    return () => clearInterval(interval)
  }, [])

  const now = new Date()
  const hour = now.getHours()
  const isWeekend = now.getDay() === 0 || now.getDay() === 6
  const isLateNight = hour >= 22 || hour < 6

  const handleMarkerClick = useCallback((buildingId: number) => {
    const targetBuilding = buildings.find((building) => building.id === buildingId)
    if (!targetBuilding) return

    if (targetBuilding.studySpaces.length > 0) {
      setActiveStudyBuildingId(buildingId)
      setActiveRoomBuildingId(null)
      return
    }

    if (targetBuilding.rooms.length > 0) {
      setActiveRoomBuildingId(buildingId)
      setActiveStudyBuildingId(null)
      return
    }

    setActiveStudyBuildingId(null)
    setActiveRoomBuildingId(null)
  }, [buildings])

  const handleSetActiveStudyBuilding = (id: number | null) => {
    setActiveStudyBuildingId(id)
    if (id !== null) {
      setActiveRoomBuildingId(null)
    }
  }

  const handleSetActiveRoomBuilding = (id: number | null) => {
    setActiveRoomBuildingId(id)
    if (id !== null) {
      setActiveStudyBuildingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-zinc-100">
        <Loading />
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row p-2 lg:p-4 h-screen bg-zinc-900 text-zinc-100 gap-0 md:gap-2">
      <div className="basis-2/5 order-last sm:order-first flex-1 overflow-hidden sm:flex sm:flex-col py-4 sm:px-0 sm:py-2">
        <div className="h-auto pl-2 pr-4 mb-6 lg:mb-4 flex items-center justify-between gap-4 shrink-0">
          <p className="text-3xl font-medium">University of Bristol Spots</p>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                aria-label="Show app information"
              >
                <Info className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent
              className="bg-zinc-900 border-[0.5px] border-zinc-700 text-zinc-100"
              tabIndex={-1}
              onOpenAutoFocus={(event) => {
                event.preventDefault()
                const target = event.currentTarget as HTMLElement | null
                target?.focus()
              }}
            >
              <DialogHeader>
                <DialogTitle>About</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm text-zinc-400">
                <p>Study seat and teaching space availability at the University of Bristol.</p>
                <p>Made with 💛 by <a href="https://vandamdinh.com" target="_blank" className="text-white">Vandam</a>! You can view the source code <a href="https://github.com/vandamd/spots" target="_blank" className="text-white">here</a>.</p>
                <p>Largely inspired by <a href="https://spots.aksharbarot.com/" target="_blank" className="text-white">Spots</a> by Akshar Barot. I've adapted this site to use the endpoints found <a href="https://www.bris.ac.uk/where-is-my/find/" className="text-white">here</a>.</p>
                <p>The closing times and availability of rooms may be wrong. Please double check :)</p>
                <p>Any feedback? Let me know via <a href="mailto:ep21170@bristol.ac.uk" className="text-white">email</a>.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-full">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && (
          <BuildingList
            buildings={buildings}
            fetchTimestamp={fetchTimestamp}
            activeStudyBuildingId={activeStudyBuildingId}
            activeRoomBuildingId={activeRoomBuildingId}
            setActiveStudyBuilding={handleSetActiveStudyBuilding}
            setActiveRoomBuilding={handleSetActiveRoomBuilding}
          />
        )}
        </ScrollArea>
      </div>

      <div className="basis-3/5 h-[40vh] sm:h-full p-2 sm:p-0 rounded-[20px]">
        {!error && <Map buildings={buildings} onBuildingClick={handleMarkerClick} />}
      </div>
    </div>
  )
}
