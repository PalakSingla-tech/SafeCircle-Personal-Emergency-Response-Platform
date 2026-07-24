import { NextResponse } from "next/server";

const notifications = [
  {
    id: "notif-1",
    title: "Ambulance Dispatched",
    description: "Paramedic Unit #42 is en route to Robert Jenkins.",
    time: "2 mins ago",
    read: false,
    type: "critical",
    icon: "Ambulance",
  },
  {
    id: "notif-2",
    title: "Hospital Viewed Profile",
    description: "City General Hospital has accessed the medical file for Robert Jenkins.",
    time: "5 mins ago",
    read: false,
    type: "info",
    icon: "Building2",
  },
  {
    id: "notif-3",
    title: "Emergency Contact Accepted",
    description: "Mary Miller has accepted the emergency alert.",
    time: "10 mins ago",
    read: false,
    type: "success",
    icon: "UserCheck",
  },
  {
    id: "notif-4",
    title: "Emergency Activated",
    description: "An emergency session was initiated for Robert Jenkins.",
    time: "12 mins ago",
    read: true,
    type: "critical",
    icon: "AlertTriangle",
  },
];

export async function GET() {
  return NextResponse.json(notifications);
}

export async function PATCH() {
  notifications.forEach((notification) => {
    notification.read = true;
  });

  return NextResponse.json(notifications);
}
