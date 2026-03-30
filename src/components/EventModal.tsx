"use client";

import { useState } from "react";
import { X, Loader2, Trash2, Calendar as CalIcon } from "lucide-react";
import { createEventAction, deleteEventAction } from "@/app/actions";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  event?: any;
}

export default function EventModal({ isOpen, onClose, selectedDate, event }: EventModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(eventForm: React.FormEvent<HTMLFormElement>) {
    eventForm.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(eventForm.currentTarget);
    
    try {
      if (event) {
        await deleteEventAction(event.id);
      }
      await createEventAction(formData);
      onClose();
    } catch (err: any) {
      setError("Erro ao salvar evento.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!event || !confirm("Remover este compromisso?")) return;
    setIsPending(true);
    try {
      await deleteEventAction(event.id);
      onClose();
    } catch (err) {
      setError("Erro ao excluir.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <h2 className="text-xl font-light text-foreground flex items-center gap-3">
            <CalIcon className="h-6 w-6 text-primary" /> {event ? "Compromisso" : "Agendar Evento"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Assunto / Título</label>
            <input 
              name="title" 
              defaultValue={event?.title} 
              required 
              placeholder="Ex: Reunião de Alinhamento"
              className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-muted-foreground/30 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Data</label>
              <input 
                name="date" 
                type="date"
                defaultValue={selectedDate ? selectedDate.toISOString().split('T')[0] : event?.date?.split('T')[0]} 
                required 
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium appearance-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Horário</label>
              <input 
                name="time" 
                type="time"
                defaultValue={event?.date ? new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }) : "09:00"} 
                required 
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium appearance-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Tipo de Compromisso</label>
            <select name="type" defaultValue={event?.type || "Reunião"} className="w-full h-12 bg-background border border-border rounded-2xl px-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-medium text-sm appearance-none">
              <option value="Reunião">Reunião</option>
              <option value="Projeto">Projeto</option>
              <option value="Lembrete">Lembrete</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Observações</label>
            <textarea 
              name="description" 
              defaultValue={event?.description} 
              rows={3}
              placeholder="Notas adicionais sobre o compromisso..."
              className="w-full bg-background border border-border rounded-2xl p-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none font-medium text-sm tracking-tight"
            />
          </div>

          {error && <p className="text-sm text-rose-500 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 font-medium tracking-tight">{error}</p>}

          <div className="pt-6 flex items-center justify-between gap-4">
            {event && (
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
            <div className="flex items-center gap-3 ml-auto w-full">
              <button type="submit" disabled={isPending} className="w-full bg-primary text-white h-12 px-8 rounded-2xl font-medium hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 tracking-widest uppercase text-xs">
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (event ? "Salvar Alterações" : "Confirmar Agendamento")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
