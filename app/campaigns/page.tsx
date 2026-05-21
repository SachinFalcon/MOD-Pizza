import { Suspense } from "react";
import CampaignsClient from "@/components/features/campaigns/campaigns-client";

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-semibold">Loading Campaigns...</div>}>
      <CampaignsClient />
    </Suspense>
  );
}
