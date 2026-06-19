"use client";

import React from "react";
import { useRbac } from "@/hooks/use-rbac";
import EditorApprovals from "@/components/features/approvals/editor-approvals";
import PublisherApprovals from "@/components/features/approvals/publisher-approvals";
import AdminApprovals from "@/components/features/approvals/admin-approvals";
import { withRbac } from "@/components/providers/rbac-guard";

function ApprovalsPage() {
  const { profile } = useRbac();

  if (profile.id === "admin") {
    return <AdminApprovals />;
  }

  if (profile.id === "publisher") {
    return <PublisherApprovals />;
  }

  // Editor uses the Editor view for now
  return <EditorApprovals />;
}

export default withRbac(ApprovalsPage, "Approvals Queue", "View Only");
