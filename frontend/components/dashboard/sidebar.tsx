"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardNavItems } from "./nav-config";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  const pathname = usePathname();
  const mainItems = dashboardNavItems.filter((item) => !item.logout);
  const logoutItem = dashboardNavItems.find((item) => item.logout);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <ShieldPlus className="h-5 w-5" />
        </span>
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          SafeCircle
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {mainItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {logoutItem && (
        <div className="p-3">
          <Separator className="mb-3" />
          <Link
            href={logoutItem.href}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <logoutItem.icon className="h-4 w-4" />
            {logoutItem.label}
          </Link>
        </div>
      )}
    </aside>
  );
}
