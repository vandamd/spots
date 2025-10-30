"use client"

import { useRef, useEffect, useMemo } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import type { Building } from "@/lib/types"

interface MapProps {
  buildings: Building[]
  onBuildingClick: (buildingId: number) => void
}

function getMarkerClass(building: Building) {
  const hasStudySpaces = building.studySpaces.length > 0
  if (hasStudySpaces) {
    if (building.studyIsOpen === false) {
      return "h-2 w-2 rounded-full bg-amber-400 shadow-[0px_0px_4px_2px_rgba(251,191,36,0.7)] cursor-pointer"
    }
    return building.studySpaces.some((space) => (space.available ?? 0) > 0)
      ? "h-2 w-2 rounded-full bg-sky-400 shadow-[0px_0px_4px_2px_rgba(56,189,248,0.7)] cursor-pointer"
      : "h-2 w-2 rounded-full bg-purple-500 shadow-[0px_0px_4px_2px_rgba(168,85,247,0.7)] cursor-pointer"
  }

  switch (building.status) {
    case "closed":
      return "h-2 w-2 rounded-full bg-amber-400 shadow-[0px_0px_4px_2px_rgba(251,191,36,0.7)] cursor-pointer"
    case "available":
      return "h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)] cursor-pointer"
    case "unavailable":
      return "h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)] cursor-pointer"
    default:
      return "h-2 w-2 rounded-full bg-gray-400 cursor-pointer"
  }
}

export function Map({ buildings, onBuildingClick }: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  const validBuildings = useMemo(
    () => buildings.filter((b) => b.lat !== 0 && b.lng !== 0),
    [buildings]
  )

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!token) {
      console.error("Mapbox token is not defined")
      return
    }

    mapboxgl.accessToken = token

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/vandamd/cm82xlr2p01vk01s265ypf10a",
        center: [-2.604, 51.457],
        zoom: 15.80,
        pitch: 60,
        bearing: -20,
      })

      validBuildings.forEach((building) => {
        const el = document.createElement("div")
        el.className = getMarkerClass(building)

        el.addEventListener("click", () => {
          const accordionItem =
            document.getElementById(`study-building-${building.id}`) ??
            document.getElementById(`building-${building.id}`)

          if (accordionItem) {
            setTimeout(() => {
              accordionItem.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }, 300)
          }

          onBuildingClick(building.id)
        })

        if (mapRef.current) {
          new mapboxgl.Marker(el)
            .setLngLat([building.lng, building.lat])
            .addTo(mapRef.current)
        }
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [onBuildingClick, validBuildings])

  if (validBuildings.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center rounded-[20px] bg-zinc-800">
        <p className="text-zinc-500">Map unavailable - coordinate data missing</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      <div id="map-container" ref={mapContainerRef} />
      <div className="bg-zinc-800/90 absolute top-4 left-4 flex flex-col gap-2 p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-sm text-green-300">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <span className="text-sm text-red-300">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-sm text-amber-200">Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-sky-400" />
          <span className="text-sm text-sky-200">Seats available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <span className="text-sm text-purple-200">Seats full</span>
        </div>
      </div>
    </div>
  )
}
