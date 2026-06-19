"use client";

import React from "react";
import { useRbac } from "@/hooks/use-rbac";
import { PublisherUsersView } from "@/components/features/users/publisher-users-view";
import { AdminUsersView } from "@/components/features/users/admin-users-view";
import { withRbac } from "@/components/providers/rbac-guard";

function UserManagementPageWrapper() {
  const { role } = useRbac();

  if (role === "admin") {
    return <AdminUsersView />;
  }

  return <PublisherUsersView />;
}

export default withRbac(UserManagementPageWrapper, "User Administration", "View Only");
