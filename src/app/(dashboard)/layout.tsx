import { Sidebar, MobileNav } from "@/components/Navigation";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let agencyName = "Veris Digital";
  try {
    const settings = await prisma.setting.findUnique({ where: { id: "global" } });
    agencyName = settings?.agencyName || "Veris Digital";
  } catch {
    // fallback
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar name={agencyName} />
      <main className="flex-1 md:ml-64 pb-16 md:pb-0 min-h-screen relative">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
