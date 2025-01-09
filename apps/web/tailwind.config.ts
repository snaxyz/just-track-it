import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "spin-once": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(35deg)" },
        },
        "outline-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)" }, // blue color example
          "70%": { boxShadow: "0 0 0 8px rgba(59, 130, 246, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" },
        },
        "color-cycle": {
          "0%": { boxShadow: "0 0 0 2px rgba(239, 68, 68, 1)" }, // red
          "25%": { boxShadow: "0 0 0 2px rgba(234, 179, 8, 1)" }, // yellow
          "50%": { boxShadow: "0 0 0 2px rgba(34, 197, 94, 1)" }, // green
          "75%": { boxShadow: "0 0 0 2px rgba(59, 130, 246, 1)" }, // blue
          "100%": { boxShadow: "0 0 0 2px rgba(239, 68, 68, 1)" }, // back to red
        },
        "spin-outline": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "gradient-outline": {
          "0%, 100%": {
            "box-shadow":
              "0 0 0px rgba(99, 102, 241, 0.6), 0 0 15px rgba(168, 85, 247, 0.6)",
          },
          "50%": {
            "box-shadow":
              "0 0 20px rgba(99, 102, 241, 0.8), 0 0 35px rgba(168, 85, 247, 0.8)",
          },
        },
      },
      animation: {
        "spin-once": "spin-once 0.3s ease-in forwards",
        "outline-pulse": "outline-pulse 1.5s ease-in-out infinite",
        "color-cycle": "color-cycle 3s linear infinite",
        "spin-outline": "spin-outline 1.5s linear infinite",
        "gradient-outline": "gradient-outline 2s ease-in forwards",
      },
      colors: {
        caption: {
          DEFAULT: "#A8A8A8",
          light: "#6B6B6B",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "snalabs",
      layout: {
        fontSize: {
          tiny: "0.875rem",
          small: "1rem",
          medium: "1.125rem",
          large: "1.25rem",
        },
        lineHeight: {
          tiny: "1.25rem",
          small: "1.5rem",
          medium: "1.75rem",
          large: "1.75rem",
        },
      },
      themes: {
        light: {
          colors: {
            content1: {},
            content2: {},
            content3: {},
            content4: {},
            default: {
              ...colors.violet,
              [50]: colors.violet[100],
              [100]: colors.violet[100],
              DEFAULT: colors.violet[200],
              foreground: colors.black,
            },
            primary: {
              ...colors.pink,
              DEFAULT: colors.pink[400],
              foreground: colors.black,
            },
            secondary: {
              ...colors.fuchsia,
              DEFAULT: colors.fuchsia[600],
              foreground: colors.white,
            },
            danger: {
              ...colors.rose,
              DEFAULT: colors.rose[400],
              foreground: colors.white,
            },
          },
        },
        dark: {
          colors: {
            content1: {},
            content2: {},
            content3: {},
            content4: {},
            default: {
              [50]: colors.zinc[950],
              [100]: colors.zinc[900],
              [200]: colors.zinc[800],
              [300]: colors.zinc[700],
              [400]: colors.zinc[600],
              [500]: colors.zinc[500],
              [600]: colors.zinc[400],
              [700]: colors.zinc[300],
              [800]: colors.zinc[200],
              [900]: colors.zinc[100],
            },
            primary: {
              ...colors.blue,
              DEFAULT: colors.blue[600],
              foreground: colors.white,
            },
            secondary: {
              ...colors.lime,
              DEFAULT: colors.lime[300],
              foreground: colors.black,
            },
          },
        },
      },
    }),
  ],
};
export default config;
