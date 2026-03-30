"use client";

import { useState } from "react";
import { PlusCircle, StickyNote, Edit2, Search, Zap } from "lucide-react";
import NoteModal from "@/components/NoteModal";

interface NotasGridProps {
  notes: any[];
}

export default function NotasGrid({ notes }: NotasGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function openNewModal() {
    setEditingNote(null);
    setIsModalOpen(true);
  }

  function openEditModal(note: any) {
    setEditingNote(note);
    setIsModalOpen(true);
  }

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header Unificado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-primary/60 mb-2">Criativo</p>
          <h1 className="text-4xl font-light tracking-tight text-foreground">Central de Insights</h1>
          <p className="text-muted-foreground font-medium text-sm mt-3 opacity-60">Capture ideias, pautas e anotações estratégicas.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="inline-flex items-center justify-center rounded-2xl bg-primary text-white h-12 px-8 font-medium hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 text-xs uppercase tracking-widest gap-2"
        >
          <PlusCircle className="h-4 w-4" /> Nova Anotação
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <input 
            type="text" 
            placeholder="Buscar por termo ou ideia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-5 rounded-2xl border border-border bg-card/40 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all text-foreground font-medium shadow-inner placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredNotes.length === 0 && (
          <div className="col-span-full py-32 text-center rounded-[2.5rem] border-2 border-dashed border-border bg-muted/5">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.3em] italic opacity-40">Nenhum insight por aqui ainda...</p>
          </div>
        )}
        {filteredNotes.map(note => (
          <div 
            key={note.id} 
            className="group relative flex flex-col justify-between p-8 rounded-[2rem] border border-border bg-card hover:border-primary/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden"
          >
            {/* Corner Color Accent */}
            <div className={`absolute top-0 right-0 h-24 w-24 opacity-10 blur-3xl -mr-12 -mt-12 transition-all group-hover:opacity-30 ${note.color}`} />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className={`h-10 w-1 px-0 rounded-full ${note.color} opacity-40 group-hover:opacity-100 transition-all`} />
                <button 
                  onClick={() => openEditModal(note)} 
                  className="p-2.5 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100 border border-border/30"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-foreground text-lg tracking-tight leading-tight group-hover:text-primary transition-colors">
                  {note.title}
                </h3>
                <p className="text-sm font-light text-muted-foreground leading-relaxed line-clamp-6 tracking-tight">
                  {note.content}
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground opacity-40 group-hover:opacity-70 transition-opacity">
               <div className="flex items-center gap-2">
                 <Zap className="h-3 w-3 text-primary" />
                 Atualizada em {new Date(note.updatedAt).toLocaleDateString('pt-BR')}
               </div>
            </div>
          </div>
        ))}
      </div>

      <NoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        note={editingNote} 
      />
    </div>
  );
}
