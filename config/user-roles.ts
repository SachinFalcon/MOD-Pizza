export interface UserProfileData {
  id: string;
  name: string;
  role: string;
  roleLabel: string;
  email: string;
  phone: string;
  scope: string;
  joined: string;
  lastLogin: string;
  avatarUrl: string;
  timezone: string;
  permissions: { module: string; access: string; variant: "success" | "info" | "neutral" | "warning" }[];
  activityLog: { action: string; module: string; date: string; status: "SUCCESS" | "FAILED" }[];
  scopeStats: { region: string; count: number }[];
  activeSessions: { device: string; location: string; loginTime: string; status: "current" | "revoke" }[];
}

export const USER_PROFILES: Record<string, UserProfileData> = {
  editor: {
    id: "editor",
    name: "Nolan Schleifer",
    role: "Editor",
    roleLabel: "CAMPAIGN EDITOR",
    email: "nolan.schleifer@mtas.com",
    phone: "+1 874 345 2289",
    scope: "Chicago HQ",
    joined: "Jan 12, 2023",
    lastLogin: "Today, 09:12 AM",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    timezone: "UTC-05:00 (EST - New York)",
    permissions: [
      { module: "Campaign Management", access: "Full Access", variant: "success" },
      { module: "Approvals Queue", access: "Read Only", variant: "neutral" },
      { module: "Screen Scheduler", access: "Read Only", variant: "neutral" },
      { module: "User Administration", access: "No Access", variant: "neutral" },
      { module: "System Logs & Audit", access: "View Only", variant: "neutral" }
    ],
    activityLog: [
      { action: "Created New Campaign", module: "Campaigns", date: "Today, 09:12 AM", status: "SUCCESS" },
      { action: "Modified Template Asset", module: "Library", date: "Yesterday, 04:45 PM", status: "SUCCESS" },
      { action: "Exported Performance Report", module: "Reports", date: "Jan 22, 11:30 AM", status: "SUCCESS" }
    ],
    scopeStats: [
      { region: "West Region", count: 120 },
      { region: "South Region", count: 84 },
      { region: "Midwest Region", count: 64 }
    ],
    activeSessions: [
      { device: "MacBook Pro - Chrome", location: "New York, US", loginTime: "Today, 09:12 AM", status: "current" },
      { device: "iPhone 15 - Mobile App", location: "New York, US", loginTime: "Jan 23, 09:45 PM", status: "revoke" }
    ]
  },
  publisher: {
    id: "publisher",
    name: "Sarah Connor",
    role: "Publisher",
    roleLabel: "CONTENT PUBLISHER",
    email: "sarah.connor@mtas.com",
    phone: "+1 874 345 9901",
    scope: "New York HQ",
    joined: "Feb 18, 2022",
    lastLogin: "Today, 08:30 AM",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    timezone: "UTC-05:00 (EST - New York)",
    permissions: [
      { module: "Campaign Management", access: "Full Access", variant: "success" },
      { module: "Approvals Queue", access: "Full Access", variant: "success" },
      { module: "Screen Scheduler", access: "Full Access", variant: "success" },
      { module: "User Administration", access: "Read Only", variant: "neutral" },
      { module: "System Logs & Audit", access: "View Only", variant: "neutral" }
    ],
    activityLog: [
      { action: "Published Campaign Offer", module: "Approvals", date: "Today, 08:30 AM", status: "SUCCESS" },
      { action: "Rejected Creative Layout", module: "Approvals", date: "Yesterday, 02:15 PM", status: "SUCCESS" },
      { action: "Approved BOGO Menu Promo", module: "Approvals", date: "Jan 21, 09:10 AM", status: "SUCCESS" }
    ],
    scopeStats: [
      { region: "East Region", count: 180 },
      { region: "North Region", count: 96 },
      { region: "South Region", count: 112 }
    ],
    activeSessions: [
      { device: "iMac 24 - Safari", location: "Boston, US", loginTime: "Today, 08:30 AM", status: "current" },
      { device: "iPad Air Pro - Safari", location: "New York, US", loginTime: "Jan 24, 11:20 AM", status: "revoke" }
    ]
  },
  admin: {
    id: "admin",
    name: "Nolan Smith",
    role: "Admin",
    roleLabel: "SUPER ADMINISTRATOR",
    email: "nolan.hq@modpizza.com",
    phone: "+1 874 345 0000",
    scope: "Global Operations HQ",
    joined: "Oct 01, 2020",
    lastLogin: "Today, 07:15 AM",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    timezone: "UTC-05:00 (EST - New York)",
    permissions: [
      { module: "Campaign Management", access: "Full Access", variant: "success" },
      { module: "Approvals Queue", access: "Full Access", variant: "success" },
      { module: "Screen Scheduler", access: "Full Access", variant: "success" },
      { module: "User Administration", access: "Manage", variant: "info" },
      { module: "System Logs & Audit", access: "View Only", variant: "neutral" }
    ],
    activityLog: [
      { action: "Approved Campaign", module: "Approvals", date: "Today, 09:12 AM", status: "SUCCESS" },
      { action: "Modified User Permissions", module: "Users", date: "Yesterday, 04:45 PM", status: "SUCCESS" },
      { action: "Created New Campaign", module: "Campaigns", date: "Jan 22, 11:30 AM", status: "SUCCESS" }
    ],
    scopeStats: [
      { region: "Global Network", count: 480 },
      { region: "US Regional HQ", count: 240 },
      { region: "Southwest Hub", count: 80 }
    ],
    activeSessions: [
      { device: "MacBook Pro - Chrome", location: "New York, US", loginTime: "Today, 07:15 AM", status: "current" },
      { device: "iPhone 15 - Mobile App", location: "New York, US", loginTime: "Jan 25, 08:32 AM", status: "revoke" }
    ]
  }
};

export function getActiveProfileKey(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user-role") || "editor";
  }
  return "editor";
}

export function getActiveProfile(): UserProfileData {
  const key = getActiveProfileKey();
  return USER_PROFILES[key] || USER_PROFILES.editor;
}

export function setActiveProfileKey(key: string): void {
  if (typeof window !== "undefined" && USER_PROFILES[key]) {
    localStorage.setItem("user-role", key);
    window.dispatchEvent(new Event("role-change"));
  }
}
