import { DashboardCard } from "@/components/dashboard/dashboard-card";

export function DashboardPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <DashboardCard title={title} description={description}>
        <p className="text-sm text-muted-foreground">
          This section is coming soon. Use the sidebar to navigate back to the dashboard.
        </p>
      </DashboardCard>
    </div>
  );
}
