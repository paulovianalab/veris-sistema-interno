"use client";

import { useState } from "react";
import { PlusCircle, FileText, ExternalLink, Calendar, Search, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/components";
import ProposalModal from "@/components/ProposalModal";

interface PropostasGridProps {
  proposals: any[];
  clients: any[];
}

export default function PropostasGrid({ proposals, clients }: PropostasGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProposals = proposals.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.client?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  function openNewModal() {
    setEditingProposal(null);
    setIsModalOpen(true);
  }

  function openEditModal(proposal: any) {
    setEditingProposal(proposal);
    setIsModalOpen(true);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aprovada": return <Badge variant="success">Aprovada</Badge>;
      case "Enviada": return <Badge variant="info">Enviada</Badge>;
      case "Recusada": return <Badge variant="destructive">Recusada</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Propostas Comerciais</h1>
          <p className="text-muted-foreground font-medium mt-1">Gerencie propostas, orçamentos e fechamentos</p>
        </div>
        <button 
          onClick={openNewModal}
          className="inline-flex items-center justify-center rounded-2xl bg-primary text-white h-12 px-6 font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Nova Proposta
        </button>
      </div>

      <div className="relative w-full md:w-80">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Buscar proposta ou cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-card/30 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all text-foreground font-bold"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProposals.length === 0 && (
          <div className="col-span-3 py-24 text-center rounded-3xl border-2 border-dashed border-border bg-muted/10 opacity-70">
            <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Nada encontrado por aqui...</p>
          </div>
        )}
        {filteredProposals.map(proposal => (
          <div key={proposal.id} className="group relative flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-muted dark:bg-zinc-800 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEditModal(proposal)} className="p-2 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all group-hover:opacity-100 opacity-0 shadow-sm border border-border">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                {getStatusBadge(proposal.status)}
              </div>
            </div>

            <div>
              <h3 className="font-black text-foreground text-xl tracking-tight leading-tight group-hover:text-primary transition-colors mb-2">
                {proposal.title}
              </h3>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                {proposal.client?.company || proposal.client?.name}
              </p>
            </div>

            <div className="mt-2 space-y-4 bg-muted/40 p-5 rounded-2xl border border-border/50 shadow-inner">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Investimento</span>
                  <span className="text-lg font-black text-foreground tracking-tighter">
                    R$ {proposal.value.toLocaleString('pt-BR')}
                  </span>
               </div>
               <div className="flex items-center justify-between text-xs pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground font-bold">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {new Date(proposal.date).toLocaleDateString('pt-BR')}
                  </div>
                  {proposal.link && (
                    <a 
                      href={proposal.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary font-black hover:underline tracking-tight"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ver PDF <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>

      <ProposalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        proposal={editingProposal} 
        clients={clients}
      />
    </>
  );
}
