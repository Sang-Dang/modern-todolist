import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "login-hero": "url('/login-hero.jpg')",
      },
    },
  },
  plugins: [],
  important: true,
} satisfies Config;
