"use client";

import React from "react";
import { useRbac } from "@/hooks/use-rbac";
import { PublisherSettingsView } from "@/components/features/settings/publisher-settings";
import { EditorSettingsView } from "@/components/features/settings/editor-settings";
import { AdminSettingsView } from "@/components/features/settings/admin-settings";
import { withRbac } from "@/components/providers/rbac-guard";

function SettingsPage() {
  const { role } = useRbac();

  if (role === "admin") {
    return <AdminSettingsView />;
  }

  if (role === "editor") {
    return <EditorSettingsView />;
  }

  return <PublisherSettingsView />;
}

export default withRbac(SettingsPage, "System Logs & Audit", "View Only");
