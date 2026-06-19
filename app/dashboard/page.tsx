"use client";

import React from "react";
import { useRbac } from "@/hooks/use-rbac";
import EditorDashboard from "@/components/features/dashboard/editor-dashboard";
import PublisherDashboard from "@/components/features/dashboard/publisher-dashboard";
import AdminDashboard from "@/components/features/dashboard/admin-dashboard";

export default function DashboardPage() {
  const { profile } = useRbac();

  if (profile.id === "publisher") {
    return <PublisherDashboard />;
  }

  if (profile.id === "admin") {
    return <AdminDashboard />;
  }

  // Editor uses the Editor dashboard
  return <EditorDashboard />;
}

