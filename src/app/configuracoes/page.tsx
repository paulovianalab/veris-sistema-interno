import prisma from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export default async function ConfigPage() {
  const settings = await prisma.setting.findUnique({ where: { id: "global" } });
  
  return <SettingsForm initialData={settings} />;
}
