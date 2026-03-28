"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/components";
import { Lock, Mail, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return await loginAction(formData);
  }, null);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 transition-colors duration-500">
      <div className="mb-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <div className="relative group">
           <img src="/logo-veris.png" alt="Veris" className="h-12 w-auto object-contain dark:brightness-200 transition-all hover:scale-110" />
        </div>
        <div className="mt-4 flex items-center gap-2 bg-primary/10 text-primary text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] border border-primary/20 shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5" /> Acesso Interno
        </div>
      </div>
      
      <Card className="w-full max-w-sm border-border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none transition-all duration-500 rounded-[2rem] overflow-hidden">
        <CardHeader className="space-y-2 text-center border-b border-border/50 pb-8 bg-muted/20">
          <CardTitle className="text-3xl font-black text-foreground tracking-tighter">Login</CardTitle>
          <CardDescription className="text-muted-foreground font-bold text-xs uppercase tracking-widest px-8">
            Credenciais do Dashboard Veris
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 px-8">
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  required
                  className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-2xl text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold placeholder:text-muted-foreground/30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  required
                  className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-2xl text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold placeholder:text-muted-foreground/30"
                />
              </div>
            </div>
            
            {state?.error && (
              <p className="text-xs text-rose-500 bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20 text-center font-black animate-in fade-in slide-in-from-top-2">
                {state.error}
              </p>
            )}

            <button 
              type="submit" 
              className="w-full h-14 bg-primary text-white rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center mt-2 group"
              disabled={isPending}
            >
              {isPending ? "Autenticando..." : "Entrar no Painel"}
              {!isPending && <Lock className="ml-2 h-4 w-4 opacity-50 group-hover:translate-x-1 transition-transform" />}
            </button>
            
            <p className="text-center text-[10px] text-muted-foreground mt-6 font-bold uppercase tracking-widest leading-relaxed opacity-60">
              Gerencie notas, agenda e CRM em tempo real.
            </p>
          </form>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">
        &copy; 2026 Veris Digital Agency
      </p>
    </div>
  );
}
