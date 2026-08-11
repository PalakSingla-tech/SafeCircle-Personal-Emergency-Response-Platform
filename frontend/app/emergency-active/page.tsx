"use client";
import { useState, useEffect, Suspense } from "react";

import {
  AlertTriangle,
  MapPin,
  Users,
  Building2,
  PhoneCall,
  Activity,
  XCircle,
  Info,
  Share2,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saveLocationSharing, getLocationByAlertId, getTimeline, type LocationShareState, type TimelineEvent } from "@/lib/api";
import { useSearchParams } from "next/navigation";

const TIMELINE_STEPS = [
  { id: "qr_scanned", label: "QR Scanned", time: "09:42 AM", icon: Activity },
  { id: "location", label: "Location Shared", time: "09:43 AM", icon: MapPin },
  { id: "contact_accepted", label: "Emergency Contact Accepted", time: "09:44 AM", icon: Users },
  { id: "hospital_assigned", label: "Hospital Assigned", time: "09:46 AM", icon: Building2 },
  { id: "ambulance", label: "Ambulance En Route", time: "09:50 AM", icon: PhoneCall },
];

function EmergencyActiveContent() {
  const [countdown, setCountdown] = useState(180); // 3 minutes countdown for example
  const [activeStep, setActiveStep] = useState(0);
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const searchParams = useSearchParams();
  const alertId = searchParams.get("id");
  const [liveLocation, setLiveLocation] = useState<LocationShareState | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (!alertId) return;
    const fetchTimeline = async () => {
      try {
        const events = await getTimeline(alertId);
        if (events) setTimelineEvents(events);
      } catch (err) {
        console.error("Failed to fetch timeline", err);
      }
    };
    fetchTimeline();
    const pollTimer = setInterval(fetchTimeline, 5000);
    return () => clearInterval(pollTimer);
  }, [alertId]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await saveLocationSharing({
              enabled: true,
              sharingWith: [],
              lastUpdated: new Date().toISOString(),
              currentLocation: `${latitude},${longitude}`,
              latitude,
              longitude,
              ...(alertId && { alertId: Number(alertId) })
            } as any);
          } catch (error) {
            console.error("Failed to update location", error);
          }
        },
        (error) => console.error("Error getting location", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [alertId]);

  useEffect(() => {
    if (!alertId) return;
    const fetchLocation = async () => {
      try {
        const loc = await getLocationByAlertId(alertId);
        if (loc) setLiveLocation(loc);
      } catch (err) {
        console.error("Failed to fetch live location", err);
      }
    };
    fetchLocation();
    const pollTimer = setInterval(fetchLocation, 5000);
    return () => clearInterval(pollTimer);
  }, [alertId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (isStopped) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-50 font-sans p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="mx-auto w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">Emergency Stopped</h2>
          <p className="text-slate-400">
            The emergency broadcast has been successfully stopped. Your family and emergency contacts have been notified that you are safe.
          </p>
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="w-full h-12 rounded-xl text-slate-300 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-red-500/30">
      {/* Top Red Emergency Banner */}
      <div className="bg-red-600 text-white p-4 sm:p-6 shadow-[0_0_40px_rgba(220,38,38,0.4)] relative overflow-hidden flex items-center justify-center gap-3 z-50 animate-in slide-in-from-top-full duration-500">
        <div className="animate-pulse">
          <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-widest uppercase text-center">
          Emergency Activated
        </h1>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8 relative">
        
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-20">
          <div className="w-64 h-64 bg-red-600 rounded-full blur-3xl absolute animate-[ping_2s_ease-out_infinite]" />
          <div className="w-64 h-64 bg-red-600 rounded-full blur-3xl absolute animate-[ping_2s_ease-out_infinite_0.5s]" />
        </div>

        {/* Live Countdown & Status Cards */}
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-slate-900/80 backdrop-blur-md border border-red-500/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg animate-in zoom-in-95 duration-500">
            <Clock className="h-6 w-6 text-red-500 mb-2" />
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Time Elapsed
            </span>
            <span className="text-4xl sm:text-5xl font-mono font-black text-white">
              {formatTime(180 - countdown)}
            </span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-lg animate-in zoom-in-95 duration-500 delay-100 fill-mode-both">
            <MapPin className="h-6 w-6 text-blue-500 mb-2" />
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Location Status
            </span>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-sm px-3 py-1">
              Broadcasting Live
            </Badge>
          </div>
        </div>

        {/* Responder & Status Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 relative z-10 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200 fill-mode-both">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Live ETA</span>
            <span className="text-2xl font-bold text-amber-500">4 Min</span>
            <span className="text-xs text-slate-400 mt-1">Paramedic Unit #42</span>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Status</span>
            <span className="text-lg font-bold text-emerald-400 leading-tight">Ambulance Arriving</span>
          </div>
          <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-2xl p-4 flex items-center gap-4 sm:col-span-2">
            <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-50">City General</p>
              <p className="text-sm text-emerald-500/80 font-medium uppercase tracking-wider">Hospital Receiving Live Data</p>
            </div>
          </div>
        </div>

        {/* Live Map Area */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden relative z-10 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
          <div className="h-48 sm:h-64 bg-slate-800 relative w-full flex items-center justify-center">
            {/* Map Placeholder */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {liveLocation?.latitude && liveLocation?.longitude ? (
              <div className="absolute z-10 flex flex-col items-center animate-bounce">
                <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="mt-2 bg-slate-900 text-xs px-2 py-1 rounded border border-slate-700">
                  {liveLocation.latitude.toFixed(4)}, {liveLocation.longitude.toFixed(4)}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 font-medium z-10 flex flex-col items-center">
                <MapPin className="h-8 w-8 mb-2 opacity-50" />
                Waiting for GPS Signal...
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-900 flex justify-between items-center text-sm border-t border-slate-800">
            <div className="flex items-center text-emerald-400 gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Live Tracking Active
            </div>
            <div className="text-slate-400">
              Updates every 5s
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 relative z-10 flex-1 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300 fill-mode-both">
          <h3 className="text-lg font-bold text-slate-200 mb-6 uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-500" />
            Emergency Timeline
          </h3>
          <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
            {timelineEvents.length > 0 ? (
              timelineEvents.map((step, index) => {
                const isActive = true;
                return (
                  <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow flex-none transition-colors duration-500 z-10" style={{ backgroundColor: isActive ? '#ef4444' : '', borderColor: isActive ? '#ef4444' : '', color: isActive ? 'white' : '' }}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 shadow-sm animate-in fade-in duration-500 fill-mode-both ${index % 2 === 0 ? 'slide-in-from-left-4' : 'slide-in-from-right-4'}`} style={{ animationDelay: `${600 + index * 100}ms` }}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className={`font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                        <span className="text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded-md">
                          {new Date(step.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-slate-400 py-8">No timeline events yet.</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid gap-3 sm:grid-cols-3 relative z-10 pt-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-500 fill-mode-both">
          <Button
            variant="destructive"
            onClick={() => setIsStopped(true)}
            className="h-14 rounded-2xl text-base font-bold sm:col-span-3 bg-red-600 text-white hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all"
          >
            <XCircle className="mr-2 h-5 w-5" />
            Stop Emergency
          </Button>
          <Button
            variant="outline"
            className="h-14 rounded-2xl text-slate-300 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white"
          >
            <Info className="mr-2 h-5 w-5" />
            View Details
          </Button>
          <Button
            variant="outline"
            className="h-14 rounded-2xl text-slate-300 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white"
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share Location
          </Button>
          <Button
            variant="outline"
            className="h-14 rounded-2xl text-slate-300 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white"
          >
            <PhoneCall className="mr-2 h-5 w-5" />
            Call 911
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function EmergencyActiveScreen() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading emergency data...</div>}>
      <EmergencyActiveContent />
    </Suspense>
  );
}
