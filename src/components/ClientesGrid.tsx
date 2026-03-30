"use client";

import { useState } from "react";
import { Users, Search, PlusCircle, MoreVertical, Edit2, TrendingUp, Globe } from "lucide-react";
import { Badge } from "@/components/ui/components";
import Link from "next/link";
import ClientModal from "@/components/ClientModal";
import { PrivacyValue } from "@/components/PrivacyToggle";

interface ClientesGridProps {
  clients: any[];
  filter: string;
}

export default function ClientesGrid({ clients, filter }: ClientesGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (c.company || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "Todos" || c.type === filter;
    return matchesSearch && matchesFilter;
  });

  function openNewModal() {
    setEditingClient(null);
    setIsModalOpen(true);
  }

  function openEditModal(client: any) {
    setEditingClient(client);
    setIsModalOpen(true);
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Ativo": return <Badge variant="success" className="px-3 py-1 text-[10px] uppercase font-medium tracking-widest">Ativo</Badge>;
      case "Negociação": return <Badge variant="info" className="px-3 py-1 text-[10px] uppercase font-medium tracking-widest">Negociação</Badge>;
      case "Proposta": return <Badge variant="warning" className="px-3 py-1 text-[10px] uppercase font-medium tracking-widest">Proposta</Badge>;
      case "Lead": return <Badge variant="secondary" className="px-3 py-1 text-[10px] uppercase font-medium tracking-widest">Lead</Badge>;
      default: return <Badge variant="outline" className="px-3 py-1 text-[10px] uppercase font-medium tracking-widest">{status}</Badge>;
    }
  };

  const tabs = ["Todos", "Lead", "Proposta", "Negociação", "Ativo", "Inativo"];

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header Unificado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-primary/60 mb-2">Relacionamento</p>
          <h1 className="text-4xl font-light tracking-tight text-foreground">Clientes & CRM</h1>
          <p className="text-muted-foreground font-medium text-sm mt-3 opacity-60 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary/40" /> {filteredClients.length} Parceiros Registrados
          </p>
        </div>
        <button 
          onClick={openNewModal}
          className="inline-flex items-center justify-center rounded-2xl bg-primary text-white h-12 px-8 font-medium hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 text-xs uppercase tracking-widest gap-2"
        >
          <PlusCircle className="h-4 w-4" /> Novo Registro
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
        <div className="flex flex-wrap gap-2 p-1.5 bg-muted/40 rounded-[1.5rem] border border-border/50">
          {tabs.map(tab => (
            <Link 
              key={tab} 
              href={`/clientes?filter=${tab}`}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all ${
                filter === tab 
                  ? "bg-card text-primary shadow-sm border border-border/50" 
                  : "text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100"
              }`}
            >
              {tab}
            </Link>
          ))}
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-5 rounded-2xl border border-border bg-card/40 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all text-foreground font-medium shadow-inner placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Table Headers */}
        <div className="hidden lg:grid grid-cols-12 px-10 py-5 bg-muted/5 rounded-[1.5rem] border border-border/30 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.3em] opacity-40">
           <div className="col-span-4 pl-4">Identificação / Empresa</div>
           <div className="col-span-2">Responsável</div>
           <div className="col-span-2 text-center text-primary/60">Recorrência</div>
           <div className="col-span-2 text-center">Status Operacional</div>
           <div className="col-span-2 text-right pr-4">Ação</div>
        </div>

        <div className="space-y-4">
          {filteredClients.map(client => (
            <div key={client.id} className="premium-card lg:grid grid-cols-12 flex flex-col p-6 lg:p-0 lg:h-28 items-center px-10 hover:border-primary/20 transition-all group animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="col-span-4 flex items-center w-full pl-4">
                <div className="flex flex-col truncate">
                  <span className="font-medium text-foreground text-lg leading-tight mb-1 truncate tracking-tight group-hover:text-primary transition-colors">{client.company || client.name}</span>
                  <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-[0.2em] opacity-40">ID #{client.id.slice(-6).toUpperCase()}</span>
                </div>
              </div>

              <div className="col-span-2 hidden lg:flex flex-col justify-center">
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{client.name}</span>
                <span className="text-[8px] text-muted-foreground font-medium uppercase tracking-widest mt-1 opacity-30">Account Manager</span>
              </div>

              <div className="col-span-2 hidden lg:flex flex-col justify-center text-center">
                <span className="text-lg font-light text-foreground tracking-tighter">
                  <PrivacyValue value={client.monthlyValue} />
                </span>
                <span className="text-[8px] text-muted-foreground font-medium uppercase tracking-widest mt-1 opacity-30">Fee Mensal Veris</span>
              </div>

              <div className="col-span-2 hidden lg:flex items-center justify-center">
                {getStatusBadge(client.type)}
              </div>

              <div className="col-span-2 flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto mt-6 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-none border-border/40">
                <div className="lg:hidden space-y-2">
                   {getStatusBadge(client.type)}
                   <div className="text-xl font-light text-primary">
                     <PrivacyValue value={client.monthlyValue} />
                   </div>
                </div>

                <div className="flex items-center gap-3 pr-2">
                  {client.instagram && (
                    <a 
                      href={`https://instagram.com/${client.instagram.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl border border-border bg-card/40 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                      title="Instagram"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                  <button 
                    onClick={() => openEditModal(client)}
                    className="p-3 rounded-xl border border-border bg-card/40 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                    title="Editar Registro"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="p-3 rounded-xl border border-border bg-card/40 text-muted-foreground opacity-10 group-hover:opacity-40 hover:opacity-100 transition-all">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredClients.length === 0 && (
            <div className="py-24 text-center rounded-[2rem] border-2 border-dashed border-border bg-muted/5">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.3em] italic opacity-40">Nenhum registro encontrado.</p>
            </div>
          )}
        </div>
      </div>

      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        client={editingClient} 
      />
    </div>
  );
}
