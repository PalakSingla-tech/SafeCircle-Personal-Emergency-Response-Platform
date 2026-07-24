"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  PhoneCall,
  Ambulance,
  MapPin,
  HeartPulse,
  Activity,
  Syringe,
  Pill,
  Info,
  ShieldAlert,
  BellRing,
  HeartHandshake,
  CheckCircle2,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPublicScanData, notifyEmergency, type PublicScanData } from "@/lib/api";

const MOCK_DATA = {
  name: "Sarah Jenkins",
  age: 41,
  bloodGroup: "O+",
  avatarInitials: "SJ",
  medicalConditions: ["Type 2 Diabetes", "Asthma", "Hypertension"],
  currentMedications: ["Metformin 500mg daily", "Albuterol Inhaler as needed", "Lisinopril 10mg"],
  allergies: ["Penicillin", "Peanuts", "Latex"],
  emergencyNotes: "Carries EpiPen in left pocket. Pacemaker implanted in 2021. Do NOT administer NSAIDs.",
  doctorInfo: "Dr. Emily Chen - +1 (555) 987-6543",
  primaryHospital: "City General Hospital",
  contacts: [
    { name: "David Jenkins", relationship: "Spouse", phone: "+1 (555) 123-4567", primary: true },
    { name: "Mary Miller", relationship: "Sister", phone: "+1 (555) 456-7890", primary: false }
  ]
};

export default function EmergencyScanPage({ params }: { params: { id: string } }) {
  const [wizardStep, setWizardStep] = useState<number>(0);
  // 0 = Not started (Viewing Data)
  // 1 = Need Help? (Assess)
  // 2 = Notify Family & Share Location
  // 3 = Call Ambulance & Hospital Nav

  const [scanData, setScanData] = useState<PublicScanData>(MOCK_DATA as any);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getPublicScanData(params.id)
      .then((data) => {
        if (isMounted) {
          setScanData(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          // Fallback to mock data if error
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  const handleStartAssist = () => setWizardStep(1);

  const handleNotifyAndShare = async () => {
    try {
      await notifyEmergency(params.id, "Responder's Location");
    } catch {
      console.error("Failed to notify emergency");
    }
    setWizardStep(3);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><AlertTriangle className="h-8 w-8 animate-bounce text-red-500" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-40 selection:bg-red-500/30">
      {/* Top Emergency Banner */}
      <div className="bg-red-600 text-white p-4 shadow-md sticky top-0 z-50 flex items-center justify-center gap-2">
        <AlertTriangle className="h-6 w-6 animate-pulse" />
        <h1 className="text-xl font-black tracking-widest uppercase">Emergency Information</h1>
      </div>

      <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Profile Header */}
        <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-red-500 via-red-600 to-red-500" />
          
          <div className="flex h-24 w-24 sm:h-32 sm:w-32 shrink-0 items-center justify-center rounded-full bg-slate-100 border-4 border-white shadow-lg text-4xl sm:text-5xl font-black text-slate-400">
            {scanData.avatarInitials}
          </div>
          
          <div className="flex-1 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{scanData.name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Badge variant="outline" className="text-lg px-4 py-1 rounded-full border-slate-200">
                Age: {scanData.age}
              </Badge>
              <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1 rounded-full font-bold text-lg shadow-sm">
                <HeartPulse className="h-5 w-5" />
                Blood: {scanData.bloodGroup}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Notes - High Priority */}
        <div className="rounded-3xl bg-amber-50 p-6 shadow-md border border-amber-200">
          <div className="flex items-center gap-2 mb-3 text-amber-800">
            <ShieldAlert className="h-6 w-6" />
            <h3 className="text-xl font-bold uppercase tracking-wide">Critical Emergency Notes</h3>
          </div>
          <p className="text-amber-950 font-medium text-lg leading-relaxed bg-white/50 p-4 rounded-2xl border border-amber-100">
            {scanData.emergencyNotes}
          </p>
        </div>

        {wizardStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              {/* Medical Conditions */}
              <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-blue-600">
                  <Activity className="h-6 w-6" />
                  <h3 className="text-xl font-bold">Medical Conditions</h3>
                </div>
                <ul className="space-y-3">
                  {scanData.medicalConditions.map((cond, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg font-medium text-slate-700">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                      {cond}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Known Allergies */}
              <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-red-500">
                  <Syringe className="h-6 w-6" />
                  <h3 className="text-xl font-bold">Known Allergies</h3>
                </div>
                <ul className="space-y-3">
                  {scanData.allergies.map((allergy, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg font-medium text-slate-700">
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-2.5 shrink-0" />
                      {allergy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Medications */}
            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-100 mb-6">
              <div className="flex items-center gap-2 mb-4 text-emerald-600">
                <Pill className="h-6 w-6" />
                <h3 className="text-xl font-bold">Current Medications</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {scanData.currentMedications.map((med, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium text-slate-700">
                    {med}
                  </div>
                ))}
              </div>
            </div>

            {/* Contacts & Facilities */}
            <div className="rounded-3xl bg-slate-900 p-6 shadow-xl text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Info className="h-6 w-6 text-blue-400" />
                Medical Contacts & Facilities
              </h3>
              
              <div className="space-y-6">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Primary Doctor</p>
                  <p className="text-lg font-semibold">{scanData.doctorInfo}</p>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Preferred Hospital</p>
                  <p className="text-lg font-semibold">{scanData.primaryHospital}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-3">Emergency Contacts</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {scanData.contacts.map((contact, i) => (
                      <div key={i} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-bold text-lg">{contact.name}</p>
                            {contact.primary && <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">Primary</Badge>}
                          </div>
                          <p className="text-slate-400">{contact.relationship}</p>
                        </div>
                        <a href={`tel:${contact.phone}`} className="mt-4 flex items-center justify-center gap-2 bg-white text-slate-900 py-2 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                          <PhoneCall className="h-4 w-4" />
                          Call {contact.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Need Help */}
        {wizardStep === 1 && (
          <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-200 text-center animate-in zoom-in-95 duration-500">
            <div className="mx-auto w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <HeartHandshake className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Are you helping this person?</h2>
            <p className="text-lg text-slate-600 mb-8">
              We will guide you through the next steps to ensure they get the care they need quickly and safely.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button size="lg" variant="outline" className="h-14 rounded-2xl text-lg font-bold" onClick={() => setWizardStep(0)}>
                Go Back to Profile
              </Button>
              <Button size="lg" className="h-14 rounded-2xl text-lg font-bold text-white bg-blue-600 hover:bg-blue-700" onClick={() => setWizardStep(2)}>
                Yes, Start Assistance
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Notify Family & Share Location */}
        {wizardStep === 2 && (
          <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-200 text-center animate-in slide-in-from-right-8 duration-500">
            <div className="mx-auto w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <BellRing className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Notify Family & Share Location</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
              We are about to alert {scanData.name}'s emergency contacts and share your current location with them so they can track the rescue.
            </p>
            <Button size="lg" className="w-full h-16 rounded-2xl text-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 mb-4" onClick={handleNotifyAndShare}>
              <MapPin className="mr-2 h-6 w-6" />
              Share Location & Notify
            </Button>
            <Button variant="ghost" className="text-slate-500" onClick={() => setWizardStep(1)}>
              Wait, go back
            </Button>
          </div>
        )}

        {/* Step 3: Call Ambulance & Hospital Nav */}
        {wizardStep === 3 && (
          <div className="rounded-3xl bg-red-50 p-8 shadow-xl border border-red-200 text-center animate-in slide-in-from-right-8 duration-500">
             <div className="mx-auto w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-black text-red-900 mb-2">Family Notified!</h2>
            <p className="text-lg text-red-800/80 mb-8">
              Location shared successfully. What's the next step?
            </p>
            <div className="space-y-4">
              <a href="tel:911" className="block w-full">
                <Button size="lg" className="w-full h-16 rounded-2xl text-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 animate-pulse">
                  <Ambulance className="mr-2 h-6 w-6" />
                  Call Ambulance (911)
                </Button>
              </a>
              <Button variant="outline" size="lg" className="w-full h-16 rounded-2xl text-xl font-bold text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100">
                <Navigation className="mr-2 h-6 w-6" />
                Navigate to Nearest Hospital
              </Button>
              <Link href="/emergency-active" className="block w-full pt-4">
                <Button variant="ghost" className="text-red-700 font-bold underline">
                  View Live Tracking Session
                </Button>
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Sticky Action Bar - Changes based on step */}
      {wizardStep === 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom-full">
          <div className="mx-auto max-w-3xl flex flex-col sm:flex-row gap-3">
            <button type="button" className="w-full flex items-center justify-center h-16 text-lg font-black bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-600/20 transition-all cursor-pointer" onClick={() => setWizardStep(1)}>
              <HeartHandshake className="mr-3 h-7 w-7" />
              I am helping this person
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
