"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Settings, Moon, Sun, User, Building, Shield, ChevronRight, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { updateSettingsAction } from "@/app/actions";

interface SettingsFormProps {
  initialData: {
    agencyName: string | null;
    theme: string | null;
  } | null;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.currentTarget);
    formData.append("theme", theme);
    
    try {
      await updateSettingsAction(formData);
      setMessage("Configurações salvas com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Erro ao salvar.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Sistema</h2>
        <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-4">
           Configurações
        </h1>
        <p className="text-muted-foreground font-medium">Personalize a identidade e aparência do seu Veris Dashboard.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        {/* Aparência */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Preferências Visuais</h2>
             <div className="h-1 w-20 bg-primary/20 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 shadow-xl ${
                theme === "light" 
                  ? "border-primary bg-primary/[0.03] scale-[1.02]" 
                  : "border-border bg-card/40 hover:bg-card hover:border-primary/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl transition-all ${theme === "light" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"}`}>
                  <Sun className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-black text-foreground tracking-tight">Tema Claro</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5 opacity-70">Ambientes Iluminados</p>
                </div>
              </div>
              {theme === "light" && <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 shadow-xl ${
                theme === "dark" 
                  ? "border-primary bg-primary/[0.03] scale-[1.02]" 
                  : "border-border bg-card/40 hover:bg-card hover:border-primary/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl transition-all ${theme === "dark" ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"}`}>
                  <Moon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-black text-foreground tracking-tight">Tema Escuro</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5 opacity-70">Longas Sessões</p>
                </div>
              </div>
              {theme === "dark" && <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />}
            </button>
          </div>
        </section>

        {/* Agência */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Identidade da Agência</h2>
             <div className="h-1 w-20 bg-primary/20 rounded-full" />
          </div>
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nome de Exibição</label>
                <div className="relative">
                  <Building className="absolute left-5 top-4 h-5 w-5 text-muted-foreground" />
                  <input
                    name="agencyName"
                    defaultValue={initialData?.agencyName || "Veris Digital"}
                    placeholder="Nome da sua agência"
                    className="w-full h-14 pl-14 pr-5 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/40 outline-none transition-all font-black text-foreground placeholder:text-muted-foreground/30 shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">E-mail Administrativo</label>
                <div className="relative">
                  <User className="absolute left-5 top-4 h-5 w-5 text-muted-foreground opacity-50" />
                  <input
                    defaultValue="digitalveris@gmail.com"
                    readOnly
                    className="w-full h-14 pl-14 pr-5 bg-muted/30 border border-border/50 rounded-2xl text-muted-foreground cursor-not-allowed italic font-bold opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Segurança */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Segurança da Conta</h2>
             <div className="h-1 w-20 bg-rose-500/20 rounded-full" />
          </div>
          <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
            <button type="button" className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-all group">
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-muted text-muted-foreground transition-all group-hover:bg-primary group-hover:text-white shadow-sm">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-black text-foreground tracking-tight">Redefinir Senha Administradora</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5 opacity-60">Segurança de acesso ao painel</p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </section>

        <div className="pt-10 flex flex-col items-center gap-6">
          {message && (
            <div className="p-4 px-10 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-black uppercase tracking-widest animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300 shadow-2xl shadow-primary/10">
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto min-w-[280px] h-16 bg-primary text-white rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 group"
          >
            {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Save className="h-6 w-6 transition-transform group-hover:rotate-12" /> Salvar Configurações</>}
          </button>
        </div>
      </form>
    </div>
  );
}
