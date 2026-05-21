"use client";
/**
 * hooks/use-campaigns.ts
 * TanStack Query hooks for campaign data.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignService } from "@/services/campaign.service";
import type { CampaignFormData } from "@/lib/schemas/campaign.schema";

export const CAMPAIGN_KEYS = {
  all:    ["campaigns"] as const,
  detail: (id: string) => ["campaigns", id] as const,
};

/** Fetch campaign list */
export function useCampaigns() {
  return useQuery({
    queryKey: CAMPAIGN_KEYS.all,
    queryFn:  campaignService.getCampaigns,
  });
}

/** Fetch single campaign */
export function useCampaign(id: string) {
  return useQuery({
    queryKey: CAMPAIGN_KEYS.detail(id),
    queryFn:  () => campaignService.getCampaignById(id),
    enabled:  Boolean(id),
  });
}

/** Create campaign — invalidates list on success */
export function useCreateCampaign(onSuccess?: (id: string) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CampaignFormData) => campaignService.createCampaign(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: CAMPAIGN_KEYS.all });
      onSuccess?.(res.id);
    },
  });
}

/** Update campaign status */
export function useUpdateCampaignStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      campaignService.updateCampaignStatus(id, status as any),
    onSuccess: () => qc.invalidateQueries({ queryKey: CAMPAIGN_KEYS.all }),
  });
}
