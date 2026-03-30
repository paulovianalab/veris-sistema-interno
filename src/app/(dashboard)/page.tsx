import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/components";
import { Users, FileText, CheckSquare, Target, TrendingUp, Calendar, Eye, EyeOff, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrivacyValue, PrivacyToggle } from "@/components/PrivacyToggle";
import { getTrelloDataAction } from "@/app/actions";
import ActivityChart from "@/components/ActivityChart";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  let clients: any[] = [];
  let tasks: any[] = [];
  let events: any[] = [];
  let newClientsThisMonth = 0;
  let prevMonthClientsCount = 0;
  let settings: any = null;
  let trelloData: any = null;

  try {
    [clients, tasks, events, newClientsThisMonth, prevMonthClientsCount, settings, trelloData] = await Promise.all([
      prisma.client.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.task.findMany({
        where: { status: "Pendente" },
        orderBy: { date: 'asc' },
        take: 3,
        include: { client: true }
      }),
      prisma.event.findMany({
        where: { date: { gte: now } },
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
      }),
      prisma.setting.findUnique({ where: { id: "global" } }),
      getTrelloDataAction()
    ]);
  } catch (err) {
    console.error("Erro ao carregar dados do dashboard:", err);
  }

  const weeklyGoal = settings?.weeklyGoal || 5000;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const newRevenueThisWeek = clients
    .filter(c => new Date(c.createdAt) >= sevenDaysAgo && c.type === "Ativo")
    .reduce((acc, curr) => acc + curr.monthlyValue, 0);
  
  const goalProgress = Math.min(Math.round((newRevenueThisWeek / weeklyGoal) * 100), 100);

  const activeClients = clients.filter(c => c.type === "Ativo").length;
  const monthlyRevenue = clients
    .filter(c => c.type === "Ativo")
    .reduce((acc, curr) => acc + curr.monthlyValue, 0);

  const clientGrowth = prevMonthClientsCount === 0 
    ? newClientsThisMonth * 100 
    : Math.round(((newClientsThisMonth - prevMonthClientsCount) / prevMonthClientsCount) * 100);

  // Process Trello data for chart
  const trelloLabels = trelloData?.lists?.map((l: any) => l.name) || ["Sem Dados"];
  const trelloChartData = trelloData?.lists?.map((l: any) => 
    trelloData.cards.filter((c: any) => c.idList === l.id).length
  ) || [0];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Ativo": return <Badge variant="success" className="text-[10px] font-medium uppercase px-2 py-0.5">Ativo</Badge>;
      case "Negociação": return <Badge variant="info" className="text-[10px] font-medium uppercase px-2 py-0.5">Negociação</Badge>;
      case "Proposta": return <Badge variant="warning" className="text-[10px] font-medium uppercase px-2 py-0.5">Proposta</Badge>;
      case "Lead": return <Badge variant="secondary" className="text-[10px] font-medium uppercase px-2 py-0.5">Lead</Badge>;
      default: return <Badge variant="outline" className="text-[10px] font-medium uppercase px-2 py-0.5">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-primary/60 mb-2">Visão Executiva</p>
          <h1 className="text-4xl font-light tracking-tight text-foreground">Dashboard</h1>
        </div>
        <div className="flex flex-col items-end gap-3">
           {/* Widget de Meta Semanal - Detalhe Minimalista no Topo */}
           <div className="flex items-center gap-4 bg-primary/5 px-5 py-2 rounded-full border border-primary/10">
              <div className="flex items-center gap-2">
                 <Trophy className="h-3 w-3 text-primary" />
                 <span className="text-[10px] font-medium uppercase tracking-widest text-primary/80">Meta Semanal:</span>
                 <span className="text-[10px] font-medium text-foreground">{goalProgress}%</span>
              </div>
              <div className="w-24 h-1 bg-primary/10 rounded-full overflow-hidden border border-primary/5">
                 <div 
                   className="h-full bg-primary transition-all duration-1000 ease-out" 
                   style={{ width: `${goalProgress}%` }} 
                 />
              </div>
           </div>

           <div className="px-4 py-2 bg-muted/30 border border-border/50 rounded-xl text-[10px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
             <Calendar className="h-3.5 w-3.5" />
             {now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
           </div>
        </div>
      </div>

      {/* Hero Metrics - 4 cards limpos e uniformes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="premium-card p-7 transition-all hover:bg-muted/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Clientes Ativos</span>
            <Users className="h-4 w-4 text-primary/40" />
          </div>
          <div>
            <div className="text-3xl font-light text-foreground">{activeClients}</div>
            <p className="text-[9px] font-medium text-emerald-500 uppercase tracking-widest mt-1.5 opacity-80">Operação Consolidada</p>
          </div>
        </div>

        <div className="premium-card p-7 transition-all hover:bg-muted/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Novos (Mês)</span>
            <Target className="h-4 w-4 text-cyan-500/40" />
          </div>
          <div>
            <div className="text-3xl font-light text-foreground">{newClientsThisMonth}</div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={cn("text-[9px] font-medium uppercase tracking-widest", clientGrowth >= 0 ? "text-emerald-500" : "text-rose-500")}>
                {clientGrowth >= 0 ? "+" : ""}{clientGrowth}% vs anterior
              </span>
            </div>
          </div>
        </div>

        <div className="premium-card p-7 transition-all hover:bg-muted/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Tarefas Pendentes</span>
            <CheckSquare className="h-4 w-4 text-orange-500/40" />
          </div>
          <div>
            <div className="text-3xl font-light text-foreground">{tasks.length}</div>
            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest mt-1.5 opacity-60">Atividades em aberto</p>
          </div>
        </div>

        <div className="premium-card p-7 bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20 relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10 mb-4">
             <span className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-80">Faturamento</span>
             <div className="flex items-center gap-2">
                <PrivacyToggle />
                <TrendingUp className="h-4 w-4 opacity-50" />
             </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-light">
              <PrivacyValue value={monthlyRevenue} />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[9px] font-medium opacity-60 uppercase tracking-widest">
               <span>Total Ativo</span>
               <span>100% Veris</span>
            </div>
          </div>
          <div className="absolute -right-2 -top-2 h-20 w-20 bg-white/10 rounded-full blur-2xl transition-all group-hover:bg-white/20" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="premium-card overflow-hidden">
            <div className="p-6 border-b border-border/40 flex items-center justify-between bg-muted/5">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] flex items-center gap-2">
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
                      <p className="font-medium text-foreground text-sm leading-none mb-1.5">{client.company || client.name}</p>
                      <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">{client.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-medium text-foreground">
                        <PrivacyValue value={client.monthlyValue} />
                      </div>
                      <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5 opacity-50">Mensal</p>
                    </div>
                    {getStatusBadge(client.type)}
                  </div>
                </div>
              ))}
              {clients.length === 0 && <p className="p-10 text-center text-muted-foreground text-[10px] font-medium uppercase tracking-widest opacity-50">Nenhum cliente disponível.</p>}
            </div>
          </div>

          <div className="premium-card p-12">
             <div className="mb-10 flex items-center justify-between">
                <div>
                   <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-primary/80 mb-1.5">Análise de Performance</h3>
                   <p className="text-[10px] text-muted-foreground font-medium italic opacity-40 uppercase tracking-widest">Histórico de interações / Semana</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
             </div>
             {/* Modern Activity Chart */}
             <div className="pt-4 pb-2">
                <ActivityChart data={trelloChartData} labels={trelloLabels} />
             </div>
          </div>
        </div>

        {/* Sidebar Feed */}
        <div className="lg:col-span-4 space-y-8">
          <div className="premium-card overflow-hidden">
            <div className="p-6 border-b border-border/40 bg-muted/5 flex items-center justify-between">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Agenda & Eventos
              </h2>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="p-6 space-y-7">
              {events.map(event => (
                <div key={event.id} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-all">
                  <div className={cn(
                    "h-10 w-1 px-0 rounded-full shrink-0 transition-all",
                    event.type === "Reunião" ? "bg-primary/60" : "bg-orange-500/60"
                  )} />
                  <div className="space-y-1.5 w-full">
                    <div className="flex justify-between items-start">
                       <p className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors leading-tight truncate max-w-[180px]">
                        {event.title}
                       </p>
                       <span className="text-[9px] font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-md whitespace-nowrap tracking-wider">
                         {new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60">
                       <span className="truncate max-w-[140px] font-medium">{event.client?.company || event.client?.name || "Interno"}</span>
                       <span>•</span>
                       <span>{new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                 <div className="py-10 text-center space-y-3">
                    <p className="text-muted-foreground text-[9px] font-medium uppercase tracking-[0.3em] italic opacity-40">Nenhum evento agendado</p>
                 </div>
              )}
              <a 
                href="/agenda" 
                className="block w-full py-3.5 bg-muted/50 hover:bg-muted rounded-2xl text-[9px] font-medium uppercase tracking-[0.2em] text-center transition-all opacity-80"
              >
                Acessar Agenda Completa
              </a>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white space-y-6 relative overflow-hidden group border border-white/5">
             <div className="relative z-10">
                <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-40">Operação Veris</h3>
                <p className="text-xl font-light mt-3 leading-snug tracking-tight">Mantenha o foco na entrega de alto nível e consistência.</p>
                <div className="mt-10 flex flex-col gap-4">
                   <div className="flex items-center justify-between text-[9px] font-medium uppercase tracking-widest">
                      <span className="opacity-40">SLA Médio de Entrega</span>
                      <span className="text-emerald-400">98.5%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-emerald-500/80 w-[98%] transition-all duration-1000" />
                   </div>
                </div>
             </div>
             {/* Subtle pattern */}
             <div className="absolute -right-12 -bottom-12 h-44 w-44 bg-primary/10 rounded-full blur-3xl transition-all group-hover:bg-primary/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
