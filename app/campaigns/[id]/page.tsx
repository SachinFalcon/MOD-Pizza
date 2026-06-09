// Server Component — can safely export generateStaticParams alongside a client child.
// Required for `output: "export"` config: tells Next.js which [id] slugs to pre-render.
export function generateStaticParams() {
  return [
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

export default function CampaignDetailsPage() {
  return (
    <CampaignDetailsWrapper />
  );
}
