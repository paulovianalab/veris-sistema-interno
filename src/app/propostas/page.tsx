import prisma from "@/lib/prisma";
import PropostasGrid from "@/components/PropostasGrid";

export default async function PropostasPage() {
  const [proposals, clients] = await Promise.all([
    prisma.proposal.findMany({
      include: { client: true },
      orderBy: { date: "desc" }
    }),
    prisma.client.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <PropostasGrid proposals={proposals} clients={clients} />
    </div>
  );
}
