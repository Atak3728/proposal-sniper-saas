"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ThemeToggleProps {
    className?: string;
    iconSize?: number;
}

export function ThemeToggle({ className, iconSize = 20 }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className={twMerge(
                    "p-2 rounded-lg text-gray-500 opacity-0",
                    className
                )}
                aria-hidden="true"
                disabled
            >
                <Sun size={iconSize} />
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={twMerge(
                "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-lighter text-gray-500 dark:text-gray-400 transition-colors",
                className
            )}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
        </button>
    );
}
