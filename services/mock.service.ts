/**
 * Mock API Service for MTAS HQ
 * This file simulates backend interactions with dummy data and artificial delays.
 */

import { UserProfileData, USER_PROFILES } from "@/config/user-roles";

export interface Campaign {
  id: string;
  name: string;
  creatives: string;
  outlets: string;
  status: 'Live' | 'Sent for Approval' | 'Under Modification' | 'Approved' | 'Draft';
  runtime: string;
  lastEdit: string;
}

export interface Outlet {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'Inactive';
  screens: string;
  region: string;
}

export interface DashboardStats {
  liveCampaigns: number;
  awaitingApproval: number;
  campaignsCreated: number;
  avgCoverage: number;
}

export interface Asset {
  id: number;
  title: string;
  res: string;
  size: string;
  type: 'VIDEO' | 'IMAGE';
  used: number;
  img: string;
  status: 'Syncing' | 'Uploaded' | 'Failed';
}

export interface Template {
  id: number;
  title: string;
  type: string;
  screens: number;
  img: string;
  duration: string;
  used: string;
  badge?: string;
}

// Settings Interfaces
export interface SettingsData {
  defaultDuration: string;
  defaultStatus: string;
  conflictStrategy: string;
  loopBehavior: string;
  minPlayTime: string;
  maxAssets: string;
  overlapWarning: boolean;
  screenAssignment: string;

  syncInterval: string;
  deviceOfflineTimeout: string;
  reconnectAttempts: number;
  orientation: string;
  resolution: string;
  volume: number;

  allowedFormats: {
    mp4: boolean;
    mov: boolean;
    avi: boolean;
    webm: boolean;
    jpg: boolean;
    png: boolean;
    gif: boolean;
    svg: boolean;
    [key: string]: boolean;
  };
  startOfWeekLimit: string;
  maxAssetsCampaign: string;
  playbackMode: string;
  scalingMethod: string;
  unsupportedBehavior: string;
  optimizationEngine: boolean;
  compressionLevel: string;

  emailAlerts: boolean;
  criticalAlertsOnly: boolean;
  loginAttempts: number;
  alertDelayBuffer: string;
  escalationTime: string;
  lockoutDuration: string;
  passwordPolicy: {
    minLength: boolean;
    specialSymbol: boolean;
    number: boolean;
    upperCase: boolean;
  };
  requireOtp: boolean;
  approvalMode: string;
  enableAuditLogs: boolean;
  ipRestriction: boolean;
  ipWhitelist: string[];
  storageMaxUploadSize: string;
  autoDeleteOldAssets: boolean;
  storageCompression: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  platformStartOfWeek: string;
  systemLanguage: string;
  sessionTimeout: string;
  namingConvention: string;
  approvalRequiredFor: {
    campaignPublish: boolean;
    campaignEdit: boolean;
    screenAssignment: boolean;
    mediaUpload: boolean;
  };
  defaultApprovalType: string;
  slaLimitValue: string;
  slaLimitUnit: string;
}

// Dashboard Extra Interfaces
export interface DashboardTask {
  title: string;
  desc: string;
  actionLabel?: string;
  status?: string;
}

export interface Opportunity {
  title: string;
  date: string;
  sub: string;
}

export interface PerformanceInsights {
  approvalRate: number;
  bestPerformingDay: string;
}

export interface EditorRanking {
  rank: number;
  hours: string;
  topCampaign: string;
}

// Campaign Details Interfaces
export interface CampaignOutlet {
  id: string;
  name: string;
  city: string;
  region: string;
  status: "Active" | "Scheduled";
  startPercent: number;
  widthPercent: number;
  window: string;
  startLabel?: string;
}

export interface PlaybackAsset {
  index: number;
  name: string;
  type: "VIDEO" | "IMAGE";
  duration: string;
  resolution: string;
  size: string;
}

export interface CampaignAsset {
  title: string;
  type: string;
  duration: string;
  res: string;
  size: string;
  img: string;
}

export interface Comment {
  id: number;
  author: string;
  role: string;
  avatar: string;
  time: string;
  text: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data
const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "AD-94821", name: "Holiday Promo", creatives: "3 Assets", outlets: "128", status: "Live", runtime: "134 hrs", lastEdit: "2 hrs ago" },
  { id: "AD-94822", name: "Summer Sale 2026", creatives: "4 Assets", outlets: "78", status: "Draft", runtime: "0", lastEdit: "Yesterday" },
  { id: "AD-94823", name: "BOGO Weekend", creatives: "2 Assets", outlets: "212", status: "Under Modification", runtime: "0", lastEdit: "Mar 10, 2026" },
  { id: "AD-94824", name: "New Outlet Opening", creatives: "1 Asset", outlets: "1", status: "Approved", runtime: "0", lastEdit: "Mar 12, 2026" },
  { id: "AD-94825", name: "Pizza Day Special", creatives: "5 Assets", outlets: "540", status: "Live", runtime: "48 hrs", lastEdit: "5 min ago" },
];

const MOCK_OUTLETS: Outlet[] = [
  { id: "OUT-1043", name: "Hudson Yards Atrium", location: "New York City, NY", status: "Active", screens: "6 Screen", region: "Northeast" },
  { id: "OUT-1044", name: "Times Square Hub", location: "New York City, NY", status: "Active", screens: "12 Screen", region: "Northeast" },
  { id: "OUT-1045", name: "Soho Boutique Outlet", location: "New York City, NY", status: "Active", screens: "4 Screen", region: "Northeast" },
  { id: "OUT-1046", name: "Beverly Hills Central", location: "Los Angeles, CA", status: "Active", screens: "8 Screen", region: "West Coast" },
  { id: "OUT-1047", name: "Santa Monica Pier", location: "Los Angeles, CA", status: "Inactive", screens: "5 Screen", region: "West Coast" },
  { id: "OUT-1048", name: "Pike Place Market", location: "Seattle, WA", status: "Active", screens: "3 Screen", region: "West Coast" },
  { id: "OUT-1049", name: "Wacker Drive", location: "Chicago, IL", status: "Active", screens: "7 Screen", region: "Midwest" },
  { id: "OUT-1050", name: "Magnificent Mile", location: "Chicago, IL", status: "Active", screens: "5 Screen", region: "Midwest" },
  { id: "OUT-1051", name: "Midtown Atlanta", location: "Atlanta, GA", status: "Active", screens: "6 Screen", region: "Southeast" },
  { id: "OUT-1052", name: "South Beach Plaza", location: "Miami, FL", status: "Inactive", screens: "4 Screen", region: "Southeast" },
  { id: "OUT-1053", name: "Deep Ellum", location: "Dallas, TX", status: "Active", screens: "5 Screen", region: "Southwest" },
  { id: "OUT-1054", name: "River Walk Center", location: "San Antonio, TX", status: "Active", screens: "3 Screen", region: "Southwest" },
];

const MOCK_STATS: DashboardStats = {
  liveCampaigns: 9,
  awaitingApproval: 4.2,
  campaignsCreated: 128,
  avgCoverage: 78.4
};

const MOCK_ASSETS: Asset[] = [
  { id: 1, title: "Summer Collection 2026...", res: "1920 × 1080", size: "24.5 MB", type: "VIDEO", used: 12, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop", status: 'Uploaded' },
  { id: 2, title: "Pizza Night Special", res: "1920 × 1080", size: "18.2 MB", type: "VIDEO", used: 8, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", status: 'Uploaded' },
  { id: 3, title: "BOGO Offer Static", res: "1080 × 1920", size: "4.5 MB", type: "IMAGE", used: 42, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop", status: 'Uploaded' },
  { id: 4, title: "Beverage Promo Loop", res: "1920 × 1080", size: "32.1 MB", type: "VIDEO", used: 5, img: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop", status: 'Syncing' },
  { id: 5, title: "Store Opening Logo", res: "1080 × 1080", size: "1.2 MB", type: "IMAGE", used: 128, img: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop", status: 'Uploaded' },
  { id: 6, title: "Holiday Greetings", res: "1920 × 1080", size: "15.0 MB", type: "VIDEO", used: 0, img: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop", status: 'Failed' },
];

const MOCK_TEMPLATES: Template[] = [
  { id: 1, title: "Global Promo Layout", type: "Dynamic", screens: 6, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", duration: "15s", used: "1.2k", badge: "New" },
  { id: 2, title: "Single Outlet Special", type: "Static", screens: 1, img: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?w=400&h=300&fit=crop", duration: "30s", used: "840" },
  { id: 3, title: "Video Wall Sequence", type: "Video", screens: 9, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", duration: "10s", used: "2.1k", badge: "Trending" },
];

// Default Settings
const DEFAULT_SETTINGS: SettingsData = {
  defaultDuration: "30 Days",
  defaultStatus: "Draft",
  conflictStrategy: "Manual Override",
  loopBehavior: "Loop continuously",
  minPlayTime: "10 Seconds",
  maxAssets: "50",
  overlapWarning: true,
  screenAssignment: "Manual Override",

  syncInterval: "Every 15 minutes",
  deviceOfflineTimeout: "Every 5 minutes",
  reconnectAttempts: 3,
  orientation: "Landscape",
  resolution: "1920x1080 (1080p)",
  volume: 0,

  allowedFormats: {
    mp4: true,
    mov: true,
    avi: false,
    webm: true,
    jpg: true,
    png: true,
    gif: false,
    svg: false
  },
  startOfWeekLimit: "500",
  maxAssetsCampaign: "100",
  playbackMode: "Continuous Loop",
  scalingMethod: "fill",
  unsupportedBehavior: "Show Fallback Image",
  optimizationEngine: true,
  compressionLevel: "medium",

  emailAlerts: true,
  criticalAlertsOnly: false,
  loginAttempts: 5,
  alertDelayBuffer: "15",
  escalationTime: "30 Minutes",
  lockoutDuration: "15 Minutes",
  passwordPolicy: {
    minLength: true,
    specialSymbol: true,
    number: true,
    upperCase: true
  },
  requireOtp: false,
  approvalMode: "Single Step",
  enableAuditLogs: true,
  ipRestriction: false,
  ipWhitelist: ["192.168.1.1", "10.0.0.45", "203.0.113.195"],
  storageMaxUploadSize: "500MB",
  autoDeleteOldAssets: false,
  storageCompression: "Balanced",
  timezone: "UTC",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12-hour",
  platformStartOfWeek: "Monday",
  systemLanguage: "English",
  sessionTimeout: "30",
  namingConvention: "MTAS_Global_{ID}",
  approvalRequiredFor: {
    campaignPublish: true,
    campaignEdit: true,
    screenAssignment: false,
    mediaUpload: true
  },
  defaultApprovalType: "Single Approval",
  slaLimitValue: "24",
  slaLimitUnit: "Hours"
};

let userSettingsState = { ...DEFAULT_SETTINGS };

// Dashboard Extra Data
const MOCK_DASHBOARD_TASKS: DashboardTask[] = [
  { title: "Weekend Combo Deal", desc: "Campaign setup is not yet completed", actionLabel: "Fix Now" },
  { title: "Cheese Burst Promo", desc: "Publisher requested modification", actionLabel: "Edit" },
  { title: "Student Combo Deal", desc: "Campaign is ready for approval", actionLabel: "Send" },
  { title: "Summer Refresh", desc: "Awaiting publisher approval", status: "In Review" }
];

const MOCK_OPPORTUNITIES: Opportunity[] = [
  { title: "Memorial Day", date: "May 27", sub: "Suggested: BBQ Pizza Offer" },
  { title: "NBA Playoffs", date: "May 21", sub: "Suggested: Game Night Combo" }
];

const MOCK_PERFORMANCE_INSIGHTS: PerformanceInsights = {
  approvalRate: 82,
  bestPerformingDay: "Friday"
};

const MOCK_EDITOR_RANKING: EditorRanking = {
  rank: 2,
  hours: "324 screen hours",
  topCampaign: "Weekend Pizza Offer"
};

// Campaign Details Data
const MOCK_CAMPAIGN_OUTLETS: Record<string, CampaignOutlet[]> = {
  "default": [
    { id: "OUT-1043", name: "Hudson Yards Atrium", city: "New York City, NY", region: "East Coast", status: "Active", startPercent: 0, widthPercent: 80, window: "07:00 - 23:00" },
    { id: "OUT-1044", name: "Times Square Hub", city: "New York City, NY", region: "East Coast", status: "Active", startPercent: 0, widthPercent: 100, window: "00:00 - 24:00" },
    { id: "OUT-1045", name: "Soho Boutique Outlet", city: "New York City, NY", region: "East Coast", status: "Active", startPercent: 10, widthPercent: 90, window: "09:00 - 21:00" },
    { id: "OUT-1046", name: "Union Square Store", city: "New York City, NY", region: "East Coast", status: "Active", startPercent: 0, widthPercent: 80, window: "08:00 - 22:00" },
    { id: "OUT-1047", name: "Santa Monica Pier", city: "Los Angeles, CA", region: "West Coast", status: "Active", startPercent: 30, widthPercent: 70, window: "10:00 - 23:00", startLabel: "STARTS DEC 10" },
    { id: "OUT-1048", name: "Sunset Boulevard", city: "Los Angeles, CA", region: "West Coast", status: "Scheduled", startPercent: 30, widthPercent: 70, window: "08:00 - 22:00" },
    { id: "OUT-1049", name: "Beverly Hills Central", city: "Los Angeles, CA", region: "West Coast", status: "Scheduled", startPercent: 30, widthPercent: 70, window: "09:00 - 23:00" },
    { id: "OUT-1050", name: "Pike Place Market", city: "Seattle, WA", region: "Northwest", status: "Scheduled", startPercent: 40, widthPercent: 60, window: "07:00 - 21:00", startLabel: "STARTS DEC 12" },
    { id: "OUT-1051", name: "Capitol Hill Pizza", city: "Seattle, WA", region: "Northwest", status: "Scheduled", startPercent: 40, widthPercent: 60, window: "08:00 - 23:00" },
    { id: "OUT-1052", name: "University District", city: "Seattle, WA", region: "Northwest", status: "Scheduled", startPercent: 40, widthPercent: 60, window: "10:00 - 22:00" }
  ]
};

const MOCK_PLAYBACK_SEQUENCES: Record<string, PlaybackAsset[]> = {
  "default": [
    { index: 1, name: "Summer_Promo_Main.mp4", type: "VIDEO", duration: "15s", resolution: "1920×1080", size: "12.4 MB" },
    { index: 2, name: "Summer_Promo_Main.mp4", type: "VIDEO", duration: "15s", resolution: "1920×1080", size: "12.4 MB" },
    { index: 3, name: "Summer_Promo_Main.mp4", type: "IMAGE", duration: "15s", resolution: "1920×1080", size: "12.4 MB" },
    { index: 4, name: "Summer_Promo_Main.mp4", type: "VIDEO", duration: "15s", resolution: "1920×1080", size: "12.4 MB" }
  ]
};

const MOCK_CAMPAIGN_ASSETS: Record<string, CampaignAsset[]> = {
  "default": [
    { title: "Winter Coffee Promo.mp4", type: "Video (MP4)", duration: "15.0s", res: "1920 × 1080", size: "24.5 MB", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop" },
    { title: "Winter Coffee Promo.mp4", type: "Video (MP4)", duration: "15.0s", res: "1920 × 1080", size: "24.5 MB", img: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop" },
    { title: "Winter Coffee Promo.mp4", type: "Video (MP4)", duration: "15.0s", res: "1920 × 1080", size: "24.5 MB", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop" },
    { title: "Winter Coffee Promo.mp4", type: "Video (MP4)", duration: "15.0s", res: "1920 × 1080", size: "24.5 MB", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" }
  ]
};

const MOCK_CAMPAIGN_COMMENTS: Record<string, Comment[]> = {
  "default": [
    {
      id: 1,
      author: "You",
      role: "",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      time: "2 hours ago",
      text: "The typography on the main banner needs slightly more leading. It feels a bit cramped for an 'editorial' feel."
    },
    {
      id: 2,
      author: "Brandon Septimus",
      role: "PUBLISHER",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      time: "1 hour ago",
      text: "Agreed. Adjusted to 1.6em. I've uploaded a new preview for review."
    },
    {
      id: 3,
      author: "You",
      role: "",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      time: "25 mins ago",
      text: "Campaign targets for EMEA are slightly high. Do we have the additional spend for the Italian market expansion?"
    }
  ]
};

// API Functions
export const api = {
  getCampaigns: async (): Promise<Campaign[]> => {
    await delay(800);
    return MOCK_CAMPAIGNS;
  },

  getOutlets: async (): Promise<Outlet[]> => {
    await delay(600);
    return MOCK_OUTLETS;
  },

  getStats: async (): Promise<DashboardStats> => {
    await delay(500);
    return MOCK_STATS;
  },

  getAssets: async (): Promise<Asset[]> => {
    await delay(700);
    return MOCK_ASSETS;
  },

  getTemplates: async (): Promise<Template[]> => {
    await delay(600);
    return MOCK_TEMPLATES;
  },

  createCampaign: async (data: any): Promise<{ success: boolean; id: string }> => {
    await delay(1500);
    return { success: true, id: `CAM-${Math.floor(Math.random() * 100000)}` };
  },

  // Dynamic profile fetch
  getUserProfile: async (roleKey: string): Promise<UserProfileData> => {
    await delay(500);
    const key = roleKey.toLowerCase();
    return USER_PROFILES[key] || USER_PROFILES.editor;
  },

  // Dynamic Settings endpoints
  getSettings: async (): Promise<SettingsData> => {
    await delay(600);
    return userSettingsState;
  },

  saveSettings: async (data: SettingsData): Promise<{ success: boolean }> => {
    await delay(800);
    userSettingsState = { ...data };
    return { success: true };
  },

  resetSettings: async (): Promise<SettingsData> => {
    await delay(500);
    userSettingsState = { ...DEFAULT_SETTINGS };
    return userSettingsState;
  },

  // Dashboard components
  getDashboardTasks: async (): Promise<DashboardTask[]> => {
    await delay(400);
    return MOCK_DASHBOARD_TASKS;
  },

  getDashboardOpportunities: async (): Promise<Opportunity[]> => {
    await delay(300);
    return MOCK_OPPORTUNITIES;
  },

  getPerformanceInsights: async (): Promise<PerformanceInsights> => {
    await delay(400);
    return MOCK_PERFORMANCE_INSIGHTS;
  },

  getEditorRanking: async (): Promise<EditorRanking> => {
    await delay(300);
    return MOCK_EDITOR_RANKING;
  },

  // Campaign-specific details
  getCampaignOutlets: async (campaignId: string): Promise<CampaignOutlet[]> => {
    await delay(600);
    return MOCK_CAMPAIGN_OUTLETS[campaignId] || MOCK_CAMPAIGN_OUTLETS["default"];
  },

  getCampaignPlaybackSequence: async (campaignId: string): Promise<PlaybackAsset[]> => {
    await delay(500);
    return MOCK_PLAYBACK_SEQUENCES[campaignId] || MOCK_PLAYBACK_SEQUENCES["default"];
  },

  getCampaignAssets: async (campaignId: string): Promise<CampaignAsset[]> => {
    await delay(550);
    return MOCK_CAMPAIGN_ASSETS[campaignId] || MOCK_CAMPAIGN_ASSETS["default"];
  },

  getCampaignComments: async (campaignId: string): Promise<Comment[]> => {
    await delay(400);
    if (!MOCK_CAMPAIGN_COMMENTS[campaignId]) {
      MOCK_CAMPAIGN_COMMENTS[campaignId] = [ ...MOCK_CAMPAIGN_COMMENTS["default"] ];
    }
    return MOCK_CAMPAIGN_COMMENTS[campaignId];
  },

  addCampaignComment: async (campaignId: string, text: string): Promise<{ success: boolean; comment: Comment }> => {
    await delay(300);
    if (!MOCK_CAMPAIGN_COMMENTS[campaignId]) {
      MOCK_CAMPAIGN_COMMENTS[campaignId] = [ ...MOCK_CAMPAIGN_COMMENTS["default"] ];
    }
    const newCommentObj: Comment = {
      id: Date.now(),
      author: "You",
      role: "",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      time: "Just now",
      text: text
    };
    MOCK_CAMPAIGN_COMMENTS[campaignId].push(newCommentObj);
    return { success: true, comment: newCommentObj };
  }
};
