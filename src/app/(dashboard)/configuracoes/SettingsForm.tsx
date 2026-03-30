"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Settings, Moon, Sun, User, Building, Shield, ChevronRight, Save, Loader2, Trophy, Eye } from "lucide-react";
import { useState } from "react";
import { updateSettingsAction } from "@/app/actions";

interface SettingsFormProps {
  initialData: {
    agencyName: string | null;
    theme: string | null;
    weeklyGoal: number | null;
  } | null;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const { theme, setTheme } = useTheme();
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
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-3 border-b border-border pb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-primary/60 mb-1">Customização</p>
        <h1 className="text-4xl font-light tracking-tight text-foreground flex items-center gap-4">
           Configurações do Sistema
        </h1>
        <p className="text-muted-foreground font-medium text-sm">Gerencie a identidade visual e as metas estratégicas da Veris Digital.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-14">
        {/* Aparência */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 px-2">
             <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Sun className="h-4 w-4" />
             </div>
             <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-foreground/80">Interface & Aparência</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex items-center justify-between p-8 rounded-[2.5rem] border transition-all duration-300 ${
                theme === "light" 
                  ? "border-primary bg-primary/[0.03] ring-4 ring-primary/5 shadow-2xl shadow-primary/10" 
                  : "border-border bg-card/40 hover:bg-card hover:border-primary/20"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl transition-all ${theme === "light" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"}`}>
                  <Sun className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground text-lg tracking-tight leading-none mb-1">Claro</p>
                  <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest opacity-70">Daylight optimized</p>
                </div>
              </div>
              {theme === "light" && <div className="h-2 w-2 rounded-full bg-primary" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-between p-8 rounded-[2.5rem] border transition-all duration-300 ${
                theme === "dark" 
                  ? "border-primary bg-primary/[0.03] ring-4 ring-primary/5 shadow-2xl shadow-primary/10" 
                  : "border-border bg-card/40 hover:bg-card hover:border-primary/20"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl transition-all ${theme === "dark" ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"}`}>
                  <Moon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground text-lg tracking-tight leading-none mb-1">Escuro</p>
                  <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest opacity-70">Premium dark mode</p>
                </div>
              </div>
              {theme === "dark" && <div className="h-2 w-2 rounded-full bg-primary" />}
            </button>
          </div>
        </section>

        {/* Metas Estratégicas */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 px-2">
             <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Trophy className="h-4 w-4" />
             </div>
             <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-foreground/80">Objetivos & Metas</h2>
          </div>
          <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                   <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Meta de Novos Fechamentos (Semanal)</label>
                   <Eye className="h-3 w-3 text-primary/40" />
                </div>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
                  <input
                    name="weeklyGoal"
                    type="number"
                    defaultValue={initialData?.weeklyGoal || 5000}
                    className="w-full h-16 pl-14 pr-6 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/40 outline-none transition-all font-medium text-foreground text-xl shadow-inner scroll-none"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium italic opacity-60">Este valor define o progresso da barra exibida no Dashboard principal.</p>
              </div>
              <div className="flex flex-col justify-center p-6 bg-primary/5 rounded-3xl border border-primary/10">
                 <h4 className="text-xs font-medium uppercase tracking-widest text-primary mb-2">Por que definir metas?</h4>
                 <p className="text-xs text-muted-foreground leading-relaxed italic">"Ter uma meta clara de R$ 5.000 por semana ajuda a Veris a manter o ritmo de crescimento e focar na prospecção ativa."</p>
              </div>
            </div>
          </div>
        </section>

        {/* Agência */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 px-2">
             <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Building className="h-4 w-4" />
             </div>
             <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-foreground/80">Perfil da Agência</h2>
          </div>
          <div className="bg-card border border-border rounded-[3rem] p-10 shadow-2xl space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest ml-1">Nome de Marca</label>
                <input
                  name="agencyName"
                  defaultValue={initialData?.agencyName || "Veris Digital"}
                  className="w-full h-14 px-6 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/40 outline-none transition-all font-medium text-foreground tracking-tight text-lg"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest ml-1">E-mail de Suporte Integrado</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30" />
                  <input
                    defaultValue="contato@veris.com.br"
                    readOnly
                    className="w-full h-14 pl-14 pr-6 bg-muted/20 border border-border/50 rounded-2xl text-muted-foreground cursor-not-allowed italic font-medium opacity-50 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-12 flex flex-col items-center gap-8">
          {message && (
            <div className="py-3 px-8 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-medium uppercase tracking-widest animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto min-w-[320px] h-16 bg-primary text-white rounded-[2.5rem] font-medium text-lg hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 group uppercase tracking-widest text-xs"
          >
            {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Save className="h-5 w-5 group-hover:scale-110 transition-transform" /> Efetuar Alterações</>}
          </button>
        </div>
      </form>
    </div>
  );
}
