import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0f4c3a', // Dark Green
                    light: '#22c55e', // Bright green for dark mode
                    dark: '#0a3628',
                },
                secondary: {
                    DEFAULT: '#d4af37', // Gold
                    light: '#dfc264',
                    dark: '#aa8c2c',
                },
                neutral: {
                    light: '#f5f5dc', // Soft Beige
                    dark: '#1a1a1a',
                }
            },
            fontFamily: {
                arabic: ['var(--font-amiri)', 'serif'],
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
