"use client";
import { useEffect, useState } from "react";
import {
  User,
  HeartPulse,
  AlertTriangle,
  Shield,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  Loader2,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  type MedicalProfileData,
  STEPS,
  BLOOD_GROUPS,
  GENDERS,
  loadProfile,
  saveProfile,
  saveDraft,
  calculateCompletion,
  getStepCompletion,
  emptyProfile,
} from "@/lib/medical-profile";
import {
  ProfileField,
  ProfileInput,
  ProfileTextarea,
  ProfileSelect,
  ProfileSectionCard,
} from "./profile-fields";

const stepIcons = [User, HeartPulse, AlertTriangle, Shield, Stethoscope];

type Errors = Partial<Record<keyof MedicalProfileData, string>>;

function validateStep(step: number, data: MedicalProfileData): Errors {
  const errors: Errors = {};
  if (step === 0) {
    if (!String(data.fullName || "").trim()) errors.fullName = "Full name is required";
    if (!data.dob) errors.dob = "Date of birth is required";
    if (!data.gender) errors.gender = "Please select a gender";
    if (!data.bloodGroup) errors.bloodGroup = "Blood group is required";
  }
  if (step === 1) {
    if (!String(data.allergies || "").trim()) errors.allergies = "List allergies or enter None";
  }
  if (step === 2) {
    if (!String(data.emergencyNotes || "").trim()) errors.emergencyNotes = "Emergency notes are required";
  }
  return errors;
}

export function MedicalProfileWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<MedicalProfileData>(emptyProfile);

  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    setData(loadProfile());
  }, []);

  const completion = calculateCompletion(data);

  useEffect(() => {
    saveDraft(data);
    setDraftSaved(true);
    const t = setTimeout(() => setDraftSaved(false), 2000);
    return () => clearTimeout(t);
  }, [data]);

  const update = (key: keyof MedicalProfileData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setUpdated(false);
  };

  const goNext = () => {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      saveDraft(data);
      setSaving(false);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2500);
    }, 400);
  };

  const handleUpdate = () => {
    const allErrors: Errors = {};
    for (let i = 0; i < STEPS.length; i++) {
      Object.assign(allErrors, validateStep(i, data));
    }
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstStepWithError = [0, 1, 2].find((s) => {
        const e = validateStep(s, data);
        return Object.keys(e).length > 0;
      });
      if (firstStepWithError !== undefined) setStep(firstStepWithError);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      saveProfile(data);
      setSaving(false);
      setUpdated(true);
      setSaved(true);
    }, 600);
  };

  const StepIcon = stepIcons[step];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/8 via-card to-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="secondary" className="mb-2">Medical Profile</Badge>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Complete your emergency profile
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              This information is shared with first responders via your QR card.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {draftSaved ? (
                <>
                  <Cloud className="h-4 w-4 text-primary" />
                  <span className="text-primary">Draft autosaved</span>
                </>
              ) : (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin opacity-50" />
                  <span>Autosave enabled</span>
                </>
              )}
            </div>
            <div className="text-right">
              <span className="font-display text-3xl font-bold text-primary">{completion}%</span>
              <p className="text-xs text-muted-foreground">Profile complete</p>
            </div>
          </div>
        </div>
        <Progress value={completion} className="mt-4 h-2" />
      </div>

      {/* Step indicators */}
      <div className="flex gap-1 overflow-x-auto pb-1 sm:gap-2">
        {STEPS.map((s, i) => {
          const Icon = stepIcons[i];
          const stepDone = getStepCompletion(data, i) === 100;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                "flex min-w-[7rem] flex-1 flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-all sm:min-w-0",
                step === i
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-primary/30",
                stepDone && step !== i && "border-green-500/30 bg-green-500/5"
              )}
            >
              <Icon className={cn("h-4 w-4", step === i ? "text-primary" : "text-muted-foreground")} />
              <span className="text-[11px] font-medium leading-tight sm:text-xs">{s.short}</span>
              <span className="text-[10px] text-muted-foreground">{getStepCompletion(data, i)}%</span>
            </button>
          );
        })}
      </div>

      {/* Form steps — plain div, no framer-motion to avoid opacity:0 stuck state */}
      <div key={step}>
        {step === 0 && (
          <ProfileSectionCard title="Personal Information" description="Basic details for your medical ID">
            <ProfileField label="Full Name" id="fullName" required error={errors.fullName}>
              <ProfileInput id="fullName" value={data.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Jane Doe" />
            </ProfileField>
            <ProfileField label="Date of Birth" id="dob" required error={errors.dob}>
              <ProfileInput id="dob" type="date" value={data.dob} onChange={(e) => update("dob", e.target.value)} />
            </ProfileField>
            <ProfileField label="Gender" id="gender" required error={errors.gender}>
              <ProfileSelect id="gender" value={data.gender} onChange={(e) => update("gender", e.target.value)}>
                <option value="">Select gender</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </ProfileSelect>
            </ProfileField>
            <ProfileField label="Blood Group" id="bloodGroup" required error={errors.bloodGroup}>
              <ProfileSelect id="bloodGroup" value={data.bloodGroup} onChange={(e) => update("bloodGroup", e.target.value)}>
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
              </ProfileSelect>
            </ProfileField>
            <ProfileField label="Height" id="height" hint="e.g. 5'8&quot; or 173 cm">
              <ProfileInput id="height" value={data.height} onChange={(e) => update("height", e.target.value)} placeholder="173 cm" />
            </ProfileField>
            <ProfileField label="Weight" id="weight" hint="e.g. 150 lbs or 68 kg">
              <ProfileInput id="weight" value={data.weight} onChange={(e) => update("weight", e.target.value)} placeholder="68 kg" />
            </ProfileField>
          </ProfileSectionCard>
        )}

        {step === 1 && (
          <ProfileSectionCard title="Medical Information" description="Critical health details for emergencies">
            <div className="sm:col-span-2">
              <ProfileField label="Medical Conditions" id="medicalConditions" hint="Separate with commas">
                <ProfileTextarea id="medicalConditions" value={data.medicalConditions} onChange={(e) => update("medicalConditions", e.target.value)} placeholder="Asthma, Type 2 Diabetes..." />
              </ProfileField>
            </div>
            <div className="sm:col-span-2">
              <ProfileField label="Current Medications" id="currentMedications">
                <ProfileTextarea id="currentMedications" value={data.currentMedications} onChange={(e) => update("currentMedications", e.target.value)} placeholder="Metformin 500mg daily..." />
              </ProfileField>
            </div>
            <div className="sm:col-span-2">
              <ProfileField label="Allergies" id="allergies" required error={errors.allergies}>
                <ProfileTextarea id="allergies" value={data.allergies} onChange={(e) => update("allergies", e.target.value)} placeholder="Penicillin, Peanuts, Latex..." />
              </ProfileField>
            </div>
            <div className="sm:col-span-2">
              <ProfileField label="Past Surgeries" id="pastSurgeries">
                <ProfileTextarea id="pastSurgeries" value={data.pastSurgeries} onChange={(e) => update("pastSurgeries", e.target.value)} placeholder="Appendectomy 2019..." />
              </ProfileField>
            </div>
            <ProfileField label="Disabilities" id="disabilities">
              <ProfileInput id="disabilities" value={data.disabilities} onChange={(e) => update("disabilities", e.target.value)} placeholder="None or describe" />
            </ProfileField>
            <ProfileField label="Organ Donor" id="organDonor">
              <ProfileSelect id="organDonor" value={data.organDonor} onChange={(e) => update("organDonor", e.target.value)}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </ProfileSelect>
            </ProfileField>
          </ProfileSectionCard>
        )}

        {step === 2 && (
          <ProfileSectionCard title="Emergency Information" description="Notes for first responders">
            <div className="sm:col-span-2">
              <ProfileField label="Emergency Notes" id="emergencyNotes" required error={errors.emergencyNotes} hint="Include pacemaker, DNR status, or other critical info">
                <ProfileTextarea id="emergencyNotes" value={data.emergencyNotes} onChange={(e) => update("emergencyNotes", e.target.value)} placeholder="Carries EpiPen. Contact spouse first..." className="min-h-[140px]" />
              </ProfileField>
            </div>
          </ProfileSectionCard>
        )}

        {step === 3 && (
          <ProfileSectionCard title="Insurance" description="Health insurance details">
            <ProfileField label="Insurance Provider" id="insuranceProvider">
              <ProfileInput id="insuranceProvider" value={data.insuranceProvider} onChange={(e) => update("insuranceProvider", e.target.value)} placeholder="Blue Cross Blue Shield" />
            </ProfileField>
            <ProfileField label="Policy Number" id="policyNumber">
              <ProfileInput id="policyNumber" value={data.policyNumber} onChange={(e) => update("policyNumber", e.target.value)} placeholder="XYZ123456789" />
            </ProfileField>
          </ProfileSectionCard>
        )}

        {step === 4 && (
          <ProfileSectionCard title="Doctor Information" description="Your primary care details">
            <ProfileField label="Primary Doctor" id="primaryDoctor">
              <ProfileInput id="primaryDoctor" value={data.primaryDoctor} onChange={(e) => update("primaryDoctor", e.target.value)} placeholder="Dr. Emily Chen" />
            </ProfileField>
            <ProfileField label="Hospital Preference" id="hospitalPreference">
              <ProfileInput id="hospitalPreference" value={data.hospitalPreference} onChange={(e) => update("hospitalPreference", e.target.value)} placeholder="City General Hospital" />
            </ProfileField>
          </ProfileSectionCard>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <StepIcon className="h-4 w-4 text-primary" />
          Step {step + 1} of {STEPS.length}: {STEPS[step]?.title}
        </div>
        <div className="flex flex-wrap gap-2">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={goPrev} className="rounded-xl">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          )}
          <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={saving} className="rounded-xl">
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={goNext} className="rounded-xl">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleUpdate} disabled={saving} className="rounded-xl">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Update Profile
            </Button>
          )}
        </div>
      </div>

      {updated && saved && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          Profile updated successfully! Your QR card will reflect these changes.
        </div>
      )}
    </div>
  );
}
