import { Layout, ExternalLink } from "lucide-react";
import TrelloFeed from "@/components/TrelloFeed";

export default function CronogramaPage() {
  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-primary/60 mb-2">Operacional</p>
          <h1 className="text-4xl font-light tracking-tight text-foreground">Cronograma de Postagens</h1>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href={`https://trello.com/b/${process.env.TRELLO_BOARD_ID}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            Abrir no Trello <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
           <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Layout className="h-4 w-4" />
           </div>
           <h3 className="text-sm font-medium uppercase tracking-[0.3em] text-foreground/80">Quadro Ativo</h3>
        </div>
        
        <div className="premium-card p-2 bg-muted/5 border-dashed border-border/60 shadow-none">
           <TrelloFeed />
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6 relative overflow-hidden group max-w-2xl">
         <div className="relative z-10">
            <h3 className="text-xs font-medium uppercase tracking-widest opacity-60">Dica Operacional</h3>
            <p className="text-xl font-light mt-2 leading-tight">O sincronismo com o Trello ocorre a cada 5 minutos. Card atualizados lá aparecerão aqui automaticamente.</p>
         </div>
         <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all" />
      </div>
    </div>
  );
}
