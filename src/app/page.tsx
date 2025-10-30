"use client"

import { useEffect, useState } from 'react'
import type { Building } from '@/lib/types'
import { BuildingList } from '@/components/BuildingList'
import { Loading } from '@/components/Loading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Map } from '@/components/Map'
import { AlertCircle, Info } from 'lucide-react'

export default function Home() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchTimestamp, setFetchTimestamp] = useState<Date>(new Date())
  const [activeBuildingId, setActiveBuildingId] = useState<number | null>(null)

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

  const handleMarkerClick = (buildingId: number) => {
    setActiveBuildingId(buildingId)
  }

  const handleSetActiveBuildingId = (id: number | null) => {
    setActiveBuildingId(id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-zinc-100">
        <Loading />
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-zinc-900 text-zinc-100 gap-2 p-4">
      <div className="basis-2/5 order-last sm:order-first flex flex-col">
        <div className="h-14 pl-2 pr-4 flex items-center shrink-0">
          <p className="text-3xl font-medium">Bristol Teaching Spaces</p>
        </div>

        <ScrollArea className="flex-1 py-4 sm:px-0 sm:py-2">
        {isLateNight && (
          <Alert className="mb-4 bg-zinc-800 border-amber-600">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-400">Limited Data</AlertTitle>
            <AlertDescription className="text-zinc-300">
              Room data may be unavailable outside teaching hours (6am-10pm)
            </AlertDescription>
          </Alert>
        )}

        {isWeekend && (
          <Alert className="mb-4 bg-zinc-800 border-blue-600">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-400">Weekend Notice</AlertTitle>
            <AlertDescription className="text-zinc-300">
              Showing limited data for weekend periods
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && <BuildingList buildings={buildings} fetchTimestamp={fetchTimestamp} activeBuildingId={activeBuildingId} setActiveBuildingId={handleSetActiveBuildingId} />}
        </ScrollArea>
      </div>

      <div className="basis-3/5 h-[60vh] sm:h-full p-2 sm:p-0 rounded-[20px]">
        {!error && <Map buildings={buildings} onBuildingClick={handleMarkerClick} />}
      </div>
    </div>
  )
}
