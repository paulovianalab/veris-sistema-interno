"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface ActivityChartProps {
  data?: number[];
  labels?: string[];
}

export default function ActivityChart({ 
  data = [30, 45, 35, 80, 50, 70, 90], 
  labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"] 
}: ActivityChartProps) {
  const { theme } = useTheme();
  
  // Normalization: Find max to scale correctly
  const maxVal = Math.max(...data, 10); // at least 10 to avoid div by zero

  
  // SVG Viewport: 1000x200
  const width = 1000;
  const height = 200;
  const padding = 30;
  
  // Calculate points
  const points = data.map((d, i) => ({
    x: data.length > 1 ? (i * (width / (data.length - 1))) : width / 2,
    y: height - padding - (d / maxVal) * (height - padding * 2)
  }));

  // Create SVG path (Bezier curve)
  const drawPath = () => {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x - 5} ${points[0].y} L ${points[0].x + 5} ${points[0].y}`;
    
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 3;
      const cp2x = next.x - (next.x - curr.x) / 3;
      d += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const path = drawPath();
  const areaPath = points.length > 1 
    ? `${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
    : "";

  return (
    <div className="w-full space-y-8">
      <div className="relative h-56 w-full group">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
            <clipPath id="chartClip">
              <rect width={width} height={height} />
            </clipPath>
          </defs>

          {/* Grid Lines - Professional look */}
          {[0, 25, 50, 75, 100].map((step) => {
             const y = height - padding - (step / 100) * (height - padding * 2);
             return (
               <line 
                 key={step} 
                 x1="0" y1={y} x2={width} y2={y} 
                 stroke="currentColor" 
                 className="text-border/20" 
                 strokeWidth="1" 
                 strokeDasharray="4 8"
               />
             );
          })}

          {/* Area Fill */}
          <motion.path
            d={areaPath}
            fill="url(#areaGradient)"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          />

          {/* Curve Line */}
          <motion.path
            d={path}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          />

          {/* Data Points - Minimalism */}
          {points.map((p, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.05 }}
            >
              {/* Subtle Point Glow for max value */}
              {data[i] === Math.max(...data) && (
                 <circle cx={p.x} cy={p.y} r="12" className="fill-primary/10 animate-pulse" />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r="3.5"
                className="fill-background stroke-primary/50 stroke-2 hover:stroke-primary hover:fill-primary transition-all duration-300 cursor-pointer"
              />
            </motion.g>
          ))}
        </svg>
      </div>

      <div className="flex justify-between text-[8px] font-medium text-muted-foreground/40 uppercase tracking-[0.2em] px-1">
        {labels.map((l, i) => (
          <span 
            key={`${l}-${i}`} 
            className="flex-1 text-center truncate hover:text-primary transition-colors cursor-default"
            title={l}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
