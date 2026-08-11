"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Reorder, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MoreHorizontal,
  GripVertical,
  Plus,
  Upload,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Pencil,
  Trash2,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  createEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
  type EmergencyContact,
} from "@/lib/api";

const initialContacts: EmergencyContact[] = [
  { id: "1", name: "David Jenkins", relationship: "Spouse", phone: "+1 (555) 123-4567", email: "david@example.com", verified: true, avatarInitials: "DJ" },
  { id: "2", name: "Emily Chen", relationship: "Doctor", phone: "+1 (555) 987-6543", verified: true, avatarInitials: "EC" },
  { id: "3", name: "Sarah Miller", relationship: "Sister", phone: "+1 (555) 456-7890", verified: false, avatarInitials: "SM" }
];

export function EmergencyContactsClient() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  
  // Add Contact Form State
  const [newName, setNewName] = useState("");
  const [newRel, setNewRel] = useState("");
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadContacts = async () => {
      try {
        const data = await getEmergencyContacts();
        if (isMounted) {
          setContacts(data);
        }
      } catch {
        if (isMounted) {
          setContacts(initialContacts);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContacts();
    return () => {
      isMounted = false;
    };
  }, []);

  const shareContact = (contact: EmergencyContact) => {
    const text = `Emergency Contact:\nName: ${contact.name}\nRelationship: ${contact.relationship}\nPhone: ${contact.phone}`;
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Contact info copied to clipboard"))
      .catch(() => toast.error("Failed to copy contact info"));
  };

  const startEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setNewName(contact.name);
    setNewRel(contact.relationship);
    setNewPhone(contact.phone);
    setIsAddOpen(true);
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    if (editingContact) {
      // Handle Edit (Mocked for now since backend endpoint might be missing)
      setContacts((prev) => prev.map(c => 
        c.id === editingContact.id 
          ? { ...c, name: newName, relationship: newRel || "Friend", phone: newPhone } 
          : c
      ));
      closeModal();
      return;
    }

    try {
      const created = await createEmergencyContact({
        name: newName,
        relationship: newRel || "Friend",
        phone: newPhone,
      });
      setContacts((prev) => [created, ...prev]);
      closeModal();
    } catch {
      const initials = newName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "NA";
      const newContact: EmergencyContact = {
        id: Math.random().toString(36).slice(2, 9),
        name: newName,
        relationship: newRel || "Friend",
        phone: newPhone,
        verified: false,
        avatarInitials: initials,
      };
      setContacts((prev) => [newContact, ...prev]);
      closeModal();
    }
  };

  const closeModal = () => {
    setIsAddOpen(false);
    setEditingContact(null);
    setNewName("");
    setNewRel("");
    setNewPhone("");
  };

  const deleteContact = async (id: string) => {
    try {
      await deleteEmergencyContact(id);
    } catch {
      // Fall back to local UI update if the API is unavailable.
    }
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Emergency Contacts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage who gets notified in an emergency. Drag to reorder priority.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card/70 p-6 text-sm text-muted-foreground">
          Loading contacts from the API layer...
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-24 px-4 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-1 text-lg font-semibold">No contacts added</h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            Add your trusted contacts so they can be notified instantly in case of an emergency.
          </p>
          <Button onClick={() => setIsAddOpen(true)} className="rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add First Contact
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          {/* Desktop Table Header */}
          <div className="hidden grid-cols-[auto_1fr_1fr_1fr_auto_auto] items-center gap-4 border-b border-border bg-muted/40 px-6 py-3 text-sm font-medium text-muted-foreground lg:grid">
            <div className="w-8"></div>
            <div>Contact</div>
            <div>Relationship</div>
            <div>Phone Number</div>
            <div>Status</div>
            <div className="w-10"></div>
          </div>
          
          <Reorder.Group axis="y" values={contacts} onReorder={setContacts} className="divide-y divide-border/50">
            <AnimatePresence initial={false}>
              {contacts.map((contact, index) => {
                if (!contact) return null;
                return (
                <Reorder.Item
                  key={contact.id}
                  value={contact}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative cursor-grab bg-card active:cursor-grabbing hover:bg-muted/20"
                >
                  <div className="grid items-center gap-4 p-4 lg:grid-cols-[auto_1fr_1fr_1fr_auto_auto] lg:px-6">
                    {/* Drag Handle & Priority */}
                    <div className="hidden lg:flex items-center gap-2 w-8">
                      <GripVertical className="h-4 w-4 text-muted-foreground/50 hover:text-foreground" />
                      <span className="text-xs font-medium text-muted-foreground/50">{index + 1}</span>
                    </div>

                    {/* Mobile Header: Handle & Actions (visible on mobile only) */}
                    <div className="flex items-center justify-between lg:hidden mb-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                        Priority {index + 1}
                      </div>
                      <ContactActions contact={contact} onShare={() => shareContact(contact)} onEdit={() => startEditContact(contact)} onDelete={() => deleteContact(contact.id)} />
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary shadow-inner">
                        {contact.avatarInitials}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{contact.name}</p>
                        {contact.email && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3" /> {contact.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Relationship */}
                    <div className="text-sm">
                      <span className="lg:hidden text-xs text-muted-foreground mr-2">Relation:</span>
                      {contact.relationship}
                    </div>

                    {/* Phone */}
                    <div className="text-sm font-medium">
                      <span className="lg:hidden text-xs text-muted-foreground font-normal mr-2">Phone:</span>
                      {contact.phone}
                    </div>

                    {/* Status */}
                    <div>
                      {contact.verified ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 border-orange-500/30 text-orange-600 bg-orange-500/10">
                          <AlertCircle className="h-3 w-3" /> Pending
                        </Badge>
                      )}
                    </div>

                    {/* Actions (Desktop) */}
                    <div className="hidden lg:block">
                      <ContactActions contact={contact} onShare={() => shareContact(contact)} onEdit={() => startEditContact(contact)} onDelete={() => deleteContact(contact.id)} />
                    </div>
                  </div>
                </Reorder.Item>
              )})}
            </AnimatePresence>
          </Reorder.Group>
        </div>
      )}

      {/* Add/Edit Contact Modal */}
      <Dialog open={isAddOpen} onClose={closeModal}>
        <h3 className="mb-1 text-xl font-bold tracking-tight">
          {editingContact ? "Edit Emergency Contact" : "Add Emergency Contact"}
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          {editingContact 
            ? "Update the details for this emergency contact." 
            : "This person will be notified automatically in an emergency."}
        </p>
        
        <form onSubmit={handleAddContact} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Full Name</label>
            <Input required value={newName} onChange={e => setNewName(e.target.value)} placeholder="Jane Doe" className="rounded-xl" />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Relationship</label>
              <Input value={newRel} onChange={e => setNewRel(e.target.value)} placeholder="Spouse, Sibling, etc." className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone Number</label>
              <Input required type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="rounded-xl" />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-2 pt-2 border-t border-border/50">
            <Button type="button" variant="outline" onClick={closeModal} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl">
              {editingContact ? "Save Changes" : "Add Contact"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

function ContactActions({ contact, onShare, onEdit, onDelete }: { contact: EmergencyContact, onShare: () => void, onEdit: () => void, onDelete: () => void }) {
  return (
    <DropdownMenu
      trigger={
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      }
    >
      <DropdownMenuItem onClick={onShare} className="gap-2 cursor-pointer rounded-lg">
        <Share2 className="h-4 w-4" /> Share Profile
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onEdit} className="gap-2 cursor-pointer rounded-lg">
        <Pencil className="h-4 w-4" /> Edit
      </DropdownMenuItem>
      <div className="h-px bg-border my-1" />
      <DropdownMenuItem onClick={onDelete} destructive className="gap-2 cursor-pointer rounded-lg">
        <Trash2 className="h-4 w-4" /> Delete
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
