"use client";

import { useEffect, useState } from "react";
import { ExternalLink, MoreVertical, Layout, CheckCircle2 } from "lucide-react";
import { getTrelloDataAction } from "@/app/actions";
import { cn } from "@/lib/utils";

export default function TrelloFeed() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const result = await getTrelloDataAction();
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 premium-card animate-pulse bg-muted/20" />
        ))}
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="premium-card p-8 text-center bg-rose-500/5 border-rose-500/20">
        <p className="text-xs font-medium text-rose-500 uppercase tracking-widest">{data.error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data?.lists?.map((list: any) => {
        const listCards = data.cards.filter((c: any) => c.idList === list.id);
        
        return (
          <div 
            key={list.id} 
            className="flex flex-col bg-card/40 border border-border/50 rounded-3xl p-5 hover:border-primary/30 transition-all group/list"
          >
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  {list.name}
                </h4>
              </div>
              <span className="text-[9px] font-medium text-muted-foreground/40 bg-muted/30 px-2 py-0.5 rounded-full">
                {listCards.length}
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {listCards.length > 0 ? (
                listCards.map((card: any) => (
                  <a 
                    key={card.id} 
                    href={card.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-4 bg-background border border-border/40 rounded-2xl hover:bg-muted/30 hover:border-primary/20 transition-all group/card relative overflow-hidden"
                  >
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <p className="text-[12px] font-medium text-foreground leading-[1.4] tracking-tight">
                        {card.name}
                      </p>
                      <ExternalLink className="h-3 w-3 text-muted-foreground/30 group-hover/card:text-primary transition-colors mt-0.5 shrink-0" />
                    </div>
                  </a>
                ))
              ) : (
                <div className="h-20 flex flex-col items-center justify-center border border-dashed border-border/30 rounded-2xl opacity-40">
                   <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Sem postagens</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
