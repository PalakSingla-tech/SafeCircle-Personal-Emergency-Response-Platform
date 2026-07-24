import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json({
    success: true,
    message: "Password updated successfully",
    currentPasswordProvided: Boolean(payload.currentPassword),
    newPasswordLength: payload.newPassword?.length ?? 0,
  });
}
