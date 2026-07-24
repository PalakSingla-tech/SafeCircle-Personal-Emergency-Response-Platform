import {
  LayoutDashboard,
  HeartPulse,
  Phone,
  QrCode,
  History,
  Users,
  MapPin,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  logout?: boolean;
}

export const dashboardNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Medical Profile", href: "/dashboard/medical-profile", icon: HeartPulse },
  { label: "Emergency Contacts", href: "/dashboard/emergency-contacts", icon: Phone },
  { label: "QR Card", href: "/dashboard/qr-card", icon: QrCode },
  { label: "Emergency History", href: "/dashboard/emergency-history", icon: History },
  { label: "Family Members", href: "/dashboard/family-members", icon: Users },
  { label: "Location Sharing", href: "/dashboard/location-sharing", icon: MapPin },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Logout", href: "/login", icon: LogOut, logout: true },
];
