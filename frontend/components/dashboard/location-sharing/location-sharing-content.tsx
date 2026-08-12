"use client";
import { useEffect, useState } from "react";
import {
  MapPin,
  Navigation,
  Shield,
  Users,
  Clock,
  BellRing,
  Eye,
  EyeOff,
  Radio,
  History,
  Smartphone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getLocationSharing, saveLocationSharing, getFamilyMembers, getEmergencyHistory, getSharedLocations, type LocationShareState, type FamilyMember, type EmergencyHistoryEvent, type SharedLocation } from "@/lib/api";
import { cn } from "@/lib/utils";

const LOCATION_KEY = "safecircle_location_settings";

interface LocationSettings {
  enabled: boolean;
  shareWithCircle: boolean;
  emergencyOnly: boolean;
  autoShareOnAlert: boolean;
  showPreciseLocation: boolean;
  duration: "always" | "emergency" | "1h" | "8h" | "24h";
}

const defaultSettings: LocationSettings = {
  enabled: true,
  shareWithCircle: true,
  emergencyOnly: false,
  autoShareOnAlert: true,
  showPreciseLocation: true,
  duration: "always",
};

const defaultLocationHistory: any[] = [];

const durationOptions = [
  { value: "always" as const, label: "Always", desc: "Share continuously with your circle" },
  { value: "emergency" as const, label: "Emergency only", desc: "Share only when an alert is triggered" },
  { value: "1h" as const, label: "1 hour", desc: "Temporary sharing for the next hour" },
  { value: "8h" as const, label: "8 hours", desc: "Share during your active day" },
  { value: "24h" as const, label: "24 hours", desc: "Share for the next 24 hours" },
];

function loadSettings(): LocationSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return defaultSettings;
}

function saveSettings(settings: LocationSettings) {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(settings));
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function LocationSharingContent() {
  const [settings, setSettings] = useState<LocationSettings>(defaultSettings);
  const [memberSharing, setMemberSharing] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
  });
  const [locating, setLocating] = useState(false);
  const [realMembers, setRealMembers] = useState<FamilyMember[]>([]);
  const [realHistory, setRealHistory] = useState<any[]>(defaultLocationHistory);
  const [updated, setUpdated] = useState(false);
  const [currentLocationText, setCurrentLocationText] = useState("Locating...");
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [sharedLocations, setSharedLocations] = useState<SharedLocation[]>([]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      const geoId = navigator.geolocation.watchPosition(
        async (pos) => {
          setLocationAccuracy(Math.round(pos.coords.accuracy));
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
            const data = await res.json();
            if (data && data.address) {
              const road = data.address.road || data.address.pedestrian || data.address.suburb || "";
              const city = data.address.city || data.address.town || data.address.village || data.address.county || "";
              const short = [road, city].filter(Boolean).join(", ");
              setCurrentLocationText(short || "Unknown Road");
            } else {
              setCurrentLocationText(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
            }
          } catch (e) {
            setCurrentLocationText(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          }
        },
        (err) => {
          setCurrentLocationText("Location unavailable");
        },
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(geoId);
    } else {
      setCurrentLocationText("Location not supported");
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const state = await getLocationSharing();
        setSettings({
          enabled: state.enabled,
          shareWithCircle: state.sharingWith.length > 0,
          emergencyOnly: false,
          autoShareOnAlert: true,
          showPreciseLocation: true,
          duration: "always",
        });
      } catch {
        setSettings(loadSettings());
      }
      try {
        const members = await getFamilyMembers();
        if (members) {
          setRealMembers(members);
          const sharingObj: Record<number, boolean> = {};
          members.forEach(m => { sharingObj[m.memberId] = true; });
          setMemberSharing(sharingObj);
        }
      } catch (err) {
        console.error(err);
      }
      try {
        const history = await getEmergencyHistory();
        if (history && history.length > 0) {
          setRealHistory([
            ...defaultLocationHistory,
            ...history.map(h => ({
              id: Number(h.id),
              place: h.location || "Unknown Location",
              time: `${h.date} ${h.time}`,
              type: "Emergency Alert"
            }))
          ]);
        }
      } catch(err) {}
      try {
        const locations = await getSharedLocations();
        if (locations) {
          setSharedLocations(locations);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const update = async (patch: Partial<LocationSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);

    try {
      await saveLocationSharing({
        enabled: next.enabled,
        sharingWith: next.shareWithCircle ? ["Family", "Emergency Contacts"] : [],
        lastUpdated: "Just now",
        currentLocation: "Downtown, Seattle",
      });
    } catch {
      // Intentionally ignored; local storage remains the fallback.
    }
  };

  const refreshLocation = () => {
    setLocating(true);
    setTimeout(() => {
      setLocating(false);
      setUpdated(true);
      setTimeout(() => setUpdated(false), 2500);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="secondary" className="mb-2">Safety</Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Location Sharing
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Let your emergency circle know where you are during a crisis so help can reach you faster.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Location sharing</p>
            <p className="text-sm font-semibold">
              {settings.enabled ? "Active" : "Off"}
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(v) => update({ enabled: v })}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Map preview */}
        <div className="lg:col-span-3">
          <DashboardCard
            title="Live Location"
            description="Your current position shared with trusted contacts"
            action={
              settings.enabled ? (
                <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  Live
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50"></span>
                  Paused
                </div>
              )
            }
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/30">
              {/* Map mock */}
              <div
                className="relative h-64 sm:h-80"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.95 0.02 264) 0%, oklch(0.92 0.03 200) 50%, oklch(0.94 0.02 264) 100%)",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, oklch(0.55 0.22 264 / 0.15) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.55 0.22 264 / 0.15) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                {/* Roads */}
                <div className="absolute left-1/4 top-0 h-full w-1 bg-white/60" />
                <div className="absolute left-2/3 top-0 h-full w-1.5 bg-white/50" />
                <div className="absolute left-0 top-1/3 h-1 w-full bg-white/60" />
                <div className="absolute left-0 top-2/3 h-1 w-3/4 bg-white/50" />

                {/* Pin */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                  <div className="relative">
                    <span className="absolute -inset-3 animate-ping rounded-full bg-primary/30" />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {!settings.enabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                    <div className="text-center">
                      <EyeOff className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">Location sharing is off</p>
                      <p className="text-xs text-muted-foreground">Enable to share your location</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{currentLocationText}</p>
                    <p className="text-xs text-muted-foreground">Updated just now {locationAccuracy ? `· ±${locationAccuracy}m accuracy` : ""}</p>
                  </div>
                </div>
                <Badge variant={settings.enabled ? "success" : "secondary"}>
                  {settings.enabled ? "Sharing live" : "Not sharing"}
                </Badge>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Quick stats */}
        <div className="space-y-4 lg:col-span-2">
          <DashboardCard title="Sharing Status">
            <div className="space-y-3">
              {[
                { label: "Circle members", value: realMembers.length.toString(), icon: Users },
                { label: "Currently sharing with", value: Object.values(memberSharing).filter(Boolean).length.toString(), icon: Eye },
                { label: "Last shared", value: "2 min ago", icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{label}</span>
                  </div>
                  <span className="text-sm font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Privacy" description="Your location is encrypted end-to-end">
            <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <Shield className="h-5 w-5 shrink-0 text-green-600" />
              <div>
                <p className="text-sm font-medium">Secure sharing</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Only contacts you approve can view your location. Data is never sold or shared with third parties.
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Sharing duration */}
      <DashboardCard title="Sharing Duration" description="Control when your location is visible">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {durationOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={!settings.enabled}
              onClick={() => update({ duration: opt.value, emergencyOnly: opt.value === "emergency" })}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-all disabled:opacity-50",
                settings.duration === opt.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30"
              )}
            >
              <p className="text-sm font-semibold">{opt.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</p>
            </button>
          ))}
        </div>
      </DashboardCard>

      {/* Controls */}
      <DashboardCard title="Sharing Controls">
        <div className="space-y-3">
          <SettingRow
            icon={Users}
            title="Share with emergency circle"
            description="Allow all approved circle members to see your location"
          >
            <Switch
              checked={settings.shareWithCircle}
              onCheckedChange={(v) => update({ shareWithCircle: v })}
              disabled={!settings.enabled}
            />
          </SettingRow>
          <SettingRow
            icon={BellRing}
            title="Auto-share on emergency alert"
            description="Automatically share location when an emergency is activated"
          >
            <Switch
              checked={settings.autoShareOnAlert}
              onCheckedChange={(v) => update({ autoShareOnAlert: v })}
              disabled={!settings.enabled}
            />
          </SettingRow>
          <SettingRow
            icon={MapPin}
            title="Precise location"
            description="Share exact GPS coordinates instead of approximate area"
          >
            <Switch
              checked={settings.showPreciseLocation}
              onCheckedChange={(v) => update({ showPreciseLocation: v })}
              disabled={!settings.enabled}
            />
          </SettingRow>
        </div>
      </DashboardCard>

      {/* Circle members */}
      <DashboardCard
        title="Circle Access"
        description="Choose who can view your live location"
      >
        <div className="space-y-3">
          {realMembers.length === 0 && <div className="text-center text-muted-foreground p-4">No circle members found. Add family members to share location.</div>}
          {realMembers.map((member) => (
            <div
              key={member.memberId}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{member.fullName.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.relationship}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={memberSharing[member.memberId] ? "success" : "secondary"}>
                  {memberSharing[member.memberId] ? "Can view" : "No access"}
                </Badge>
                <Switch
                  checked={memberSharing[member.memberId] ?? false}
                  onCheckedChange={(v) =>
                    setMemberSharing((prev) => ({ ...prev, [member.memberId]: v }))
                  }
                  disabled={!settings.enabled || !settings.shareWithCircle}
                />
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* Locations Shared With Me */}
      <DashboardCard
        title="Locations Shared With Me"
        description="Live locations of contacts who have added you to their circle"
      >
        <div className="space-y-3">
          {sharedLocations.length === 0 && (
            <div className="text-center text-muted-foreground p-4">No one is currently sharing their location with you.</div>
          )}
          {sharedLocations.map((loc) => (
            <div
              key={loc.id}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{loc.fullName.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{loc.fullName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success" className="animate-pulse">Live</Badge>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={`https://maps.google.com/?q=${loc.latitude},${loc.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Map
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard
        title="Location History"
        description="Recent places you've been while sharing was active"
        action={
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Clear history
          </Button>
        }
      >
        <div className="space-y-2">
          {realHistory.length === 0 && (
            <div className="text-center text-muted-foreground p-4">No location history found.</div>
          )}
          {realHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {item.type === "Current" ? (
                    <Radio className="h-4 w-4" />
                  ) : (
                    <History className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.place}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
              <Badge variant={item.type === "Current" ? "success" : "outline"}>
                {item.type}
              </Badge>
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* Device info */}
      <DashboardCard title="Connected Device">
        <SettingRow
          icon={Smartphone}
          title="Your Device"
          description="Location sourced from this device"
        >
          <Badge variant="success" className="gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Connected
          </Badge>
        </SettingRow>
        {!settings.enabled && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Enable location sharing above to let your circle find you in an emergency.
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
