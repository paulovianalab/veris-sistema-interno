import prisma from "@/lib/prisma";
import ClientesGrid from "@/components/ClientesGrid";

export const dynamic = 'force-dynamic';

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
    const url = process.env.TURSO_DATABASE_URL;
    return (
      <div className="p-10 max-w-2xl mx-auto bg-rose-500/10 text-rose-500 border border-rose-500 rounded-xl mt-10">
        <h2 className="font-bold text-lg mb-4">DIAGNÓSTICO VERCEL (Falha de Conexão):</h2>
        <div className="space-y-4 text-xs font-mono">
           <p className="bg-black/50 p-2 rounded">Variável TURSO_DATABASE_URL: {url ? "✅ DEFINIDA!" : "❌ NÃO ENCONTRADA NA VERCEL!"}</p>
           {url && <p className="bg-black/50 p-2 rounded">Valor começa com: {url.substring(0, 15)}...</p>}
           
           <p className="text-white mt-4 font-sans">Se disse que "NÃO ENCONTRADA", significa que o painel da Vercel não repassou as Environment Variables para este deploy.</p>
           
           <div className="bg-red-950 p-4 border border-red-500 rounded mt-4">
               <strong>Erro real disparado pelo Prisma:</strong><br/>
               {error.message || String(error)}
           </div>
        </div>
      </div>
    );
  }
}
