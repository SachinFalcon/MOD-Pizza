"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "request_changes";

export interface CampaignApproval {
  id: string;
  name: string;
  promoCode: string;
  priority: "High" | "Medium" | "Low";
  targetOutlets: number;
  submittedDate: string;
  submitterName: string;
  submitterRole: string;
  submitterAvatar: string;
  waitTime: string;
  thumbnail: string;
  status: ApprovalStatus;
  isOverdue?: boolean;
}

const INITIAL_CAMPAIGNS: CampaignApproval[] = [
  {
    id: "CMP-10234",
    name: "Holiday Promo Loop",
    promoCode: "#HOLIDAY24",
    priority: "High",
    targetOutlets: 42,
    submittedDate: "12 Mar, 2026",
    submitterName: "Maria Lopez",
    submitterRole: "Editor",
    submitterAvatar: "https://i.pravatar.cc/150?u=maria",
    waitTime: "120 Hrs, 16 Min",
    thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop",
    status: "pending",
    isOverdue: true,
  },
  {
    id: "CMP-10235",
    name: "FoodieHub",
    promoCode: "#FOODIE24",
    priority: "Medium",
    targetOutlets: 42,
    submittedDate: "12 Mar, 2026",
    submitterName: "Maria Lopez",
    submitterRole: "Editor",
    submitterAvatar: "https://i.pravatar.cc/150?u=maria",
    waitTime: "120 Hrs, 16 Min",
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop",
    status: "pending",
  },
  {
    id: "CMP-10236",
    name: "Summer Sale",
    promoCode: "#SUMMERMOD",
    priority: "Low",
    targetOutlets: 42,
    submittedDate: "12 Mar, 2026",
    submitterName: "Maria Lopez",
    submitterRole: "Editor",
    submitterAvatar: "https://i.pravatar.cc/150?u=maria",
    waitTime: "120 Hrs, 16 Min",
    thumbnail: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&h=300&fit=crop",
    status: "pending",
  },
  {
    id: "CMP-10237",
    name: "Student Offer",
    promoCode: "#STUDENT",
    priority: "High",
    targetOutlets: 42,
    submittedDate: "12 Mar, 2026",
    submitterName: "Maria Lopez",
    submitterRole: "Editor",
    submitterAvatar: "https://i.pravatar.cc/150?u=maria",
    waitTime: "120 Hrs, 16 Min",
    thumbnail: "https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?w=500&h=300&fit=crop",
    status: "pending",
  },
  {
    id: "CMP-10238",
    name: "Lunch Offer",
    promoCode: "#LUNCHMOD",
    priority: "Medium",
    targetOutlets: 42,
    submittedDate: "12 Mar, 2026",
    submitterName: "Maria Lopez",
    submitterRole: "Editor",
    submitterAvatar: "https://i.pravatar.cc/150?u=maria",
    waitTime: "120 Hrs, 16 Min",
    thumbnail: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&h=300&fit=crop",
    status: "pending",
  },
];

interface ApprovalsContextType {
  campaigns: CampaignApproval[];
  updateStatus: (id: string, status: ApprovalStatus) => void;
}

const ApprovalsContext = createContext<ApprovalsContextType | undefined>(undefined);

export function ApprovalsProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<CampaignApproval[]>(INITIAL_CAMPAIGNS);

  const updateStatus = (id: string, status: ApprovalStatus) => {
    setCampaigns((prev) =>
      prev.map((camp) => (camp.id === id ? { ...camp, status } : camp))
    );
  };

  return (
    <ApprovalsContext.Provider value={{ campaigns, updateStatus }}>
      {children}
    </ApprovalsContext.Provider>
  );
}

export function useApprovals() {
  const context = useContext(ApprovalsContext);
  if (!context) {
    throw new Error("useApprovals must be used within an ApprovalsProvider");
  }
  return context;
}
