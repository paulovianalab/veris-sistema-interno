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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="mb-12 flex flex-col items-center">
        <img src="/logo-veris.png" alt="Veris" className="h-14 w-auto object-contain dark:brightness-200" />
        <div className="mt-6 flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] border border-border/50 shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5" /> Acesso Restrito
        </div>
      </div>
      
      <div className="w-full max-w-sm bg-card border border-border shadow-premium rounded-2xl overflow-hidden">
        <div className="pt-10 pb-6 px-10 text-center border-b border-border/40">
          <h1 className="text-2xl font-black text-foreground tracking-tight">Login</h1>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2">
            Veris Agency Dash
          </p>
        </div>
        <div className="p-10">
          <form action={formAction} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="name@agency.com" 
                  required
                  className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-xl text-foreground focus:ring-1 focus:ring-primary outline-none transition-all font-bold placeholder:text-muted-foreground/30 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Chave de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  required
                  className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-xl text-foreground focus:ring-1 focus:ring-primary outline-none transition-all font-bold placeholder:text-muted-foreground/30 text-sm"
                />
              </div>
            </div>
            
            {state?.error && (
              <p className="text-[11px] text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-center font-black">
                {state.error}
              </p>
            )}

            <button 
              type="submit" 
              className="w-full h-12 bg-primary text-white rounded-xl font-black text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-primary/20"
              disabled={isPending}
            >
              {isPending ? "Validando..." : "Entrar no Dashboard"}
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-12 flex items-center gap-4 opacity-30 grayscale">
         <div className="h-px w-8 bg-slate-500" />
         <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
           &copy; Veris Digital OS
         </p>
         <div className="h-px w-8 bg-slate-500" />
      </div>
    </div>
  );
  );
}
