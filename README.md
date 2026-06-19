# MOD Pizza CMS — Frontend

> **MTAS HQ** · Campaign Management & Screen Operations Platform  
> Next.js 16 · TypeScript · Tailwind v4 · Zustand v5 · TanStack Query v5

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Permission Matrix](#2-permission-matrix) ← **Start here for UAT**
3. [Tech Stack](#3-tech-stack)
4. [Architecture](#4-architecture)
5. [Getting Started](#5-getting-started)
6. [Key Modules](#6-key-modules)
7. [Dev Tools](#7-dev-tools)
8. [Production Readiness Checklist](#8-production-readiness-checklist)

---

## 1. Project Overview

MOD Pizza CMS is the internal digital signage management platform for **MTAS HQ**. It allows campaign editors, publishers, and administrators to create, approve, schedule, and monitor promotional content across MOD Pizza's outlet screen network across the USA.

**Core operational flows:**
- Create → Submit → Approve → Publish → Monitor
- Real-time screen health tracking (30-second heartbeat)
- 10-minute deployment acknowledgment window (BRD §24)
- Bulk campaign import via CSV with Zod validation
- Role-based access control enforced at every UI boundary

---

## 2. Permission Matrix

> **UAT Testers:** This table explains exactly why certain buttons, tabs, or sections are visible or hidden for your account. Every gate is enforced by the `<RbacGuard>` component — there is no client-side workaround.

### Access Level Hierarchy

```
No Access  <  View Only  <  Read Only  <  Manage  <  Full Access
```

Higher levels include all lower-level permissions. A `Full Access` user can do everything a `Read Only` user can.

---

### Role Profiles

| Field | Editor | Publisher | Admin |
|---|---|---|---|
| **Example User** | Dev Sachin | Sarah Connor | Dev Sachin |
| **Email** | dev.sachin@mtas.com | sarah.connor@mtas.com | dev.sachin@modpizza.com |
| **Scope** | Chicago HQ | New York HQ | Global Operations HQ |
| **Timezone** | UTC-05:00 (EST) | UTC-05:00 (EST) | UTC-05:00 (EST) |

---

### Module Permission Grid

| Module | Editor | Publisher | Admin |
|---|:---:|:---:|:---:|
| **Campaign Management** | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| **Approvals Queue** | 👁 Read Only | ✅ Full Access | ✅ Full Access |
| **Screen Scheduler** | 👁 Read Only | ✅ Full Access | ✅ Full Access |
| **User Administration** | 🚫 No Access | 👁 Read Only | ⚙️ Manage |
| **System Logs & Audit** | 👁 View Only | 👁 View Only | 👁 View Only |

---

### What This Means Per Role (UAT Cheat Sheet)

#### 🖊 Editor
```
✅ Can create, edit, and submit campaigns
✅ Can browse all campaigns and view reports
✅ Can upload assets and run bulk CSV imports
✅ Can view the screen list (read-only)
❌ Cannot approve or reject campaigns
❌ Cannot see or manage the Timeline (Gantt) scheduler tab
❌ Cannot manage user accounts or roles
❌ Cannot see the User Administration section
```

#### 📢 Publisher
```
✅ Everything an Editor can do
✅ Can approve, reject, and publish campaigns
✅ Can access the full Timeline (Gantt) scheduler
✅ Can add/remove screen assignments in the scheduler
✅ Can view (not edit) user accounts
❌ Cannot modify user roles or permissions
❌ Cannot access Archive & Restore runbooks
```

#### 🔐 Admin
```
✅ Everything a Publisher can do
✅ Can create, modify, and revoke user accounts
✅ Can manage role assignments
✅ Can access System Logs & Audit trails
✅ Can access Archive & Restore runbooks (BRD §31)
✅ Full global scope — all outlets and regions visible
```

---

### UI Element Visibility by Role

| UI Element | Location | Editor | Publisher | Admin | Guard |
|---|---|:---:|:---:|:---:|---|
| **Create Campaign** button | Campaigns page | ✅ | ✅ | ✅ | `Campaign Management → Full Access` |
| **Timeline** tab | Campaigns page | ❌ | ✅ | ✅ | `Screen Scheduler → Full Access` |
| **Approve/Reject** actions | Approvals Queue | ❌ | ✅ | ✅ | `Approvals Queue → Full Access` |
| **User Admin** section | Sidebar | ❌ | 👁 Read | ✅ | `User Administration → Read Only` |
| **Bulk CSV Import** | Library → Assets | ✅ | ✅ | ✅ | _(no guard — all roles)_ |
| **Upload Assets** | Library → Assets | ✅ | ✅ | ✅ | _(no guard — all roles)_ |
| **Reports & Insights** | Reports page | ✅ | ✅ | ✅ | _(no guard — all roles)_ |
| **Archive & Restore** | Admin panel | ❌ | ❌ | ✅ | `User Administration → Manage` |

---

### Deployment Watchdog (BRD §24)

Any campaign deployment that stays in **Pending** state for more than **10 minutes** without a screen heartbeat acknowledgment will:

1. Fire a global `toast.error` notification in the bottom-right of the screen
2. Flag the campaign as **Delayed** in the deployment store
3. Show an **Acknowledge** button on the toast — clicking it clears the flag

This is enforced by `hooks/use-deployment-monitor.ts` polling every 30 seconds.

---

## 3. Tech Stack

| Layer | Library | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 16.x | SSR + routing |
| **Language** | TypeScript | 5.x | Type safety |
| **Styling** | Tailwind CSS | v4 | Utility classes |
| **UI Components** | shadcn/ui | latest | CSS-variable–driven components |
| **State (RBAC)** | Zustand | v5 | Reactive permission store |
| **State (Async)** | TanStack Query | v5 | Server state + polling |
| **Forms** | React Hook Form + Zod | v7 / v3 | Validation aligned to DDL |
| **Charts** | Apache ECharts | v5 | Activity heatmap + performance charts |
| **CSV Import** | Papa Parse | v5 | Bulk campaign import |
| **Toasts** | Sonner | latest | Deployment alert toasts |
| **Scheduler** | Custom renderer | — | Swap-ready for Bryntum/FullCalendar |

---

## 4. Architecture

```
app/
├── layout.tsx              ← QueryProvider + Toaster (global)
├── dashboard/page.tsx      ← KPI stats
├── campaigns/page.tsx      ← List + Timeline (Gantt) views
├── reports/page.tsx        ← ECharts heatmap + performance charts
└── library/page.tsx        ← Assets + Upload + CSV Import

store/
├── rbac.store.ts           ← Role permissions (Zustand + persist)
└── deployment.store.ts     ← Pending queue + delayed flags

hooks/
├── use-rbac.ts             ← useRbac() / useRbacActions()
├── use-campaigns.ts        ← TanStack Query campaign CRUD
├── use-telemetry.ts        ← Screen health polling (30s)
└── use-deployment-monitor.ts  ← 10-min watchdog (BRD §24)

components/
├── providers/
│   ├── rbac-guard.tsx      ← <RbacGuard> + withRbac() HOC
│   └── query-provider.tsx  ← QueryClientProvider wrapper
├── gantt/
│   └── campaign-scheduler.tsx  ← Library-agnostic Gantt renderer
├── telemetry/
│   ├── screen-health-heatmap.tsx       ← ECharts heatmap
│   └── campaign-performance-chart.tsx  ← ECharts bar+line
├── governance/
│   ├── asset-uploader.tsx  ← Drag-drop with progress bars
│   └── csv-importer.tsx    ← Papa Parse + Zod validation
└── dev/
    └── role-switcher.tsx   ← DEV ONLY — floating permission tester

lib/
├── schemas/
│   ├── campaign.schema.ts      ← Zod (aligned to campaigns DDL)
│   └── csv-import.schema.ts    ← Zod row validator for CSV
├── user-roles.ts           ← Role profile definitions
└── utils.ts                ← cn() utility (shadcn)

services/
├── campaign.service.ts     ← Campaign API wrapper
└── telemetry.service.ts    ← Screen health + heatmap data

types/
└── gantt.ts                ← Library-agnostic Gantt contracts
```

### RBAC Guard Decision Flow

```
User visits a guarded page/element
        │
        ▼
useRbac().can(module, requiredAccess)
        │
  ┌─────┴─────┐
  │           │
 YES          NO
  │           │
Render     mode="block"    → Show 403 page
content    mode="hide"     → Render nothing (default)
           mode="readonly" → Render disabled fallback
```

---

## 5. Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
# .env.local — populate when connecting to real backend
NEXT_PUBLIC_API_BASE_URL=https://api.mtas.internal
NEXT_PUBLIC_WS_URL=wss://ws.mtas.internal
```

---

## 6. Key Modules

### Campaigns (`/campaigns`)

- **List view** — sortable/filterable table with status badges
- **Timeline view** — custom Gantt scheduler (Publisher + Admin only)
  - Auto-detects scheduling conflicts (red ring + badge count)
  - Day / Week / Month zoom levels
  - `onSlotClick` opens the Create Campaign modal pre-filled with outlet + date

### Reports (`/reports`)

- **ECharts Activity Heatmap** — hour × day campaign intensity; fetched via `useActivityHeatmap()` (5-min stale time)
- **ECharts Combo Chart** — 6-month approval rate (line) + screen hours (bar)

### Library (`/library`)

Assets tab has three sub-panels:

| Panel | Feature |
|---|---|
| **Browse Assets** | Grid view of uploaded media |
| **Upload Files** | Drag-and-drop with per-file progress bars |
| **Bulk Import CSV** | Papa Parse + Zod validation; previews each row before import |

CSV expected columns: `name, approval_type, runtime_seconds, outlet_ids, coverage_percentage`

### Gantt Scheduler — Library Swap Guide

The scheduler accepts a stable `CampaignSchedulerProps` contract (`types/gantt.ts`). To replace the custom renderer with Bryntum or FullCalendar:

1. Edit only `components/gantt/campaign-scheduler.tsx`
2. Add a local `toVendorTask(t: GanttTask)` adapter
3. `app/campaigns/page.tsx` requires **zero changes**

---

## 7. Dev Tools

### Gantt Logic Testing (Dev Mode Panel)

In development, an amber `[DEV]` panel appears above the Gantt scheduler with three instant test cases:

| Scenario | What it tests |
|---|---|
| **Case A: Clean** | No conflicts — all outlets are distinct |
| **Case B: Conflict** | Two campaigns share an outlet → red ring + conflict count badge |
| **Case C: Stale** | Campaign dispatched >10 min ago → Deployment Watchdog alert fires |

The panel is hidden in production (`process.env.NODE_ENV === "production"`).

### Role Switcher (Floating Panel)

A floating **Dev Role Switcher** appears in the bottom-right corner in development mode. Click it to:

- Switch between Editor / Publisher / Admin instantly
- View the live permission matrix (`✓ Yes` / `✗ No` per guarded feature)
- Confirm exactly which UI elements appear for each role before UAT

---

## 8. Production Readiness Checklist

### Before Go-Live

- [ ] Set `NODE_ENV=production` in the deployment environment — automatically hides all dev tooling
- [ ] Swap `simulateUpload()` in `asset-uploader.tsx` with real `@uppy/xhr-upload` plugin
- [ ] Replace mock functions in `services/campaign.service.ts` and `services/telemetry.service.ts` with real `fetch()` calls
- [ ] Confirm Bryntum Gantt license — if obtained, replace `campaign-scheduler.tsx` internals only (page layer is unchanged)
- [ ] Run `npx shadcn@latest add button dialog form badge table skeleton` for remaining UI components

### UAT Sign-off Status

| Task | Owner | Status |
|---|---|---|
| RBAC Permission Matrix | Dev | ✅ Complete |
| shadcn/ui CSS layer + `--primary` branding | Dev | ✅ Complete |
| Gantt Logic Tests (Cases A / B / C) | Dev | ✅ Complete |
| Deployment Watchdog (BRD §24) | Dev | ✅ Complete |
| RBAC Permission Audit | QA | 🟡 Pending UAT confirmation |
| Real API integration | Dev | 🟡 Pending backend handoff |
| Bryntum license acquisition | PM | 🟡 Pending decision |

---

## Access Level Legend

| Symbol | Level | Meaning |
|:---:|---|---|
| ✅ | Full Access | Create, read, update, delete — everything |
| ⚙️ | Manage | Admin-level CRUD on users and configuration |
| 👁 | Read Only / View Only | Can see the data, cannot modify it |
| ❌ | No Access | Section is hidden; direct URL returns a 403 page |

---

*MOD Pizza MTAS HQ — Internal Use Only*



Editor: dev.sachin@modpizza.com (password: password123)
Publisher: dev.ajay@modpizza.com (password: password123)
Admin: dev.lakshay@modpizza.com (password: password123)