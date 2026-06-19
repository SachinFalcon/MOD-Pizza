// Server Component — can safely export generateStaticParams alongside a client child.
// Required for `output: "export"` config: tells Next.js which [id] slugs to pre-render.
export function generateStaticParams() {
  return [
    { id: "CMP-2041" },
    { id: "CMP-2042" },
    { id: "CMP-2043" },
    { id: "CMP-2044" },
    { id: "CMP-2045" },
    { id: "CMP-2046" },
    { id: "CMP-2047" },
    { id: "CMP-2048" },
    { id: "AD-94821" },
    { id: "AD-94822" },
    { id: "AD-94823" },
    { id: "AD-94824" },
    { id: "AD-94825" },
    { id: "AD-94621" },
    { id: "AD-94622" },
    { id: "AD-94623" },
    { id: "AD-94624" },
    { id: "AD-94625" },
    { id: "AD-94626" },
    { id: "CAM-00000" },
  ];
}

import CampaignDetailsWrapper from "@/components/features/campaign-details/campaign-details-wrapper";
import { RbacGuard } from "@/components/providers/rbac-guard";

export default function CampaignDetailsPage() {
  return (
    <RbacGuard module="Campaign Management" require="View Only">
      <CampaignDetailsWrapper />
    </RbacGuard>
  );
}
