import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const familyMembers = [
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

export async function GET() {
  return NextResponse.json(familyMembers);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const newMember = {
    id: `${familyMembers.length + 1}`,
    name: payload.name ?? "New Family Member",
    relationship: payload.relationship ?? "Relative",
    photo: "NM",
    medicalSummary: "No medical summary provided",
    accessStatus: payload.accessStatus ?? "Emergency Only",
    lastUpdated: "Just now",
  };

  familyMembers.push(newMember as never);
  return NextResponse.json(newMember, { status: 201 });
}
