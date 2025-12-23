"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Home, History, LayoutTemplate, Settings, ChevronLeft, ChevronRight, HelpCircle, Crown, Loader2, Sparkles, CreditCard } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { getCheckoutUrl } from '@/actions/payment-actions';
import { getBio } from '@/actions/db-actions'; // IMPORT THIS
import { toast } from 'sonner';

// --- Components ---

const ProminentUpgradeButton = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const email = user.primaryEmailAddress?.emailAddress || '';
      const checkoutUrl = await getCheckoutUrl(user.id, email);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      toast.error("Failed to start upgrade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all group flex items-center justify-center gap-3 relative overflow-hidden mb-4"
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
        {loading ? <Loader2 size={18} className="animate-spin text-white" /> : <Sparkles size={18} className="text-white fill-white/20" />}
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-bold tracking-wide">UPGRADE TO PRO</span>
        <span className="text-[10px] text-white/80 font-medium">{loading ? 'Processing...' : 'Unlock full power'}</span>
      </div>
    </button>
  );
};

const UpgradeButton = ({ isPro }: { isPro: boolean }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) return;
    if (isPro) {
      // Manage subscription logic could go here (e.g., customer portal)
      toast.info("You are already a Pro member!");
      return;
    }

    setLoading(true);
    try {
      const email = user.primaryEmailAddress?.emailAddress || '';
      const checkoutUrl = await getCheckoutUrl(user.id, email);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      toast.error("Failed to start upgrade.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="text-[10px] text-primary hover:text-primary/80 font-medium truncate text-left transition-colors flex items-center gap-1"
    >
      {loading ? (
        <>
          <Loader2 size={10} className="animate-spin mb-0.5" />
          <span>Processing...</span>
        </>
      ) : isPro ? (
        <>
          <CreditCard size={10} className="mb-0.5" />
          <span>Manage Plan</span>
        </>
      ) : (
        <>
          <Crown size={10} className="mb-0.5" />
          <span>Upgrade to Pro</span>
        </>
      )}
    </button>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPro, setIsPro] = useState(false); // State to track Pro status
  const [isChecking, setIsChecking] = useState(true);

  // 1. Fetch User Status
  useEffect(() => {
    async function checkStatus() {
      try {
        if (user?.id) {
          const res = await getBio(user.id);
          // @ts-ignore - Assuming userProfile has 'isPro' field
          if (res.success && res.data?.isPro) {
            setIsPro(true);
          }
        }
      } catch (error) {
        console.error("Error checking pro status:", error);
      } finally {
        setIsChecking(false);
      }
    }

    if (isLoaded) {
      if (user) checkStatus();
      else setIsChecking(false); // If no user, stop checking immediately
    }
  }, [user, isLoaded]);

  // 2. Auto-collapse logic
  useEffect(() => {
    setIsCollapsed(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'History', href: '/history', icon: History },
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

      {/* Footer */}
      <div className={clsx("mt-auto flex flex-col gap-3 w-full transition-all duration-300", isCollapsed ? "px-3 items-center" : "px-4")}>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="self-end mb-2 text-gray-400 hover:text-primary transition-colors p-1"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Upgrade Button Logic: ONLY SHOW IF NOT PRO AND NOT CHECKING */}
        {!isCollapsed && !isPro && !isChecking && (
          <div className="w-full px-4">
            <ProminentUpgradeButton />
          </div>
        )}

        <div className={clsx(
          "bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 transition-all duration-300 overflow-hidden relative group",
          isCollapsed ? "w-12 h-12 p-0 flex items-center justify-center cursor-pointer hover:bg-primary/10 hover:border-primary/30" : "w-full px-4 py-4"
        )}>
          <SignedIn>
            <div className={clsx("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonTrigger: "focus:shadow-none"
                  }
                }}
                showName={!isCollapsed}
              />
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      My Account
                    </span>
                    {/* Pass isPro status to small button */}
                    <UpgradeButton isPro={isPro} />
                  </div>
                </div>
              )}
            </div>
          </SignedIn>
          <SignedOut>
            {/* ... SignedOut content remains the same ... */}
            <SignInButton mode="modal">
              <button className="w-full bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white py-2 rounded-lg shadow-lg shadow-primary/25 text-xs font-bold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">login</span>
                SIGN IN
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* ... Rest of footer (Theme Toggle, Help) remains the same ... */}
        {!isCollapsed && <div className="h-px bg-gray-100 dark:bg-white/5 my-1 w-full"></div>}
        <div className={clsx("flex items-center w-full transition-all duration-300", isCollapsed ? "flex-col gap-4 pb-4" : "gap-3 px-4 pb-2")}>
          <ThemeToggle className={clsx("rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all", isCollapsed ? "w-10 h-10" : "w-9 h-9")} iconSize={isCollapsed ? 20 : 18} />
          {!isCollapsed && <div className="flex-1"></div>}
          {isCollapsed ? <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500" title="Help"><HelpCircle size={20} /></button> : <button className="text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2"><span>Help & Support</span></button>}
        </div>

      </div>
    </nav>
  );
};

export default Sidebar;