export interface MedicalProfileData {
  // Personal
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  height: string;
  weight: string;
  // Medical
  medicalConditions: string;
  currentMedications: string;
  allergies: string;
  pastSurgeries: string;
  disabilities: string;
  organDonor: string;
  // Emergency
  emergencyNotes: string;
  // Insurance
  insuranceProvider: string;
  policyNumber: string;
  // Doctor
  primaryDoctor: string;
  hospitalPreference: string;
}

export const emptyProfile: MedicalProfileData = {
  fullName: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  height: "",
  weight: "",
  medicalConditions: "",
  currentMedications: "",
  allergies: "",
  pastSurgeries: "",
  disabilities: "",
  organDonor: "no",
  emergencyNotes: "",
  insuranceProvider: "",
  policyNumber: "",
  primaryDoctor: "",
  hospitalPreference: "",
};

export const PROFILE_STORAGE_KEY = "safecircle_medical_profile";
export const PROFILE_DRAFT_KEY = "safecircle_medical_profile_draft";

export function loadProfile(): MedicalProfileData {
  if (typeof window === "undefined") return emptyProfile;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) return { ...emptyProfile, ...JSON.parse(raw) };
    const draft = localStorage.getItem(PROFILE_DRAFT_KEY);
    if (draft) return { ...emptyProfile, ...JSON.parse(draft) };
  } catch {
    /* ignore */
  }
  return emptyProfile;
}

export function saveProfile(data: MedicalProfileData) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
  localStorage.removeItem(PROFILE_DRAFT_KEY);
}

export function saveDraft(data: MedicalProfileData) {
  localStorage.setItem(PROFILE_DRAFT_KEY, JSON.stringify(data));
}

const fieldGroups: (keyof MedicalProfileData)[][] = [
  ["fullName", "dob", "gender", "bloodGroup", "height", "weight"],
  ["medicalConditions", "currentMedications", "allergies", "pastSurgeries", "disabilities", "organDonor"],
  ["emergencyNotes"],
  ["insuranceProvider", "policyNumber"],
  ["primaryDoctor", "hospitalPreference"],
];

export function calculateCompletion(data: MedicalProfileData): number {
  const allFields = fieldGroups.flat();
  const filled = allFields.filter((key) => {
    const val = data[key];
    return val !== undefined && val !== null && String(val).trim() !== "";
  });
  return Math.round((filled.length / allFields.length) * 100);
}

export function getStepCompletion(data: MedicalProfileData, stepIndex: number): number {
  const fields = fieldGroups[stepIndex] ?? [];
  const filled = fields.filter((key) => String(data[key] ?? "").trim() !== "");
  return fields.length ? Math.round((filled.length / fields.length) * 100) : 0;
}

export const STEPS = [
  { id: "personal", title: "Personal Information", short: "Personal" },
  { id: "medical", title: "Medical Information", short: "Medical" },
  { id: "emergency", title: "Emergency Information", short: "Emergency" },
  { id: "insurance", title: "Insurance", short: "Insurance" },
  { id: "doctor", title: "Doctor Information", short: "Doctor" },
] as const;

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];
