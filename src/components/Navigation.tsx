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
            <img 
              src={theme === "light" ? "/images/logo-veris-black.png" : "/logo-veris.png"} 
              alt="Veris" 
              className="h-7 w-auto object-contain" 
            />
            <span className="ml-2.5 text-[9px] font-medium uppercase tracking-[0.4em] text-primary/60 opacity-60">
              Internal
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-8">
          <nav className="grid items-start px-3 text-sm font-medium space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[1.25rem] px-5 py-3 transition-all duration-300 relative group",
                    isActive 
                      ? "bg-primary/5 text-primary" 
                      : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {isActive && <div className="absolute left-0 w-1 h-5 bg-primary/60 rounded-r-full" />}
                  <Icon className={cn("h-4.5 w-4.5", isActive ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary/60")} strokeWidth={isActive ? 2 : 1.5} />
                  <span className={cn(
                    "tracking-tight text-[13px] transition-all",
                    isActive ? "font-medium" : "font-light"
                  )}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-6 border-t border-border/40 space-y-5">
        <div className="flex items-center justify-between px-2">
           <button 
             onClick={toggleTheme}
             className="p-2.5 rounded-xl text-muted-foreground/40 hover:text-primary hover:bg-primary/5 transition-all"
             title={theme === "dark" ? "Light Mode" : "Dark Mode"}
           >
             {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
           </button>
           <Link 
             href="/configuracoes" 
             className="p-2.5 rounded-xl text-muted-foreground/40 hover:text-primary hover:bg-primary/5 transition-all"
             title="Configurações"
           >
             <Settings className="h-4.5 w-4.5" />
           </Link>
        </div>

        <div className="flex items-center justify-between px-4 py-4 rounded-[1.5rem] bg-muted/20 border border-border/40 transition-all hover:bg-muted/30">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 bg-primary/5 text-primary border border-primary/10 rounded-xl flex items-center justify-center font-medium text-xs shrink-0">
              {name.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-[10px] font-medium text-foreground uppercase tracking-widest truncate">{name}</p>
              <p className="text-[9px] text-muted-foreground font-medium truncate opacity-40">Veris Administrator</p>
            </div>
          </div>
          <button 
            onClick={() => logoutAction()}
            className="text-muted-foreground/30 hover:text-rose-500 transition-all p-1.5"
            title="Sair"
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
    <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-card/80 backdrop-blur-3xl border border-border/40 rounded-[2rem] flex justify-around items-center px-4 z-50 shadow-2xl">
      {mobileLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center p-2 transition-all",
              isActive ? "text-primary" : "text-muted-foreground/50"
            )}
          >
            <Icon className="h-5 w-5 mb-1" strokeWidth={isActive ? 2 : 1.5} />
            <span className="text-[8px] font-medium uppercase tracking-widest opacity-60">{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
