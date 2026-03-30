"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";

const PrivacyContext = createContext<{
  isPrivate: boolean;
  toggle: () => void;
}>({
  isPrivate: false,
  toggle: () => {},
});

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [isPrivate, setIsPrivate] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("veris_privacy_mode");
    if (saved === "true") setIsPrivate(true);
  }, []);

  const toggle = () => {
    setIsPrivate(prev => {
      const newVal = !prev;
      localStorage.setItem("veris_privacy_mode", String(newVal));
      return newVal;
    });
  };

  return (
    <PrivacyContext.Provider value={{ isPrivate, toggle }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function PrivacyToggle() {
  const { isPrivate, toggle } = useContext(PrivacyContext);

  return (
    <button 
      onClick={toggle}
      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
      title={isPrivate ? "Mostrar Valores" : "Ocultar Valores"}
    >
      {isPrivate ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}

export function PrivacyValue({ value, prefix = "R$ " }: { value: number | string, prefix?: string }) {
  try {
    const { isPrivate } = useContext(PrivacyContext);
    
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const formatted = numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    if (isPrivate) {
      return (
        <span className="font-medium tracking-tighter opacity-60">
          {prefix}••••
        </span>
      );
    }

    return <span>{prefix}{formatted}</span>;
  } catch (error) {
    // Fallback if context is not available
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const formatted = numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    return <span>{prefix}{formatted}</span>;
  }
}
