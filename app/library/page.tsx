"use client";

import React, { Suspense } from "react";
import { useRbac } from "@/hooks/use-rbac";
import { LibraryPageContent } from "@/components/features/library";
import { PublisherLibraryView } from "@/components/features/library/publisher-library-view";

export default function LibraryPage() {
  const { profile } = useRbac();

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-semibold">Loading Library...</div>}>
      {profile.id === "publisher" ? <PublisherLibraryView /> : <LibraryPageContent />}
    </Suspense>
  );
}
