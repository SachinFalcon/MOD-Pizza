"use client";

import React from "react";
import { useRbac } from "@/hooks/use-rbac";
import EditorApprovals from "@/components/features/approvals/editor-approvals";
import PublisherApprovals from "@/components/features/approvals/publisher-approvals";

export default function ApprovalsPage() {
  const { profile } = useRbac();

  if (profile.id === "publisher") {
    return <PublisherApprovals />;
  }

  // Admin and Editor use the Editor view for now
  return <EditorApprovals />;
}
