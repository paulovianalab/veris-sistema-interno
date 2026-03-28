"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, CheckSquare, StickyNote, Calendar, Settings, LogOut, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { name: "Visão Geral", href: "/", icon: LayoutDashboard },
  { name: "Clientes & CRM", href: "/clientes", icon: Users },
  { name: "Propostas", href: "/propostas", icon: FileText },
  { name: "Tarefas", href: "/tarefas", icon: CheckSquare },
  { name: "Notas", href: "/notas", icon: StickyNote },
  { name: "Agenda", href: "/agenda", icon: Calendar },
];

export function Sidebar({ name = "Veris Digital" }: { name?: string }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="hidden border-r border-border bg-card md:flex md:w-64 md:flex-col justify-between h-screen fixed transition-all duration-500 shadow-2xl">
      <div className="flex flex-col flex-grow">
        <div className="flex h-24 items-center px-8 border-b border-border/40 bg-muted/5">
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <img src="/logo-veris.png" alt="Veris" className="h-8 w-auto object-contain dark:brightness-200 transition-all group-hover:scale-110" />
            </div>
            <span className="ml-3 bg-primary/10 text-primary text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-primary/20 shadow-sm">
              Interno
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-10">
          <nav className="grid items-start px-4 text-sm font-black space-y-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 group",
                    isActive 
                      ? "bg-primary text-white shadow-2xl shadow-primary/30 scale-[1.02]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border/50"
                  )}
                >
                  <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-primary")} strokeWidth={isActive ? 3 : 2} />
                  <span className="tracking-tight">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-5 border-t border-border/40 bg-muted/5 space-y-5">
        <div className="flex items-center justify-between px-2">
           <button 
             onClick={toggleTheme}
             className="p-3 rounded-2xl bg-card border border-border text-foreground hover:border-primary transition-all shadow-xl hover:shadow-primary/10 hover:-translate-y-1 active:scale-95 group"
             title={theme === "dark" ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
           >
             {theme === "dark" ? <Sun className="h-5 w-5 text-orange-400 group-hover:rotate-45 transition-transform" /> : <Moon className="h-5 w-5 text-indigo-500 group-hover:-rotate-12 transition-transform" />}
           </button>
           <Link href="/configuracoes" className="p-3 rounded-2xl bg-card border border-border text-foreground hover:border-primary transition-all shadow-xl hover:shadow-primary/10 hover:-translate-y-1 active:scale-95">
             <Settings className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
           </Link>
        </div>

        <div className="flex items-center justify-between px-4 py-4 rounded-3xl bg-card border border-border shadow-2xl group/profile hover:border-primary/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-xl shadow-primary/30 group-hover/profile:scale-110 transition-transform">
              {name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <p className="text-[11px] font-black text-foreground uppercase tracking-widest leading-none mb-1">{name}</p>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-muted-foreground font-bold italic opacity-70">Admin On</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => logoutAction()}
            className="text-muted-foreground hover:text-rose-500 transition-all p-2 rounded-xl hover:bg-rose-500/5 hover:rotate-12"
            title="Sair do Sistema"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const mobileLinks = [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "CRM", href: "/clientes", icon: Users },
    { name: "Tarefas", href: "/tarefas", icon: CheckSquare },
    { name: "Perfil", href: "/configuracoes", icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-card/80 backdrop-blur-3xl border border-border/40 rounded-[2.5rem] flex justify-around items-center px-6 z-50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] dark:shadow-none transition-all duration-500">
      {mobileLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center h-full transition-all duration-500 group",
              isActive ? "text-primary scale-110" : "text-muted-foreground"
            )}
          >
            <div className={cn("p-2.5 rounded-2xl transition-all duration-500 mb-1 shadow-sm", isActive ? "bg-primary/20 shadow-primary/20" : "")}>
              <Icon className="h-5 w-5" strokeWidth={isActive ? 3 : 2} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
