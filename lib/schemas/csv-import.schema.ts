/**
 * lib/schemas/csv-import.schema.ts
 * Zod schema for validating a single Papa Parse row before bulk campaign import.
 */
import { z } from "zod";

export const csvCampaignRowSchema = z.object({
  name: z.string().min(3).max(150),
  approval_type: z.enum(["Auto", "Manual"]),
  runtime_seconds: z.coerce.number().int().min(1),
  outlet_ids: z
    .string()
    .transform((v) => v.split("|").map((s) => s.trim()))
    .pipe(z.array(z.string().min(1)).min(1)),
  coverage_percentage: z.coerce.number().min(0).max(100).default(0),
});

export type CsvCampaignRow = z.infer<typeof csvCampaignRowSchema>;

/** CSV column headers expected in the upload file */
export const CSV_CAMPAIGN_HEADERS = [
  "name",
  "approval_type",
  "runtime_seconds",
  "outlet_ids",
  "coverage_percentage",
] as const;
