"use client";

import { useState } from "react";
import { X, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { createTaskAction, updateTaskAction, deleteTaskAction } from "@/app/actions";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: any; // If provided, we are in Edit mode
  clients: { id: string, name: string, company?: string | null }[];
}

export default function TaskModal({ isOpen, onClose, task, clients }: TaskModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    try {
      if (task) {
        await updateTaskAction(task.id, formData);
      } else {
        await createTaskAction(formData);
      }
      onClose();
    } catch (err: any) {
      setError("Erro ao salvar tarefa.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!task || !confirm("Tem certeza que deseja excluir esta tarefa?")) return;
    setIsPending(true);
    try {
      await deleteTaskAction(task.id);
      onClose();
    } catch (err) {
      setError("Erro ao excluir tarefa.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
          <h2 className="text-xl font-light text-foreground flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-primary" /> {task ? "Editar Tarefa" : "Nova Atividade"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2.5">
            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">O que precisa ser feito?</label>
            <input 
              name="title" 
              defaultValue={task?.title} 
              required 
              placeholder="Ex: Revisar Copy da Landing Page"
              className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-muted-foreground/30 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Prioridade</label>
              <select 
                name="priority" 
                defaultValue={task?.priority || "Média"} 
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-medium text-sm cursor-pointer appearance-none"
              >
                <option value="Baixa">Prio: Baixa</option>
                <option value="Média">Prio: Média</option>
                <option value="Alta">Prio: Alta</option>
              </select>
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Status Atual</label>
              <select 
                name="status" 
                defaultValue={task?.status || "Pendente"} 
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-medium text-sm cursor-pointer appearance-none"
              >
                <option value="Pendente">Pendente</option>
                <option value="Concluída">Concluída</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Associar a Cliente</label>
              <select 
                name="clientId" 
                defaultValue={task?.clientId || ""} 
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-medium text-sm cursor-pointer appearance-none"
              >
                <option value="">Uso Interno Veris</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.company || client.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground ml-1">Prazo de Entrega</label>
              <input 
                name="date" 
                type="date" 
                defaultValue={task?.date ? new Date(task.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} 
                required
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium text-sm appearance-none"
              />
            </div>
          </div>

          {error && <p className="text-sm text-rose-500 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 font-medium tracking-tight">{error}</p>}

          <div className="pt-6 flex items-center justify-between gap-4">
            {task && (
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
            <div className="flex items-center gap-4 ml-auto w-full md:w-auto">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-8 py-3 text-muted-foreground font-medium hover:text-foreground transition-all text-xs uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="flex-1 md:min-w-[160px] bg-primary text-white h-12 px-8 rounded-2xl font-medium hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 text-xs uppercase tracking-widest"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : (task ? "Salvar" : "Criar Tarefa")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
