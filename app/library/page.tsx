"use client";

import React, { Suspense } from "react";
import { useRbac } from "@/hooks/use-rbac";
import { AdminLibraryView } from "@/components/features/library/admin-library-view";
import { PublisherLibraryView } from "@/components/features/library/publisher-library-view";
import { withRbac } from "@/components/providers/rbac-guard";

function LibraryPage() {
  const { profile } = useRbac();

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-semibold">Loading Library...</div>}>
      {profile.id === "publisher" ? <PublisherLibraryView /> : <AdminLibraryView />}
    </Suspense>
  );
}

export default withRbac(LibraryPage, "Campaign Management", "View Only");
