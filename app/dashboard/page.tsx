"use client";

import React from "react";
import { useRbac } from "@/hooks/use-rbac";
import EditorDashboard from "@/components/features/dashboard/editor-dashboard";
import PublisherDashboard from "@/components/features/dashboard/publisher-dashboard";

export default function DashboardPage() {
  const { profile } = useRbac();

  if (profile.id === "publisher") {
    return <PublisherDashboard />;
  }

  // Admin and Editor currently use the Editor dashboard
  return <EditorDashboard />;
}

