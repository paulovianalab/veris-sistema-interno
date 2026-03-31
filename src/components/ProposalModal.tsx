"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Loader2, Trash2, FileText } from "lucide-react";
import { createProposalAction, updateProposalAction, deleteProposalAction } from "@/app/actions";
import { servicesData } from "@/lib/constants";

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal?: any;
  clients: { id: string, name: string, company?: string | null }[];
}

export default function ProposalModal({ isOpen, onClose, proposal, clients }: ProposalModalProps) {
    if (!isOpen) return null;

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

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
      
      const benefitSections: string[] = [];
      const investmentSections: string[] = [];

      selectedServices.forEach((serviceKey) => {
        const service = servicesData[serviceKey as keyof typeof servicesData];
        if (!service) return;

        if (service.benefits.length > 0) {
          benefitSections.push(`${service.label}: ${service.benefits.join(", ")}`);
        }
        if (service.investment) {
          investmentSections.push(`${service.label}: ${service.investment}`);
        }
      });

      let finalContent = "";
      if (benefitSections.length > 0) {
        finalContent += "### Entregáveis & Benefícios\n";
        finalContent += benefitSections.join("\n\n") + "\n\n";
      }
      if (investmentSections.length > 0) {
        finalContent += "### Investimento & Prazos\n";
        finalContent += investmentSections.join("\n\n");
      }

      return finalContent.trim();
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
     <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-foreground">
       <div className="bg-card border border-border w-full max-w-sm sm:max-w-md lg:max-w-lg h-screen sm:h-auto sm:max-h-[90vh] rounded-[2rem] shadow-2xl overflow-y-auto sm:overflow-visible animate-in zoom-in-95 duration-200 flex flex-col">
         <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-muted/10 flex-shrink-0">
           <h2 className="text-lg sm:text-xl font-light text-foreground flex items-center gap-2 sm:gap-3">
             <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /> {proposal ? "Editar Proposta" : "Nova Proposta"}
           </h2>
           <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full flex-shrink-0">
             <X className="h-5 w-5 sm:h-6 sm:w-6" />
           </button>
         </div>

         <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
           <div className="space-y-2.5">
             <label className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Título da Proposta Comercial</label>
             <input 
               name="title" 
               defaultValue={proposal?.title} 
               required 
               placeholder="Ex: Consultoria de Performance 2026"
               className="w-full h-10 sm:h-12 bg-background border border-border rounded-2xl px-4 sm:px-5 text-foreground text-sm sm:text-base focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-muted-foreground/30 dark:bg-slate-900"
             />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
             <div className="space-y-2.5">
               <label className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Cliente Prospectado</label>
               <select 
                 name="clientId" 
                 defaultValue={proposal?.clientId || ""} 
                 required
                 className="w-full h-10 sm:h-12 bg-background border border-border rounded-2xl px-4 sm:px-5 text-foreground text-sm sm:text-base focus:ring-2 focus:ring-primary/50 outline-none font-medium appearance-none cursor-pointer dark:bg-slate-900"
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
               <label className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Valor da Proposta (R$)</label>
               <input 
                 name="value" 
                 type="number" 
                 step="0.01" 
                 defaultValue={proposal?.value || 0} 
                 className="w-full h-10 sm:h-12 bg-background border border-border rounded-2xl px-4 sm:px-5 text-foreground text-sm sm:text-base focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium dark:bg-slate-900"
               />
             </div>
           </div>

           <div className="space-y-3">
             <label className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Serviços (Escopo Automático)</label>
             <div className="space-y-2.5">
               {Object.entries(servicesData).map(([key, service]) => (
                 <div key={key} className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                   onClick={() => toggleService(key)}>
                   <input 
                     type="checkbox" 
                     checked={selectedServices.includes(key)}
                     onChange={() => toggleService(key)}
                     className="w-4 h-4 sm:w-5 sm:h-5 mt-1 sm:mt-0.5 rounded border-border bg-background cursor-pointer accent-primary flex-shrink-0"
                   />
                   <div className="flex-1 min-w-0">
                     <p className="font-medium text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">{service.label}</p>
                     <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 line-clamp-2">{service.scope}</p>
                   </div>
                 </div>
               ))}
             </div>
             {selectedServices.length > 0 && (
               <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-xl">
                 <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] text-primary mb-1.5 sm:mb-2">Escopo Gerado:</p>
                 <p className="text-xs sm:text-xs text-foreground whitespace-pre-line leading-relaxed">{generateScope}</p>
               </div>
             )}
           </div>

           <div className="space-y-2.5">
             <label className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Status de Negociação</label>
             <select 
               name="status" 
               defaultValue={proposal?.status || "Enviada"} 
               className="w-full h-10 sm:h-12 bg-background border border-border rounded-2xl px-4 sm:px-5 text-foreground text-sm sm:text-base focus:ring-2 focus:ring-primary/50 outline-none font-medium appearance-none cursor-pointer dark:bg-slate-900"
             >
               <option value="Enviada">Aguardando Envio</option>
               <option value="Em Aberto">Em Aberto</option>
               <option value="Aprovada">Contrato Fechado</option>
               <option value="Recusada">Recusada</option>
             </select>
           </div>

           {error && <p className="text-xs sm:text-sm text-rose-500 bg-rose-500/10 p-3 sm:p-4 rounded-2xl border border-rose-500/20 font-medium tracking-tight">{error}</p>}

           <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-border">
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
             <div className="flex items-center gap-2 sm:gap-4 w-full sm:ml-auto">
               <button 
                 type="button" 
                 onClick={onClose} 
                 className="flex-1 sm:flex-none px-6 sm:px-8 py-2 sm:py-3 text-muted-foreground font-medium hover:text-foreground transition-all text-[11px] sm:text-xs uppercase tracking-widest"
               >
                 Cancelar
               </button>
               <button 
                 type="submit" 
                 disabled={isPending}
                 className="flex-1 sm:min-w-[160px] bg-primary text-white h-10 sm:h-12 px-6 sm:px-8 rounded-2xl font-medium hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-primary/20 text-[11px] sm:text-xs uppercase tracking-widest"
               >
                 {isPending ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-white" /> : (proposal ? "Salvar" : "Criar")}
               </button>
             </div>
           </div>
        </form>
       </div>
     </div>
   );
}
