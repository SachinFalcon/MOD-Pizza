"use client";

import React, { Suspense } from "react";
import { useRbac } from "@/hooks/use-rbac";
import CampaignDetailsClient from "@/components/features/campaign-details/campaign-details-client";
import PublisherCampaignDetailsView from "@/components/features/campaign-details/publisher-campaign-details-view";

export default function CampaignDetailsWrapper() {
  const { profile } = useRbac();

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-semibold">Loading Campaign Details...</div>}>
      {profile.id === "publisher" ? <PublisherCampaignDetailsView /> : <CampaignDetailsClient />}
    </Suspense>
  );
}
