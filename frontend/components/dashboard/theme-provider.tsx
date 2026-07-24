"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}>({ theme: "light", setTheme: () => {}, toggleTheme: () => {} });

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("safecircle-dashboard-theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("safecircle-dashboard-theme", theme);
    const root = document.getElementById("dashboard-root");
    if (root) {
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div
        id="dashboard-root"
        className={`dashboard-theme min-h-screen${theme === "dark" ? " dark" : ""}`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  return useContext(ThemeContext);
}
