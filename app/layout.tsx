import type { Metadata } from "next";
import { Oswald, Poppins, Barlow, Architects_Daughter } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { ApprovalsProvider } from "@/lib/contexts/approvals-context";
import { Toaster } from "sonner";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"],
});

const architectsDaughter = Architects_Daughter({
  subsets: ["latin"],
  variable: "--font-architects",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "MOD Pizza Admin Dashboard",
  description: "Global campaign management and screen diagnostics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${poppins.variable} ${barlow.variable} ${architectsDaughter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ApprovalsProvider>
          <QueryProvider>
            <div className="flex min-h-screen flex-col">
              {/* Sidebar & Header would go here */}
              <main className="flex-1">{children}</main>
            </div>

            {/* Global toast notifications (sonner) — richColors uses --primary = MOD Red */}
            <Toaster
              position="bottom-right"
              richColors
              toastOptions={{
                style: {
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: "13px",
                },
              }}
            />
          </QueryProvider>
        </ApprovalsProvider>
      </body>
    </html>
  );
}
