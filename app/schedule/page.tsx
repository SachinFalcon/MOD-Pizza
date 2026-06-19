"use client";

import React from "react";
import { useRbac } from "@/hooks/use-rbac";
import ScreenSchedulePage from "@/components/features/schedule/screen-schedule-page";
import AdminScreenSchedulePage from "@/components/features/schedule/admin-screen-schedule-page";
import { withRbac } from "@/components/providers/rbac-guard";

function ScheduleRoute() {
  const { profile } = useRbac();

  if (profile.id === "admin") {
    return <AdminScreenSchedulePage />;
  }

  return <ScreenSchedulePage />;
}

export default withRbac(ScheduleRoute, "Screen Scheduler", "View Only");
