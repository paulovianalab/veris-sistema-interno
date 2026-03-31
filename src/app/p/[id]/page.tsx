"use client";

import { useState, useEffect, use, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
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
  Layers,
  CreditCard,
  QrCode,
  Info
} from "lucide-react";
import { acceptProposalAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import { servicesData } from "@/lib/constants";

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
  const [paymentMethod, setPaymentMethod] = useState<"Pix" | "Cartão" | null>(null);

  // Parallax Setup
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const yBackground = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  const rotateBackground = useTransform(smoothProgress, [0, 1], [0, 5]);

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
    if (password.toLowerCase() === "veris26") {
      setUnlocked(true);
      setError("");
    } else {
      setError("Senha incorreta.");
    }
  };

  const handleAccept = async () => {
    if (!paymentMethod) return;
    setIsAccepting(true);
    try {
      await acceptProposalAction(id as string, paymentMethod);
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
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center text-center p-6 text-white font-sans">
        <Globe className="h-10 w-10 text-muted-foreground/20 mb-6" />
        <h1 className="text-xl font-light mb-2">Proposta expirada ou inexistente.</h1>
      </div>
    );
  }

  const selectedServicesKeys = proposal.selectedServices ? JSON.parse(proposal.selectedServices) : [];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020202] text-white selection:bg-primary/30 font-sans overflow-x-hidden relative">
      {/* Parallax Mesh Background */}
      <motion.div 
        style={{ y: yBackground, rotate: rotateBackground }}
        className="fixed inset-0 pointer-events-none z-0 opacity-40 overflow-hidden"
      >
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
      </motion.div>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div 
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#020202]"
          >
            <div className="w-full max-w-sm space-y-12 text-center text-white">
              <div className="space-y-12">
                <img src="/logo-veris.png" alt="Veris" className="h-12 w-auto mx-auto brightness-200 grayscale" />
                <div className="space-y-4">
                    <h1 className="text-2xl font-light tracking-tight">Ambiente Privado</h1>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest leading-relaxed">
                        Exclusivo para <br />
                        <span className="text-primary font-bold italic text-base mt-1 block">
                            {proposal.client?.company || proposal.client?.name}
                        </span>
                    </p>
                </div>
              </div>

              <form onSubmit={handleUnlock} className="space-y-6">
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Palavra-chave"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:ring-1 focus:ring-primary/40 outline-none transition-all text-center tracking-widest placeholder:tracking-normal placeholder:text-muted-foreground/20 font-semibold"
                />
                <button 
                  type="submit"
                  className="w-full h-14 bg-white text-black rounded-2xl font-bold hover:bg-primary hover:text-white transition-all uppercase text-[10px] tracking-widest"
                >
                  Entrar
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.main 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 max-w-5xl mx-auto px-6 py-16 lg:py-24"
          >
            {/* Minimal Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-10 pointer-events-none">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <img src="/logo-veris.png" alt="Veris" className="h-7 w-auto brightness-200 pointer-events-auto" />
                    <div className="sm:flex items-center gap-4 hidden pointer-events-auto">
                        <div className="h-px w-8 bg-white/10" />
                        <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.3em]">Documento Oficial &copy; 2026</span>
                    </div>
                </div>
            </nav>

            <div className="space-y-48 lg:space-y-64 pt-32">
                {/* Hero / Title Section */}
                <section className="text-center space-y-16">
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <span className="text-[10px] text-primary font-bold uppercase tracking-[0.6em] opacity-60">Parceria Estratégica Digital</span>
                        <h1 className="text-6xl md:text-8xl font-light tracking-tight leading-[1.0] text-white max-w-4xl mx-auto items-center">
                            Propulsão Digital para a <span className="italic font-medium text-primary"> {proposal.client?.company || proposal.client.name}</span>
                        </h1>
                        <p className="text-muted-foreground/30 text-xs uppercase tracking-[0.6em] font-light max-w-2xl mx-auto leading-relaxed">
                            Acelerando resultados com altíssima tecnologia
                        </p>
                    </motion.div>
                </section>

                {/* Section 1: The Transformation (Structured Scope) */}
                <section className="space-y-32">
                    <div className="grid lg:grid-cols-12 gap-16 items-start">
                        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-40">
                             <div className="h-px w-16 bg-primary" />
                             <h2 className="text-5xl font-light tracking-tight text-white leading-[1.1]">
                                A <span className="italic font-normal">Arquitetura</span> <br />
                                de Valor.
                             </h2>
                             <p className="text-muted-foreground/40 text-sm leading-relaxed max-w-sm font-light">
                                Cada solução foi projetada de forma modular, garantindo uma infraestrutura robusta para o seu crescimento.
                             </p>
                        </div>

                        <div className="lg:col-span-8 space-y-6">
                            {selectedServicesKeys.map((key: string, idx: number) => {
                                const service = servicesData[key as keyof typeof servicesData];
                                if (!service) return null;
                                return (
                                    <motion.div 
                                        key={key}
                                        initial={{ y: 30, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 md:p-12 hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10"
                                    >
                                        <div className="flex flex-col gap-12">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
                                                <div className="space-y-8 flex-1">
                                                    <div className="flex items-center gap-5">
                                                        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform duration-500">
                                                            <service.icon className="h-6 w-6" />
                                                        </div>
                                                        <h3 className="text-2xl font-light tracking-tight text-white">{service.label}</h3>
                                                    </div>
                                                    
                                                    <div className="space-y-4">
                                                        {service.benefits.map((benefit, bIdx) => (
                                                            <div key={bIdx} className="flex items-center gap-3 text-xs text-muted-foreground/60 font-light">
                                                                <div className="h-1 w-1 bg-primary rounded-full shrink-0" />
                                                                {benefit}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="md:text-right space-y-6 md:border-l md:border-white/5 md:pl-12 min-w-[200px]">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-primary uppercase tracking-widest font-black opacity-30">Prazos</span>
                                                        <p className="text-sm text-white italic font-light">{service.period}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-primary uppercase tracking-widest font-black opacity-30">Nota Técnica</span>
                                                        <p className="text-[10px] text-muted-foreground/40 leading-relaxed uppercase tracking-tighter">Detalhamento via onboarding</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Specialized IA Content */}
                                            {key === 'ia' && (
                                                <div className="space-y-12 pt-8 border-t border-white/5">
                                                    <div className="grid md:grid-cols-2 gap-12">
                                                        {/* Feature Shapes */}
                                                        <div className="space-y-6">
                                                            <h4 className="text-[10px] text-primary uppercase tracking-[0.4em] font-black opacity-40">Estrutura de IA</h4>
                                                            <div className="grid gap-4">
                                                                {((service as any).extendedFeatures || []).map((feat: any, fIdx: number) => (
                                                                    <div key={fIdx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                                                                        <div className="text-xs font-bold text-white uppercase tracking-widest">{feat.title}</div>
                                                                        <div className="text-[10px] text-muted-foreground/40 leading-relaxed">{feat.desc}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Visual Flowchart */}
                                                        <div className="space-y-8">
                                                            <h4 className="text-[10px] text-primary uppercase tracking-[0.4em] font-black opacity-40">Caminho do Lead</h4>
                                                            <div className="relative space-y-6 pl-8">
                                                                <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/20 to-transparent" />
                                                                {((service as any).flow || []).map((step: any, sIdx: number) => (
                                                                    <div key={sIdx} className="relative flex items-center gap-4">
                                                                        <div className="absolute -left-[25px] h-3 w-3 rounded-full bg-primary border-4 border-[#020202]" />
                                                                        <div className="flex items-center gap-3 text-xs text-white/60 font-light">
                                                                            <step.icon className="h-4 w-4 text-primary/40 shrink-0" />
                                                                            {step.step}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Integrations */}
                                                    <div className="pt-4 space-y-6">
                                                        <h4 className="text-[10px] text-primary uppercase tracking-[0.4em] font-black opacity-40">Integrações Nativas</h4>
                                                        <div className="flex flex-wrap gap-3">
                                                            {((service as any).integrations || []).map((int: string, iIdx: number) => (
                                                                <span key={iIdx} className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
                                                                    {int}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Section 2: Payment & Finality (Discreet Investment) */}
                <section className="max-w-xl mx-auto space-y-24">
                    <div className="text-center space-y-12">
                        <div className="space-y-4 pt-12">
                            <h3 className="text-2xl font-light text-white/90">Efetivar Parceria</h3>
                            <p className="text-muted-foreground/40 text-[10px] uppercase tracking-widest">Escolha a melhor forma de início.</p>
                        </div>

                        {/* Payment Selection Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: "Pix", label: "Pix à vista", icon: QrCode, desc: "Processamento Imediato" },
                                { id: "Cartão", label: "Cartão", icon: CreditCard, desc: "Opções de Parcelamento" }
                            ].map((method) => (
                                <button 
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id as any)}
                                    className={cn(
                                        "p-8 rounded-[2rem] border transition-all duration-500 text-center flex flex-col items-center gap-4 group",
                                        paymentMethod === method.id 
                                            ? "bg-primary border-primary text-white" 
                                            : "bg-white/[0.02] border-white/5 text-muted-foreground hover:border-white/20"
                                    )}
                                >
                                    <method.icon className={cn("h-6 w-6 mb-2", paymentMethod === method.id ? "text-white" : "text-primary")} />
                                    <div className="space-y-1">
                                        <div className="text-[11px] font-bold uppercase tracking-widest">{method.label}</div>
                                        <div className={cn("text-[9px] uppercase tracking-tighter opacity-40", paymentMethod === method.id && "opacity-80")}>{method.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Discreet Value Card */}
                    <motion.div 
                         initial={{ y: 20, opacity: 0 }}
                         whileInView={{ y: 0, opacity: 1 }}
                         viewport={{ once: true }}
                         className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center gap-3 relative overflow-hidden"
                    >
                         <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-2">
                             Investimento Consolidado
                         </div>
                         <div className="text-4xl text-white font-light tracking-tight flex items-center gap-3">
                             <span className="text-base text-white/20 -mb-2">BRL</span>
                             {proposal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                         </div>
                         <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-medium leading-relaxed max-w-[340px] text-center mt-4">
                             Valor único ou conforme condições de fechamento. <br className="hidden md:block" /> Válido por 7 dias.
                         </p>
                    </motion.div>

                    {/* Final CTA */}
                    <div className="flex flex-col items-center gap-12">
                        {accepted ? (
                            <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-700">
                                <div className="p-8 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-center">
                                    <div className="text-sm font-bold uppercase tracking-widest">Contrato Emitido</div>
                                    <p className="text-[10px] text-emerald-500/60 mt-2">Nossa equipe de Onboarding entrará em contato.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full flex justify-center">
                                <button 
                                    onClick={handleAccept}
                                    disabled={isAccepting || !paymentMethod}
                                    className={cn(
                                        "group relative h-20 px-16 rounded-[2rem] font-bold text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-6 w-full max-w-[360px] overflow-hidden",
                                        !paymentMethod 
                                            ? "bg-white/5 text-white/20 cursor-not-allowed" 
                                            : "bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                                    )}
                                >
                                    {isAccepting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                        <>
                                            {paymentMethod ? `Aprovar via ${paymentMethod}` : "Selecione o Início"}
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </button>
                                {!paymentMethod && (
                                    <div className="absolute -bottom-10 flex items-center gap-2 text-[8px] uppercase tracking-widest text-primary font-bold opacity-60">
                                        <Info className="h-3 w-3" /> Selecione entre Pix ou Cartão para prosseguir
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <footer className="pt-24 pb-12 flex flex-col items-center gap-6 grayscale opacity-20 transition-opacity hover:opacity-50">
                            <img src="/logo-veris.png" alt="Veris" className="h-5 w-auto brightness-200" />
                            <p className="text-[9px] uppercase tracking-[0.4em]">&copy; 2026 Veris Digital Agency OS</p>
                        </footer>
                    </div>
                </section>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <style jsx global>{`
        body { background-color: #020202 !important; }
        ::selection { background: rgba(0, 225, 255, 0.2); color: white; }
      `}</style>
    </div>
  );
}
