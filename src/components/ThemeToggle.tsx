"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const update = () => {
            if (theme === "dark") { setIsDark(true); return; }
            if (theme === "light") { setIsDark(false); return; }
            // "system" — read actual OS preference
            setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
        };
        update();
        if (theme === "system") {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            mq.addEventListener("change", update);
            return () => mq.removeEventListener("change", update);
        }
    }, [theme]);

    const toggle = () => setTheme(isDark ? "light" : "dark");

    // Prevent SSR mismatch — render neutral button until mounted
    if (!mounted) {
        return (
            <button className="p-2 rounded-full bg-neutral-light/50 dark:bg-black/50 hover:bg-primary/10 transition-colors border border-primary/10 w-9 h-9 flex items-center justify-center" aria-label="Toggle theme">
                <span className="w-4 h-4" />
            </button>
        );
    }

    return (
        <button
            onClick={toggle}
            className="p-2 rounded-full bg-neutral-light/50 dark:bg-black/50 hover:bg-primary/10 dark:hover:bg-primary-light/10 transition-colors text-primary border border-primary/10 dark:text-primary-light flex items-center justify-center relative w-9 h-9 overflow-hidden"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <div className={`absolute transition-all duration-300 ${isDark ? "-translate-y-8 opacity-0" : "translate-y-0 opacity-100"}`}>
                <Sun className="h-[1.2rem] w-[1.2rem] text-secondary" />
            </div>
            <div className={`absolute transition-all duration-300 ${isDark ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            </div>
            <span className="sr-only">{isDark ? "Switch to light mode" : "Switch to dark mode"}</span>
        </button>
    );
}
