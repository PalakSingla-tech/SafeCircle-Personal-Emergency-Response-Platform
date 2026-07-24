import { NextRequest, NextResponse } from "next/server";

let state = {
  profileId: "safe-circle-001",
  status: "active",
  lastUpdated: "Today",
  shareUrl: "https://safe-circle.app/scan/safe-circle-001",
};

export async function GET() {
  return NextResponse.json(state);
}

export async function PUT(request: NextRequest) {
  state = await request.json();
  return NextResponse.json(state);
}
