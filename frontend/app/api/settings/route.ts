import { NextRequest, NextResponse } from "next/server";

let settings = {
  notificationsEnabled: true,
  locationSharingEnabled: true,
  darkMode: false,
  emergencyAutoShare: true,
};

export async function GET() {
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  settings = await request.json();
  return NextResponse.json(settings);
}
