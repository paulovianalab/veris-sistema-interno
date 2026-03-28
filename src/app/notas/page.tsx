import prisma from "@/lib/prisma";
import NotasGrid from "@/components/NotasGrid";

export const dynamic = 'force-dynamic';

export default async function NotasPage() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      <NotasGrid notes={notes} />
    </div>
  );
}
