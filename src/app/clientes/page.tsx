import prisma from "@/lib/prisma";
import ClientesGrid from "@/components/ClientesGrid";

export default async function ClientesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const filter = (await searchParams).filter || "Todos";

  const dbFilter = filter !== "Todos" ? { type: filter } : {};
  try {
    const clients = await prisma.client.findMany({
      where: dbFilter,
      orderBy: { createdAt: "desc" }
    });

    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <ClientesGrid clients={clients} filter={filter} />
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-10 max-w-2xl mx-auto bg-rose-500/10 text-rose-500 border border-rose-500 rounded-xl mt-10">
        <h2 className="font-bold text-lg mb-2">ERRO GRAVE NO BANCO DE DADOS (Página de Clientes):</h2>
        <pre className="text-xs whitespace-pre-wrap">{error.message || String(error)}</pre>
        {error.stack && <pre className="text-xs mt-4 opacity-50">{error.stack}</pre>}
      </div>
    );
  }
}
