"use client";
import { useEffect, useState } from "react";
import { Plus, Search, MoreHorizontal, FileText, UserPlus, ShieldCheck, HeartPulse, Settings, Edit2, Trash2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";
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
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRelationship, setInviteRelationship] = useState("Parent");
  const [inviteAccessStatus, setInviteAccessStatus] = useState("Emergency Only");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);

  const [editRelationship, setEditRelationship] = useState("");
  const [editAccessStatus, setEditAccessStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [selectedMemberProfile, setSelectedMemberProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const openView = async (member: FamilyMember) => {
    setSelectedMember(member);
    setViewModalOpen(true);
    setSelectedMemberProfile(null);
    setIsLoadingProfile(true);
    try {
      const { getFamilyMemberMedicalProfile } = await import("@/lib/api");
      const profile = await getFamilyMemberMedicalProfile(member.id);
      setSelectedMemberProfile(profile);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const openEdit = (member: FamilyMember) => {
    setSelectedMember(member);
    setEditRelationship(member.relationship);
    setEditAccessStatus(member.accessStatus);
    setEditModalOpen(true);
  };

  const openRemove = (member: FamilyMember) => {
    setSelectedMember(member);
    setRemoveModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    setIsProcessing(true);
    try {
      const { updateFamilyMember } = await import("@/lib/api");
      const updated = await updateFamilyMember(selectedMember.id, {
        relationship: editRelationship,
        accessStatus: editAccessStatus,
      });
      setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
      setEditModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async () => {
    if (!selectedMember) return;
    setIsProcessing(true);
    try {
      const { deleteFamilyMember } = await import("@/lib/api");
      await deleteFamilyMember(selectedMember.id);
      setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
      setRemoveModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

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
          setApiError(true);
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

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError("");
    setInviteSuccess(false);
    setIsInviting(true);

    try {
      const { createFamilyMember } = await import("@/lib/api");
      const newMember = await createFamilyMember({
        email: inviteEmail,
        relationship: inviteRelationship,
        accessStatus: inviteAccessStatus,
      });
      
      setMembers(prev => [...prev, newMember]);
      setInviteSuccess(true);
      setTimeout(() => {
        setIsInviteModalOpen(false);
        setInviteEmail("");
        setInviteSuccess(false);
      }, 1500);
    } catch (err: any) {
      setInviteError(err.message || "Failed to invite family member. Please check the email.");
    } finally {
      setIsInviting(false);
    }
  };

  const filteredMembers = members.filter((member) =>
    [member.fullName, member.relationship, member.accessStatus].join(" ").toLowerCase().includes(search.toLowerCase())
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
          <Button className="rounded-xl shrink-0" onClick={() => setIsInviteModalOpen(true)}>
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
      ) : apiError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600 shadow-sm dark:border-red-900/50 dark:bg-red-950/20">
          <HeartPulse className="mx-auto mb-4 h-12 w-12 text-red-400 opacity-50" />
          <h2 className="text-lg font-bold mb-2">Unable to connect to the backend</h2>
          <p className="text-sm opacity-80">
            We couldn't fetch your family members. Please make sure the server is running and try again.
          </p>
          <Button variant="outline" className="mt-6 border-red-200 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900" onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
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
                  {getInitials(member.fullName)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-tight">{member.fullName}</h3>
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
                <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg" onClick={() => openView(member)}>
                  <FileText className="h-4 w-4" /> View Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg" onClick={() => openEdit(member)}>
                  <Edit2 className="h-4 w-4" /> Edit Access
                </DropdownMenuItem>
                <DropdownMenuItem destructive className="cursor-pointer gap-2 rounded-lg text-red-600 focus:text-red-600" onClick={() => openRemove(member)}>
                  <Trash2 className="h-4 w-4" /> Remove
                </DropdownMenuItem>
              </DropdownMenu>
            </div>

            <div className="space-y-4 flex-1">
              <div className="rounded-xl bg-muted/40 p-3">
                <div className="flex items-center gap-2 mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <HeartPulse className="h-4 w-4 text-red-500" />
                  Medical Profile
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Health profile available. Click View Profile to see details.
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
              <Button variant="outline" className="w-full rounded-xl hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors" onClick={() => openView(member)}>
                View Profile
              </Button>
            </div>
          </div>
        ))}
        
        {/* Add New Card */}
        <button onClick={() => setIsInviteModalOpen(true)} className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 p-6 transition-colors hover:border-primary/40 hover:bg-primary/5 min-h-[250px]">
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

      <Dialog open={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)}>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Invite Family Member</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add a trusted member to your safety circle.
            </p>
          </div>
          
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input
                id="email"
                type="email"
                required
                placeholder="family@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="relationship" className="text-sm font-medium">Relationship</label>
              <select
                id="relationship"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={inviteRelationship}
                onChange={(e) => setInviteRelationship(e.target.value)}
              >
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Child">Child</option>
                <option value="Spouse">Spouse</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="access" className="text-sm font-medium">Access Status</label>
              <select
                id="access"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={inviteAccessStatus}
                onChange={(e) => setInviteAccessStatus(e.target.value)}
              >
                <option value="Emergency Only">Emergency Only</option>
                <option value="Full Access">Full Access</option>
              </select>
            </div>

            {inviteError && (
              <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
                {inviteError}
              </div>
            )}
            
            {inviteSuccess && (
              <div className="text-sm text-green-500 bg-green-500/10 p-3 rounded-lg">
                Successfully invited!
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isInviting || inviteSuccess}>
                {isInviting ? "Inviting..." : "Send Invite"}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* View Profile Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        {selectedMember && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary ring-4 ring-background shadow-inner">
                {getInitials(selectedMember.fullName)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedMember.fullName}</h2>
                <p className="text-muted-foreground">{selectedMember.relationship}</p>
              </div>
            </div>
            
            <div className="grid gap-4 bg-muted/30 p-4 rounded-xl">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">Email:</span>
                <span className="col-span-2 font-medium break-words">{selectedMember.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">Phone:</span>
                <span className="col-span-2 font-medium">{selectedMember.phoneNumber || "Not provided"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">Access:</span>
                <span className="col-span-2">
                  <Badge variant="outline" className={selectedMember.accessStatus === "Full Access" ? "border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400" : ""}>
                    {selectedMember.accessStatus}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">Added:</span>
                <span className="col-span-2 font-medium">
                  {selectedMember.addedAt ? new Date(selectedMember.addedAt).toLocaleDateString() : "Unknown"}
                </span>
              </div>
            </div>

            {isLoadingProfile ? (
              <div className="flex justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : selectedMemberProfile ? (
              <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-red-500" /> Medical Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-muted/40 p-3 rounded-lg">
                    <span className="block text-xs font-bold uppercase text-muted-foreground mb-1">Blood Type</span>
                    <span className="font-medium">{selectedMemberProfile.bloodGroup || "Not provided"}</span>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-lg">
                    <span className="block text-xs font-bold uppercase text-muted-foreground mb-1">Allergies</span>
                    <span className="font-medium text-red-600 dark:text-red-400">{selectedMemberProfile.allergies || "None reported"}</span>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-lg sm:col-span-2">
                    <span className="block text-xs font-bold uppercase text-muted-foreground mb-1">Medical Conditions</span>
                    <span className="font-medium">{selectedMemberProfile.medicalConditions || "None reported"}</span>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-lg sm:col-span-2">
                    <span className="block text-xs font-bold uppercase text-muted-foreground mb-1">Emergency Notes</span>
                    <span className="font-medium text-amber-700 dark:text-amber-500">{selectedMemberProfile.emergencyNotes || "None"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground border-t border-border/50 pt-6">
                No medical profile available for this member.
              </div>
            )}

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Edit Access Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Edit Access for {selectedMember?.fullName}</h2>
          </div>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-relationship" className="text-sm font-medium">Relationship</label>
              <select
                id="edit-relationship"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editRelationship}
                onChange={(e) => setEditRelationship(e.target.value)}
              >
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Child">Child</option>
                <option value="Spouse">Spouse</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-access" className="text-sm font-medium">Access Status</label>
              <select
                id="edit-access"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editAccessStatus}
                onChange={(e) => setEditAccessStatus(e.target.value)}
              >
                <option value="Emergency Only">Emergency Only</option>
                <option value="Full Access">Full Access</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* Remove Confirmation Modal */}
      <Dialog open={removeModalOpen} onClose={() => setRemoveModalOpen(false)}>
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
            <Trash2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Remove Family Member?</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Are you sure you want to remove <strong>{selectedMember?.fullName}</strong> from your safety circle? This action cannot be undone.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Button variant="outline" onClick={() => setRemoveModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove} disabled={isProcessing}>
              {isProcessing ? "Removing..." : "Yes, Remove"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
