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
    return matchesSearch;
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
      case "Ativo": return <Badge variant="success">Ativo</Badge>;
      case "Negociação": return <Badge variant="info">Negociação</Badge>;
      case "Proposta": return <Badge variant="warning">Proposta</Badge>;
      case "Lead": return <Badge variant="secondary">Lead</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const tabs = ["Todos", "Lead", "Proposta", "Negociação", "Ativo", "Inativo"];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Clientes & CRM</h1>
          <p className="text-muted-foreground font-medium mt-1">Gestão completa do relacionamento com clientes</p>
        </div>
        <button 
          onClick={openNewModal}
          className="inline-flex items-center justify-center rounded-2xl bg-primary text-white h-12 px-6 font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Novo Cliente
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <Link 
              key={tab} 
              href={`/clientes?filter=${tab}`}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                filter === tab 
                  ? "bg-primary/10 border-primary text-primary shadow-inner" 
                  : "border-border bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </Link>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-card/30 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all text-foreground font-bold shadow-inner"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.length === 0 && (
          <div className="col-span-3 py-24 text-center rounded-3xl border-2 border-dashed border-border bg-muted/10 opacity-70">
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Nenhum cliente por aqui...</p>
          </div>
        )}
        {filteredClients.map(client => (
          <div key={client.id} className="group relative flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-muted dark:bg-zinc-800 flex items-center justify-center text-foreground font-black text-xl border border-border group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-lg">
                  {client.company?.[0]?.toUpperCase() || client.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-foreground text-lg tracking-tight truncate max-w-[150px] leading-tight mb-1">
                    {client.company || client.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(client.type)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => openEditModal(client)}
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-border"
                title="Editar"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 mt-1 bg-muted/30 p-5 rounded-2xl border border-border/50 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-black uppercase tracking-widest">Contato</span>
                <span className="text-foreground font-black tracking-tight">{client.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-border/50 pt-3">
                <span className="text-muted-foreground font-black uppercase tracking-widest">Fee Mensal</span>
                <span className="text-emerald-500 font-extrabold text-base tracking-tighter">
                  R$ {client.monthlyValue.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            {client.instagram && (
              <div className="mt-auto pt-2 overflow-hidden text-center">
                <a 
                  href={`https://instagram.com/${client.instagram.replace('@', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block w-full py-2.5 rounded-xl bg-gradient-to-tr from-primary/10 to-primary/5 border border-primary/20 text-primary hover:bg-primary/20 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm"
                >
                  Ver Instagram
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        client={editingClient} 
      />
    </>
  );
}
