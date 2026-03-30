import prisma from "@/lib/prisma";
import AgendaGrid from "@/components/AgendaGrid";

export const dynamic = 'force-dynamic';

export default async function AgendaPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" }
  });

  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      <AgendaGrid events={events} clients={clients} />
    </div>
  );
}
