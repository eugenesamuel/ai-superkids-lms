import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "ds-orange": "#FF6B35",
        "space-navy": "#1A1A2E",
        "space-deep": "#0D0D1A",
        "electric-cyan": "#00D4FF",
        "neon-green": "#00E676",
        "soft-white": "#F8F9FF",
        "light-orange": "#FFF3EE",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(255, 107, 53, 0.45)",
        "glow-cyan": "0 0 24px rgba(0, 212, 255, 0.45)",
        "glow-green": "0 0 24px rgba(0, 230, 118, 0.45)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-ring": "pulseRing 2s ease-out infinite",
        "star-drift": "starDrift 60s linear infinite",
        "glow-pulse": "glowPulse 2.4s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
        "wave-hand": "waveHand 1.6s ease-in-out infinite",
        "pop-in": "popIn 420ms cubic-bezier(0.18, 0.89, 0.32, 1.28)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(255,107,53,0.55)" },
          "70%": { boxShadow: "0 0 0 18px rgba(255,107,53,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(255,107,53,0)" },
        },
        starDrift: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "10000px 5000px" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(255,107,53,0.4)" },
          "50%": { boxShadow: "0 0 24px rgba(255,107,53,0.85)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        waveHand: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(20deg)" },
          "40%": { transform: "rotate(-10deg)" },
          "60%": { transform: "rotate(15deg)" },
        },
        popIn: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "60%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
