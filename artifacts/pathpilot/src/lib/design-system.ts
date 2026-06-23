/**
 * PathPilot Premium Design System
 * Inspired by Apple, Linear, Notion, Xbox, and Stripe
 * Provides a consistent, intentional design language across the platform
 */

// Color Palette - Sophisticated and muted with high-contrast accents
export const COLORS = {
  // Neutrals
  background: "#0a0a0a", // Deep black for dark mode
  surface: "#1a1a1a", // Slightly lighter surface
  surfaceAlt: "#252525", // Alternative surface for contrast
  border: "#333333", // Subtle borders
  borderLight: "#404040", // Lighter borders

  // Text
  textPrimary: "#ffffff", // Primary text
  textSecondary: "#b0b0b0", // Secondary text
  textTertiary: "#808080", // Tertiary text (muted)

  // Accent Colors
  primary: "#3b82f6", // Vibrant blue
  primaryHover: "#2563eb", // Darker blue on hover
  primaryLight: "#60a5fa", // Lighter blue for subtle elements
  primaryDark: "#1d4ed8", // Darker blue for emphasis

  // Status Colors
  success: "#10b981", // Green
  warning: "#f59e0b", // Amber
  error: "#ef4444", // Red
  info: "#06b6d4", // Cyan

  // Gradients
  gradientPrimary: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  gradientSuccess: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  gradientWarning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
};

// Typography System - Premium and intentional
export const TYPOGRAPHY = {
  // Font Family
  fontFamily: {
    sans: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },

  // Font Sizes (in pixels)
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
    "5xl": "48px",
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tight: "-0.02em",
    normal: "0em",
    wide: "0.02em",
    wider: "0.05em",
  },
};

// Spacing System - Rigid 4px/8px grid
export const SPACING = {
  0: "0",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  28: "112px",
  32: "128px",
};

// Border Radius - Subtle and intentional
export const BORDER_RADIUS = {
  none: "0",
  sm: "4px",
  base: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  full: "9999px",
};

// Shadows - Subtle and layered
export const SHADOWS = {
  none: "none",
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  base: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  md: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
};

// Transitions - Smooth and professional
export const TRANSITIONS = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  base: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  slower: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
};

// Z-Index Scale
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Component Variants
export const COMPONENT_VARIANTS = {
  button: {
    primary: {
      bg: COLORS.primary,
      text: COLORS.textPrimary,
      hover: COLORS.primaryHover,
      active: COLORS.primaryDark,
    },
    secondary: {
      bg: COLORS.surfaceAlt,
      text: COLORS.textPrimary,
      hover: COLORS.border,
      active: COLORS.borderLight,
    },
    ghost: {
      bg: "transparent",
      text: COLORS.textPrimary,
      hover: COLORS.surface,
      active: COLORS.surfaceAlt,
    },
  },
  card: {
    default: {
      bg: COLORS.surface,
      border: COLORS.border,
      shadow: SHADOWS.sm,
    },
    elevated: {
      bg: COLORS.surface,
      border: COLORS.borderLight,
      shadow: SHADOWS.md,
    },
    interactive: {
      bg: COLORS.surface,
      border: COLORS.border,
      shadow: SHADOWS.sm,
      hoverBg: COLORS.surfaceAlt,
      hoverShadow: SHADOWS.md,
    },
  },
  input: {
    default: {
      bg: COLORS.surfaceAlt,
      border: COLORS.border,
      text: COLORS.textPrimary,
      placeholder: COLORS.textTertiary,
    },
    focus: {
      bg: COLORS.surfaceAlt,
      border: COLORS.primary,
      text: COLORS.textPrimary,
      shadow: `0 0 0 3px rgba(59, 130, 246, 0.1)`,
    },
  },
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Animation Presets
export const ANIMATIONS = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    animation: fadeIn ${TRANSITIONS.base};
  `,
  slideInUp: `
    @keyframes slideInUp {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    animation: slideInUp ${TRANSITIONS.base};
  `,
  slideInDown: `
    @keyframes slideInDown {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    animation: slideInDown ${TRANSITIONS.base};
  `,
  slideInLeft: `
    @keyframes slideInLeft {
      from { transform: translateX(-10px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    animation: slideInLeft ${TRANSITIONS.base};
  `,
  slideInRight: `
    @keyframes slideInRight {
      from { transform: translateX(10px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    animation: slideInRight ${TRANSITIONS.base};
  `,
  scaleIn: `
    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    animation: scaleIn ${TRANSITIONS.base};
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  `,
};

// Utility Functions
export const designUtils = {
  // Create a consistent spacing value
  spacing: (multiplier: number) => `${multiplier * 4}px`,

  // Create a responsive font size
  responsiveFontSize: (mobile: string, desktop: string) => ({
    mobile,
    desktop,
  }),

  // Create a gradient text
  gradientText: (gradient: string) => ({
    backgroundImage: gradient,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }),

  // Create a glass morphism effect (subtle)
  glassmorphism: (opacity: number = 0.1) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: "blur(10px)",
    border: `1px solid rgba(255, 255, 255, ${opacity * 2})`,
  }),

  // Create a focus ring
  focusRing: (color: string = COLORS.primary) => ({
    outline: "none",
    boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.1)`,
    borderColor: color,
  }),
};
