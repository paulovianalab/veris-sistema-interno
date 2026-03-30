"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function ActivityChart() {
  const { theme } = useTheme();
  
  // Mock data points
  const data = [30, 45, 35, 80, 50, 70, 90];
  const labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
  
  // SVG Viewport: 1000x200
  const width = 1000;
  const height = 200;
  const padding = 20;
  
  // Calculate points
  const points = data.map((d, i) => ({
    x: (i * (width / (data.length - 1))),
    y: height - padding - (d / 100) * (height - padding * 2)
  }));

  // Create SVG path (Bezier curve)
  const drawPath = () => {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      d += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const path = drawPath();
  const areaPath = `${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-1000">
      <div className="relative h-48 w-full group">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.5" />
              <stop offset="50%" stopColor="var(--primary)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <motion.path
            d={areaPath}
            fill="url(#areaGradient)"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            style={{ originY: 1 }}
          />

          {/* Curve Line */}
          <motion.path
            d={path}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Tooltip Vertical Line on Hover (Mock for CSS) */}
          <div className="absolute inset-0 pointer-events-none">
             {/* This part would usually be handled by a charting lib, but we keep it minimal */}
          </div>

          {/* Data Points */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              className="fill-background stroke-primary stroke-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.1 }}
              whileHover={{ scale: 2, fill: "var(--primary)" }}
            />
          ))}

          {/* Highlight for Peak */}
          {points[3] && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <text
                x={points[3].x}
                y={points[3].y - 20}
                textAnchor="middle"
                className="fill-primary font-medium text-[24px] uppercase tracking-[0.2em]"
                style={{ fontSize: '24px' }}
              >
                PICO
              </text>
              <circle cx={points[3].x} cy={points[3].y} r="12" className="fill-primary/20 animate-ping" />
            </motion.g>
          )}
        </svg>
      </div>

      <div className="flex justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-[0.4em] opacity-40 px-2">
        {labels.map(l => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}
