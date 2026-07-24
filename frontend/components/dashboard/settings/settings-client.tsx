"use client";
import { useState } from "react";
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  AlertTriangle,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Download,
  Trash2,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboardTheme } from "@/components/dashboard/theme-provider";

export function SettingsClient() {
  const { theme, toggleTheme } = useDashboardTheme();
  
  // Local state for toggles (simulated functionality)
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState("Private");
  const [language, setLanguage] = useState("English (US)");

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${checked ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings, privacy, and preferences.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Navigation Sidebar (Desktop) */}
        <div className="hidden md:block md:col-span-3 space-y-1 sticky top-24 self-start">
          {[
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'security', icon: ShieldCheck, label: 'Security' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'privacy', icon: Lock, label: 'Privacy' },
            { id: 'appearance', icon: Palette, label: 'Appearance' },
            { id: 'language', icon: Globe, label: 'Language' },
            { id: 'danger', icon: AlertTriangle, label: 'Danger Zone', danger: true },
          ].map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/50 ${item.danger ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30' : 'text-slate-600 dark:text-slate-400'}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-9 space-y-8">
          
          {/* Profile Section */}
          <section id="profile" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Profile</h2>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary ring-4 ring-background shadow-sm">
                  SJ
                </div>
                <div>
                  <Button variant="outline" className="rounded-xl mr-2">Change Avatar</Button>
                  <Button variant="ghost" className="rounded-xl text-destructive hover:bg-destructive/10">Remove</Button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input defaultValue="Sarah Jenkins" className="rounded-xl bg-muted/30 border-border/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input defaultValue="sarah.jenkins@example.com" type="email" className="rounded-xl bg-muted/30 border-border/50" />
                </div>
              </div>
              <Button className="rounded-xl">Save Changes</Button>
            </div>
          </section>

          {/* Security Section */}
          <section id="security" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-bold">Security</h2>
            </div>
            <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/50">
              <div className="p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" /> Change Password
                </h3>
                <div className="space-y-3 max-w-md">
                  <Input type="password" placeholder="Current Password" className="rounded-xl bg-muted/30" />
                  <Input type="password" placeholder="New Password" className="rounded-xl bg-muted/30" />
                  <Input type="password" placeholder="Confirm New Password" className="rounded-xl bg-muted/30" />
                  <Button variant="outline" className="rounded-xl w-full">Update Password</Button>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" /> Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security to your account.</p>
                </div>
                <ToggleSwitch checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section id="notifications" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Bell className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold">Notifications</h2>
            </div>
            <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/50">
              <div className="p-6 flex items-center justify-between hover:bg-muted/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Receive alerts and updates via email.</p>
                  </div>
                </div>
                <ToggleSwitch checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
              </div>
              <div className="p-6 flex items-center justify-between hover:bg-muted/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">SMS Notifications</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Receive critical emergency alerts via SMS.</p>
                  </div>
                </div>
                <ToggleSwitch checked={smsNotif} onChange={() => setSmsNotif(!smsNotif)} />
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section id="appearance" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Palette className="h-5 w-5 text-indigo-500" />
              <h2 className="text-xl font-bold">Appearance</h2>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {theme === 'dark' ? <Moon className="h-4 w-4 text-indigo-500" /> : <Sun className="h-4 w-4 text-amber-500" />} 
                    Dark Mode
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Toggle between light and dark themes.</p>
                </div>
                <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
              </div>
            </div>
          </section>

          {/* Language Section */}
          <section id="language" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-bold">Language</h2>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">System Language</h3>
                <p className="text-sm text-muted-foreground mt-1">Select your preferred language for the dashboard.</p>
              </div>
              <select 
                className="w-full sm:w-[200px] rounded-xl border-border bg-muted/40 px-3 py-2 text-sm focus:ring-1 focus:ring-primary/30 outline-none border"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English (US)">English (US)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </section>

          {/* Danger Zone */}
          <section id="danger" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-2 border-b border-red-200 dark:border-red-900/50 pb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
            </div>
            <div className="rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 shadow-sm divide-y divide-red-200/50 dark:divide-red-900/30">
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-200">Export Data</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Download all your medical data and emergency history.</p>
                </div>
                <Button variant="outline" className="rounded-xl border-slate-300 dark:border-slate-700 shrink-0">
                  <Download className="mr-2 h-4 w-4" /> Export as JSON
                </Button>
              </div>
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-400">Delete Account</h3>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">Permanently delete your account and all associated data.</p>
                </div>
                <Button variant="destructive" className="rounded-xl shrink-0 bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                </Button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
