"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  QrCode,
  Share2,
  HeartPulse,
  UserPlus,
  ScanLine,
  BellRing,
  Users,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboard, DashboardResponse } from "@/lib/api";

const ICON_MAP: Record<string, any> = {
  BellRing,
  HeartPulse,
  UserPlus,
  Activity,
  QrCode,
  ScanLine,
  Users
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const dashboardData = await getDashboard();
        if (mounted) setData(dashboardData);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3">
              Emergency Ready
            </Badge>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {data.fullName?.split(' ')[0] || "User"}
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Your emergency profile is {data.completionPercentage}% complete. Finish your medical details to ensure first responders have everything they need.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <span className="text-sm font-medium text-muted-foreground">Completion percentage</span>
            <span className="font-display text-4xl font-bold text-primary">{data.completionPercentage}%</span>
            <Progress value={data.completionPercentage} className="w-full sm:w-48" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="QR Scans" value={data.stats.qrScans.value} change={data.stats.qrScans.change} icon={ScanLine} trend={data.stats.qrScans.trend as any} />
        <StatCard label="Emergency Alerts" value={data.stats.emergencyAlerts.value} change={data.stats.emergencyAlerts.change} icon={BellRing} trend={data.stats.emergencyAlerts.trend as any} />
        <StatCard label="Saved Contacts" value={data.stats.savedContacts.value} change={data.stats.savedContacts.change} icon={Users} trend={data.stats.savedContacts.trend as any} />
        <StatCard label="Family Members" value={data.stats.familyMembers.value} change={data.stats.familyMembers.change} icon={Activity} trend={data.stats.familyMembers.trend as any} />
      </div>

      {/* Widgets row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardCard title="QR Code Status" description="Your emergency card is live">
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5">
              <QrCode className="h-16 w-16 text-primary" />
            </div>
            {data.qrCodeStatus.active ? (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3 w-3" /> Active
              </Badge>
            ) : (
              <Badge variant="destructive">Inactive</Badge>
            )}
            <p className="text-center text-xs text-muted-foreground">
              Last generated {data.qrCodeStatus.lastGenerated} · {data.qrCodeStatus.totalScans} total scans
            </p>
          </div>
        </DashboardCard>

        <DashboardCard title="Emergency Contacts" description={`${data.emergencyContacts.length} contacts in your circle`}>
          <div className="space-y-3">
            {data.emergencyContacts.slice(0, 3).map((c: any) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                <span className="text-sm font-medium">{c.name} · {c.relationship}</span>
                <Badge variant="outline">Primary</Badge>
              </div>
            ))}
            {data.emergencyContacts.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">No contacts added yet.</div>
            )}
            <Link href="/dashboard/emergency-contacts">
              <Button variant="outline" size="sm" className="mt-1 w-full rounded-xl">
                View all contacts
              </Button>
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard title="Medical Profile Completion" description="Progress by section">
          <div className="space-y-4">
            {data.medicalProfileCompletion.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
                <Progress value={item.value} />
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Quick actions */}
      <DashboardCard title="Quick Actions" description="Common tasks at a glance">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Generate QR", icon: QrCode, href: "/dashboard/qr-card" },
            { label: "Share QR", icon: Share2, href: "/dashboard/qr-card" },
            { label: "Edit Medical Profile", icon: HeartPulse, href: "/dashboard/medical-profile" },
            { label: "Add Contact", icon: UserPlus, href: "/dashboard/emergency-contacts" },
          ].map(({ label, icon: Icon, href }) => (
            <Link key={label} href={href}>
              <Button
                variant="outline"
                className="h-auto w-full flex-col gap-2 rounded-xl py-4 hover:border-primary/30 hover:bg-primary/5"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </DashboardCard>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Monthly QR Scans" description="Scan activity over time">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.qrScanData}>
                <defs>
                  <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 264)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 264)" />
                <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 264)" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="scans"
                  stroke="oklch(0.55 0.22 264)"
                  fill="url(#scanGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Emergency Activations" description="Alerts triggered per month">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.emergencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.008 264)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 264)" />
                <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 264)" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="alerts" fill="oklch(0.55 0.22 264)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardCard
          title="Recent QR Scans"
          action={
            <Link href="/dashboard/emergency-history" className="text-sm font-medium text-primary hover:underline">
              View all <ArrowUpRight className="inline h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="space-y-3">
            {data.recentScans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <div>
                  <p className="text-sm font-medium">{scan.location}</p>
                  <p className="text-xs text-muted-foreground">{scan.type}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {scan.time}
                </span>
              </div>
            ))}
            {data.recentScans.length === 0 && (
                <div className="text-sm text-muted-foreground py-2">No recent scans.</div>
            )}
          </div>
        </DashboardCard>

        <DashboardCard title="Recent Emergency Activity" description="Latest updates to your profile">
          <div className="relative space-y-0">
            {data.recentActivity.map((item, i) => {
              const Icon = ICON_MAP[item.icon] || BellRing;
              return (
                <div key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < data.recentActivity.length - 1 && (
                    <div className="absolute left-[17px] top-9 h-[calc(100%-1rem)] w-px bg-border" />
                  )}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                    <p className="mt-1 text-xs text-muted-foreground/80">{item.time}</p>
                  </div>
                </div>
              );
            })}
            {data.recentActivity.length === 0 && (
                <div className="text-sm text-muted-foreground py-2">No recent activity.</div>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
