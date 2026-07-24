import { NextRequest, NextResponse } from "next/server";
import { locationState } from "../state";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return NextResponse.json({
    ...locationState,
    userId,
  });
}
