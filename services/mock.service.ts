/**
 * Mock API Service for MTAS HQ
 * This file simulates backend interactions with dummy data and artificial delays.
 */

export interface Campaign {
  id: string;
  name: string;
  creatives: string;
  outlets: string;
  status: 'Live' | 'Sent' | 'Under Modification' | 'Approved' | 'Draft';
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
  { id: "OUT-1043", name: "Hudson Yards Atrium", location: "New York City, NY", status: "Active", screens: "6 Screen", region: "North America" },
  { id: "OUT-1044", name: "Times Square Hub", location: "New York City, NY", status: "Active", screens: "12 Screen", region: "North America" },
  { id: "OUT-1045", name: "London Bridge Plaza", location: "London, UK", status: "Active", screens: "4 Screen", region: "Europe" },
  { id: "OUT-1046", name: "Piccadilly Circus", location: "London, UK", status: "Inactive", screens: "8 Screen", region: "Europe" },
  { id: "OUT-1047", name: "Berlin Central", location: "Berlin, DE", status: "Active", screens: "5 Screen", region: "Europe" },
];

const MOCK_STATS: DashboardStats = {
  liveCampaigns: 9,
  awaitingApproval: 4.2,
  campaignsCreated: 128,
  avgCoverage: 78.4
};

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
  }
};
