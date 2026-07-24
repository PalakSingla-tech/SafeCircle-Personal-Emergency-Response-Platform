"use client";
import { Menu, Search, Bell, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDashboardTheme } from "./theme-provider";
import Link from "next/link";

export function TopNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme } = useDashboardTheme();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative hidden flex-1 sm:block sm:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search profiles, contacts, scans..."
          className="h-9 w-full rounded-xl border border-input bg-muted/40 pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="relative sm:hidden" aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>

        <Link href="/dashboard/notifications">
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu
          trigger={
            <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-border transition-shadow hover:ring-primary/30">
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
            </button>
          }
        >
          <DropdownMenuLabel>Sarah Jenkins</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => {}}>Profile</DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/dashboard/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive>
            <Link href="/login">Logout</Link>
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
}
