import OutletNetworkPage from "@/components/features/outlets/outlet-network-page";
import { withRbac } from "@/components/providers/rbac-guard";

function OutletsRoute() {
  return <OutletNetworkPage />;
}

export default withRbac(OutletsRoute, "User Administration", "View Only");
