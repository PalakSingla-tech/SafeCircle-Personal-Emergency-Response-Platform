import { NextRequest, NextResponse } from "next/server";

let draft = {};

export async function POST(request: NextRequest) {
  draft = await request.json();
  return NextResponse.json(draft);
}
