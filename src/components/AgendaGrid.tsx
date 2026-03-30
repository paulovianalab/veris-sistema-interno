"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PlusCircle, CheckCircle2 } from "lucide-react";
import EventModal from "@/components/EventModal";
import { cn } from "@/lib/utils";
import { utcToBrasilia } from "@/lib/timezone";

interface AgendaGridProps {
  events: any[];
  clients: any[];
}

export default function AgendaGrid({ events, clients }: AgendaGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simple calendar logic
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();
  const daysCount = daysInMonth(month, year);
  const startDay = firstDayOfMonth(month, year);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const calendarDays = [];
  
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysCount; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  function openNewModal(date: Date) {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  }

  function openEditModal(event: any, e: React.MouseEvent) {
    e.stopPropagation();
    setSelectedEvent(event);
    // Convert UTC date to Brasília timezone
    const eventDateObj = new Date(event.date);
    const brasiliaEventTime = utcToBrasilia(eventDateObj);
    const dateObj = new Date(brasiliaEventTime.year, brasiliaEventTime.month - 1, brasiliaEventTime.day);
    setSelectedDate(dateObj);
    setIsModalOpen(true);
  }

  const getEventsForDay = (date: Date) => {
    return events.filter(e => {
      // Convert the stored UTC date to Brasília timezone for comparison
      const eventDateObj = new Date(e.date);
      const brasiliaEventTime = utcToBrasilia(eventDateObj);
      
      // Compare dates in Brasília timezone
      return brasiliaEventTime.day === date.getDate() && 
             brasiliaEventTime.month === date.getMonth() + 1 && 
             brasiliaEventTime.year === date.getFullYear();
    });
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header Unificado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-primary/60 mb-2">Calendário</p>
          <h1 className="text-4xl font-light tracking-tight text-foreground">Agenda & Eventos</h1>
          <p className="text-muted-foreground font-medium text-sm mt-3 opacity-60">Organize seus compromissos e prazos estratégicos.</p>
        </div>
        <button 
          onClick={() => openNewModal(new Date())}
          className="inline-flex items-center justify-center rounded-2xl bg-primary text-white h-12 px-8 font-medium hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 text-xs uppercase tracking-widest gap-2"
        >
          <PlusCircle className="h-4 w-4" /> Novo Evento
        </button>
      </div>

      <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between p-8 border-b border-border bg-muted/10">
          <div className="flex items-center gap-8">
            <h2 className="text-2xl font-light text-foreground tracking-tight">
              {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2.5 rounded-xl hover:bg-muted border border-border/50 text-muted-foreground hover:text-foreground transition-all group bg-background/50">
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button onClick={nextMonth} className="p-2.5 rounded-xl hover:bg-muted border border-border/50 text-muted-foreground hover:text-foreground transition-all group bg-background/50">
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="hidden sm:flex p-1.5 bg-muted/40 border border-border/50 rounded-2xl">
            <button className="px-6 py-2 rounded-xl bg-card text-foreground font-medium shadow-sm text-[10px] tracking-widest uppercase">Mês</button>
            <button className="px-6 py-2 rounded-xl text-muted-foreground/50 hover:text-foreground font-medium text-[10px] tracking-widest uppercase transition-all">Semana</button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border bg-muted/5">
          {weekDays.map(day => (
            <div key={day} className="py-5 text-center text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.3em]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-muted/5">
          {calendarDays.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="min-h-[140px] md:min-h-[170px] border-r border-b border-border/40 bg-muted/10 opacity-20" />;
            
            const dayEvents = getEventsForDay(date);
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <div 
                key={date.toISOString()} 
                onClick={() => openNewModal(date)}
                className={cn(
                  "min-h-[140px] md:min-h-[180px] p-4 border-r border-b border-border/40 group relative hover:bg-primary/[0.02] transition-all cursor-pointer",
                  isToday ? "bg-primary/[0.04]" : "bg-card"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                   <span className={cn(
                     "inline-flex h-9 w-9 items-center justify-center text-sm rounded-xl transition-all",
                     isToday ? "bg-primary text-white shadow-lg shadow-primary/20 font-medium" : "text-muted-foreground group-hover:text-foreground font-light group-hover:bg-muted group-hover:font-medium"
                   )}>
                    {date.getDate()}
                  </span>
                </div>
                
                <div className="space-y-1.5 overflow-y-auto max-h-[110px] scrollbar-hide">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      onClick={(e) => openEditModal(event, e)}
                      className="text-[9px] p-2.5 px-3 rounded-xl bg-card text-foreground font-medium border border-border/50 truncate hover:border-primary/40 hover:bg-primary/5 transition-all shadow-sm group/event relative flex items-center gap-2"
                    >
                      <div className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        event.type === 'Reunião' ? 'bg-primary' : event.type === 'Lembrete' ? 'bg-orange-500' : 'bg-emerald-500'
                      )} />
                      <span className="truncate opacity-80">{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[9px] text-muted-foreground font-medium px-2 uppercase tracking-tighter opacity-40">
                       + {dayEvents.length - 3} itens
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedDate={selectedDate} 
        event={selectedEvent} 
        clients={clients}
      />
    </div>
  );
}
