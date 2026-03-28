"use client";

import { useState } from "react";
import { X, Loader2, Trash2 } from "lucide-react";
import { createClientAction, updateClientAction, deleteClientAction } from "@/app/actions";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: any; // If provided, we are in Edit mode
}

export default function ClientModal({ isOpen, onClose, client }: ClientModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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
      <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <h2 className="text-xl font-black text-foreground">
            {client ? "Editar Cliente" : "Novo Cliente"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Nome do Contato</label>
              <input 
                name="name" 
                defaultValue={client?.name} 
                required 
                placeholder="Ex: João Silva"
                className="w-full h-11 bg-background border border-border rounded-xl px-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Empresa</label>
              <input 
                name="company" 
                defaultValue={client?.company} 
                placeholder="Ex: Veris Agency"
                className="w-full h-11 bg-background border border-border rounded-xl px-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Status / Tipo</label>
              <select 
                name="type" 
                defaultValue={client?.type || "Lead"} 
                className="w-full h-11 bg-background border border-border rounded-xl px-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-bold"
              >
                <option value="Lead">Lead</option>
                <option value="Proposta">Proposta</option>
                <option value="Negociação">Negociação</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Responsável</label>
              <input 
                name="responsible" 
                defaultValue={client?.responsible} 
                required
                placeholder="Ex: Ana Lima"
                className="w-full h-11 bg-background border border-border rounded-xl px-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Valor Mensal (R$)</label>
            <input 
              name="monthlyValue" 
              type="number" 
              step="0.01" 
              defaultValue={client?.monthlyValue || 0} 
              className="w-full h-11 bg-background border border-border rounded-xl px-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Tags (JSON)</label>
            <input 
              name="tags" 
              defaultValue={client?.tags || "[]"} 
              className="w-full h-11 bg-background border border-border rounded-xl px-4 text-foreground text-xs font-bold focus:ring-2 focus:ring-primary/50 outline-none font-mono"
            />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}

          <div className="pt-6 flex items-center justify-between gap-4">
            {client && (
              <button 
                type="button" 
                onClick={handleDelete}
                disabled={isPending}
                className="flex items-center gap-2 text-muted-foreground hover:text-rose-500 transition-colors"
                title="Excluir"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-2.5 text-muted-foreground font-bold hover:text-foreground transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="min-w-[140px] bg-primary text-white h-11 px-6 rounded-xl font-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : (client ? "Salvar" : "Criar Cliente")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
