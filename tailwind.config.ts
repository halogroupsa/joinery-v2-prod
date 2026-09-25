import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // RGB-channel form so Tailwind opacity modifiers (bg-paper/92) work.
        paper: {
          DEFAULT: "rgb(var(--color-paper-rgb) / <alpha-value>)",
          warm: "rgb(var(--color-paper-warm-rgb) / <alpha-value>)",
          deep: "rgb(var(--color-paper-deep-rgb) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--color-ink-rgb) / <alpha-value>)",
          soft: "rgb(var(--color-ink-soft-rgb) / <alpha-value>)",
          mute: "rgb(var(--color-ink-mute-rgb) / <alpha-value>)",
        },
        carbon: {
          DEFAULT: "rgb(var(--color-carbon-rgb) / <alpha-value>)",
          deep: "rgb(var(--color-carbon-deep-rgb) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent-rgb) / <alpha-value>)",
          soft: "rgb(var(--color-accent-soft-rgb) / <alpha-value>)",
          deep: "rgb(var(--color-accent-deep-rgb) / <alpha-value>)",
        },
        timber: "rgb(var(--color-timber-rgb) / <alpha-value>)",
        sage: {
          DEFAULT: "rgb(var(--color-sage-rgb) / <alpha-value>)",
          soft: "rgb(var(--color-sage-soft-rgb) / <alpha-value>)",
        },
        rule: {
          DEFAULT: "rgb(var(--color-rule-rgb) / <alpha-value>)",
          strong: "rgb(var(--color-rule-strong-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      // Every size is a token, so `text-sm` and friends are fluid rather
      // than frozen. Line heights are unitless on purpose: a fixed rem
      // leading would drift out of ratio as the clamp grows.
      fontSize: {
        // UI + reading — overrides Tailwind's fixed defaults.
        // Fallbacks as above; here they double as the old fixed sizes.
        "3xs": ["var(--text-3xs, 0.625rem)", { lineHeight: "1.5" }],
        "2xs": ["var(--text-2xs, 0.6875rem)", { lineHeight: "1.45" }],
        xs: ["var(--text-xs, 0.75rem)", { lineHeight: "1.35" }],
        sm: ["var(--text-sm, 0.875rem)", { lineHeight: "1.45" }],
        base: ["var(--text-base, 1rem)", { lineHeight: "1.5" }],
        md: ["var(--text-md, 1.0625rem)", { lineHeight: "1.5" }],
        lg: ["var(--text-lg, 1.125rem)", { lineHeight: "1.5" }],
        xl: ["var(--text-xl, 1.25rem)", { lineHeight: "1.4" }],
        "2xl": ["var(--text-2xl, 1.5rem)", { lineHeight: "1.3" }],
        "3xl": ["var(--text-3xl, 1.875rem)", { lineHeight: "1.2" }],
        "4xl": ["var(--text-4xl, 2.25rem)", { lineHeight: "1.1" }],

        // Editorial display — height-capped, see globals.css.
        // Size only, no line height: these land on headings that already
        // get their leading from the h1-h6 / .display-title base rules,
        // and emitting one here would silently override it.
        //
        // Each carries its clamp as a var() fallback. An unresolved
        // custom property on font-size does not fall back to something
        // sensible — it falls back to *inherited*, which silently drops a
        // 60px hero to body size with no error anywhere. The duplication
        // is worth it to make that failure impossible.
        "fluid-lg": "var(--display-lg, clamp(1rem, 0.75rem + 0.5vw, 1.25rem))",
        "fluid-xl": "var(--display-xl, clamp(1.125rem, 0.8rem + 0.8vw, 1.625rem))",
        "fluid-2xl": "var(--display-2xl, clamp(1.375rem, 1rem + 1.2vw, 1.875rem))",
        "fluid-3xl": "var(--display-3xl, clamp(1.525rem, 1rem + 2vw, 2.125rem))",
        "fluid-4xl": "var(--display-4xl, clamp(2rem, 1.2rem + 2vw, 3rem))",
        "fluid-display": "var(--display-xxl, clamp(2rem, 1.2rem + 2vw, 3.25rem))",
        "fluid-hero": "var(--display-hero, clamp(2.15rem, 1.25rem + 1.9vw, 3.25rem))",
      },
      maxWidth: {
        "container-max": "var(--container-max)",
        "container-wide": "var(--container-wide)",
      },
      // Squared-off aesthetic — force every `rounded-*` utility (including
      // rounded-full / rounded-l-md etc.) to 0 so no border radius appears
      // anywhere on the site.
      borderRadius: {
        none: "0",
        xs: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "0",
        DEFAULT: "0",
      },
      transitionTimingFunction: {
        "out-soft": "var(--ease-out)",
        "in-soft": "var(--ease-in)",
        "in-out-soft": "var(--ease-in-out)",
      },
      transitionDuration: {
        fast: "160ms",
        base: "280ms",
        slow: "460ms",
        slower: "720ms",
      },
    },
  },
  plugins: [],
};

export default config;
