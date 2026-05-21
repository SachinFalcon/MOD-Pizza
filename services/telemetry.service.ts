/**
 * services/telemetry.service.ts
 * Real-time screen health & KPI telemetry — mock data shaped to match
 * the screens + outlets tables from db_structure.txt.
 */
import { api } from "@/services/mock.service";

export interface ScreenHealth {
  screenId: string;
  outletId: string;
  outletName: string;
  status: "Online" | "Degraded" | "Offline";
  uptimePercent: number;
  lastPing: string; // ISO timestamp
  region: string;
}

export interface TelemetryStats {
  totalScreens: number;
  onlineScreens: number;
  offlineScreens: number;
  degradedScreens: number;
  avgUptime: number;
}

// Deterministic mock — same shape every call for consistent UX
const MOCK_SCREENS: ScreenHealth[] = [
  { screenId: "SCR-001", outletId: "out-001", outletName: "Chicago Downtown",   status: "Online",   uptimePercent: 99.1, lastPing: new Date().toISOString(), region: "Midwest" },
  { screenId: "SCR-002", outletId: "out-001", outletName: "Chicago Downtown",   status: "Online",   uptimePercent: 98.7, lastPing: new Date().toISOString(), region: "Midwest" },
  { screenId: "SCR-003", outletId: "out-002", outletName: "NYC Times Square",   status: "Degraded", uptimePercent: 81.2, lastPing: new Date().toISOString(), region: "East" },
  { screenId: "SCR-004", outletId: "out-002", outletName: "NYC Times Square",   status: "Online",   uptimePercent: 97.4, lastPing: new Date().toISOString(), region: "East" },
  { screenId: "SCR-005", outletId: "out-003", outletName: "LA Sunset Strip",    status: "Offline",  uptimePercent: 0,    lastPing: new Date(Date.now() - 3_600_000).toISOString(), region: "West" },
  { screenId: "SCR-006", outletId: "out-003", outletName: "LA Sunset Strip",    status: "Online",   uptimePercent: 99.9, lastPing: new Date().toISOString(), region: "West" },
  { screenId: "SCR-007", outletId: "out-004", outletName: "Houston Galleria",   status: "Online",   uptimePercent: 95.3, lastPing: new Date().toISOString(), region: "South" },
  { screenId: "SCR-008", outletId: "out-005", outletName: "Seattle Pike Place", status: "Degraded", uptimePercent: 72.0, lastPing: new Date().toISOString(), region: "West" },
];

export const telemetryService = {
  /** Screen health list — optionally filtered by outlet */
  getScreenHealth: async (outletId?: string): Promise<ScreenHealth[]> => {
    await new Promise((r) => setTimeout(r, 400));
    return outletId
      ? MOCK_SCREENS.filter((s) => s.outletId === outletId)
      : MOCK_SCREENS;
  },

  /** Aggregate KPI stats */
  getSystemStats: async (): Promise<TelemetryStats> => {
    const data = await api.getStats();
    const screens = MOCK_SCREENS;
    return {
      totalScreens: screens.length,
      onlineScreens:   screens.filter((s) => s.status === "Online").length,
      offlineScreens:  screens.filter((s) => s.status === "Offline").length,
      degradedScreens: screens.filter((s) => s.status === "Degraded").length,
      avgUptime: Math.round(
        screens.reduce((sum, s) => sum + s.uptimePercent, 0) / screens.length
      ),
    };
  },

  /** Heatmap matrix: hours × days → intensity value 0–100 */
  getActivityHeatmap: async (): Promise<number[][]> => {
    await new Promise((r) => setTimeout(r, 300));
    // 7 days × 24 hours — seeded pseudo-random for demo consistency
    return Array.from({ length: 24 }, (_, h) =>
      Array.from({ length: 7 }, (_, d) => {
        const base = h >= 11 && h <= 21 ? 60 : 20;
        const weekend = d >= 5 ? 15 : 0;
        return Math.min(100, base + weekend + ((h * 7 + d * 3) % 25));
      })
    );
  },
};
