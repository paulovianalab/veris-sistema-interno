import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, MobileNav } from "@/components/Navigation";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Veris Dashboard",
  description: "Internal CRM and Task Management Dashboard",
};

import prisma from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let agencyName = "Veris Digital";
  try {
    const settings = await prisma.setting.findUnique({ where: { id: "global" } });
    agencyName = settings?.agencyName || "Veris Digital";
  } catch {
    // fallback to default if DB unavailable during build
  }

  return (
    <html lang="pt-BR" className="h-full antialiased dark transition-colors duration-300">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans selection:bg-primary/30">
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar name={agencyName} />
            <main className="flex-1 md:ml-64 pb-16 md:pb-0 min-h-screen relative">
              {children}
            </main>
            <MobileNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
