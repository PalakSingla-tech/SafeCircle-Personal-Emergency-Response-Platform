"use client";
import { useEffect, useState } from "react";
import { Search, Download, Calendar, MapPin, Activity, Building2, User, Clock, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getEmergencyHistory, type EmergencyHistoryEvent } from "@/lib/api";

const HISTORY_DATA = [
  {
    id: "EV-2026-89",
    date: "Jul 18, 2026",
    time: "14:32 PM",
    location: "Rajiv Chowk Metro Station, Delhi",
    responder: "Ambulance Unit 108",
    hospital: "AIIMS New Delhi",
    type: "Allergic Reaction",
    status: "Resolved",
  },
  {
    id: "EV-2025-42",
    date: "Nov 03, 2025",
    time: "09:15 AM",
    location: "Connaught Place, Delhi",
    responder: "Public Good Samaritan",
    hospital: "N/A - Treated on site",
    type: "Asthma Attack",
    status: "Resolved",
  },
];


export function HistoryClient() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [events, setEvents] = useState<EmergencyHistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        const data = await getEmergencyHistory();
        if (isMounted) {
          setEvents(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch history:", error);
          setEvents(HISTORY_DATA);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEvents = events.filter((event) => {
    const lowerSearch = search.toLowerCase();
    const matchesSearch = [event.type, event.location, event.hospital, event.responder, event.id].join(" ").toLowerCase().includes(lowerSearch);
    const matchesDate = date ? event.date.toLowerCase().includes(date.toLowerCase()) : true;
    return matchesSearch && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
      case "Archived":
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
      case "Active":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "Active":
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      default:
        return <Info className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Emergency History
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A complete timeline of your past medical emergencies and scans.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl shrink-0">
            <Download className="mr-2 h-4 w-4" />
            Export History
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-border bg-card p-2 sm:p-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events, locations, hospitals..."
            className="w-full pl-9 rounded-xl border-0 bg-muted/40 focus-visible:ring-1 focus-visible:ring-primary/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-px bg-border hidden sm:block mx-1" />
        <div className="flex gap-2">
          <Input
            type="date"
            className="w-[150px] rounded-xl border-0 bg-muted/40 focus-visible:ring-1 focus-visible:ring-primary/30"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select 
            className="w-[140px] rounded-xl border-0 bg-muted/40 px-3 text-sm focus:ring-1 focus:ring-primary/30 outline-none"
            defaultValue="all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card/70 p-6 text-sm text-muted-foreground">
          Loading emergency history from the API layer...
        </div>
      ) : (
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent pt-4 pb-12">
          {filteredEvents.map((event) => (
            <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Timeline Dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary/10 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm flex-none z-10 transition-transform group-hover:scale-110">
                <Activity className="h-4 w-4" />
              </div>

              {/* Event Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]">
                <div className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow hover:border-primary/20 overflow-hidden">
                  {/* Card Header */}
                  <div className="border-b border-border/50 bg-muted/20 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-background rounded-lg p-2 border border-border shadow-sm">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{event.date}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {event.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full font-medium shadow-sm ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                      {event.status}
                    </Badge>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Emergency Type</p>
                        <p className="font-medium text-foreground flex items-center gap-2">
                          <Activity className="h-4 w-4 text-red-500" />
                          {event.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Location</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                          {event.location}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Responder</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <User className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          {event.responder}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Hospital Destination</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <Building2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          {event.hospital}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="bg-muted/10 px-5 py-3 border-t border-border/50 flex justify-between items-center">
                    <span className="text-xs font-mono text-muted-foreground">ID: {event.id}</span>
                    <Button variant="ghost" size="sm" className="h-8 text-xs font-medium rounded-lg hover:text-primary">
                      View Full Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-8 pb-8">
            <Button variant="outline" className="rounded-xl">
              Load More History
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
