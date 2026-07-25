import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    userId: 1,
    fullName: "Jane Doe",
    email: "jane@example.com",
    completionPercentage: 82,
    stats: {
      qrScans: { value: 128, change: "+12%", trend: "up" },
      emergencyAlerts: { value: 7, change: "+2", trend: "up" },
      savedContacts: { value: 4, change: "+1", trend: "up" },
      familyMembers: { value: 3, change: "0", trend: "neutral" },
    },
    qrCodeStatus: {
      active: true,
      lastGenerated: "2 hours ago",
      totalScans: 24,
    },
    medicalProfileCompletion: [
      { label: "Basic Info", value: 100 },
      { label: "Medical History", value: 80 },
      { label: "Emergency Contacts", value: 90 },
    ],
    qrScanData: [
      { month: "Jan", scans: 12, alerts: 1 },
      { month: "Feb", scans: 18, alerts: 2 },
      { month: "Mar", scans: 22, alerts: 1 },
      { month: "Apr", scans: 30, alerts: 3 },
      { month: "May", scans: 24, alerts: 2 },
      { month: "Jun", scans: 22, alerts: 1 },
    ],
    emergencyData: [
      { month: "Jan", scans: 1, alerts: 0 },
      { month: "Feb", scans: 2, alerts: 1 },
      { month: "Mar", scans: 1, alerts: 0 },
      { month: "Apr", scans: 3, alerts: 1 },
      { month: "May", scans: 2, alerts: 0 },
      { month: "Jun", scans: 1, alerts: 0 },
    ],
    recentScans: [
      { id: 1, location: "Downtown Clinic", time: "10 min ago", type: "QR Scan" },
      { id: 2, location: "Home", time: "1 hour ago", type: "Emergency Alert" },
    ],
    recentActivity: [
      { id: 1, title: "Profile updated", desc: "Medical details were refreshed", time: "2h ago", icon: "HeartPulse" },
      { id: 2, title: "Contact added", desc: "A new emergency contact was added", time: "Yesterday", icon: "UserPlus" },
    ],
    emergencyContacts: [
      { id: "1", name: "David Jenkins", relationship: "Spouse" },
      { id: "2", name: "Emily Chen", relationship: "Doctor" },
    ],
  });
}
