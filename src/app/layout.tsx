import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Find The Expert (FTE) - Platform Kolaborasi & Mentoring Ahli Lokal",
  description:
    "Hubungkan pembelajar dan masyarakat dengan mentor dan ahli terverifikasi berdasarkan kategori keahlian dan radius jarak geografis terdekat.",
  keywords: ["Find The Expert", "FTE", "Mentoring", "Konsultasi Ahli", "Belajar", "Peta Ahli"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <ConvexClientProvider>
          <AuthProvider>
            <DataProvider>
              <AppShell>{children}</AppShell>
            </DataProvider>
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
