import { NextRequest, NextResponse } from "next/server";
import { locationState } from "./state";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(locationState);
}

export async function POST(request: NextRequest) {
  const nextState = await request.json();
  Object.assign(locationState, nextState);
  return NextResponse.json(locationState, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const nextState = await request.json();
  Object.assign(locationState, nextState);
  return NextResponse.json(locationState);
}
