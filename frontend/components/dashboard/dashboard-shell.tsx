"use client";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import { MobileDrawer } from "./mobile-drawer";
import { TopNavbar } from "./top-navbar";

import "./dashboard.css";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
