"use client";

import React from "react";
import { useRbac } from "@/hooks/use-rbac";
import { PublisherReportsView } from "@/components/features/reports/publisher-reports";
import { EditorReportsView } from "@/components/features/reports/editor-reports";
import { AdminReportsView } from "@/components/features/reports/admin-reports";
import { withRbac } from "@/components/providers/rbac-guard";

function ReportsPage() {
  const { role } = useRbac();

  if (role === "editor") {
    return <EditorReportsView />;
  }

  if (role === "admin") {
    return <AdminReportsView />;
  }

  return <PublisherReportsView />;
}

export default withRbac(ReportsPage, "Campaign Management", "View Only");
