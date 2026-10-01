"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon } from "lucide-react";

interface RiskMeterProps {
  score: number; // 0 to 100
  riskLevel: string;
  size?: number;
}

export default function RiskMeter({ score, riskLevel, size = 220 }: RiskMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    const duration = 1200; // ms
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  // Color selection based on score
  let strokeColor = "#10B981"; // Emerald green
  let glowColor = "rgba(16, 185, 129, 0.35)";
  let textColor = "text-emerald-400";
  let badgeBg = "bg-emerald-500/15 border-emerald-500/30 text-emerald-300";
  let Icon = ShieldCheck;

  if (score >= 75) {
    strokeColor = "#EF4444"; // Red / Crimson
    glowColor = "rgba(239, 68, 68, 0.4)";
    textColor = "text-red-400";
    badgeBg = "bg-red-500/15 border-red-500/30 text-red-300";
    Icon = AlertOctagon;
  } else if (score >= 50) {
    strokeColor = "#F97316"; // Orange
    glowColor = "rgba(249, 115, 22, 0.35)";
    textColor = "text-orange-400";
    badgeBg = "bg-orange-500/15 border-orange-500/30 text-orange-300";
    Icon = AlertTriangle;
  } else if (score >= 30) {
    strokeColor = "#F59E0B"; // Amber
    glowColor = "rgba(245, 158, 11, 0.35)";
    textColor = "text-amber-400";
    badgeBg = "bg-amber-500/15 border-amber-500/30 text-amber-300";
    Icon = ShieldAlert;
  }

  // SVG Gauge calculations
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // We use a 240 degree arc (leaving bottom 120 open for a modern gauge look)
  const arcDegree = 240;
  const arcLength = (circumference * arcDegree) / 360;
  const offset = arcLength - (arcLength * animatedScore) / 100;

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Glow backdrop */}
        <div
          className="absolute inset-4 rounded-full filter blur-xl transition-all duration-700 pointer-events-none opacity-40"
          style={{ background: glowColor }}
        />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-[210deg] drop-shadow-md"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Metric Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
            Dispute Risk Score
          </div>
          <div className="flex items-baseline justify-center">
            <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${textColor} font-mono`}>
              {animatedScore}
            </span>
            <span className="text-sm font-semibold text-slate-400 ml-1">/100</span>
          </div>

          <div className="flex items-center gap-1 mt-1.5">
            <Icon className={`w-3.5 h-3.5 ${textColor}`} />
            <span className="text-xs font-medium text-slate-300">
              {score >= 75 ? "Critical Risk" : score >= 50 ? "High Risk" : score >= 30 ? "Moderate" : "Low Risk"}
            </span>
          </div>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div
        className={`px-3.5 py-1 rounded-full text-xs font-semibold border shadow-sm mt-[-10px] flex items-center gap-1.5 ${badgeBg}`}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: strokeColor }}
        />
        <span>{riskLevel}</span>
      </div>
    </div>
  );
}
