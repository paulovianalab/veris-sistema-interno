"use client";

import { useState } from "react";
import { X, Loader2, Trash2 } from "lucide-react";
import { createNoteAction, updateNoteAction, deleteNoteAction } from "@/app/actions";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: any;
}

const colors = [
  "bg-cyan-500", "bg-orange-500", "bg-emerald-500", "bg-rose-500", "bg-purple-500", "bg-zinc-700"
];

export default function NoteModal({ isOpen, onClose, note }: NoteModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(note?.color || "bg-cyan-500");

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.append("color", selectedColor);
    
    try {
      if (note) {
        await updateNoteAction(note.id, formData);
      } else {
        await createNoteAction(formData);
      }
      onClose();
    } catch (err: any) {
      setError("Erro ao salvar nota.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!note || !confirm("Tem certeza que deseja excluir esta nota?")) return;
    setIsPending(true);
    try {
      await deleteNoteAction(note.id);
      onClose();
    } catch (err) {
      setError("Erro ao excluir nota.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <h2 className="text-xl font-black text-foreground">
            {note ? "Editar Nota" : "Nova Nota"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Assunto</label>
            <input 
              name="title" 
              defaultValue={note?.title} 
              required 
              placeholder="Ex: Ideias de Marketing"
              className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-black placeholder:text-muted-foreground/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Conteúdo</label>
            <textarea 
              name="content" 
              defaultValue={note?.content} 
              required 
              placeholder="Escreva algo brilhante..."
              rows={4}
              className="w-full bg-background border border-border rounded-2xl p-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none font-bold"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Cor do Card</label>
            <div className="flex gap-3 p-1">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-9 w-9 rounded-2xl border-2 transition-all transform hover:scale-110 shadow-lg ${color} ${selectedColor === color ? "border-white ring-2 ring-primary" : "border-transparent"}`}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-rose-500 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 font-bold">{error}</p>}

          <div className="pt-6 flex items-center justify-between gap-4">
            {note && (
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
              <button type="submit" disabled={isPending} className="min-w-[150px] bg-primary text-white h-12 px-8 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (note ? "Salvar" : "Criar Nota")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
