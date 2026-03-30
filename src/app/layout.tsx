import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, MobileNav } from "@/components/Navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PrivacyProvider } from "@/components/PrivacyToggle";
import { RootErrorBoundary } from "@/components/RootErrorBoundary";

export const metadata: Metadata = {
  title: "Veris Dashboard",
  description: "Internal CRM and Task Management Dashboard",
  icons: {
    icon: "/favicon.ico",
  },
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Comprehensive protection against external scripts and errors
            (function() {
              // Protect Element.addEventListener from failing
              const originalAddEventListener = Element.prototype.addEventListener;
              Element.prototype.addEventListener = function(...args) {
                try {
                  return originalAddEventListener.apply(this, args);
                } catch (e) {
                  console.warn('[Security] addEventListener error caught:', e.message);
                  return undefined;
                }
              };

              // Protect document.querySelector from failing
              const originalQuerySelector = document.querySelector;
              document.querySelector = function(selector) {
                try {
                  const result = originalQuerySelector.call(document, selector);
                  if (!result) {
                    console.debug('[Security] querySelector returned null for:', selector);
                    return null;
                  }
                  return result;
                } catch (e) {
                  console.warn('[Security] querySelector error caught:', e.message);
                  return null;
                }
              };

              // Protect setTimeout and setInterval from external scripts
              const originalSetTimeout = window.setTimeout;
              window.setTimeout = function(...args) {
                try {
                  return originalSetTimeout.apply(this, args);
                } catch (e) {
                  console.warn('[Security] setTimeout error caught:', e.message);
                  return null;
                }
              };

              const originalSetInterval = window.setInterval;
              window.setInterval = function(...args) {
                try {
                  return originalSetInterval.apply(this, args);
                } catch (e) {
                  console.warn('[Security] setInterval error caught:', e.message);
                  return null;
                }
              };

              // Mark as protected
              window.__VERIS_PROTECTED__ = true;
            })();
          `
        }} />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans selection:bg-primary/30">
        <ThemeProvider>
          <PrivacyProvider>
            <RootErrorBoundary>
              {children}
            </RootErrorBoundary>
          </PrivacyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
