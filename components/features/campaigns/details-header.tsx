import React from "react";
import Link from "next/link";
import { Campaign } from "@/services/mock.service";
import { Play } from "lucide-react";

interface DetailsHeaderProps {
  campaign: Campaign;
  onPreviewTrigger: () => void;
}

export default function DetailsHeader({ campaign, onPreviewTrigger }: DetailsHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <nav className="text-sm text-gray-500">
        <Link href="/campaigns">Campaigns</Link> &gt; <span className="font-medium text-gray-900">{campaign.name}</span>
      </nav>
      <button
        onClick={onPreviewTrigger}
        className="flex items-center gap-2 px-4 py-2 bg-modRed text-white rounded hover:bg-modRed-dark transition"
      >
        <Play size={16} /> Preview
      </button>
    </div>
  );
}
