import type { Config } from "tailwindcss";

// [CRITÉRIO 4.1] Tailwind CSS é a base do ecossistema visual (componentes estilo ShadCN/UI).
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { darkBg: "#0f172a", cardBg: "#1e293b", accentYellow: "#eab308" },
    },
  },
  plugins: [],
};
export default config;
