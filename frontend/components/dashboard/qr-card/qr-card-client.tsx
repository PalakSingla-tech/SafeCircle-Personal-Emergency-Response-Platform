"use client";
import { useEffect, useState } from "react";
import {
  Download,
  Printer,
  Share2,
  Link as LinkIcon,
  HeartPulse,
  User,
  AlertTriangle,
  RefreshCw,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQrCard, saveQrCard, type QrCardState } from "@/lib/api";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";

type CardDesign = "Wallet" | "Minimal" | "Dark" | "Hospital" | "Keychain" | "Sticker" | "Wallpaper" | "Watch" | "NFC";
const DESIGNS: CardDesign[] = ["Wallet", "Hospital", "Minimal", "Dark", "Keychain", "Sticker", "Wallpaper", "Watch", "NFC"];

export function QrCardClient() {
  const [design, setDesign] = useState<CardDesign>("Wallet");
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardState, setCardState] = useState<QrCardState>({
    profileId: "safe-circle-001",
    status: "active",
    lastUpdated: "Today",
    shareUrl: "https://safe-circle.app/scan/safe-circle-001",
  });

  useEffect(() => {
    const loadCard = async () => {
      try {
        const data = await getQrCard();
        setCardState(data);
      } catch {
        // Fall back to local placeholder state.
      }
    };

    loadCard();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const updated = await saveQrCard({ ...cardState, lastUpdated: "Just now", status: "active" });
      setCardState(updated);
    } catch {
      // Local placeholder state remains unchanged.
    }
    setTimeout(() => setIsGenerating(false), 1500);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Smart QR Card Designer
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate your emergency medical ID in multiple physical and digital formats.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={handleGenerate} disabled={isGenerating}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
            Regenerate QR
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Col: Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 font-display text-lg font-semibold">Form Factor</h3>
            <div className="grid grid-cols-2 gap-3">
              {DESIGNS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDesign(d)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all",
                    design === d
                      ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20"
                      : "border-border bg-muted/20 hover:border-primary/30"
                  )}
                >
                  <span className="text-sm font-medium">{d}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 font-display text-lg font-semibold">Export & Print</h3>
            <div className="flex flex-col gap-3">
              {design === 'Sticker' || design === 'Keychain' ? (
                <Button variant="default" className="w-full justify-start rounded-xl h-11 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Printer className="mr-3 h-4 w-4" /> Order Physical Prints
                </Button>
              ) : design === 'NFC' ? (
                <Button variant="default" className="w-full justify-start rounded-xl h-11 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <AlertTriangle className="mr-3 h-4 w-4" /> Order NFC Smart Card
                </Button>
              ) : null}
              <Button variant="outline" className="w-full justify-start rounded-xl h-11">
                <Download className="mr-3 h-4 w-4 text-primary" /> Download PNG (High Res)
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl h-11">
                <FileText className="mr-3 h-4 w-4 text-primary" /> Download A4 Print Sheet
              </Button>
            </div>
          </div>
        </div>

        {/* Right Col: Preview */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/10 p-6 sm:p-12 relative overflow-hidden min-h-[600px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-full max-h-md bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          <p className="mb-6 text-sm font-medium text-muted-foreground uppercase tracking-widest z-10">Live Preview</p>
          
          <div className="relative z-10 w-full flex items-center justify-center animate-in zoom-in-95 duration-300" key={design}>
            <EmergencyCard design={design} isGenerating={isGenerating} data={cardState} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmergencyCard({ design, isGenerating, data }: { design: CardDesign; isGenerating: boolean; data: QrCardState }) {
  const isDarkText = design === "Minimal" || design === "Hospital" || design === "Sticker" || design === "Watch";

  // Dynamic dimensions and classes based on design
  const getContainerClasses = () => {
    switch (design) {
      case "Minimal":
      case "NFC":
        return "aspect-[1.586/1] max-w-[400px] bg-white text-slate-900 border-slate-200 shadow-xl rounded-2xl p-5";
      case "Wallet":
        return "aspect-[1.586/1] max-w-[400px] bg-gradient-to-br from-indigo-900 via-indigo-700 to-violet-800 text-white shadow-indigo-500/30 shadow-2xl border-white/20 rounded-2xl p-5";
      case "Dark":
        return "aspect-[1.586/1] max-w-[400px] bg-slate-950 text-slate-100 border-slate-800 shadow-2xl rounded-2xl p-5";
      case "Hospital":
        return "aspect-[1.586/1] max-w-[400px] bg-white border-red-600 text-slate-900 shadow-xl border-t-[12px] rounded-2xl p-5";
      case "Keychain":
        return "aspect-[1/1.8] max-w-[180px] bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-xl rounded-2xl p-4 ring-8 ring-slate-200/50";
      case "Sticker":
        return "aspect-square max-w-[280px] bg-white border-4 border-red-500 shadow-lg rounded-full p-6 text-slate-900 justify-center items-center text-center";
      case "Wallpaper":
        return "aspect-[9/16] max-w-[280px] bg-slate-900 text-white shadow-2xl rounded-[3rem] p-6 border-8 border-slate-800";
      case "Watch":
        return "aspect-[4/5] max-w-[180px] bg-black text-white shadow-2xl rounded-[2.5rem] p-4 border-4 border-zinc-800";
    }
  };

  // Sticker Layout (Circular)
  if (design === "Sticker") {
    return (
      <div className={cn("relative flex flex-col items-center justify-between overflow-hidden transition-all duration-300", getContainerClasses())}>
        <div className="absolute inset-0 border-[12px] border-red-50 rounded-full" />
        <HeartPulse className="h-8 w-8 text-red-500 mb-2 relative z-10" />
        <h2 className="text-xl font-black uppercase tracking-tight relative z-10 leading-none mb-1">{data.name}</h2>
        <p className="text-xs font-bold text-red-600 relative z-10 mb-2">SCAN IN EMERGENCY</p>
        <div className="relative h-24 w-24 rounded-lg bg-white overflow-hidden flex items-center justify-center shadow-md p-1 z-10">
          {isGenerating ? <RefreshCw className="h-6 w-6 animate-spin text-primary" /> : <QRCode value={data.shareUrl} size={150} style={{ height: "auto", maxWidth: "100%", width: "100%" }} viewBox={`0 0 150 150`} />}
        </div>
        <p className="text-[10px] font-mono font-bold mt-2 relative z-10 text-slate-500">ID: {data.id}</p>
      </div>
    );
  }

  // Watch Layout (Ultra small)
  if (design === "Watch") {
    return (
      <div className={cn("relative flex flex-col items-center justify-between overflow-hidden transition-all duration-300", getContainerClasses())}>
        <div className="w-full text-center mb-1">
          <p className="text-[10px] font-bold text-red-500 uppercase">Emergency ID</p>
        </div>
        <div className="relative h-20 w-20 rounded-md bg-white overflow-hidden flex items-center justify-center p-1">
          {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin text-primary" /> : <QRCode value={data.shareUrl} size={150} style={{ height: "auto", maxWidth: "100%", width: "100%" }} viewBox={`0 0 150 150`} />}
        </div>
        <div className="w-full text-center mt-2">
          <p className="text-[10px] text-white font-bold">{data.bloodGroup}</p>
          <p className="text-[9px] text-zinc-500 truncate">{data.allergies}</p>
        </div>
      </div>
    );
  }

  // Keychain Layout (Tall and narrow)
  if (design === "Keychain") {
    return (
      <div className={cn("relative flex flex-col items-center justify-between overflow-hidden transition-all duration-300", getContainerClasses())}>
        {/* Keychain hole mock */}
        <div className="absolute -top-3 w-6 h-6 rounded-full bg-slate-200 border-4 border-slate-300" />
        
        <div className="w-full text-center mt-4">
          <HeartPulse className="h-5 w-5 text-red-300 mx-auto mb-1" />
          <h2 className="text-sm font-bold uppercase tracking-tight leading-tight">{data.name}</h2>
          <p className="text-[9px] text-blue-200 uppercase mt-0.5">Blood: {data.bloodGroup}</p>
        </div>

        <div className="relative h-24 w-24 rounded-lg bg-white overflow-hidden flex items-center justify-center p-1 shadow-inner my-3">
           {isGenerating ? <RefreshCw className="h-5 w-5 animate-spin text-primary" /> : <QRCode value={data.shareUrl} size={150} style={{ height: "auto", maxWidth: "100%", width: "100%" }} viewBox={`0 0 150 150`} />}
        </div>

        <div className="w-full text-center">
          <p className="text-[8px] font-bold uppercase text-blue-200 mb-0.5">Scan For File</p>
          <p className="text-[8px] font-mono text-white/50 truncate">ID: {data.profileId}</p>
        </div>
      </div>
    );
  }

  // Wallpaper Layout (Phone screen)
  if (design === "Wallpaper") {
    return (
      <div className={cn("relative flex flex-col items-center justify-between overflow-hidden transition-all duration-300", getContainerClasses())}>
        {/* Dynamic island mock */}
        <div className="absolute top-2 w-20 h-5 bg-black rounded-full" />
        
        <div className="w-full text-center mt-12 mb-auto">
          <p className="text-5xl font-extralight text-white/80 mb-2">09:41</p>
          <p className="text-xs text-white/50 font-medium">Monday, August 14</p>
        </div>

        <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-8 flex flex-col items-center text-center">
          <AlertTriangle className="h-6 w-6 text-red-500 mb-2" />
          <h2 className="text-lg font-bold uppercase tracking-widest text-white">{data.name}</h2>
          <p className="text-[10px] text-red-300 uppercase font-bold mt-1">ICE Contact: {data.contact}</p>
          <div className="relative h-32 w-32 rounded-xl bg-white overflow-hidden flex items-center justify-center p-1 mt-4">
            {isGenerating ? <RefreshCw className="h-6 w-6 animate-spin text-primary" /> : <QRCode value={data.shareUrl} size={150} style={{ height: "auto", maxWidth: "100%", width: "100%" }} viewBox={`0 0 150 150`} />}
          </div>
          <p className="text-[9px] font-bold uppercase tracking-widest mt-3 text-white/60">Scan in emergency</p>
        </div>
        
        {/* Mock lock screen toggles */}
        <div className="w-full flex justify-between px-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div className="w-10 h-10 rounded-full bg-white/10" />
        </div>
      </div>
    );
  }

  // Standard Card Layouts (Minimal, Wallet, Dark, Hospital, NFC)
  return (
    <div className={cn("relative flex flex-col justify-between overflow-hidden transition-all duration-300 w-full", getContainerClasses())}>
      {design === "Wallet" && (
        <>
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-black/20 blur-2xl" />
        </>
      )}
      
      <div className="relative flex items-start justify-between z-10">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl shadow-inner border", isDarkText ? "bg-slate-50 border-slate-200" : "bg-white/10 border-white/20 backdrop-blur-md")}>
            <User className={cn("h-7 w-7", isDarkText ? "text-slate-400" : "text-white/80")} />
          </div>
          <div className="flex flex-col">
            <h2 className={cn("text-xl font-bold tracking-tight uppercase leading-none", !isDarkText && "text-white")}>
              {data.name}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <p className={cn("text-xs font-medium uppercase tracking-wider", isDarkText ? "text-slate-500" : "text-white/70")}>
                DOB: {data.dob}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className={cn("flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg shadow-sm font-black text-lg border", design === "Hospital" ? "bg-red-600 text-white border-red-700" : isDarkText ? "bg-red-50 text-red-600 border-red-100" : "bg-white/20 text-white border-white/20 backdrop-blur-md")}>
            {data.bloodGroup}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex-1">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p className={cn("text-[8px] uppercase font-bold tracking-widest", isDarkText ? "text-slate-400" : "text-white/50")}>Allergies</p>
            <p className={cn("text-xs font-semibold leading-tight line-clamp-1", isDarkText ? "text-slate-700" : "text-white/90")}>{data.allergies}</p>
          </div>
          <div>
            <p className={cn("text-[8px] uppercase font-bold tracking-widest", isDarkText ? "text-slate-400" : "text-white/50")}>ICE Contact</p>
            <p className={cn("text-xs font-semibold leading-tight", isDarkText ? "text-slate-700" : "text-white/90")}>{data.contact}</p>
          </div>
        </div>
      </div>

      <div className="relative flex items-end justify-between z-10 mt-auto pt-4 border-t border-dashed" style={{ borderColor: isDarkText ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}}>
        <div className="space-y-3">
          <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest", design === "Hospital" ? "bg-red-100 text-red-700" : isDarkText ? "bg-amber-100 text-amber-700" : "bg-white/20 text-white backdrop-blur-md")}>
            <AlertTriangle className="h-3 w-3" />
            {design === "NFC" ? "Tap or Scan Card" : "Scan For Medical File"}
          </div>
          <div>
            <p className={cn("text-[8px] font-bold uppercase tracking-widest", isDarkText ? "text-slate-400" : "text-white/50")}>ID Number</p>
            <p className="font-mono text-sm font-bold tracking-wider">{data.id}</p>
          </div>
        </div>

        <div className={cn("rounded-xl p-2 shadow-sm border", isDarkText ? "bg-white border-slate-200" : "bg-white border-white/20")}>
          <div className="relative h-20 w-20 rounded-lg bg-white overflow-hidden flex items-center justify-center">
            {isGenerating ? <RefreshCw className="h-6 w-6 animate-spin text-primary" /> : <div className="w-full h-full p-1 border-2 border-slate-900 rounded-md bg-white"><QRCode value={data.shareUrl} size={150} style={{ height: "auto", maxWidth: "100%", width: "100%" }} viewBox={`0 0 150 150`} /></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
