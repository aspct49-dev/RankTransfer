"use client";

import { cn } from "@/lib/utils";
import { GradFlow } from "gradflow";

interface Props {
  className?: string;
}

export const RoobetGradient = ({ className }: Props) => {
  return (
    <div className={cn("fixed inset-0 w-full h-full pointer-events-none", className)} style={{ zIndex: 0 }}>
      <GradFlow
        config={{
          color1: { r: 255, g: 194, b: 0   },
          color2: { r: 45,  g: 10,  b: 122 },
          color3: { r: 8,   g: 5,   b: 28  },
          speed: 0.3,
          scale: 1.2,
          type: "stripe",
          noise: 0.06,
        }}
      />
    </div>
  );
};
