"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Home, History, LayoutTemplate, Settings, ChevronLeft, ChevronRight, HelpCircle, Crown } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse logic: Default to Expanded as per user request
  useEffect(() => {
    // Logic can be customized here if needed in future
    // Currently defaulting to false (expanded) for main views
    setIsCollapsed(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'History', href: '#', icon: History, action: () => router.push('/dashboard?history=true') },
    { name: 'Templates', href: '/templates', icon: LayoutTemplate },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav
      className={clsx(
        "relative flex flex-col py-6 gap-6 z-30 flex-shrink-0 transition-all duration-300 ease-in-out border-r border-[rgba(0,0,0,0.08)] dark:border-glass-border bg-background-light dark:bg-[#0b0d12]",
        isCollapsed ? "w-20 items-center" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className={clsx("flex items-center gap-3 mb-2 transition-all duration-300", isCollapsed ? "px-0 justify-center" : "px-6")}>
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] flex-shrink-0">
          <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
        </div>
        <div className={clsx("flex flex-col whitespace-nowrap overflow-hidden transition-all", isCollapsed ? "w-0 opacity-0 duration-0" : "w-auto opacity-100 duration-300")}>
          <span className="font-bold text-gray-900 dark:text-white leading-none">Proposal</span>
          <span className="text-primary font-bold text-sm tracking-widest leading-none">SNIPER</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className={clsx("flex flex-col gap-2 w-full", isCollapsed ? "px-3" : "px-4")}>
        {navItems.map((item) => {
          const active = isActive(item.href) && item.href !== '#';

          if (item.action) {
            return (
              <button
                key={item.name}
                onClick={item.action}
                className={clsx(
                  "flex items-center rounded-xl transition-all group relative",
                  isCollapsed ? "justify-center w-12 h-12" : "gap-3 px-4 py-3 w-full",
                  // History is never "active" page, but we could highlight if we wanted. For now, tool-like.
                  "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 text-left"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                <span className={clsx("text-sm whitespace-nowrap overflow-hidden transition-all", isCollapsed ? "w-0 opacity-0 duration-0 hidden" : "w-auto opacity-100 duration-300 block")}>
                  {item.name}
                </span>
              </button>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center rounded-xl transition-all group relative",
                isCollapsed ? "justify-center w-12 h-12" : "gap-3 px-4 py-3 w-full",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={clsx("w-5 h-5 flex-shrink-0 transition-colors", active ? "text-primary" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white")} />

              <span className={clsx("text-sm whitespace-nowrap overflow-hidden transition-all", isCollapsed ? "w-0 opacity-0 duration-0 hidden" : "w-auto opacity-100 duration-300 block")}>
                {item.name}
              </span>

              {active && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full animate-in fade-in slide-in-from-left-1"></div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Credits Section */}
      <div className={clsx("mt-auto flex flex-col gap-3 w-full transition-all duration-300", isCollapsed ? "px-3 items-center" : "px-4")}>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="self-end mb-2 text-gray-400 hover:text-primary transition-colors p-1"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Upgrade / Credits Box */}
        <div className={clsx(
          "bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 transition-all duration-300 overflow-hidden relative group",
          isCollapsed ? "w-12 h-12 p-0 flex items-center justify-center cursor-pointer hover:bg-primary/10 hover:border-primary/30" : "w-full px-4 py-4"
        )}
        >
          {isCollapsed ? (
            <div className="relative">
              <Crown size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Credits</span>
                <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">PRO</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500">
                <span>4,250 / 5,000 words</span>
              </div>
              <button className="w-full mt-1 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white py-2 rounded-lg shadow-lg shadow-primary/25 text-xs font-bold flex items-center justify-center gap-2">
                <Crown size={14} />
                UPGRADE
              </button>
            </div>
          )}
        </div>

        {!isCollapsed && <div className="h-px bg-gray-100 dark:bg-white/5 my-1 w-full"></div>}

        <div className={clsx("flex items-center w-full transition-all duration-300", isCollapsed ? "flex-col gap-4 pb-4" : "gap-3 px-4 pb-2")}>
          <ThemeToggle
            className={clsx(
              "rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all",
              isCollapsed ? "w-10 h-10" : "w-9 h-9"
            )}
            iconSize={isCollapsed ? 20 : 18}
          />

          {!isCollapsed && <div className="flex-1"></div>}

          {isCollapsed ? (
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5" title="Help & Support">
              <HelpCircle size={20} />
            </button>
          ) : (
            <button className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2">
              <span>Help & Support</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
