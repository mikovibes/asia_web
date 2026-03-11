import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'beo-yellow': '#fed43d',
        'beo-blue': '#386ad2',
        'beo-black': '#111827',
      },
      fontFamily: {
        cartoon: ['var(--font-dynapuff)'],
        nunito: ['var(--font-nunito)'],
      },
    },
  },
  plugins: [],
};
export default config;
