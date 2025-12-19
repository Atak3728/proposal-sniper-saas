"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Home, History, LayoutTemplate, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  return (
    <nav className="w-20 bg-background-light dark:bg-[#0b0d12] border-r border-[rgba(0,0,0,0.08)] dark:border-glass-border flex flex-col items-center py-6 gap-6 z-30 flex-shrink-0 transition-colors duration-300">
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] mb-2">
        <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
      </div>
      <div className="flex flex-col gap-3 w-full px-3">
        <Link
          href="/dashboard"
          className={clsx(
            "w-full aspect-square rounded-xl flex flex-col gap-1 items-center justify-center transition-all group relative",
            isActive('/dashboard')
              ? "bg-primary/10 border border-primary/20 text-primary shadow-[0_0_10px_rgba(99,102,241,0.2)]"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
          )}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link
          href="#"
          className="w-full aspect-square rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 flex flex-col gap-1 items-center justify-center transition-all group relative"
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-medium">History</span>
        </Link>
        <Link
          href="#"
          className="w-full aspect-square rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 flex flex-col gap-1 items-center justify-center transition-all group relative"
        >
          <LayoutTemplate className="w-6 h-6" />
          <span className="text-[10px] font-medium">Templates</span>
        </Link>
      </div>
      <div className="mt-auto flex flex-col gap-3 w-full px-3">
        <ThemeToggle
          className="w-full aspect-square rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 flex flex-col gap-1 items-center justify-center transition-all"
          iconSize={24}
        />
        <Link
          href="/settings"
          className={clsx(
            "w-full aspect-square rounded-xl flex flex-col gap-1 items-center justify-center transition-all group relative",
            isActive('/settings')
              ? "bg-primary/10 border border-primary/20 text-primary shadow-[0_0_10px_rgba(99,102,241,0.2)]"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
          )}
        >
          <Settings className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
