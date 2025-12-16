
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-32" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="h-80 flex flex-col">
          <CardHeader>
            <Skeleton className="h-5 w-40 mb-3" />
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <Skeleton className="h-64 w-full rounded-lg" />
          </CardContent>
        </Card>

        <Card className="h-80 flex flex-col">
          <CardHeader>
            <Skeleton className="h-5 w-40 mb-3" />
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <Skeleton className="h-64 w-full rounded-full" />
          </CardContent>
        </Card>
      </div>

      {/* --- Recent Activity / Logs --- */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48 mb-2" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/6" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
