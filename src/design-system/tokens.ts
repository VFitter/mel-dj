export const brand = {
  primary: "var(--color-brand-primary)",
  primaryHover: "var(--color-brand-primary-hover)",
  primaryMuted: "var(--color-brand-primary-muted)",
  indigo: "var(--color-brand-indigo)",
  indigoHover: "var(--color-brand-indigo-hover)",
  accent: "var(--color-brand-accent)",
  accentHover: "var(--color-brand-accent-hover)",
  accentMuted: "var(--color-brand-accent-muted)",
  neon: "var(--color-brand-neon)",
  neonHover: "var(--color-brand-neon-hover)",
  neonMuted: "var(--color-brand-neon-muted)",
  fuchsia: "var(--color-brand-fuchsia)",
} as const;

export const semantic = {
  success: "var(--color-success)",
  successMuted: "var(--color-success-muted)",
  warning: "var(--color-warning)",
  warningMuted: "var(--color-warning-muted)",
  error: "var(--color-error)",
  errorMuted: "var(--color-error-muted)",
  info: "var(--color-info)",
  infoMuted: "var(--color-info-muted)",
} as const;

export const surface = {
  base: "var(--color-surface-base)",
  raised: "var(--color-surface-raised)",
  overlay: "var(--color-surface-overlay)",
  glass: "var(--color-surface-glass)",
  glassBorder: "var(--color-surface-glass-border)",
  elevated: "var(--color-surface-elevated)",
  sunken: "var(--color-surface-sunken)",
} as const;

export const text = {
  primary: "var(--color-text-primary)",
  secondary: "var(--color-text-secondary)",
  muted: "var(--color-text-muted)",
  disabled: "var(--color-text-disabled)",
  inverse: "var(--color-text-inverse)",
  brand: "var(--color-text-brand)",
  accent: "var(--color-text-accent)",
  neon: "var(--color-text-neon)",
} as const;

export const border = {
  default: "var(--color-border)",
  subtle: "var(--color-border-subtle)",
  strong: "var(--color-border-strong)",
  brand: "var(--color-border-brand)",
  accent: "var(--color-border-accent)",
  neon: "var(--color-border-neon)",
} as const;

export const ring = {
  default: "var(--color-ring)",
  offset: "var(--color-ring-offset)",
} as const;

export const typography = {
  fontFamily: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
    display: "var(--font-display)",
    pixel: "var(--font-pixel)",
  },
  fontSize: {
    "2xs": "var(--text-2xs)",
    xs: "var(--text-xs)",
    sm: "var(--text-sm)",
    base: "var(--text-base)",
    lg: "var(--text-lg)",
    xl: "var(--text-xl)",
    "2xl": "var(--text-2xl)",
    "3xl": "var(--text-3xl)",
    "4xl": "var(--text-4xl)",
    "5xl": "var(--text-5xl)",
    "6xl": "var(--text-6xl)",
    display: "var(--text-display)",
  },
  lineHeight: {
    none: "var(--leading-none)",
    tight: "var(--leading-tight)",
    snug: "var(--leading-snug)",
    normal: "var(--leading-normal)",
    relaxed: "var(--leading-relaxed)",
  },
  letterSpacing: {
    tighter: "var(--tracking-tighter)",
    tight: "var(--tracking-tight)",
    normal: "var(--tracking-normal)",
    wide: "var(--tracking-wide)",
    wider: "var(--tracking-wider)",
    widest: "var(--tracking-widest)",
  },
  fontWeight: {
    normal: "var(--font-weight-normal)",
    medium: "var(--font-weight-medium)",
    semibold: "var(--font-weight-semibold)",
    bold: "var(--font-weight-bold)",
  },
} as const;

export const spacing = {
  px: "var(--space-px)",
  0: "var(--space-0)",
  0.5: "var(--space-0_5)",
  1: "var(--space-1)",
  1.5: "var(--space-1_5)",
  2: "var(--space-2)",
  2.5: "var(--space-2_5)",
  3: "var(--space-3)",
  3.5: "var(--space-3_5)",
  4: "var(--space-4)",
  5: "var(--space-5)",
  6: "var(--space-6)",
  7: "var(--space-7)",
  8: "var(--space-8)",
  9: "var(--space-9)",
  10: "var(--space-10)",
  11: "var(--space-11)",
  12: "var(--space-12)",
  14: "var(--space-14)",
  16: "var(--space-16)",
  20: "var(--space-20)",
  24: "var(--space-24)",
  28: "var(--space-28)",
  32: "var(--space-32)",
  36: "var(--space-36)",
  40: "var(--space-40)",
  44: "var(--space-44)",
  48: "var(--space-48)",
  52: "var(--space-52)",
  56: "var(--space-56)",
  60: "var(--space-60)",
  64: "var(--space-64)",
  72: "var(--space-72)",
  80: "var(--space-80)",
  96: "var(--space-96)",
} as const;

export const radius = {
  none: "var(--radius-none)",
  xs: "var(--radius-xs)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  "3xl": "var(--radius-3xl)",
  "4xl": "var(--radius-4xl)",
  full: "var(--radius-full)",
} as const;

export const shadow = {
  xs: "var(--shadow-xs)",
  sm: "var(--shadow-sm)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)",
  xl: "var(--shadow-xl)",
  "2xl": "var(--shadow-2xl)",
  inner: "var(--shadow-inner)",
  none: "var(--shadow-none)",
} as const;

export const glow = {
  primary: "var(--glow-primary)",
  primarySm: "var(--glow-primary-sm)",
  accent: "var(--glow-accent)",
  accentSm: "var(--glow-accent-sm)",
  neon: "var(--glow-neon)",
  neonSm: "var(--glow-neon-sm)",
  mixed: "var(--glow-mixed)",
} as const;

export const blur = {
  xs: "var(--blur-xs)",
  sm: "var(--blur-sm)",
  md: "var(--blur-md)",
  lg: "var(--blur-lg)",
  xl: "var(--blur-xl)",
  "2xl": "var(--blur-2xl)",
  "3xl": "var(--blur-3xl)",
} as const;

export const zIndex = {
  base: "var(--z-base)",
  raised: "var(--z-raised)",
  dropdown: "var(--z-dropdown)",
  sticky: "var(--z-sticky)",
  overlay: "var(--z-overlay)",
  modal: "var(--z-modal)",
  toast: "var(--z-toast)",
  player: "var(--z-player)",
  max: "var(--z-max)",
} as const;

export const motion = {
  duration: {
    instant: "var(--duration-instant)",
    fast: "var(--duration-fast)",
    normal: "var(--duration-normal)",
    moderate: "var(--duration-moderate)",
    slow: "var(--duration-slow)",
    slower: "var(--duration-slower)",
    slowest: "var(--duration-slowest)",
  },
  ease: {
    linear: "var(--ease-linear)",
    in: "var(--ease-in)",
    out: "var(--ease-out)",
    inOut: "var(--ease-in-out)",
    spring: "var(--ease-spring)",
    bounce: "var(--ease-bounce)",
    smooth: "var(--ease-smooth)",
    pulse: "var(--ease-pulse)",
  },
} as const;

export const tokens = {
  brand,
  semantic,
  surface,
  text,
  border,
  ring,
  typography,
  spacing,
  radius,
  shadow,
  glow,
  blur,
  zIndex,
  motion,
} as const;

export type BrandToken = keyof typeof brand;
export type SemanticToken = keyof typeof semantic;
export type SurfaceToken = keyof typeof surface;
export type TextToken = keyof typeof text;
export type BorderToken = keyof typeof border;
export type RingToken = keyof typeof ring;
export type TypographyFontFamilyToken = keyof typeof typography.fontFamily;
export type TypographyFontSizeToken = keyof typeof typography.fontSize;
export type TypographyLineHeightToken = keyof typeof typography.lineHeight;
export type TypographyLetterSpacingToken = keyof typeof typography.letterSpacing;
export type TypographyFontWeightToken = keyof typeof typography.fontWeight;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type ShadowToken = keyof typeof shadow;
export type GlowToken = keyof typeof glow;
export type BlurToken = keyof typeof blur;
export type ZIndexToken = keyof typeof zIndex;
export type MotionDurationToken = keyof typeof motion.duration;
export type MotionEaseToken = keyof typeof motion.ease;
export type TokenCategory = keyof typeof tokens;
