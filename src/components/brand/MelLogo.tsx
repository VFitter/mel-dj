import { useId } from "react";
import { cn } from "@/lib/cn";
import {
  MEL_LOGO_CENTER,
  MEL_LOGO_COLOR,
  MEL_LOGO_GRID,
  MEL_LOGO_OUTER_RADIUS,
  MEL_LOGO_PIXELS,
  melLogoGlowFilter,
} from "./pixelLogo";

export interface MelLogoProps {
  className?: string;
  size?: number;
  title?: string;
  pixelColor?: string;
  glow?: boolean;
  glowColor?: string;
}

export default function MelLogo({
  className,
  size = 20,
  title = "MEL Radio",
  pixelColor = MEL_LOGO_COLOR,
  glow = true,
  glowColor = pixelColor,
}: MelLogoProps) {
  const clipId = useId();

  return (
    <svg
      viewBox={`0 0 ${MEL_LOGO_GRID} ${MEL_LOGO_GRID}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      role="img"
      aria-label={title}
      className={cn("flex-shrink-0", className)}
      style={glow ? { filter: melLogoGlowFilter(glowColor) } : undefined}
    >
      <title>{title}</title>
      <defs>
        <clipPath id={clipId}>
          <circle cx={MEL_LOGO_CENTER} cy={MEL_LOGO_CENTER} r={MEL_LOGO_OUTER_RADIUS} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {MEL_LOGO_PIXELS.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={pixelColor} />
        ))}
      </g>
    </svg>
  );
}
