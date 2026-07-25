"use client";
import { useEffect, useState } from "react";
import {
  Bell,
  HeartPulse,
  Activity,
  AlertTriangle,
  UserCheck,
  Building2,
  PhoneCall,
  Ambulance,
  CheckCircle2,
  CheckCircle,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getNotifications, markNotificationsAsRead, type NotificationItem } from "@/lib/api";

const NOTIFICATIONS_DATA: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Ambulance Dispatched",
    description: "Paramedic Unit 108 is en route to Rahul Sharma.",
    time: "2 mins ago",
    read: false,
    type: "critical",
    icon: "Ambulance",
  },
  {
    id: "notif-2",
    title: "Hospital Viewed Profile",
    description: "AIIMS New Delhi has accessed the medical file for Rahul Sharma.",
    time: "5 mins ago",
    read: false,
    type: "info",
    icon: "Building2",
  },
  {
    id: "notif-3",
    title: "Emergency Contact Accepted",
    description: "Priya Sharma has accepted the emergency alert.",
    time: "10 mins ago",
    read: false,
    type: "success",
    icon: "UserCheck",
  },
];

const ICON_MAP: Record<string, LucideIcon> = {
  Ambulance,
  Building2,
  UserCheck,
  AlertTriangle,
  Activity,
  CheckCircle2,
  CheckCircle,
  Bell,
  HeartPulse,
  PhoneCall,
};


export function NotificationsClient() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    let isMounted = true;
    const loadNotifications = async () => {
      try {
        const data = await getNotifications();
        if (isMounted) {
          setNotifications(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch notifications:", error);
          setNotifications(NOTIFICATIONS_DATA);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

  const markAllAsRead = async () => {
    try {
      const data = await markNotificationsAsRead();
      setNotifications(data);
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const getIconStyles = (type: string, read: boolean) => {
    if (read) return "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
    switch (type) {
      case "critical": return "bg-red-100 text-red-600 border-red-200 shadow-sm dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "warning": return "bg-amber-100 text-amber-600 border-amber-200 shadow-sm dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
      case "success": return "bg-emerald-100 text-emerald-600 border-emerald-200 shadow-sm dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
      case "info": return "bg-blue-100 text-blue-600 border-blue-200 shadow-sm dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      default: return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Notification Center
            </h1>
            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
              You have {unreadCount} unread notifications.
              {unreadCount > 0 && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card/70 p-6 text-sm text-muted-foreground">
          Loading notifications from the API layer...
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
              {notifications.map((notif) => {
                const Icon = ICON_MAP[notif.icon] ?? Bell;
                return (
                  <div 
                    key={notif.id} 
                    className={`p-4 sm:p-6 transition-colors hover:bg-muted/30 flex gap-4 ${!notif.read ? 'bg-primary/5' : ''}`}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${getIconStyles(notif.type, notif.read)}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 space-y-1 pt-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-base font-semibold ${!notif.read ? 'text-foreground' : 'text-foreground/80'}`}>
                          {notif.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                            {notif.time}
                          </span>
                          <DropdownMenu
                            trigger={
                              <button className="text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            }
                          >
                            <DropdownMenuItem className="rounded-lg">
                              Mark as {notif.read ? 'Unread' : 'Read'}
                            </DropdownMenuItem>
                            <DropdownMenuItem destructive className="rounded-lg">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenu>
                        </div>
                      </div>
                      <p className={`text-sm ${!notif.read ? 'text-muted-foreground font-medium' : 'text-muted-foreground'}`}>
                        {notif.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" className="rounded-xl bg-muted/50">
              Load Older Notifications
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
