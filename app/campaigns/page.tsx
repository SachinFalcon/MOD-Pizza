"use client";

import React, { Suspense } from "react";
import { useRbac } from "@/hooks/use-rbac";
import PublisherCampaignsView from "@/components/features/campaigns/publisher-campaigns-view";
import CampaignsClient from "@/components/features/campaigns/campaigns-client";

export default function CampaignsPage() {
  const { profile } = useRbac();

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-semibold">Loading Campaigns...</div>}>
      {profile.id === "publisher" ? <PublisherCampaignsView /> : <CampaignsClient />}
    </Suspense>
  );
}
