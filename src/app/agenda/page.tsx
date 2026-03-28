import prisma from "@/lib/prisma";
import AgendaGrid from "@/components/AgendaGrid";

export default async function AgendaPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      <AgendaGrid events={events} />
    </div>
  );
}
