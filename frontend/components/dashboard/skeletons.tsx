import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard } from "./dashboard-card";

export function DashboardHomeSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function WidgetSkeleton() {
  return (
    <DashboardCard>
      <Skeleton className="mb-4 h-5 w-32" />
      <Skeleton className="h-24 w-full" />
    </DashboardCard>
  );
}
