import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/components";
import { Users, FileText, CheckSquare, Target, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  let clients: any[] = [];
  let tasks: any[] = [];
  let newClientsThisMonth = 0;
  let prevMonthClientsCount = 0;

  try {
    [clients, tasks, newClientsThisMonth, prevMonthClientsCount] = await Promise.all([
      prisma.client.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.task.findMany({
        where: { status: "Pendente" },
        orderBy: { date: 'asc' },
        take: 5,
        include: { client: true }
      }),
      prisma.client.count({
        where: { createdAt: { gte: firstDayOfMonth } }
      }),
      prisma.client.count({
        where: { 
          createdAt: { 
            gte: firstDayOfPrevMonth,
            lt: firstDayOfMonth
          } 
        }
      })
    ]);
  } catch (err) {
    console.error("Erro ao carregar dados do dashboard:", err);
  }

  const activeClients = clients.filter(c => c.type === "Ativo").length;
  const monthlyRevenue = clients
    .filter(c => c.type === "Ativo")
    .reduce((acc, curr) => acc + curr.monthlyValue, 0);

  const clientGrowth = prevMonthClientsCount === 0 
    ? newClientsThisMonth * 100 
    : Math.round(((newClientsThisMonth - prevMonthClientsCount) / prevMonthClientsCount) * 100);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Ativo": return <Badge variant="success">Ativo</Badge>;
      case "Negociação": return <Badge variant="info">Negociação</Badge>;
      case "Proposta": return <Badge variant="warning">Proposta</Badge>;
      case "Lead": return <Badge variant="secondary">Lead</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-primary/60 mb-2">Visão Executiva</p>
          <h1 className="text-4xl font-light tracking-tight text-foreground">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-muted/50 border border-border rounded-xl text-xs font-medium text-muted-foreground flex items-center gap-2">
             <Calendar className="h-3.5 w-3.5" />
             {now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
           </div>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Clientes Ativos</span>
            <Users className="h-4 w-4 text-primary/50" />
          </div>
          <div>
            <div className="text-3xl font-light text-foreground">{activeClients}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] text-emerald-500 font-medium">Consolidado</span>
            </div>
          </div>
        </div>

        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Novos Clientes (Mês)</span>
            <Target className="h-4 w-4 text-cyan-500/50" />
          </div>
          <div>
            <div className="text-3xl font-light text-foreground">{newClientsThisMonth}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={cn("text-[10px] font-medium", clientGrowth >= 0 ? "text-emerald-500" : "text-rose-500")}>
                {clientGrowth >= 0 ? "+" : ""}{clientGrowth}% vs mês ant.
              </span>
            </div>
          </div>
        </div>

        <div className="premium-card p-6 bg-slate-50 dark:bg-slate-900 shadow-inner border-dashed">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Pendências</span>
            <CheckSquare className="h-4 w-4 text-orange-500/50" />
          </div>
          <div>
            <div className="text-3xl font-light text-foreground">{tasks.length}</div>
            <p className="text-[10px] text-muted-foreground font-medium mt-1">Tarefas em aberto</p>
          </div>
        </div>

        <div className="premium-card p-6 bg-primary text-primary-foreground border-none">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-widest opacity-70">Receita Mensal (Fee)</span>
            <TrendingUp className="h-4 w-4 opacity-70" />
          </div>
          <div>
            <div className="text-3xl font-light">R$ {monthlyRevenue.toLocaleString('pt-BR')}</div>
            <div className="h-1 w-full bg-white/20 rounded-full mt-4 overflow-hidden">
               <div className="h-full bg-white w-3/4" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="premium-card overflow-hidden">
            <div className="p-6 border-b border-border/40 flex items-center justify-between bg-muted/5">
              <h2 className="text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Pipeline de Clientes
              </h2>
              <a href="/clientes" className="text-[10px] font-medium text-primary hover:underline uppercase tracking-widest">Gerenciar</a>
            </div>
            <div className="divide-y divide-border/30">
              {clients.slice(0, 5).map(client => (
                <div key={client.id} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-medium text-primary border border-border/50 text-xs">
                      {client.company?.[0]?.toUpperCase() || client.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm leading-none mb-1">{client.company || client.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{client.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium text-foreground">R$ {client.monthlyValue.toLocaleString('pt-BR')}</p>
                      <p className="text-[9px] text-muted-foreground font-medium uppercase">Mensal</p>
                    </div>
                    {getStatusBadge(client.type)}
                  </div>
                </div>
              ))}
              {clients.length === 0 && <p className="p-10 text-center text-muted-foreground text-sm font-medium">Nenhum cliente disponível.</p>}
            </div>
          </div>

          <div className="premium-card p-8">
             <div className="mb-6">
                <h3 className="text-sm font-medium uppercase tracking-widest mb-1">Crescimento de Atividade</h3>
                <p className="text-xs text-muted-foreground font-medium italic">Histórico de interações registradas no sistema</p>
             </div>
             {/* Mock Chart SVG Central */}
             <div className="h-48 w-full flex items-end justify-between gap-3 px-4">
                {[40, 65, 45, 90, 55, 75, 85].map((h, i) => (
                  <div key={i} className="flex-1 group relative">
                    <div 
                      style={{ height: `${h}%` }} 
                      className="bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-all duration-500 border-t border-primary/30"
                    />
                    {i === 3 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-primary">PICO</div>}
                  </div>
                ))}
             </div>
             <div className="flex justify-between mt-4 text-[9px] font-medium text-muted-foreground uppercase tracking-widest px-4 opacity-50">
                <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sab</span><span>Dom</span>
             </div>
          </div>
        </div>

        {/* Sidebar Feed */}
        <div className="lg:col-span-4 space-y-8">
          <div className="premium-card overflow-hidden">
            <div className="p-6 border-b border-border/40 bg-muted/5">
              <h2 className="text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Atividades Críticas
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {tasks.map(task => (
                <div key={task.id} className="flex gap-4 group">
                  <div className={cn(
                    "h-2.5 w-2.5 rounded-full mt-1.5 shrink-0",
                    task.priority === "Alta" ? "bg-rose-500" : "bg-primary"
                  )} />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] font-medium text-muted-foreground uppercase tracking-widest">
                       <span>{task.client?.name || "Interno"}</span>
                       <span>•</span>
                       <span>{new Date(task.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-center text-muted-foreground text-xs font-medium py-10 italic">Nenhuma atividade pendente.</p>}
              <button className="w-full py-3 bg-muted hover:bg-muted/80 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all">
                Ver Todas as Tarefas
              </button>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6 relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-xs font-medium uppercase tracking-widest opacity-60">Operação Veris</h3>
                <p className="text-xl font-light mt-2 leading-tight">Mantenha o foco na entrega de alto nível.</p>
                <div className="mt-8 flex flex-col gap-3">
                   <div className="flex items-center justify-between text-[10px] font-medium">
                      <span className="opacity-60">SLA Médio</span>
                      <span>98.5%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[98%]" />
                   </div>
                </div>
             </div>
             {/* Subtle pattern */}
             <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
