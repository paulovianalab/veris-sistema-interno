"use client";

import { useState } from "react";
import { X, Loader2, Trash2, StickyNote } from "lucide-react";
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
      <div className="bg-card border border-border w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
          <h2 className="text-xl font-light text-foreground flex items-center gap-3">
            <StickyNote className="h-6 w-6 text-primary" /> {note ? "Editar Nota" : "Nova Anotação"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2.5">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Assunto / Tópico</label>
            <input 
              name="title" 
              defaultValue={note?.title} 
              required 
              placeholder="Ex: Insight de Marketing"
              className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-muted-foreground/30 text-sm"
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Conteúdo da Nota</label>
            <textarea 
              name="content" 
              defaultValue={note?.content} 
              required 
              placeholder="Escreva algo estratégico..."
              rows={5}
              className="w-full bg-background border border-border rounded-2xl p-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none font-medium text-sm tracking-tight leading-relaxed"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Estilo Visual (Cor)</label>
            <div className="flex gap-3 p-1">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-9 w-9 rounded-xl border-2 transition-all transform hover:scale-110 shadow-lg ${color} ${selectedColor === color ? "border-white ring-2 ring-primary/40 ring-offset-2 ring-offset-background" : "border-transparent"}`}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-rose-500 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 font-medium tracking-tight">{error}</p>}

          <div className="pt-6 flex items-center justify-between gap-4">
            {note && (
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
            <div className="flex items-center gap-3 ml-auto w-full md:w-auto">
              <button type="submit" disabled={isPending} className="w-full md:min-w-[160px] bg-primary text-white h-12 px-8 rounded-2xl font-medium hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 text-xs uppercase tracking-widest">
                {isPending ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : (note ? "Salvar Nota" : "Fixar Nota")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
