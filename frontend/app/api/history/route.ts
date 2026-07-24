import { NextResponse } from "next/server";

const history = [
  {
    id: "EV-2026-89",
    date: "Jul 18, 2026",
    time: "14:32 PM",
    location: "Metro Station, Downtown",
    responder: "Paramedic Unit #42",
    hospital: "City General Hospital",
    type: "Allergic Reaction",
    status: "Resolved",
  },
  {
    id: "EV-2025-42",
    date: "Nov 03, 2025",
    time: "09:15 AM",
    location: "Central Park, West Gate",
    responder: "Public Good Samaritan",
    hospital: "N/A - Treated on site",
    type: "Asthma Attack",
    status: "Resolved",
  },
  {
    id: "EV-2024-12",
    date: "Feb 22, 2024",
    time: "18:45 PM",
    location: "State Highway 14, Mile 22",
    responder: "Highway Patrol & EMS",
    hospital: "County Medical Center",
    type: "Traffic Accident",
    status: "Archived",
  },
];

export async function GET() {
  return NextResponse.json(history);
}
