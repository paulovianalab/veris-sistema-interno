"use client";

import { useState } from "react";
import { X, Loader2, Trash2, UserPlus, Briefcase } from "lucide-react";
import { createClientAction, updateClientAction, deleteClientAction } from "@/app/actions";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: any; // If provided, we are in Edit mode
}

const verisServices = [
  "Tráfego Pago",
  "SEO & Conteúdo",
  "Social Media",
  "Lojas & Landings",
  "Chatbot Humanizado"
];

export default function ClientModal({ isOpen, onClose, client }: ClientModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeServices = client?.services ? client.services.split(", ") : [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    try {
      if (client) {
        await updateClientAction(client.id, formData);
      } else {
        await createClientAction(formData);
      }
      onClose();
    } catch (err: any) {
      setError("Erro ao salvar cliente.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!client || !confirm("Tem certeza que deseja excluir este cliente?")) return;
    setIsPending(true);
    try {
      await deleteClientAction(client.id);
      onClose();
    } catch (err) {
      setError("Erro ao excluir cliente.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-8 border-b border-border bg-muted/10">
          <h2 className="text-2xl font-light text-foreground flex items-center gap-3">
            <UserPlus className="h-6 w-6 text-primary" /> {client ? "Editar Perfil" : "Novo Cliente"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Dados Básicos */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Nome do Contato</label>
              <input 
                name="name" 
                defaultValue={client?.name} 
                required 
                placeholder="Ex: João Silva"
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-muted-foreground/30 text-sm"
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Empresa / Marca</label>
              <input 
                name="company" 
                defaultValue={client?.company} 
                placeholder="Ex: Veris Agency"
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-muted-foreground/30 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Status na Jornada</label>
              <div className="relative">
                <select 
                  name="type" 
                  defaultValue={client?.type || "Lead"} 
                  className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-medium text-sm appearance-none cursor-pointer"
                >
                  <option value="Lead">Lead</option>
                  <option value="Proposta">Proposta</option>
                  <option value="Negociação">Negociação</option>
                  <option value="Ativo">Cliente Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Instagram (@empresa)</label>
              <input 
                name="instagram" 
                defaultValue={client?.instagram} 
                placeholder="Ex: @veris_agency"
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Faturamento Mensal (Fee Veris)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">R$</span>
              <input 
                name="monthlyValue" 
                type="number" 
                step="0.01" 
                defaultValue={client?.monthlyValue || 0} 
                className="w-full h-12 bg-background border border-border rounded-2xl pl-12 pr-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          {/* Serviços Prestados */}
          <div className="space-y-4 pt-4 border-t border-border/40">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Serviços Contratados (Diferenciais Veris)</label>
            <div className="grid grid-cols-2 gap-3">
              {verisServices.map((service) => (
                <label 
                  key={service} 
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                    activeServices.includes(service) 
                    ? "bg-primary/10 border-primary/30 text-primary" 
                    : "bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20"
                  }`}
                >
                  <input 
                    type="checkbox" 
                    name="services" 
                    value={service} 
                    defaultChecked={activeServices.includes(service)}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/50"
                  />
                  <span className="text-xs font-medium tracking-tight">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-rose-500 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 font-medium tracking-tight">{error}</p>}

          <div className="pt-8 flex items-center justify-between gap-4">
            {client && (
              <button 
                type="button" 
                onClick={handleDelete}
                disabled={isPending}
                className="flex items-center gap-2 text-muted-foreground hover:text-rose-500 transition-colors p-2"
                title="Excluir"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center gap-4 ml-auto w-full md:w-auto">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-8 py-3 text-muted-foreground font-medium hover:text-foreground transition-all text-xs uppercase tracking-widest"
              >
                Voltar
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="flex-1 md:min-w-[180px] bg-primary text-white h-12 px-8 rounded-2xl font-medium hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 text-xs uppercase tracking-widest"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : (client ? "Atualizar Perfil" : "Efetivar Cliente")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
