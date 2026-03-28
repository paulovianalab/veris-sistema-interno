"use client";

import { useState } from "react";
import { PlusCircle, CheckSquare, Clock, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/components";
import { toggleTaskStatusAction } from "@/app/actions";
import TaskModal from "@/components/TaskModal";

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
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Fluxo de Tarefas</h1>
          <p className="text-muted-foreground font-medium mt-1">Gerencie suas atividades e prazos com interatividade</p>
        </div>
        <button 
          onClick={openNewModal}
          className="inline-flex items-center justify-center rounded-2xl bg-primary text-white h-12 px-6 font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Nova Tarefa
        </button>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Pendentes */}
        <div className="space-y-7">
          <h2 className="text-sm font-black flex items-center gap-3 text-muted-foreground uppercase tracking-[0.2em] ml-2">
            <Clock className="h-5 w-5 text-primary" /> Pendentes ({pendingTasks.length})
          </h2>
          <div className="space-y-4">
            {pendingTasks.map(task => (
              <div key={task.id} className="group flex gap-5 p-6 rounded-3xl border border-border bg-card hover:border-primary/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                <button 
                  onClick={() => handleToggle(task)}
                  className="w-7 h-7 rounded-xl border-2 border-border mt-1 flex-shrink-0 hover:bg-primary/20 hover:border-primary transition-all flex items-center justify-center shadow-inner" 
                />
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex justify-between items-start">
                    <span className="font-black text-foreground text-lg group-hover:text-primary transition-colors cursor-pointer leading-tight" onClick={() => openEditModal(task)}>
                      {task.title}
                    </span>
                    <Badge variant={task.priority === "Alta" ? "warning" : "secondary"}>
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs mt-3 bg-muted/40 p-4 rounded-2xl border border-border/50 shadow-inner">
                    <div className="flex flex-col gap-1">
                       <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-black">Cliente</span>
                       <span className="text-foreground font-black tracking-tight">{task.client?.name || "Interno"}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                       <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-black">Prazo</span>
                       <span className="text-primary font-black">{new Date(task.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="py-24 border-2 border-dashed border-border rounded-3xl text-center flex flex-col items-center gap-3">
                <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] italic">Ufa! Tudo em dia por aqui.</p>
              </div>
            )}
          </div>
        </div>

        {/* Concluídas */}
        <div className="space-y-7 opacity-80 transition-opacity hover:opacity-100">
          <h2 className="text-sm font-black flex items-center gap-3 text-muted-foreground uppercase tracking-[0.2em] ml-2">
            <CheckSquare className="h-5 w-5 text-emerald-500" /> Concluídas
          </h2>
          <div className="space-y-4">
            {completedTasks.map(task => (
              <div key={task.id} className="group flex gap-5 p-5 rounded-3xl border border-border bg-card/50 hover:border-emerald-500/30 transition-all">
                <button 
                  onClick={() => handleToggle(task)}
                  className="w-7 h-7 rounded-xl flex items-center justify-center bg-emerald-500 text-white mt-1 flex-shrink-0 border border-emerald-500/20 shadow-lg shadow-emerald-500/20"
                >
                  <CheckSquare className="h-4 w-4" />
                </button>
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-muted-foreground line-through decoration-muted-foreground/50 decoration-2">{task.title}</span>
                    <button onClick={() => openEditModal(task)} className="p-2 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-black uppercase tracking-wider mt-1 ml-1 opacity-70">
                    {task.client?.name || "Interno"}
                  </div>
                </div>
              </div>
            ))}
            {completedTasks.length === 0 && (
              <p className="text-xs text-muted-foreground font-bold italic text-center py-20 uppercase tracking-widest opacity-50">Nenhuma tarefa concluída recentemente.</p>
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
    </>
  );
}
