"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle, ArrowRight, ShieldCheck, Globe, Star, Sparkles } from "lucide-react";
import { acceptProposalAction } from "@/app/actions";
import { cn } from "@/lib/utils";

export default function ProposalPublicPage() {
  const { id } = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    async function fetchProposal() {
      try {
        const res = await fetch(`/api/proposal/${id}`);
        const data = await res.json();
        if (data.success) {
          setProposal(data.proposal);
          if (data.proposal.status === "Aprovada") {
            setAccepted(true);
            setUnlocked(true);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar proposta:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProposal();
  }, [id]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === "veris2026") {
      setUnlocked(true);
      setError("");
    } else {
      setError("Palavra-chave incorreta. Tente novamente.");
    }
  };

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await acceptProposalAction(id as string);
      setAccepted(true);
    } catch (err) {
      console.error("Erro ao aceitar proposta:", err);
    } finally {
      setIsAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 border-t-2 border-primary rounded-full"
        />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-6">
        <Globe className="h-12 w-12 text-muted-foreground/20 mb-6" />
        <h1 className="text-xl font-light text-white mb-2">Proposta não encontrada</h1>
        <p className="text-muted-foreground text-sm">Este link pode ter expirado ou a proposta foi removida.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div 
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#050505]"
          >
            <div className="w-full max-w-md space-y-12 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-center mb-8">
                  <img src="/logo-veris.png" alt="Veris" className="h-8 w-auto brightness-200" />
                </div>
                <h1 className="text-2xl font-light tracking-tight">
                  Uma Proposta Exclusiva aguarda por você, <br />
                  <span className="text-primary font-medium mt-2 block italic">
                    {proposal.client?.company || proposal.client?.name}
                  </span>
                </h1>
                <p className="text-muted-foreground/60 text-xs uppercase tracking-[0.3em]">Ambiente Privado e Seguro</p>
              </motion.div>

              <motion.form 
                onSubmit={handleUnlock}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a palavra-chave de acesso"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-center tracking-widest placeholder:tracking-normal placeholder:text-muted-foreground/30 font-medium"
                  />
                </div>
                {error && <p className="text-rose-500 text-[10px] uppercase tracking-widest font-medium animate-shake">{error}</p>}
                
                <button 
                  type="submit"
                  className="w-full h-14 bg-primary text-white rounded-2xl font-semibold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 group uppercase text-[10px] tracking-[0.2em]"
                >
                  Desbloquear Proposta <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
            </div>
          </motion.div>
        ) : (
          <motion.main 
            key="content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto px-6 py-20 lg:py-32 space-y-32"
          >
            {/* Hero Section */}
            <section className="text-center space-y-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-[0.3em] font-semibold"
              >
                <Sparkles className="h-3 w-3" /> Exclusividade Veris Digital
              </motion.div>
              
              <div className="space-y-6">
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-[1.1]">
                   {proposal.title}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground/60 text-xs uppercase tracking-[0.4em]">
                  <span>Válido por 7 dias</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span>Proposta ID: {id?.toString().slice(0, 8)}</span>
                </div>
              </div>
            </section>

            {/* Value & Highlight */}
            <section className="grid md:grid-cols-2 gap-8">
              <div className="premium-card p-10 bg-white/[0.02] border-white/[0.05] space-y-8 flex flex-col justify-center">
                 <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Investimento Estimado</p>
                    <h3 className="text-5xl font-light tracking-tighter italic">
                       R$ {proposal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                 </div>
                 <p className="text-muted-foreground/60 text-sm leading-relaxed max-w-xs">
                    Um investimento estratégico focado em escalar a presença digital da <strong>{proposal.client?.company || proposal.client?.name}</strong> com tecnologia de ponta.
                 </p>
              </div>

              <div className="premium-card p-10 bg-primary border-none text-white space-y-8">
                 <ShieldCheck className="h-12 w-12 text-white/40" />
                 <h4 className="text-2xl font-light leading-tight">Garantimos a implementação de chatbots humanizados e gestão de tráfego de alta conversão.</h4>
              </div>
            </section>

            {/* Scope Section */}
            <section className="space-y-12">
              <div className="flex items-center gap-6">
                 <h3 className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground font-bold whitespace-nowrap">Escopo & Entregas</h3>
                 <div className="h-px w-full bg-white/10" />
              </div>
              
              <div className="prose prose-invert max-w-none">
                 <div className="grid md:grid-cols-1 gap-12">
                   <div className="space-y-8">
                      {proposal.content ? (
                        <div className="text-lg font-light leading-relaxed text-muted-foreground bg-white/[0.01] p-10 rounded-[2.5rem] border border-white/[0.05] whitespace-pre-wrap">
                           {proposal.content}
                        </div>
                      ) : (
                        <p className="italic text-muted-foreground/40 text-center py-20">Detalhes do escopo serão fornecidos em breve.</p>
                      )}
                   </div>
                 </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center py-20 space-y-12 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[120px] -z-10" />
               
               <div className="space-y-4">
                  <h3 className="text-3xl font-light tracking-tight">Pronto para transformar sua operação digital?</h3>
                  <p className="text-muted-foreground text-sm">Clique abaixo para aceitar esta proposta e iniciar nossa parceria.</p>
               </div>

               {accepted ? (
                 <motion.div 
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="inline-flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-12 py-6 rounded-[2rem]"
                 >
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-lg font-medium tracking-tight">Proposta Aceita com Sucesso</span>
                 </motion.div>
               ) : (
                 <button 
                   onClick={handleAccept}
                   disabled={isAccepting}
                   className="bg-primary text-white px-16 py-7 rounded-[2.5rem] font-bold text-xs uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 mx-auto min-w-[300px]"
                 >
                    {isAccepting ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }} className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full" /> : "Aceitar Proposta Exclusiva"}
                 </button>
               )}
            </section>

            {/* Footer */}
            <footer className="pt-20 border-t border-white/5 flex flex-col items-center gap-8 opacity-40">
               <img src="/logo-veris.png" alt="Veris" className="h-6 w-auto grayscale brightness-200" />
               <p className="text-[9px] uppercase tracking-[0.5em]">Veris Digital &copy; 2026</p>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
