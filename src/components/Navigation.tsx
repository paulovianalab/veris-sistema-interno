"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, CheckSquare, StickyNote, Calendar, Settings, LogOut, Moon, Sun, Layout } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { name: "Visão Geral", href: "/", icon: LayoutDashboard },
  { name: "Clientes & CRM", href: "/clientes", icon: Users },
  { name: "Cronograma", href: "/cronograma", icon: Layout },
  { name: "Propostas", href: "/propostas", icon: FileText },
  { name: "Tarefas", href: "/tarefas", icon: CheckSquare },
  { name: "Notas", href: "/notas", icon: StickyNote },
  { name: "Agenda", href: "/agenda", icon: Calendar },
];

export function Sidebar({ name = "Veris Digital" }: { name?: string }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="hidden border-r border-border bg-card md:flex md:w-64 md:flex-col justify-between h-screen fixed transition-colors duration-300">
      <div className="flex flex-col flex-grow">
        <div className="flex h-20 items-center px-6 border-b border-border/40">
          <Link href="/" className="flex items-center">
            <img src="/logo-veris.png" alt="Veris" className="h-7 w-auto object-contain dark:brightness-200" />
            <span className="ml-2.5 text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground opacity-50">
              Internal
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-8">
          <nav className="grid items-start px-3 text-sm font-medium space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 relative group",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-slate-500 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  )}
                >
                  {isActive && <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />}
                  <Icon className={cn("h-4.5 w-4.5", isActive ? "text-primary" : "text-slate-400")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="tracking-tight text-[13px]">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-border/40 space-y-4">
        <div className="flex items-center justify-between px-2">
           <button 
             onClick={toggleTheme}
             className="p-2.5 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
           >
             {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
           </button>
           <Link href="/configuracoes" className="p-2.5 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
             <Settings className="h-4.5 w-4.5" />
           </Link>
        </div>

        <div className="flex items-center justify-between px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border/50 transition-all">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center font-medium text-xs shrink-0">
              {name.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-[10px] font-medium text-foreground uppercase tracking-wider truncate">{name}</p>
              <p className="text-[9px] text-muted-foreground font-medium truncate">Administrator</p>
            </div>
          </div>
          <button 
            onClick={() => logoutAction()}
            className="text-slate-400 hover:text-rose-500 transition-all p-1.5"
          >
            <LogOut className="h-4 w-4" />
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
    <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-card/80 backdrop-blur-3xl border border-border/40 rounded-3xl flex justify-around items-center px-4 z-50 shadow-2xl">
      {mobileLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center p-2 transition-all",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5 mb-1" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[8px] font-medium uppercase tracking-widest">{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
