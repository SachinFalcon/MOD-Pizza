/**
 * types/gantt.ts
 *
 * Library-agnostic contract for the Gantt scheduler.
 *
 * These types are the ONLY thing app/campaigns/page.tsx knows about.
 * The actual rendering library (Bryntum, FullCalendar, DHTMLX, or our
 * custom renderer) lives entirely inside components/gantt/campaign-scheduler.tsx.
 *
 * To swap libraries: change the internals of CampaignScheduler — NOT these types.
 *
 * Schema alignment:
 *   GanttTask      → campaigns table (db_structure.txt §2.6)
 *   GanttResource  → outlets table   (db_structure.txt §2.4)
 *   GanttConflict  → derived: overlapping campaign_outlets rows
 */

// ─── Core Task (= one Campaign) ───────────────────────────────────────────────

export type GanttTaskStatus =
  | "Draft"
  | "Approved"
  | "Live"
  | "Sent"
  | "Sent for Approval"
  | "Under Modification";

export interface GanttTask {
  /** campaigns.id */
  id: string;

  /** campaigns.name */
  name: string;

  /**
   * Display start of the task bar.
   * Maps to campaigns.created_at (draft epoch) or campaigns.submitted_at
   * depending on view mode.
   */
  startDate: Date;

  /**
   * Display end of the task bar.
   * Derived: startDate + campaigns.runtime_seconds
   */
  endDate: Date;

  /** campaigns.status */
  status: GanttTaskStatus;

  /** campaigns.approval_type */
  approvalType: "Auto" | "Manual";

  /** campaigns.coverage_percentage */
  coveragePercent: number;

  /**
   * Outlet IDs this campaign targets (from campaign_outlets join table).
   * Used to calculate which Gantt rows (resources) this task belongs to.
   */
  outletIds: string[];

  /** Human-readable runtime for tooltip display */
  runtimeLabel: string;

  /** Optional creator name for tooltip */
  creatorName?: string;
}

// ─── Resource (= one Outlet row in the Gantt) ─────────────────────────────────

export interface GanttResource {
  /** outlets.id */
  id: string;

  /** outlets.name */
  name: string;

  /** outlets.region */
  region: string;

  /** outlets.city + outlets.state */
  location?: string;
}

// ─── Conflict (derived — two tasks overlap on the same resource) ──────────────

export interface GanttConflict {
  /** IDs of the two conflicting tasks */
  taskIds: [string, string];

  /** The shared outlet/resource where the conflict occurs */
  resourceId: string;

  /**
   * Overlap window — the time range where both campaigns are live
   * on the same outlet simultaneously.
   */
  overlapStart: Date;
  overlapEnd: Date;
}

// ─── View Controls ────────────────────────────────────────────────────────────

export type GanttViewMode = "day" | "week" | "month";

// ─── Scheduler Props (stable public API for the consuming page) ───────────────

export interface CampaignSchedulerProps {
  tasks: GanttTask[];
  resources: GanttResource[];

  /** Pre-computed conflicts. If not provided, the scheduler will compute them. */
  conflicts?: GanttConflict[];

  /** Viewport start. Defaults to the earliest task start. */
  viewStart?: Date;

  /** Viewport end. Defaults to the latest task end. */
  viewEnd?: Date;

  /** Initial zoom level */
  defaultViewMode?: GanttViewMode;

  /** IANA timezone string from the user's profile (Zustand) */
  timezone?: string;

  /**
   * Called when a task bar is clicked.
   * The consuming page can open a campaign detail drawer.
   */
  onTaskClick?: (task: GanttTask) => void;

  /**
   * Called when the user requests to create a campaign starting
   * at a specific outlet + date (drag-to-create interaction).
   */
  onSlotClick?: (resourceId: string, date: Date) => void;

  /** Loading skeleton state */
  isLoading?: boolean;
}
