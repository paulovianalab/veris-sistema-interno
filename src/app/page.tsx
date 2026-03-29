import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/components";
import { Users, FileText, CheckSquare, Target, TrendingUp, Calendar } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let clients: any[] = [];
  let tasks: any[] = [];

  try {
    [clients, tasks] = await Promise.all([
      prisma.client.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.task.findMany({
        where: { status: "Pendente" },
        orderBy: { date: 'asc' },
        take: 5,
        include: { client: true }
      })
    ]);
  } catch (err) {
    console.error("Erro ao carregar dados do dashboard:", err);
  }

  const activeClients = clients.filter(c => c.type === "Ativo").length;
  const negotiatingClients = clients.filter(c => c.type === "Negociação").length;
  const newLeads = clients.filter(c => c.type === "Lead").length;
  const monthlyRevenue = clients
    .filter(c => c.type === "Ativo")
    .reduce((acc, curr) => acc + curr.monthlyValue, 0);

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
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Painel de Controle</h2>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Visão Geral</h1>
        <p className="text-muted-foreground font-medium">Bem-vindo ao centro de comando da Veris Digital.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-xl bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{activeClients}</div>
            <p className="text-[10px] text-emerald-500 font-bold mt-1">+2 este mês</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-xl bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Em Negociação</CardTitle>
            <Target className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{negotiatingClients}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1">Aguardando feedback</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Novos Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{newLeads}</div>
            <p className="text-[10px] text-orange-500 font-bold mt-1">Potencial de crescimento</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">Receita Mensal</CardTitle>
            <FileText className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">R$ {monthlyRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-[10px] opacity-80 font-bold mt-1">MRR Consolidado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 border-border/50 shadow-2xl bg-card overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/5 p-6">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
               <Users className="h-5 w-5 text-primary" /> Pipeline de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {clients.length === 0 && <p className="p-8 text-center text-muted-foreground font-bold">Nenhum cliente cadastrado.</p>}
              {clients.slice(0, 6).map(client => (
                <div key={client.id} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-muted dark:bg-zinc-800 flex items-center justify-center font-black text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      {client.company?.[0]?.toUpperCase() || client.name[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-foreground tracking-tight leading-none mb-1">{client.company || client.name}</span>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{client.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-black text-foreground hidden sm:block tracking-tighter">
                      R$ {client.monthlyValue.toLocaleString('pt-BR')}
                    </span>
                    {getStatusBadge(client.type)}
                  </div>
                </div>
              ))}
            </div>
            {clients.length > 6 && (
              <div className="p-4 bg-muted/5 text-center border-t border-border/40">
                  <a href="/clientes" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">Ver todos os clientes</a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 border-border/50 shadow-2xl bg-card overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/5 p-6">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" /> Próximas Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {tasks.length === 0 && <p className="p-8 text-center text-muted-foreground font-bold">Nenhuma tarefa pendente.</p>}
              {tasks.map(task => (
                <div key={task.id} className="flex items-start gap-4 p-5 hover:bg-muted/30 transition-all group">
                  <div className="mt-1 h-5 w-5 rounded-lg border-2 border-border group-hover:border-primary transition-colors flex-shrink-0" />
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-start justify-between">
                      <span className="font-black text-sm text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors">{task.title}</span>
                      {task.priority === "Alta" && <div className="h-2 w-2 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" />}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className="text-primary opacity-70">@</span> {task.client?.name || "Interno"}
                      </div>
                      <div className="flex items-center gap-1 opacity-70 uppercase tracking-widest">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {tasks.length > 0 && (
              <div className="p-4 bg-muted/5 text-center border-t border-border/40">
                  <a href="/tarefas" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">Gerenciar Tarefas</a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
