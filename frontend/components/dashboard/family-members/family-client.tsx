"use client";
import { useEffect, useState } from "react";
import { Plus, Search, MoreHorizontal, FileText, UserPlus, ShieldCheck, HeartPulse, Settings, Edit2, Trash2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getFamilyMembers, type FamilyMember } from "@/lib/api";

const FAMILY_MEMBERS = [
  {
    id: "1",
    name: "James Jenkins",
    relationship: "Son",
    photo: "JJ",
    medicalSummary: "Asthma, Peanut Allergy",
    accessStatus: "Full Access",
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    name: "Emma Jenkins",
    relationship: "Daughter",
    photo: "EJ",
    medicalSummary: "No known allergies",
    accessStatus: "Emergency Only",
    lastUpdated: "1 month ago",
  },
  {
    id: "3",
    name: "Robert Jenkins",
    relationship: "Father",
    photo: "RJ",
    medicalSummary: "Type 2 Diabetes, Hypertension",
    accessStatus: "Full Access",
    lastUpdated: "5 days ago",
    activeEmergency: true,
  },
];

export function FamilyClient() {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<FamilyMember[]>(FAMILY_MEMBERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadMembers = async () => {
      try {
        const data = await getFamilyMembers();
        if (isMounted) {
          setMembers(data);
        }
      } catch {
        if (isMounted) {
          setMembers(FAMILY_MEMBERS);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMembers();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMembers = members.filter((member) =>
    [member.name, member.relationship, member.medicalSummary, member.accessStatus].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Family Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage medical profiles and emergency access for your family.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search family..."
              className="w-full pl-9 sm:w-64 rounded-xl bg-muted/40"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="rounded-xl shrink-0">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Family Member
          </Button>
        </div>
      </div>

      {/* Active Emergency Tracking Dashboard */}
      {members.find((m) => m.activeEmergency) && (
        <div className="rounded-3xl border-2 border-red-500/50 bg-red-50/30 p-6 shadow-xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-[pulse_2s_ease-in-out_infinite]" />
          
          <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            {/* Left Col: Info */}
            <div className="flex-1 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 border-2 border-red-200">
                  <HeartPulse className="h-8 w-8 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-red-900 flex items-center gap-2">
                    ACTIVE EMERGENCY
                    <Badge variant="destructive" className="bg-red-600 animate-pulse">LIVE</Badge>
                  </h2>
                  <p className="text-lg font-medium text-slate-700">Robert Jenkins (Father)</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-1">Responder</p>
                  <p className="font-semibold text-slate-900">David Smith (Paramedic)</p>
                  <a href="tel:+15559998888" className="text-blue-600 text-sm font-medium hover:underline">+1 (555) 999-8888</a>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-1">Destination</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-2"><Settings className="h-4 w-4 text-emerald-500" /> City General Hospital</p>
                  <p className="text-sm font-medium text-amber-600">ETA: 4 Minutes</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20">
                  View Full Live Session
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl border-red-200 text-red-700 hover:bg-red-50">
                  Call Responder
                </Button>
              </div>
            </div>

            {/* Right Col: Timeline */}
            <div className="lg:w-80 bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-red-500" />
                Live Timeline
              </h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                {[
                  { time: "09:50", label: "Ambulance En Route", active: true },
                  { time: "09:46", label: "Hospital Assigned", active: false },
                  { time: "09:44", label: "Contact Accepted", active: false },
                  { time: "09:42", label: "QR Scanned", active: false }
                ].map((step, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className={`h-5 w-5 rounded-full border-4 shadow-sm shrink-0 z-10 ${step.active ? 'bg-red-500 border-white' : 'bg-slate-300 border-white'}`} />
                    <div className="pt-0.5">
                      <p className={`font-semibold text-sm ${step.active ? 'text-slate-900' : 'text-slate-500'}`}>{step.label}</p>
                      <p className="text-xs text-slate-400">{step.time} AM</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-border bg-card/70 p-6 text-sm text-muted-foreground">
          Loading family member data from the API layer...
        </div>
      ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary ring-2 ring-background shadow-inner">
                  {member.photo}
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-tight">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.relationship}</p>
                </div>
              </div>
              <DropdownMenu
                trigger={
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg -mr-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                }
              >
                <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg">
                  <FileText className="h-4 w-4" /> View Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg">
                  <Edit2 className="h-4 w-4" /> Edit Access
                </DropdownMenuItem>
                <DropdownMenuItem destructive className="cursor-pointer gap-2 rounded-lg text-red-600 focus:text-red-600">
                  <Trash2 className="h-4 w-4" /> Remove
                </DropdownMenuItem>
              </DropdownMenu>
            </div>

            <div className="space-y-4 flex-1">
              <div className="rounded-xl bg-muted/40 p-3">
                <div className="flex items-center gap-2 mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <HeartPulse className="h-4 w-4 text-red-500" />
                  Medical Summary
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {member.medicalSummary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-medium text-muted-foreground">Access:</span>
                </div>
                <Badge variant="outline" className={member.accessStatus === "Full Access" ? "border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400" : ""}>
                  {member.accessStatus}
                </Badge>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <Button variant="outline" className="w-full rounded-xl hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors">
                View Profile
              </Button>
            </div>
          </div>
        ))}
        
        {/* Add New Card */}
        <button className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 p-6 transition-colors hover:border-primary/40 hover:bg-primary/5 min-h-[250px]">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="font-medium text-foreground">Add Family Member</h3>
          <p className="mt-1 text-center text-sm text-muted-foreground max-w-[200px]">
            Invite a family member to manage their emergency profile
          </p>
        </button>
      </div>
      )}
    </div>
  );
}
