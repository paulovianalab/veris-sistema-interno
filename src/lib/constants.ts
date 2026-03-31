import { 
  Zap, 
  ShoppingCart, 
  TrendingUp, 
  Globe, 
  Palette, 
  Target, 
  MousePointer2, 
  Calendar,
  Layers,
  CheckCircle,
  LucideIcon
} from "lucide-react";

export interface ServiceDetail {
  label: string;
  scope: string;
  icon: LucideIcon;
  benefits: string[];
  investment?: string;
  period?: string;
  extendedFeatures?: { title: string; desc: string }[];
  flow?: { step: string; icon: LucideIcon }[];
  integrations?: string[];
}

export const servicesData: Record<string, ServiceDetail> = {
  ia: {
    label: "IA de Atendimento",
    scope: "Atendimento 24/7, IA Treinada no modelo da empresa, Qualificação de Leads.",
    icon: Zap,
    benefits: ["Atendimento 24/7 Humanizado", "Qualificação de Leads Automática", "Integração Direta com CRM"],
    extendedFeatures: [
      { title: "Construção Visual", desc: "IA constrói seus fluxos em minutos." },
      { title: "Métricas Reais", desc: "Controle de CTR e conversão em tempo real." },
      { title: "Conexão Nativa", desc: "RD Station, HubSpot, Shopify e +50 apps." }
    ],
    flow: [
      { step: "Novo Lead no WhatsApp", icon: Target },
      { step: "Análise com IA", icon: MousePointer2 },
      { step: "A IA conduz a conversa", icon: Zap },
      { step: "Fechando o negócio", icon: CheckCircle }
    ],
    integrations: ["RD Station", "HubSpot", "Shopify", "Gemini IA", "WhatsApp API"],
    investment: "R$ 300 / mensal",
    period: "Imediato"
  },
  ecommerce: {
    label: "E-commerce",
    scope: "Design de Banners, Gestão de Catálogo, Ecossistema de Pagamentos e Logística.",
    icon: ShoppingCart,
    benefits: ["Design de Banners Exclusivos", "Gestão de Catálogo de Produtos", "Checkout de Alta Conversão"],
    investment: "A partir de R$ 69 / plataforma",
    period: "20 dias úteis"
  },
  social: {
    label: "Social Media & Tráfego",
    scope: "Gestão de 12 posts (4 vídeos) + Tráfego Estratégico em Meta e Google focado em performance.",
    icon: TrendingUp,
    benefits: ["4 Vídeos (Reels) Inclusos", "Gestão de Tráfego em Meta/Google", "Foco 100% em ROI/Performance"],
    investment: "Consultar Orçamento",
    period: "Mensal"
  },
  site: {
    label: "Site Premium",
    scope: "Design Premium focado em conversão. Estrutura ultra-rápida e otimizada para SEO.",
    icon: Globe,
    benefits: ["Design Exclusivo e Moderno", "Totalmente Otimizado para SEO", "Hospedagem em Servidor Ultra-rápido"],
    investment: "Investimento Único",
    period: "A partir de 5 dias"
  },
  branding: {
    label: "Identidade Visual / Branding",
    scope: "Estratégia de marca, Identidade Visual completa (Logo, Cores, Tipografia) e Manual da Marca.",
    icon: Palette,
    benefits: ["Logo e Identidade Completa", "Manual da Marca Estruturado", "Arquivos em PDF, PNG e Vetoriais"],
    investment: "Investimento Único",
    period: "15 dias úteis"
  }
};
