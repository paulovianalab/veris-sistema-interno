import prisma from "@/lib/prisma";
import TarefasGrid from "@/components/TarefasGrid";

export const dynamic = 'force-dynamic';

export default async function TarefasPage() {
  const [pendingTasks, completedTasks, clients] = await Promise.all([
    prisma.task.findMany({
      where: { status: "Pendente" },
      orderBy: { date: "asc" },
      include: { client: true }
    }),
    prisma.task.findMany({
      where: { status: "Concluída" },
      orderBy: { date: "desc" },
      take: 10,
      include: { client: true }
    }),
    prisma.client.findMany({
        orderBy: { name: "asc" }
    })
  ]);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <TarefasGrid pendingTasks={pendingTasks} completedTasks={completedTasks} clients={clients} />
    </div>
  );
}
