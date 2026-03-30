"use client";

import { useState } from "react";
import { Users, Search, PlusCircle, MoreVertical, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/components";
import Link from "next/link";
import ClientModal from "@/components/ClientModal";

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
      case "Ativo": return <Badge variant="success" className="px-3 py-1">Ativo</Badge>;
      case "Negociação": return <Badge variant="info" className="px-3 py-1">Negociação</Badge>;
      case "Proposta": return <Badge variant="warning" className="px-3 py-1">Proposta</Badge>;
      case "Lead": return <Badge variant="secondary" className="px-3 py-1">Lead</Badge>;
      default: return <Badge variant="outline" className="px-3 py-1">{status}</Badge>;
    }
  };

  const tabs = ["Todos", "Lead", "Proposta", "Negociação", "Ativo", "Inativo"];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">Clientes & CRM</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-2 flex items-center gap-2">
            <Users className="h-3 w-3 text-primary" /> {filteredClients.length} Clientes Filtrados
          </p>
        </div>
        <button 
          onClick={openNewModal}
          className="inline-flex items-center justify-center rounded-xl bg-primary text-white h-11 px-6 text-sm font-medium hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Registro
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-border/50">
          {tabs.map(tab => (
            <Link 
              key={tab} 
              href={`/clientes?filter=${tab}`}
              className={`px-4 py-2 rounded-lg text-[11px] font-medium uppercase tracking-wider transition-all ${
                filter === tab 
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm" 
                  : "text-slate-500 hover:text-foreground"
              }`}
            >
              {tab}
            </Link>
          ))}
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filtro rápido por nome ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-11 pr-4 rounded-xl border border-border bg-card/50 text-[13px] focus:ring-1 focus:ring-primary outline-none transition-all text-foreground font-medium placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Table Headers */}
        <div className="hidden lg:grid grid-cols-12 px-12 py-5 bg-muted/20 rounded-2xl border border-border/40 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
           <div className="col-span-4 flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
             Cliente / Empresa
           </div>
           <div className="col-span-2">Gestor / Contato</div>
           <div className="col-span-2">Fee Mensal</div>
           <div className="col-span-2">Status</div>
           <div className="col-span-2 text-right pr-2">Ações</div>
        </div>

        <div className="space-y-3">
          {filteredClients.map(client => (
            <div key={client.id} className="premium-card lg:grid grid-cols-12 flex flex-col p-6 lg:p-0 lg:h-24 items-center px-12 hover:border-primary/30 transition-all group animate-in fade-in duration-500">
              <div className="col-span-4 flex items-center gap-5 w-full">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 font-medium text-sm border border-border/50 shadow-inner">
                  {client.company?.[0]?.toUpperCase() || client.name[0].toUpperCase()}
                </div>
                <div className="flex flex-col truncate">
                  <span className="font-medium text-foreground text-[15px] leading-tight mb-1 truncate tracking-tight">{client.company || client.name}</span>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.1em] opacity-50">Registro #{client.id.slice(-6).toUpperCase()}</span>
                </div>
              </div>

              <div className="col-span-2 hidden lg:flex flex-col justify-center">
                <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">{client.name}</span>
                <span className="text-[9px] text-muted-foreground/60 font-medium uppercase mt-0.5">Responsável</span>
              </div>

              <div className="col-span-2 hidden lg:flex flex-col justify-center">
                <span className="text-[14px] font-light text-foreground tracking-tight">R$ {client.monthlyValue.toLocaleString('pt-BR')}</span>
                <span className="text-[9px] text-muted-foreground/60 font-medium uppercase mt-0.5">Recorrência</span>
              </div>

              <div className="col-span-2 hidden lg:flex items-center">
                {getStatusBadge(client.type)}
              </div>

              <div className="col-span-2 flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto mt-6 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-none border-border/50">
                <div className="lg:hidden space-y-2">
                   <div className="flex items-center gap-2">{getStatusBadge(client.type)}</div>
                   <div className="text-2xl font-light text-primary">R$ {client.monthlyValue.toLocaleString('pt-BR')}</div>
                </div>

                <div className="flex items-center gap-2.5">
                  {client.instagram && (
                    <a 
                      href={`https://instagram.com/${client.instagram.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 text-slate-400 hover:text-primary transition-all shadow-sm"
                      title="Insta"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.247 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.061 1.366-.333 2.633-1.308 3.608-.975.975-2.241 1.247-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.061-2.633-.333-3.608-1.308-.975-.975-1.247-2.241-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.061-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.247 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.352.06-2.274.274-3.082.589-.838.324-1.547.76-2.257 1.467s-1.144 1.419-1.467 2.257c-.315.808-.529 1.73-.589 3.082-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.06 1.352.274 2.274.589 3.082.324.838.76 1.547 1.467 2.257s1.419 1.144 2.257 1.467c.808.315 1.73.529 3.082.589 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.352-.06 2.274-.274 3.082-.589.838-.324 1.547-.76 2.257-1.467s1.144-1.419 1.467-2.257c.315-.808.529-1.73.589-3.082.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.06-1.352-.274-2.274-.589-3.082-.324-.838-.76-1.547-1.467-2.257s-1.419-1.144-2.257-1.467c-.808-.315-1.73-.529-3.082-.589-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  )}
                  <button 
                    onClick={() => openEditModal(client)}
                    className="p-3 rounded-xl border border-border hover:bg-muted text-slate-400 hover:text-primary transition-all shadow-sm group-hover:scale-110"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="p-3 rounded-xl border border-border hover:bg-muted text-slate-400 transition-all opacity-40 group-hover:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredClients.length === 0 && (
            <div className="py-24 text-center rounded-2xl border border-dashed border-border bg-muted/5">
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Nenhum registro encontrado nesta categoria.</p>
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
