"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return await loginAction(formData);
  }, null);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020202] px-6">
      <div className="mb-16">
        <img src="/logo-veris.png" alt="Veris" className="h-12 w-auto brightness-200 grayscale" />
      </div>
      
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-light text-white tracking-tight">Dashboard Access</h1>
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em]">Veris Digital OS &copy; 2026</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-5 top-5 h-4 w-4 text-white/10 group-focus-within:text-primary transition-colors" />
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="E-mail" 
                required
                className="w-full h-14 pl-14 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all font-medium placeholder:text-white/10 text-sm"
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-5 top-5 h-4 w-4 text-white/10 group-focus-within:text-primary transition-colors" />
              <input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Senha"
                required
                className="w-full h-14 pl-14 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all font-medium placeholder:text-white/10 text-sm"
              />
            </div>
          </div>
          
          {state?.error && (
            <p className="text-[10px] text-rose-500 bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 text-center font-bold uppercase tracking-widest">
              {state.error}
            </p>
          )}

          <button 
            type="submit" 
            className="w-full h-14 bg-white text-black rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-white/90 active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center"
            disabled={isPending}
          >
            {isPending ? "Autenticando..." : "Entrar no Sistema"}
          </button>
        </form>
      </div>

      <div className="mt-24 text-[8px] font-bold text-white/10 uppercase tracking-[0.6em]">
         Criptografado via Veris Shield
      </div>
    </div>
  );
}
