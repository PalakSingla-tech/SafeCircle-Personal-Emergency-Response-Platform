import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let profile = {
  fullName: "Sarah Jenkins",
  email: "sarah.jenkins@email.com",
  phone: "+1 (555) 234-5678",
};

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  profile = { ...profile, ...payload };
  return NextResponse.json(profile);
}
