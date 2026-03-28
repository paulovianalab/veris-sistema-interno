"use client";

import { useState } from "react";
import { StickyNote, PlusCircle, Search, MoreVertical, Trash2, Edit3 } from "lucide-react";
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
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Notas Rápidas</h1>
          <p className="text-muted-foreground font-medium mt-1">Anote insights, ideias e lembretes imediatos</p>
        </div>
        <button 
          onClick={openNewModal}
          className="inline-flex items-center justify-center rounded-2xl bg-primary text-white h-12 px-6 font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Nova Nota
        </button>
      </div>

      <div className="relative w-full md:w-80">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Buscar anotação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-card/30 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all text-foreground font-bold shadow-inner"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredNotes.length === 0 && (
          <div className="col-span-4 py-24 text-center rounded-3xl border-2 border-dashed border-border bg-muted/10 opacity-70">
            <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] italic">Bloco de notas vazio...</p>
          </div>
        )}
        {filteredNotes.map(note => (
          <div 
            key={note.id} 
            onClick={() => openEditModal(note)}
            className="group relative flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div className={`h-3 w-14 rounded-full ${note.color} shadow-lg shadow-current/30 group-hover:scale-110 transition-transform`} />
              <button className="text-muted-foreground hover:text-foreground p-1 transition-colors opacity-0 group-hover:opacity-100"><Edit3 className="h-4 w-4" /></button>
            </div>
            <h3 className="font-black text-lg text-foreground leading-tight tracking-tight mt-1">{note.title}</h3>
            <p className="text-sm text-muted-foreground flex-grow leading-relaxed font-bold opacity-80 decoration-primary decoration-2 group-hover:opacity-100 transition-opacity">
              {note.content}
            </p>
            <div className="flex items-center justify-between mt-4 bg-muted/30 p-3 rounded-2xl border border-border/50 shadow-inner">
              <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-primary">
                <StickyNote className="h-3.5 w-3.5" />
                Nota
              </div>
              <span className="text-[10px] text-muted-foreground font-black opacity-60">
                {new Date(note.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <NoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        note={editingNote} 
      />
    </>
  );
}
