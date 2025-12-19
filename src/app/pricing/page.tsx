import { ThemeToggle } from "@/components/ui/ThemeToggle";

const PricingPage = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased selection:bg-primary selection:text-white">
      <header className="w-full border-b border-solid border-slate-200 dark:border-border-dark bg-white/50 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="layout-container flex h-full grow flex-col max-w-7xl mx-auto">
          <div className="flex items-center justify-between whitespace-nowrap px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="size-8 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">track_changes</span>
              </div>
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Proposal Sniper</h2>
            </div>
            <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
              <div className="flex items-center gap-8">
                <a className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="/">Features</a>
                <a className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="/pricing">Pricing</a>
                <a className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="#">Testimonials</a>
                <a className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="#">Login</a>
              </div>
              <ThemeToggle />
              <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-5 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold shadow-lg shadow-primary/20">
                <span className="truncate">Get Started</span>
              </button>
            </div>
            <div className="md:hidden flex items-center gap-4 text-white">
              <ThemeToggle />
              <span className="material-symbols-outlined">menu</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <section className="py-16 md:py-24 px-4 flex flex-col items-center text-center max-w-4xl mx-auto">
          <span className="text-primary text-sm font-bold tracking-wider uppercase mb-3">Choose your weapon</span>
          <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Snipe the Best Jobs with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Perfect Plan.</span>
          </h1>
          <p className="text-slate-600 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
            Choose the plan that fits your proposal needs. Upgrade, downgrade, or cancel anytime. No hidden fees.
          </p>
        </section>
        <section className="flex justify-center mb-12 px-4">
          <div className="bg-slate-200 dark:bg-surface-dark p-1.5 rounded-full inline-flex relative border border-slate-300 dark:border-border-dark">
            <button className="relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 bg-white dark:bg-border-dark text-slate-900 dark:text-white shadow-sm">
              Monthly
            </button>
            <button className="relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-2">
              Yearly
              <span className="text-[10px] bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Save 20%</span>
            </button>
          </div>
        </section>
        <section className="w-full px-4 md:px-10 pb-20">
          <div className="layout-content-container max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
              <div className="flex flex-col gap-6 rounded-2xl border border-solid border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark p-6 lg:p-8 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div className="flex flex-col gap-2">
                  <h3 className="text-slate-900 dark:text-white text-xl font-bold uppercase tracking-wide">Freelancer</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm">Perfect for beginners just starting out.</p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-slate-900 dark:text-white text-5xl font-extrabold tracking-tight">$0</span>
                    <span className="text-slate-500 dark:text-gray-400 text-base font-bold">/mo</span>
                  </div>
                </div>
                <button className="w-full cursor-pointer items-center justify-center rounded-xl h-12 px-4 bg-slate-100 dark:bg-border-dark hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold transition-colors">
                  Start Free
                </button>
                <div className="flex flex-col gap-4 pt-2">
                  <div className="flex gap-3 items-center text-slate-700 dark:text-gray-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>3 proposals/day</span>
                  </div>
                  <div className="flex gap-3 items-center text-slate-700 dark:text-gray-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>Basic templates</span>
                  </div>
                  <div className="flex gap-3 items-center text-slate-700 dark:text-gray-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>Community support</span>
                  </div>
                  <div className="flex gap-3 items-center text-slate-400 dark:text-gray-600 text-sm line-through decoration-slate-400 dark:decoration-gray-600">
                    <span className="material-symbols-outlined text-slate-300 dark:text-gray-700 text-[20px]">cancel</span>
                    <span>AI Customization</span>
                  </div>
                </div>
              </div>
              <div className="relative flex flex-col gap-6 rounded-2xl border-2 border-primary bg-white dark:bg-[#151921] p-6 lg:p-8 shadow-[0_0_35px_rgba(99,102,241,0.5)] scale-100 md:scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  Most Popular
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-primary text-xl font-bold uppercase tracking-wide">Pro</h3>
                  <p className="text-slate-500 dark:text-gray-300 text-sm">For serious hustlers getting work done.</p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-slate-900 dark:text-white text-5xl font-extrabold tracking-tight">$19</span>
                    <span className="text-slate-500 dark:text-gray-400 text-base font-bold">/mo</span>
                  </div>
                </div>
                <button className="w-full cursor-pointer items-center justify-center rounded-xl h-12 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]">
                  Go Pro
                </button>
                <div className="flex flex-col gap-4 pt-2">
                  <div className="flex gap-3 items-center text-slate-900 dark:text-white text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>Unlimited proposals</span>
                  </div>
                  <div className="flex gap-3 items-center text-slate-900 dark:text-white text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>AI Customization</span>
                  </div>
                  <div className="flex gap-3 items-center text-slate-900 dark:text-white text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>Priority Support</span>
                  </div>
                  <div className="flex gap-3 items-center text-slate-900 dark:text-white text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>Advanced Analytics</span>
                  </div>
                  <div className="flex gap-3 items-center text-slate-900 dark:text-white text-sm font-medium">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>Custom Branding</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6 rounded-2xl border border-solid border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark p-6 lg:p-8 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div className="flex flex-col gap-2">
                  <h3 className="text-slate-900 dark:text-white text-xl font-bold uppercase tracking-wide">Agency</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm">For scaling teams and high volume.</p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-slate-900 dark:text-white text-5xl font-extrabold tracking-tight">$99</span>
                    <span className="text-slate-500 dark:text-gray-400 text-base font-bold">/mo</span>
                  </div>
                </div>
                <button className="w-full cursor-pointer items-center justify-center rounded-xl h-12 px-4 bg-slate-100 dark:bg-border-dark hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold transition-colors">
                  Contact Sales
                </button>
                <div className="flex flex-col gap-4 pt-2">
                  <div className="flex gap-3 items-center text-slate-700 dark:text-gray-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>5 Team seats</span>
                  </div>
                  <div className="flex gap-3 items-center text-slate-700 dark:text-gray-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>API Access</span>
                  </div>
                  <div className="flex gap-3 items-center text-slate-700 dark:text-gray-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>White-labeling</span>
                  </div>
                  <div className="flex gap-3 items-center text-slate-700 dark:text-gray-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>Dedicated account manager</span>
                  </div>
                  <div className="flex gap-3 items-center text-slate-700 dark:text-gray-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>SSO Integration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 px-4 border-t border-slate-200 dark:border-border-dark/50 bg-slate-50 dark:bg-[#13171f]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked Questions</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">help</span>
                  Can I cancel anytime?
                </h4>
                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                  Absolutely. You can cancel your subscription at any time directly from your dashboard. You'll maintain access until the end of your billing cycle.
                </p>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">help</span>
                  Do you offer refunds?
                </h4>
                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                  We offer a 14-day money-back guarantee for all new Pro and Agency subscriptions. If you're not happy, just let us know.
                </p>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">help</span>
                  Is the AI customized to me?
                </h4>
                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                  Yes! On the Pro and Agency plans, Proposal Sniper learns from your past proposals and portfolio to match your unique tone of voice.
                </p>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">help</span>
                  What if I need more seats?
                </h4>
                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                  Our Agency plan includes 5 seats. For larger teams, please contact our sales team for a custom enterprise quote.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-white dark:bg-background-dark py-8 px-4 border-t border-slate-200 dark:border-border-dark">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
            <span className="material-symbols-outlined text-xl">track_changes</span>
            <span className="font-bold text-sm">Proposal Sniper © 2024</span>
          </div>
          <div className="flex gap-6">
            <a className="text-xs text-slate-500 hover:text-primary dark:text-gray-500 dark:hover:text-white" href="#">Privacy Policy</a>
            <a className="text-xs text-slate-500 hover:text-primary dark:text-gray-500 dark:hover:text-white" href="#">Terms of Service</a>
            <a className="text-xs text-slate-500 hover:text-primary dark:text-gray-500 dark:hover:text-white" href="#">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
