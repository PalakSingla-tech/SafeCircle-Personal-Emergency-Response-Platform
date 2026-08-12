"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Shield,
  Bell,
  Lock,
  Eye,
  Palette,
  Globe,
  AlertTriangle,
  KeyRound,
  Smartphone,
  Mail,
  MessageSquare,
  Moon,
  Download,
  Trash2,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { useDashboardTheme } from "@/components/dashboard/theme-provider";
import { getSettings, saveSettings as saveSettingsApi, type SettingsProfile } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

const defaultSettings: SettingsProfile = {
  fullName: "Loading...",
  email: "loading...",
  phoneNumber: "loading...",
  emailNotifications: true,
  smsNotifications: false,
  twoFactor: false,
  language: "en",
  darkMode: false,
  locationSharingEnabled: true,
  emergencyAutoShare: true,
};

const languages = [
  { value: "en", label: "English (US)" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "hi", label: "हिन्दी" },
];

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "language", label: "Language", icon: Globe },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="shrink-0 sm:pl-4">{children}</div>
    </div>
  );
}

export function SettingsContent() {
  const { theme, setTheme } = useDashboardTheme();
  const [settings, setSettings] = useState<SettingsProfile>(defaultSettings);
  const [activeSection, setActiveSection] = useState("profile");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getSettings();
        setSettings(profile);
      } catch {
        toast.error("Failed to load settings.");
      }
    };

    load();
  }, []);

  const update = async (patch: Partial<SettingsProfile>) => {
    const next = { ...settings, ...patch };
    setSettings(next);

    try {
      await saveSettingsApi(next);
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings to server.");
    }
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2">Account</Badge>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, security, notifications, and preferences.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Section nav */}
        <nav className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  activeSection === id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* Settings cards */}
        <div className="space-y-6">
          {/* Profile */}
          <section id="profile">
            <DashboardCard title="Profile" description="Your personal account information">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-border">
                    <AvatarFallback className="text-lg">
                      {settings.fullName ? settings.fullName.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-display text-lg font-semibold">{settings.fullName}</p>
                    <p className="text-sm text-muted-foreground">{settings.email}</p>
                    <Badge variant="outline" className="mt-1.5">Pro Plan</Badge>
                  </div>
                </div>
                <Link href="/dashboard/medical-profile">
                  <Button variant="outline" className="rounded-xl">
                    Edit profile <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</p>
                  <p className="mt-1 text-sm font-medium">{settings.phoneNumber || "Not provided"}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Member since</p>
                  <p className="mt-1 text-sm font-medium">January 2025</p>
                </div>
              </div>
            </DashboardCard>
          </section>

          {/* Security */}
          <section id="security">
            <DashboardCard title="Security" description="Protect your account with strong authentication">
              <div className="space-y-3">
                <SettingRow
                  icon={KeyRound}
                  title="Change Password"
                  description="Update your password regularly to keep your account secure"
                >
                  <Link href="/reset-password">
                    <Button variant="outline" size="sm" className="rounded-lg">
                      Change password
                    </Button>
                  </Link>
                </SettingRow>
                <SettingRow
                  icon={Smartphone}
                  title="Two Factor Authentication"
                  description="Add an extra layer of security with SMS or authenticator app"
                >
                  <div className="flex items-center gap-2">
                    {settings.twoFactor && (
                      <Badge variant="success" className="hidden sm:inline-flex">Enabled</Badge>
                    )}
                    <Switch
                      checked={settings.twoFactor}
                      onCheckedChange={(v) => update({ twoFactor: v })}
                    />
                  </div>
                </SettingRow>
              </div>
            </DashboardCard>
          </section>

          {/* Notifications */}
          <section id="notifications">
            <DashboardCard title="Notifications" description="Choose how you want to be alerted">
              <div className="space-y-3">
                <SettingRow
                  icon={Mail}
                  title="Email Notifications"
                  description="Receive emergency alerts, scan activity, and account updates via email"
                >
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(v) => update({ emailNotifications: v })}
                  />
                </SettingRow>
                <SettingRow
                  icon={MessageSquare}
                  title="SMS Notifications"
                  description="Get text messages when your emergency circle is activated"
                >
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(v) => update({ smsNotifications: v })}
                  />
                </SettingRow>
              </div>
            </DashboardCard>
          </section>

          {/* Privacy */}
          <section id="privacy">
            <DashboardCard title="Privacy" description="Control your data and how it's shared">
              <div className="space-y-3">
                <SettingRow
                  icon={Eye}
                  title="Profile Visibility"
                  description="Your medical profile is only visible via QR scan to authorized responders"
                >
                  <Badge variant="secondary">QR only</Badge>
                </SettingRow>
                <SettingRow
                  icon={Download}
                  title="Export Data"
                  description="Download a copy of your profile, contacts, and activity history"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => {
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2500);
                    }}
                  >
                    {saved ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" /> Exported
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" /> Export data
                      </>
                    )}
                  </Button>
                </SettingRow>
              </div>
            </DashboardCard>
          </section>

          {/* Appearance */}
          <section id="appearance">
            <DashboardCard title="Appearance" description="Customize how SafeCircle looks">
              <SettingRow
                icon={Moon}
                title="Dark Mode"
                description="Switch between light and dark themes for the dashboard"
              >
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
                />
              </SettingRow>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-all",
                    theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="mb-2 h-8 rounded-lg bg-white shadow-sm ring-1 ring-border" />
                  <p className="text-sm font-medium">Light</p>
                  <p className="text-xs text-muted-foreground">Clean and bright</p>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-all",
                    theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="mb-2 h-8 rounded-lg bg-zinc-900 shadow-sm ring-1 ring-zinc-700" />
                  <p className="text-sm font-medium">Dark</p>
                  <p className="text-xs text-muted-foreground">Easy on the eyes</p>
                </button>
              </div>
            </DashboardCard>
          </section>

          {/* Language */}
          <section id="language">
            <DashboardCard title="Language" description="Select your preferred language">
              <SettingRow
                icon={Globe}
                title="Language Selector"
                description="Choose the language used across the dashboard"
              >
                <select
                  value={settings.language}
                  onChange={(e) => update({ language: e.target.value })}
                  className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </SettingRow>
            </DashboardCard>
          </section>

          {/* Danger Zone */}
          <section id="danger">
            <DashboardCard
              title="Danger Zone"
              description="Irreversible actions — proceed with caution"
              className="border-destructive/20"
            >
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <SettingRow
                  icon={Trash2}
                  title="Delete Account"
                  description="Permanently delete your account and all associated data. This cannot be undone."
                  className="border-0 bg-transparent p-0 hover:bg-transparent"
                >
                  {!showDeleteConfirm ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete account
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => {
                          localStorage.clear();
                          window.location.href = "/login";
                        }}
                      >
                        Confirm delete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </SettingRow>
              </div>
            </DashboardCard>
          </section>
        </div>
      </div>
    </div>
  );
}
