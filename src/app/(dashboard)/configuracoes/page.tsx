import prisma from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export const dynamic = 'force-dynamic';


export default async function ConfigPage() {
  try {
    const settings = await prisma.setting.findUnique({ where: { id: "global" } });
    return <SettingsForm initialData={settings} />;
  } catch (error: any) {
    return (
      <div className="p-10 max-w-2xl mx-auto bg-rose-500/10 text-rose-500 border border-rose-500 rounded-xl mt-10">
        <h2 className="font-bold text-lg mb-2">ERRO CAPTURADO NO PRISMA:</h2>
        <pre className="text-xs whitespace-pre-wrap">{error.message || String(error)}</pre>
        {error.stack && <pre className="text-xs mt-4 opacity-50">{error.stack}</pre>}
      </div>
    );
  }
}
