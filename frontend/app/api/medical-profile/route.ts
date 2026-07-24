import { NextRequest, NextResponse } from "next/server";

let profile = {
  fullName: "Jane Doe",
  dob: "1990-05-14",
  gender: "Female",
  bloodGroup: "O+",
  height: "173 cm",
  weight: "68 kg",
  medicalConditions: "Asthma, Type 2 Diabetes",
  currentMedications: "Metformin 500mg daily",
  allergies: "Penicillin, Peanuts",
  pastSurgeries: "Appendectomy 2019",
  disabilities: "None",
  organDonor: "yes",
  emergencyNotes: "Carries EpiPen. Contact spouse first.",
  insuranceProvider: "Blue Cross Blue Shield",
  policyNumber: "XYZ123456789",
  primaryDoctor: "Dr. Emily Chen",
  hospitalPreference: "City General Hospital",
};

export async function GET() {
  return NextResponse.json(profile);
}

export async function POST(request: NextRequest) {
  profile = await request.json();
  return NextResponse.json(profile);
}
