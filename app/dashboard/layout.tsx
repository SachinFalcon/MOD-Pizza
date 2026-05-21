import { LayoutWrapper } from "@/components/features/dashboard/layout-wrapper";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
