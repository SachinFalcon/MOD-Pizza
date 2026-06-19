"use client";

import React, { Suspense } from "react";
import { useRbac } from "@/hooks/use-rbac";
import PublisherCampaignsView from "@/components/features/campaigns/publisher-campaigns-view";
import CampaignsClient from "@/components/features/campaigns/campaigns-client";
import { withRbac } from "@/components/providers/rbac-guard";

function CampaignsPage() {
  const { profile } = useRbac();

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-semibold">Loading Campaigns...</div>}>
      {profile.id === "publisher" || profile.id === "admin" ? <PublisherCampaignsView /> : <CampaignsClient />}
    </Suspense>
  );
}

export default withRbac(CampaignsPage, "Campaign Management", "View Only");
