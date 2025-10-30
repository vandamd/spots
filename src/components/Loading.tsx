import { Loader2 } from "lucide-react"

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-zinc-400" />
        <span className="text-sm text-zinc-400">Loading spots...</span>
      </div>
    </div>
  )
}
