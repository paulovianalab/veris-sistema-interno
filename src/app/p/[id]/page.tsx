"use client";

import { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Star, 
  Sparkles, 
  Loader2, 
  Zap, 
  Target, 
  MousePointer2, 
  Calendar,
  Layers
} from "lucide-react";
import { acceptProposalAction } from "@/app/actions";
import { cn } from "@/lib/utils";

export default function ProposalPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
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
    if (id) fetchProposal();
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
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full animate-pulse" />
          <Loader2 className="h-10 w-10 text-primary animate-spin relative z-10" />
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center text-center p-6 text-white font-sans">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 group">
            <Globe className="h-8 w-8 text-muted-foreground/30 group-hover:text-primary transition-colors" />
        </div>
        <h1 className="text-2xl font-medium mb-3 tracking-tight">Proposta não encontrada</h1>
        <p className="text-muted-foreground/60 text-sm max-w-xs leading-relaxed">Este link pode ter expirado ou a proposta foi removida do sistema privado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-primary/30 font-sans overflow-x-hidden relative">
      {/* Mesh Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] rounded-full bg-cyan-400/5 blur-[80px]" />
      </div>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div 
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(20px)" }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#030303]/80 backdrop-blur-3xl"
          >
            <div className="w-full max-w-md space-y-12 text-center relative">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="flex justify-center">
                   <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative">
                      <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
                      <img src="/logo-veris.png" alt="Veris" className="h-10 w-auto brightness-200 relative z-10" />
                   </div>
                </div>
                
                <div className="space-y-3">
                    <h1 className="text-3xl font-medium tracking-tight">
                        Acesso Exclusivo
                    </h1>
                    <p className="text-muted-foreground/60 text-sm max-w-[280px] mx-auto leading-relaxed">
                        Prepare-se para transformar o futuro digital da <br />
                        <span className="text-primary font-semibold italic text-lg mt-1 block">
                            {proposal.client?.company || proposal.client?.name}
                        </span>
                    </p>
                </div>
              </motion.div>

              <motion.form 
                onSubmit={handleUnlock} 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-md group-focus-within:bg-primary/10 transition-all" />
                  <div className="relative flex items-center">
                    <Lock className="absolute left-5 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Palavra-chave de acesso"
                        className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 focus:ring-1 focus:ring-primary/40 outline-none transition-all text-center tracking-[0.3em] placeholder:tracking-normal placeholder:text-muted-foreground/20 font-semibold"
                    />
                  </div>
                </div>
                
                {error && (
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-rose-500 text-[10px] uppercase tracking-[0.2em] font-bold"
                    >
                        {error}
                    </motion.p>
                )}
                
                <button 
                  type="submit"
                  className="w-full h-16 bg-white text-black rounded-2xl font-bold hover:bg-primary hover:text-white active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl group uppercase text-[11px] tracking-[0.2em]"
                >
                  Entrar na Experiência <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>

              <div className="pt-4 flex items-center justify-center gap-2 opacity-30 text-[9px] uppercase tracking-widest font-bold">
                 <ShieldCheck className="h-3 w-3" /> Conexão Criptografada End-to-End
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.main 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 max-w-5xl mx-auto px-6 py-16 lg:py-24"
          >
            {/* Minimal Sticky Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 pointer-events-none">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 pointer-events-auto shadow-2xl"
                    >
                        <img src="/logo-veris.png" alt="Veris" className="h-6 w-auto brightness-200" />
                    </motion.div>
                    
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-primary/10 backdrop-blur-md border border-primary/20 rounded-2xl px-5 py-3 pointer-events-auto hidden sm:flex items-center gap-3"
                    >
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Documento Oficial Veris</span>
                    </motion.div>
                </div>
            </nav>

            <div className="space-y-40 lg:space-y-56 pt-24">
                {/* Hero section */}
                <motion.section 
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center space-y-12"
                >
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-[10px] uppercase tracking-[0.4em] font-medium backdrop-blur-sm">
                            <Sparkles className="h-3 w-3 text-primary" /> Parceria Estratégica 2026
                        </div>
                        
                        <h1 className="text-5xl md:text-8xl font-light tracking-tight leading-[1.1] text-white">
                            Propulsão Digital <br />
                            <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-300 bg-clip-text text-transparent font-medium italic">
                                para a {proposal.client?.company || proposal.client.name}
                            </span>
                        </h1>
                        
                        <p className="text-muted-foreground/40 text-xs md:text-sm uppercase tracking-[0.6em] font-light max-w-2xl mx-auto leading-relaxed">
                            Acelerando resultados com inteligência e alta tecnologia
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-24 opacity-60 grayscale border-y border-white/5 py-12">
                         <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-primary" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Foco em ROAS</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <Zap className="h-5 w-5 text-primary" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Growth Engine</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <Layers className="h-5 w-5 text-primary" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Tech Stack Premium</span>
                         </div>
                    </div>
                </motion.section>

                {/* Section 1: The Transformation (Scope) */}
                <section className="space-y-24">
                    <div className="grid lg:grid-cols-12 gap-16 items-start">
                        <div className="lg:col-span-4 space-y-8 sticky top-32">
                             <div className="h-1 w-12 bg-primary rounded-full" />
                             <h2 className="text-4xl font-light tracking-tight text-white leading-tight">
                                A <span className="italic font-normal">Arquitetura</span> <br />
                                da sua Jornada.
                             </h2>
                             <p className="text-muted-foreground/60 text-sm leading-relaxed max-w-sm">
                                Não entregamos apenas serviços, entregamos uma nova infraestrutura de crescimento escalável e humanizado.
                             </p>
                             
                             <div className="space-y-4 pt-8">
                                {[
                                    { icon: Target, label: "Diagnóstico de Precisão" },
                                    { icon: MousePointer2, label: "Implementação Ágil" },
                                    { icon: Calendar, label: "Acompanhamento Mensal" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground/40">
                                        <item.icon className="h-4 w-4 text-primary/40" />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div className="lg:col-span-8">
                            <motion.div 
                                initial={{ y: 40, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                className="bg-[#080808]/40 border border-white/5 rounded-[3rem] p-8 md:p-16 backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-1000" />
                                
                                <div className="relative z-10 prose prose-invert prose-headings:font-light prose-p:text-muted-foreground/80 max-w-none">
                                    {proposal.content ? (
                                        <div className="space-y-10">
                                            <div className="text-xs uppercase tracking-[0.5em] text-primary font-black opacity-40">Escopo Detalhado</div>
                                            <div className="text-lg md:text-xl font-light leading-[1.8] whitespace-pre-wrap selection:bg-primary/30">
                                                {proposal.content}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-24 space-y-6">
                                            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
                                                <Loader2 className="h-6 w-6 text-muted-foreground/20 animate-spin" />
                                            </div>
                                            <p className="text-xs uppercase tracking-widest text-muted-foreground/30">Mapeando a estratégia ideal...</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-16 pt-12 border-t border-white/5 grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <div className="text-[10px] uppercase tracking-widest font-bold text-primary">Início Previsto</div>
                                        <div className="text-sm text-white font-medium italic">Imediato após aceitação</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[10px] uppercase tracking-widest font-bold text-primary">Duração</div>
                                        <div className="text-sm text-white font-medium italic">Fase 1: 30-45 dias</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Section 2: The Investment (Moved to end) */}
                <section className="space-y-12 py-12">
                    <div className="text-center space-y-4">
                        <h3 className="text-[10px] uppercase tracking-[0.5em] text-primary font-black">Compromisso com o Valor</h3>
                        <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white">O Investimento Estimado</h2>
                    </div>

                    <motion.div 
                         initial={{ scale: 0.95, opacity: 0 }}
                         whileInView={{ scale: 1, opacity: 1 }}
                         viewport={{ once: true }}
                         className="max-w-xl mx-auto"
                    >
                         <div className="relative group">
                            <div className="absolute inset-x-0 -inset-y-4 bg-primary/20 blur-[120px] rounded-full scale-50 group-hover:scale-75 transition-transform duration-1000 opacity-50" />
                            
                            <div className="relative bg-white text-black p-12 md:p-16 rounded-[4rem] text-center shadow-2xl shadow-primary/20 flex flex-col items-center gap-6 overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <Sparkles className="h-6 w-6 text-primary/20" />
                                </div>
                                
                                <p className="text-[11px] uppercase tracking-[0.4em] font-black opacity-30">Total do Projeto</p>
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-bold opacity-20 -mb-2">BRL</span>
                                    <h3 className="text-6xl md:text-8xl font-medium tracking-tighter italic">
                                        {proposal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </h3>
                                </div>
                                
                                <div className="h-px w-24 bg-black/10 my-4" />
                                
                                <p className="text-xs text-black/50 leading-relaxed font-medium max-w-[280px]">
                                    Valor único ou parcelado conforme condições de fechamento. Condição válida por 7 dias corridos.
                                </p>
                            </div>
                         </div>
                    </motion.div>
                </section>

                {/* Section 3: The CTA */}
                <section className="text-center pb-24 space-y-12">
                    <div className="space-y-6">
                        <div className="h-16 w-px bg-gradient-to-b from-transparent to-primary mx-auto" />
                        <h3 className="text-2xl md:text-3xl font-light tracking-tight text-white/90">Pronto para este próximo salto?</h3>
                    </div>

                    <div className="flex flex-col items-center gap-8">
                        {accepted ? (
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center gap-6"
                            >
                                <div className="p-10 rounded-[3rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-center shadow-2xl shadow-emerald-500/10 backdrop-blur-md">
                                    <CheckCircle className="h-10 w-10 mx-auto mb-4 animate-bounce" />
                                    <div className="space-y-2">
                                        <div className="text-lg font-bold uppercase tracking-widest">Proposta Aceita</div>
                                        <p className="text-xs text-emerald-500/60 font-medium">Nossa equipe entrará em contato em breve.</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/30 blur-3xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <button 
                                    onClick={handleAccept}
                                    disabled={isAccepting}
                                    className="relative bg-primary text-white h-24 px-16 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-6 min-w-[320px] overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    
                                    {isAccepting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                        <>
                                            Aprovar Proposta Agora
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-muted-foreground/30 text-[9px] uppercase tracking-[0.5em] font-bold">
                             <ShieldCheck className="h-4 w-4" /> Assinatura Digital Segura
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="pt-24 pb-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12 opacity-40 grayscale">
                    <div className="flex flex-col items-center lg:items-start gap-4">
                        <img src="/logo-veris.png" alt="Veris" className="h-6 w-auto brightness-200" />
                        <p className="text-[10px] uppercase tracking-[0.6em] font-medium">&copy; 2026 Veris Digital Agency</p>
                    </div>
                    
                    <div className="hidden lg:flex gap-12">
                        {["Privacy Policy", "Exclusive Terms", "Veris.agency"].map(item => (
                            <span key={item} className="text-[9px] uppercase tracking-widest font-black cursor-pointer hover:text-primary transition-colors">{item}</span>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] uppercase tracking-widest font-black">All Systems Operational</span>
                    </div>
                </footer>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Global CSS Overrides for this page specifically */}
      <style jsx global>{`
        body {
          background-color: #030303 !important;
        }
        ::selection {
          background: rgba(8, 145, 178, 0.3);
          color: white;
        }
      `}</style>
    </div>
  );
}
