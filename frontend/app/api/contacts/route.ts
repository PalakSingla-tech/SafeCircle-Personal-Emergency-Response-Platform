import { NextRequest, NextResponse } from "next/server";

const contacts = [
  {
    id: "1",
    name: "David Jenkins",
    relationship: "Spouse",
    phone: "+1 (555) 123-4567",
    email: "david@example.com",
    verified: true,
    avatarInitials: "DJ",
  },
  {
    id: "2",
    name: "Emily Chen",
    relationship: "Doctor",
    phone: "+1 (555) 987-6543",
    verified: true,
    avatarInitials: "EC",
  },
  {
    id: "3",
    name: "Sarah Miller",
    relationship: "Sister",
    phone: "+1 (555) 456-7890",
    verified: false,
    avatarInitials: "SM",
  },
];

export async function GET() {
  return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const initials = String(payload.name || "")
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "NA";

  const contact = {
    id: `contact-${Date.now()}`,
    name: payload.name,
    relationship: payload.relationship || "Friend",
    phone: payload.phone,
    email: payload.email,
    verified: false,
    avatarInitials: initials,
  };

  contacts.unshift(contact);
  return NextResponse.json(contact, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const index = contacts.findIndex((contact) => contact.id === id);

  if (index >= 0) {
    contacts.splice(index, 1);
  }

  return NextResponse.json({ success: true });
}
