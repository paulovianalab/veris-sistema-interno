"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Loader2, Trash2, Link as LinkIcon, FileText } from "lucide-react";
import { createProposalAction, updateProposalAction, deleteProposalAction } from "@/app/actions";

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal?: any;
  clients: { id: string, name: string, company?: string | null }[];
}

const servicesData = {
  ia: {
    label: "IA de Atendimento",
    scope: "Atendimento 24/7, IA Treinada no modelo da empresa, Qualificação de Leads. Investimento: Implementação + Mensalidade R$ 300."
  },
  ecommerce: {
    label: "E-commerce",
    scope: "Design de Banners, Gestão de Catálogo, Ecossistema de Pagamentos e Logística. Prazo: 20 dias úteis. Mensalidade plataforma: a partir de R$ 69."
  },
  social: {
    label: "Social Media & Tráfego",
    scope: "Gestão de 12 posts (4 vídeos) + Tráfego Estratégico em Meta e Google focado em performance."
  },
  site: {
    label: "Site",
    scope: "Design Premium focado em conversão. Entrega a partir de 5 dias. Exemplos: Agência Seu Destino, Cookiery, Souza Jr Adv."
  },
  branding: {
    label: "Branding",
    scope: "Estratégia de marca, Identidade Visual completa (Logo, Cores, Tipografia) e Manual da Marca. Entrega em arquivos PNG, PDF e Vetoriais."
  }
};

export default function ProposalModal({ isOpen, onClose, proposal, clients }: ProposalModalProps) {
   // CRITICAL FIX: Check isOpen BEFORE calling any hooks
   if (!isOpen) {
     return null;
   }

   // NOW we can safely call hooks - they will always be called in the same order
   const [isPending, setIsPending] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [selectedServices, setSelectedServices] = useState<string[]>([]);

   // Initialize services only when modal opens with a proposal
   useEffect(() => {
     if (proposal?.selectedServices) {
       try {
         const parsed = JSON.parse(proposal.selectedServices);
         setSelectedServices(Array.isArray(parsed) ? parsed : []);
       } catch {
         setSelectedServices([]);
       }
     } else {
       setSelectedServices([]);
     }
   }, [proposal]);

   const generateScope = useMemo(() => {
     if (selectedServices.length === 0) return "";
     
     const selectedTexts = selectedServices.map((serviceKey) => {
       const service = servicesData[serviceKey as keyof typeof servicesData];
       return service?.scope || "";
     });

     return selectedTexts.join("\n\n");
   }, [selectedServices]);

  const toggleService = (serviceKey: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceKey)
        ? prev.filter((s) => s !== serviceKey)
        : [...prev, serviceKey]
    );
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("content", generateScope);
    formData.set("selectedServices", JSON.stringify(selectedServices));
    
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
      <div className="bg-card border border-border w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
          <h2 className="text-xl font-light text-foreground flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" /> {proposal ? "Editar Proposta" : "Nova Proposta"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2.5">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Título da Proposta Comercial</label>
            <input 
              name="title" 
              defaultValue={proposal?.title} 
              required 
              placeholder="Ex: Consultoria de Performance 2026"
              className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-muted-foreground/30 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Cliente Prospectado</label>
              <select 
                name="clientId" 
                defaultValue={proposal?.clientId || ""} 
                required
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-medium text-sm appearance-none cursor-pointer"
              >
                <option value="" disabled>Selecione o Cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.company || client.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Valor da Proposta (R$)</label>
              <input 
                name="value" 
                type="number" 
                step="0.01" 
                defaultValue={proposal?.value || 0} 
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Serviços (Escopo Automático)</label>
            <div className="space-y-2.5">
              {Object.entries(servicesData).map(([key, service]) => (
                <div key={key} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => toggleService(key)}>
                  <input 
                    type="checkbox" 
                    checked={selectedServices.includes(key)}
                    onChange={() => toggleService(key)}
                    className="w-5 h-5 mt-0.5 rounded border-border bg-background cursor-pointer accent-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{service.label}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{service.scope}</p>
                  </div>
                </div>
              ))}
            </div>
            {selectedServices.length > 0 && (
              <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary mb-2">Escopo Gerado:</p>
                <p className="text-xs text-foreground whitespace-pre-line leading-relaxed">{generateScope}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Status de Negociação</label>
              <select 
                name="status" 
                defaultValue={proposal?.status || "Enviada"} 
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-medium text-sm appearance-none cursor-pointer"
              >
                <option value="Enviada">Aguardando Envio</option>
                <option value="Em Aberto">Em Aberto</option>
                <option value="Aprovada">Contrato Fechado</option>
                <option value="Recusada">Recusada</option>
              </select>
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Link Externo (PDF/Doc) - Opcional</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <input 
                  name="link" 
                  defaultValue={proposal?.link} 
                  placeholder="https://sua-proposta.pdf"
                  className="w-full h-12 pl-11 pr-5 bg-background border border-border rounded-2xl text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium text-[11px] truncate italic"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-rose-500 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 font-medium tracking-tight">{error}</p>}

          <div className="pt-6 flex items-center justify-between gap-4">
            {proposal && (
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
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="flex-1 md:min-w-[160px] bg-primary text-white h-12 px-8 rounded-2xl font-medium hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 text-xs uppercase tracking-widest"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : (proposal ? "Salvar Proposta" : "Emitir Proposta")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
