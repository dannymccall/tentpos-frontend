import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export function SpinnerBadge({title}: {title:string}) {
  return (
    <div className="flex items-center gap-4 [--radius:1.2rem]">
 
      <Badge variant="outline"  className="text-slate-800">
        <Spinner />
        {title}
      </Badge>
    </div>
  )
}
