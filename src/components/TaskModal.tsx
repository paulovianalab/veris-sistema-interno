"use client";

import { useState } from "react";
import { X, Loader2, Trash2 } from "lucide-react";
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
      <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <h2 className="text-xl font-black text-foreground">
            {task ? "Editar Tarefa" : "Nova Tarefa"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Título da Tarefa</label>
            <input 
              name="title" 
              defaultValue={task?.title} 
              required 
              placeholder="Ex: Revisar Copy da Landing Page"
              className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-black placeholder:text-muted-foreground/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Prioridade</label>
              <select 
                name="priority" 
                defaultValue={task?.priority || "Média"} 
                className="w-full h-12 bg-background border border-border rounded-2xl px-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-black"
              >
                <option value="Baixa">🟢 Baixa</option>
                <option value="Média">🟡 Média</option>
                <option value="Alta">🔴 Alta</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Status</label>
              <select 
                name="status" 
                defaultValue={task?.status || "Pendente"} 
                className="w-full h-12 bg-background border border-border rounded-2xl px-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-black"
              >
                <option value="Pendente">Pendente</option>
                <option value="Concluída">Concluída</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Cliente (Opcional)</label>
              <select 
                name="clientId" 
                defaultValue={task?.clientId || ""} 
                className="w-full h-12 bg-background border border-border rounded-2xl px-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-black appearance-none"
              >
                <option value="">Interno / Sem Cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.company || client.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Prazo</label>
              <input 
                name="date" 
                type="date" 
                defaultValue={task?.date ? new Date(task.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} 
                required
                className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Responsável</label>
            <input 
              name="owner" 
              defaultValue={task?.owner} 
              required
              placeholder="Ex: Veris Admin"
              className="w-full h-12 bg-background border border-border rounded-2xl px-5 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-black"
            />
          </div>

          {error && <p className="text-sm text-rose-500 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 font-bold">{error}</p>}

          <div className="pt-6 flex items-center justify-between gap-4">
            {task && (
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
              <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-2.5 text-muted-foreground font-black hover:text-foreground transition-all uppercase tracking-widest text-[10px]"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="min-w-[150px] bg-primary text-white h-12 px-8 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (task ? "Salvar" : "Criar Tarefa")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
