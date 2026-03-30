"use client";

import { useState } from "react";
import { PlusCircle, CheckSquare, Clock, Edit2, Briefcase, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/components";
import { toggleTaskStatusAction } from "@/app/actions";
import TaskModal from "@/components/TaskModal";
import { cn } from "@/lib/utils";

interface TarefasGridProps {
  pendingTasks: any[];
  completedTasks: any[];
  clients: any[];
}

export default function TarefasGrid({ pendingTasks, completedTasks, clients }: TarefasGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);

  function openNewModal() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function openEditModal(task: any) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  async function handleToggle(task: any) {
    await toggleTaskStatusAction(task.id, task.status);
  }

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header Unificado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-primary/60 mb-2">Operacional</p>
          <h1 className="text-4xl font-light tracking-tight text-foreground">Fluxo de Atividades</h1>
          <p className="text-muted-foreground font-medium text-sm mt-3 opacity-60">Gerencie sua rotina produtiva e prazos.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="inline-flex items-center justify-center rounded-2xl bg-primary text-white h-12 px-8 font-medium hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 text-xs uppercase tracking-widest gap-2"
        >
          <PlusCircle className="h-4 w-4" /> Nova Atividade
        </button>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Pendentes */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-medium flex items-center gap-3 text-muted-foreground uppercase tracking-[0.3em]">
              <Clock className="h-4 w-4 text-primary/60" /> Pendências ({pendingTasks.length})
            </h2>
            <div className="h-px flex-1 bg-border/40 ml-6" />
          </div>
          
          <div className="space-y-4">
            {pendingTasks.map(task => (
              <div key={task.id} className="group flex gap-6 p-7 rounded-[2.5rem] border border-border bg-card hover:border-primary/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                <button 
                  onClick={() => handleToggle(task)}
                  className="w-8 h-8 rounded-xl border-2 border-border/60 mt-0.5 flex-shrink-0 hover:bg-primary/10 hover:border-primary/40 transition-all flex items-center justify-center bg-background shadow-inner" 
                />
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex justify-between items-start gap-4">
                    <span 
                      className="font-medium text-foreground text-lg group-hover:text-primary transition-colors cursor-pointer leading-tight tracking-tight" 
                      onClick={() => openEditModal(task)}
                    >
                      {task.title}
                    </span>
                    <Badge variant={task.priority === "Alta" ? "warning" : "secondary"} className="text-[9px] font-medium px-2 py-0.5 uppercase tracking-widest shrink-0">
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] font-medium uppercase tracking-[0.2em] mt-3 bg-muted/20 p-5 rounded-2xl border border-border/40 border-dashed">
                    <div className="flex items-center gap-2">
                       <Briefcase className="h-3.5 w-3.5 text-primary/40" />
                       <span className="text-muted-foreground opacity-60">Cliente:</span>
                       <span className="text-foreground">{task.client?.company || task.client?.name || "Veris Internal"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar className="h-3.5 w-3.5 text-primary/40" />
                       <span className="text-muted-foreground opacity-60">Prazo:</span>
                       <span className="text-primary/80">{new Date(task.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="py-32 border-2 border-dashed border-border/60 rounded-[3rem] text-center flex flex-col items-center gap-4 bg-muted/5">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.3em] italic opacity-40">Tudo em dia por aqui.</p>
              </div>
            )}
          </div>
        </div>

        {/* Concluídas */}
        <div className="space-y-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-medium flex items-center gap-3 text-muted-foreground uppercase tracking-[0.3em]">
              <CheckSquare className="h-4 w-4 text-emerald-500/60" /> Finalizadas
            </h2>
            <div className="h-px flex-1 bg-border/40 ml-6" />
          </div>

          <div className="space-y-4">
            {completedTasks.map(task => (
              <div key={task.id} className="group flex gap-6 p-6 rounded-[2rem] border border-border bg-card/40 hover:border-emerald-500/30 transition-all duration-500">
                <button 
                  onClick={() => handleToggle(task)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 mt-0.5 flex-shrink-0 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 group-hover:bg-emerald-500 group-hover:text-white transition-all"
                >
                  <CheckSquare className="h-4 w-4" />
                </button>
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-medium text-muted-foreground line-through decoration-muted-foreground/30 decoration-1 text-sm">{task.title}</span>
                    <button 
                      onClick={() => openEditModal(task)} 
                      className="p-2.5 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100 border border-border/30"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-[0.2em] mt-1 ml-0.5 opacity-40">
                    {task.client?.company || task.client?.name || "Interno"}
                  </p>
                </div>
              </div>
            ))}
            {completedTasks.length === 0 && (
              <div className="py-24 border-2 border-dashed border-border/40 rounded-[2.5rem] flex items-center justify-center bg-muted/5">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.3em] italic opacity-30">Sem registros recentes.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={editingTask} 
        clients={clients}
      />
    </div>
  );
}
