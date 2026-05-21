/**
 * services/campaign.service.ts
 * Typed campaign service — wraps lib/api.ts mock for TanStack Query hooks.
 * Swap the internals to real fetch() calls when the backend is ready.
 */
import { api, type Campaign } from "@/services/mock.service";
import type { CampaignFormData } from "@/lib/schemas/campaign.schema";

export const campaignService = {
  /** Fetch paginated campaign list */
  getCampaigns: (): Promise<Campaign[]> => api.getCampaigns(),

  /** Fetch single campaign by id (mock: filter from list) */
  getCampaignById: async (id: string): Promise<Campaign | undefined> => {
    const list = await api.getCampaigns();
    return list.find((c) => c.id === id);
  },

  /** Create a new campaign */
  createCampaign: (data: CampaignFormData): Promise<{ success: boolean; id: string }> =>
    api.createCampaign(data),

  /** Patch campaign status (mock: resolves immediately) */
  updateCampaignStatus: async (
    id: string,
    status: Campaign["status"]
  ): Promise<{ success: boolean }> => {
    await new Promise((r) => setTimeout(r, 600));
    console.info(`[mock] Campaign ${id} status → ${status}`);
    return { success: true };
  },
};
