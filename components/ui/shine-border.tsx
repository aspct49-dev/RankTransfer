"use client";

import { cn } from "@/lib/utils";

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

export function ShineBorder({
  borderRadius = 20,
  borderWidth = 2,
  duration = 8,
  color = ["#ffc200", "#7c1fd4", "#f0b429", "#45107a", "#ffd700"],
  className,
  children,
}: ShineBorderProps) {
  const colorStr = Array.isArray(color) ? color.join(",") : color;

  return (
    <div
      className={cn("shine-border-wrap", className)}
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--border-width": `${borderWidth}px`,
          "--shine-duration": `${duration}s`,
          "--shine-colors": `radial-gradient(transparent, transparent, ${colorStr}, transparent, transparent)`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
