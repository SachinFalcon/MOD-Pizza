// Server Component — can safely export generateStaticParams alongside a client child.
// Required for `output: "export"` config: tells Next.js which [id] slugs to pre-render.
export function generateStaticParams() {
  return [
    { id: "AD-94821" },
    { id: "AD-94822" },
    { id: "AD-94823" },
    { id: "AD-94824" },
    { id: "AD-94825" },
    { id: "CAM-00000" },
  ];
}

import CampaignDetailsClient from "@/components/features/campaign-details/campaign-details-client";
import { Suspense } from "react";

export default function CampaignDetailsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-semibold">Loading Campaign Details...</div>}>
      <CampaignDetailsClient />
    </Suspense>
  );
}
