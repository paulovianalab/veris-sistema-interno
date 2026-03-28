"use client";

import { useState } from "react";
import { X, Loader2, Trash2, Link as LinkIcon, FileText } from "lucide-react";
import { createProposalAction, updateProposalAction, deleteProposalAction } from "@/app/actions";

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal?: any;
  clients: { id: string, name: string, company?: string | null }[];
}

export default function ProposalModal({ isOpen, onClose, proposal, clients }: ProposalModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    try {
      if (proposal) {
        await updateProposalAction(proposal.id, formData);
      } else {
        await createProposalAction(formData);
      }
      onClose();
    } catch (err: any) {
      setError("Erro ao salvar proposta.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!proposal || !confirm("Tem certeza que deseja excluir esta proposta?")) return;
    setIsPending(true);
    try {
      await deleteProposalAction(proposal.id);
      onClose();
    } catch (err) {
      setError("Erro ao excluir proposta.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <h2 className="text-xl font-black text-foreground">
            {proposal ? "Editar Proposta" : "Nova Proposta"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Título da Proposta</label>
            <input 
              name="title" 
              defaultValue={proposal?.title} 
              required 
              placeholder="Ex: Consultoria SEO 2026"
              className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-black placeholder:text-muted-foreground/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Cliente</label>
              <select 
                name="clientId" 
                defaultValue={proposal?.clientId || ""} 
                required
                className="w-full h-12 bg-background border border-border rounded-2xl px-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-bold"
              >
                <option value="" disabled>Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.company || client.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Valor Total (R$)</label>
              <input 
                name="value" 
                type="number" 
                step="0.01" 
                defaultValue={proposal?.value || 0} 
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Status</label>
              <select 
                name="status" 
                defaultValue={proposal?.status || "Enviada"} 
                className="w-full h-12 bg-background border border-border rounded-2xl px-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-bold"
              >
                <option value="Enviada">Para Enviar</option>
                <option value="Em Aberto">Em Aberto</option>
                <option value="Aprovada">Aprovada</option>
                <option value="Recusada">Recusada</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Link do PDF / Proposta</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <input 
                  name="link" 
                  defaultValue={proposal?.link} 
                  placeholder="https://..."
                  className="w-full h-12 pl-11 pr-4 bg-background border border-border rounded-2xl text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium text-xs italic"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-rose-500 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 font-bold">{error}</p>}

          <div className="pt-6 flex items-center justify-between gap-4">
            {proposal && (
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
                className="px-6 py-2.5 text-muted-foreground font-black hover:text-foreground transition-all uppercase tracking-widest text-[10px]"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="min-w-[150px] bg-primary text-white h-12 px-8 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (proposal ? "Salvar" : "Criar Proposta")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
