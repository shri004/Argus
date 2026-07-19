/**
 * Every color here is a CSS custom property defined in src/index.css.
 * Components use classes like `bg-surface-1` or `text-accent` instead
 * of raw hex, so the whole theme (or a future light mode) can change
 * in one file without touching component code.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          0: "var(--bg-0)",
          1: "var(--bg-1)",
        },
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          strong: "var(--accent-strong)",
        },
        severity: {
          critical: "var(--sev-critical)",
          high: "var(--sev-high)",
          medium: "var(--sev-medium)",
          low: "var(--sev-low)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
