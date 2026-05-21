/**
 * lib/schemas/campaign.schema.ts
 * Zod schema mirroring the campaigns DDL from db_structure.txt §2.6
 */
import { z } from "zod";

export const campaignSchema = z.object({
  name: z
    .string({ required_error: "Campaign name is required" })
    .min(3, "Name must be at least 3 characters")
    .max(150, "Name must be under 150 characters"),

  approval_type: z.enum(["Auto", "Manual"], {
    required_error: "Select an approval type",
  }),

  runtime_seconds: z
    .number({ required_error: "Runtime is required" })
    .int()
    .min(1, "Runtime must be at least 1 second")
    .max(86_400 * 30, "Runtime cannot exceed 30 days"),

  outlet_ids: z
    .array(z.string().uuid("Invalid outlet ID"))
    .min(1, "Select at least one outlet"),

  screen_ids: z
    .array(z.string().uuid("Invalid screen ID"))
    .default([]),

  template_id: z.string().uuid("Invalid template ID").optional(),

  coverage_percentage: z
    .number()
    .min(0)
    .max(100)
    .default(0),
});

export type CampaignFormData = z.infer<typeof campaignSchema>;
