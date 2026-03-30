"use client";

import { useState } from "react";
import { PlusCircle, FileText, ExternalLink, Calendar, Search, Edit2, Briefcase, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/components";
import ProposalModal from "@/components/ProposalModal";
import { PrivacyValue } from "@/components/PrivacyToggle";

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
      case "Aprovada": return <Badge variant="success" className="text-[10px] font-medium uppercase px-2 py-0.5">Aprovada</Badge>;
      case "Enviada": return <Badge variant="info" className="text-[10px] font-medium uppercase px-2 py-0.5">Enviada</Badge>;
      case "Recusada": return <Badge variant="destructive" className="text-[10px] font-medium uppercase px-2 py-0.5">Recusada</Badge>;
      default: return <Badge variant="secondary" className="text-[10px] font-medium uppercase px-2 py-0.5">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header Unificado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-primary/60 mb-2">Estratégico</p>
          <h1 className="text-4xl font-light tracking-tight text-foreground">Propostas Comerciais</h1>
          <p className="text-muted-foreground font-medium text-sm mt-3 opacity-60">Gerencie propostas, orçamentos e fechamentos.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="inline-flex items-center justify-center rounded-2xl bg-primary text-white h-12 px-8 font-medium hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 text-xs uppercase tracking-widest gap-2"
        >
          <PlusCircle className="h-4 w-4" /> Nova Proposta
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <input 
            type="text" 
            placeholder="Buscar por título ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-5 rounded-2xl border border-border bg-card/40 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all text-foreground font-medium shadow-inner placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProposals.length === 0 && (
          <div className="col-span-full py-32 text-center rounded-[2.5rem] border-2 border-dashed border-border bg-muted/5">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.3em] italic opacity-40">Nenhuma proposta encontrada...</p>
          </div>
        )}
        {filteredProposals.map(proposal => (
          <div key={proposal.id} className="group relative flex flex-col gap-6 rounded-[2.5rem] border border-border bg-card p-8 hover:border-primary/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="p-4 rounded-[1.25rem] bg-muted/50 text-primary border border-border/50 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => openEditModal(proposal)} 
                  className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100 border border-border/50"
                  title="Editar"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                {getStatusBadge(proposal.status)}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-foreground text-xl tracking-tight leading-tight group-hover:text-primary transition-colors mb-3">
                {proposal.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-60">
                 <Briefcase className="h-3 w-3" />
                 {proposal.client?.company || proposal.client?.name}
              </div>
            </div>

            <div className="mt-auto pt-6 space-y-5 border-t border-border/40">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground opacity-60">Investimento</span>
                  <div className="text-xl font-light text-foreground tracking-tight">
                    <PrivacyValue value={proposal.value} />
                  </div>
               </div>
               <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-2 text-muted-foreground opacity-60">
                    <Calendar className="h-3.5 w-3.5 text-primary/60" />
                    {new Date(proposal.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/p/${proposal.id}`}
                      target="_blank"
                      className="group/link flex items-center gap-2 text-primary font-semibold hover:brightness-110 transition-all"
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Proposta Digital
                    </Link>
                    {proposal.link && (
                      <a 
                        href={proposal.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-foreground transition-all ml-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        PDF <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
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
    </div>
  );
}
