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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getNotifications, markNotificationsAsRead, getDashboard, setAuthToken, type NotificationDTO } from "@/lib/api";

export function TopNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme } = useDashboardTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [userName, setUserName] = useState("User");
  const [userInitials, setUserInitials] = useState("U");

  useEffect(() => {
    getNotifications().then(setNotifications).catch(console.error);
    getDashboard().then(dashboard => {
      if (dashboard && dashboard.fullName) {
        setUserName(dashboard.fullName);
        const parts = dashboard.fullName.trim().split(" ");
        if (parts.length > 1) {
          setUserInitials((parts[0][0] + parts[parts.length - 1][0]).toUpperCase());
        } else if (parts.length === 1 && parts[0].length > 0) {
          setUserInitials(parts[0][0].toUpperCase());
        }
      }
    }).catch(console.error);
    
    const interval = setInterval(() => {
      getNotifications().then(setNotifications).catch(console.error);
    }, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async () => {
    if (unreadCount > 0) {
      try {
        const updated = await markNotificationsAsRead();
        setNotifications(updated);
      } catch (err) {
        console.error(err);
      }
    }
  };

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

        <DropdownMenu
          trigger={
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications" onClick={handleMarkAsRead}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Button>
          }
        >
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <div className="max-h-64 overflow-y-auto min-w-[200px]">
            {notifications.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground text-center">No notifications</div>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3">
                  <div className="font-semibold text-sm">{n.title}</div>
                  <div className="text-xs text-muted-foreground break-words">{n.message}</div>
                  <div className="text-xs text-muted-foreground opacity-70 mt-1">{n.time}</div>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </DropdownMenu>

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
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </button>
          }
        >
          <DropdownMenuLabel>{userName}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push('/dashboard/medical-profile')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onClick={() => {
            setAuthToken(null);
            localStorage.removeItem("user_name");
            localStorage.removeItem("user_email");
            router.push('/login');
          }}>
            Logout
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
}
