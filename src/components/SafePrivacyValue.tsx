"use client";

/**
 * Safe Privacy Value Component
 * Displays formatted currency value without relying on context
 * This prevents React errors when context is not available
 */

interface SafePrivacyValueProps {
  value: number | string;
  prefix?: string;
}

export function SafePrivacyValue({ value, prefix = "R$ " }: SafePrivacyValueProps) {
  try {
    if (value === null || value === undefined) {
      return <span>{prefix}0.00</span>;
    }

    const numValue = typeof value === "string" ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return <span>{prefix}0.00</span>;
    }

    const formatted = numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    return <span>{prefix}{formatted}</span>;
  } catch (error) {
    // Ultimate fallback
    return <span>{prefix}0.00</span>;
  }
}
