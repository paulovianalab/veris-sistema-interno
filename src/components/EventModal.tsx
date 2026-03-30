"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Trash2, Calendar as CalIcon } from "lucide-react";
import { createEventAction, deleteEventAction } from "@/app/actions";
import { utcToBrasilia } from "@/lib/timezone";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  event?: any;
  clients: any[];
}

export default function EventModal({ isOpen, onClose, selectedDate, event, clients }: EventModalProps) {
  // CRITICAL FIX: Check isOpen BEFORE calling any hooks
  if (!isOpen) {
    return null;
  }

  // NOW we can safely call hooks - they will always be called in the same order
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventDateDisplay, setEventDateDisplay] = useState<string>(""); // DD/MM/YYYY format for display
  const [eventTimeDisplay, setEventTimeDisplay] = useState<string>(""); // HH:MM format for display
  const [internalDate, setInternalDate] = useState<string>(""); // YYYY-MM-DD for form submission
  const [internalTime, setInternalTime] = useState<string>(""); // HH:MM for form submission

  // Helper functions
  const brazilDateToISO = (brazilDate: string): string => {
    const parts = brazilDate.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return "";
  };

  const isoDateToBrazil = (isoDate: string): string => {
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return "";
  };

  // Initialize date and time when modal opens or event changes
  useEffect(() => {
    if (event?.date) {
      // Convert UTC date from database to Brasília time
      const eventDateObj = new Date(event.date);
      const brasiliaTime = utcToBrasilia(eventDateObj);
      const displayDate = isoDateToBrazil(brasiliaTime.dateStr);
      setEventDateDisplay(displayDate);
      setEventTimeDisplay(brasiliaTime.timeStr);
      setInternalDate(brasiliaTime.dateStr);
      setInternalTime(brasiliaTime.timeStr);
    } else if (selectedDate) {
      // For new events, use the selected date
      const brasiliaTime = utcToBrasilia(selectedDate);
      const displayDate = isoDateToBrazil(brasiliaTime.dateStr);
      setEventDateDisplay(displayDate);
      setEventTimeDisplay("09:00");
      setInternalDate(brasiliaTime.dateStr);
      setInternalTime("09:00");
    }
  }, [event, selectedDate]);

  // Handle date input change (DD/MM/YYYY format)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEventDateDisplay(value);
    const isoDate = brazilDateToISO(value);
    setInternalDate(isoDate);
  };

  // Handle time input change (HH:MM format)
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEventTimeDisplay(value);
    setInternalTime(value);
  };

  async function handleSubmit(eventForm: React.FormEvent<HTMLFormElement>) {
    eventForm.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(eventForm.currentTarget);
    
    // Use the internal ISO format date for submission
    if (internalDate) {
      formData.set("date", internalDate);
    }
    if (internalTime) {
      formData.set("time", internalTime);
    }
    
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

          <div className="space-y-2">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Cliente Associado (Opcional)</label>
            <select 
              name="clientId" 
              defaultValue={event?.clientId || ""} 
              className="w-full h-12 bg-background border border-border rounded-2xl px-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-medium text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
            >
              <option value="">Nenhum Cliente</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.company || c.name}</option>
              ))}
            </select>
          </div>

           <div className="grid grid-cols-2 gap-5">
             <div className="space-y-2">
               <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Data (DD/MM/YYYY)</label>
               <input 
                 name="date" 
                 type="text"
                 inputMode="numeric"
                 placeholder="DD/MM/YYYY"
                 value={eventDateDisplay}
                 onChange={handleDateChange}
                 required 
                 className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium appearance-none text-sm"
               />
               <input 
                 type="hidden"
                 name="date-internal" 
                 value={internalDate}
               />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Horário (HH:MM)</label>
               <input 
                 name="time" 
                 type="time"
                 value={eventTimeDisplay}
                 onChange={handleTimeChange}
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
