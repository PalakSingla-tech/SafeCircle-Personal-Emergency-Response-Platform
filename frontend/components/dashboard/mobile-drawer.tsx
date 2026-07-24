"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { dashboardNavItems } from "./nav-config";
import { Separator } from "@/components/ui/separator";

export function MobileDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const mainItems = dashboardNavItems.filter((item) => !item.logout);
  const logoutItem = dashboardNavItems.find((item) => item.logout);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetHeader onClose={() => onOpenChange(false)}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldPlus className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">SafeCircle</span>
        </div>
      </SheetHeader>
      <SheetContent>
        <nav className="flex flex-col gap-1">
          {mainItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {logoutItem && (
          <>
            <Separator className="my-3" />
            <Link
              href={logoutItem.href}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <logoutItem.icon className="h-4 w-4" />
              {logoutItem.label}
            </Link>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
