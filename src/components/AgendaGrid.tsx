"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import EventModal from "@/components/EventModal";

interface AgendaGridProps {
  events: any[];
}

export default function AgendaGrid({ events }: AgendaGridProps) {
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

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
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
    setSelectedDate(new Date(event.date));
    setIsModalOpen(true);
  }

  const getEventsForDay = (date: Date) => {
    return events.filter(e => {
      const eDate = new Date(e.date);
      return eDate.getDate() === date.getDate() && 
             eDate.getMonth() === date.getMonth() && 
             eDate.getFullYear() === date.getFullYear();
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Sua Agenda</h1>
          <p className="text-muted-foreground font-medium mt-1">Organize seus compromissos e prazos importantes</p>
        </div>
        <button 
          onClick={() => openNewModal(new Date())}
          className="inline-flex items-center justify-center rounded-2xl bg-primary text-white h-12 px-6 font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Novo Evento
        </button>
      </div>

      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between p-7 border-b border-border bg-muted/20">
          <div className="flex items-center gap-8">
            <h2 className="text-2xl font-black text-foreground tracking-tighter">
              {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
            </h2>
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="p-2.5 rounded-xl hover:bg-muted border border-border text-foreground transition-all group shadow-sm bg-card/50">
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button onClick={nextMonth} className="p-2.5 rounded-xl hover:bg-muted border border-border text-foreground transition-all group shadow-sm bg-card/50">
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="hidden sm:flex p-1 bg-muted/50 border border-border rounded-2xl shadow-inner">
            <button className="px-5 py-2 rounded-xl bg-card text-foreground font-black shadow-lg text-xs tracking-widest uppercase">Mês</button>
            <button className="px-5 py-2 rounded-xl text-muted-foreground hover:text-foreground font-black text-xs tracking-widest uppercase opacity-50">Semana</button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border bg-muted/5">
          {weekDays.map(day => (
            <div key={day} className="py-5 text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] font-mono">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-muted/10">
          {calendarDays.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="min-h-[140px] md:min-h-[180px] border-r border-b border-border/50 bg-muted/20 opacity-30" />;
            
            const dayEvents = getEventsForDay(date);
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <div 
                key={date.toISOString()} 
                onClick={() => openNewModal(date)}
                className={`min-h-[130px] md:min-h-[170px] p-3 border-r border-b border-border group relative hover:bg-primary/[0.04] transition-all cursor-pointer last:border-r-0 ${isToday ? "bg-primary/[0.03]" : "bg-card/40"}`}
              >
                <div className="flex justify-between items-start">
                   <span className={`inline-flex h-9 w-9 items-center justify-center text-sm font-black rounded-xl transition-all shadow-sm ${isToday ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110" : "text-muted-foreground group-hover:text-foreground group-hover:bg-muted"}`}>
                    {date.getDate()}
                  </span>
                </div>
                
                <div className="mt-4 space-y-2 overflow-y-auto max-h-[110px] scrollbar-hide py-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      onClick={(e) => openEditModal(event, e)}
                      className="text-[9px] p-2.5 px-3 rounded-xl bg-card text-foreground font-black border border-border truncate hover:border-primary/50 hover:bg-primary/5 transition-all shadow-md group/event relative"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full border-2 border-background shadow-sm ${event.type === 'Reunião' ? 'bg-primary' : event.type === 'Lembrete' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                        {event.title}
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[9px] text-muted-foreground font-black px-2 uppercase tracking-tighter opacity-70">
                       + {dayEvents.length - 3} mais
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
      />
    </>
  );
}
