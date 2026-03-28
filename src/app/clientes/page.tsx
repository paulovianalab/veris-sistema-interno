import prisma from "@/lib/prisma";
import ClientesGrid from "@/components/ClientesGrid";

export default async function ClientesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const filter = (await searchParams).filter || "Todos";

  const dbFilter = filter !== "Todos" ? { type: filter } : {};
  const clients = await prisma.client.findMany({
    where: dbFilter,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <ClientesGrid clients={clients} filter={filter} />
    </div>
  );
}
