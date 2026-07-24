import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let state = {
  enabled: true,
  sharingWith: ["Family", "Emergency Contacts"],
  lastUpdated: "Just now",
  currentLocation: "Downtown, Seattle",
};

export async function GET() {
  return NextResponse.json(state);
}

export async function POST(request: NextRequest) {
  state = await request.json();
  return NextResponse.json(state, { status: 201 });
}

export async function PUT(request: NextRequest) {
  state = await request.json();
  return NextResponse.json(state);
}
