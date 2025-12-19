import { ThemeToggle } from "../components/ui/ThemeToggle";

const LandingPage = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden text-slate-900 dark:text-white transition-colors duration-200">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-border-dark bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex justify-center w-full">
            <div className="layout-content-container flex w-full max-w-[1200px] items-center justify-between px-4 py-4 md:px-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">target</span>
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">Proposal Sniper</h2>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <a className="text-sm font-medium hover:text-primary transition-colors" href="#features">Features</a>
                <a className="text-sm font-medium hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
                <a className="text-sm font-medium hover:text-primary transition-colors" href="/pricing">Pricing</a>
              </nav>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-transparent border border-gray-300 dark:border-border-dark text-sm font-bold hover:bg-gray-100 dark:hover:bg-card-dark transition-colors">
                  Log In
                </button>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-indigo-600 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-12 md:py-20 lg:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="layout-container flex justify-center px-4 md:px-10">
            <div className="layout-content-container flex flex-col max-w-[1200px] w-full">
              <div className="@container">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
                  <div className="flex flex-col gap-6 lg:w-1/2 z-10">
                    <div className="flex flex-col gap-4 text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                        <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                        <span className="text-primary text-xs font-bold uppercase tracking-wider">AI-Powered Efficiency</span>
                      </div>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                        Get Hired Faster with <span className="text-primary">AI-Precision</span> Proposals
                      </h1>
                      <h2 className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-normal leading-relaxed max-w-lg">
                        Stop wasting hours writing cover letters. Proposal Sniper analyzes job descriptions and crafts the perfect pitch in seconds.
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <button className="flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-white text-base font-bold shadow-lg shadow-primary/25 hover:bg-indigo-600 hover:scale-105 transition-all duration-200">
                        Generate Proposal Now
                      </button>
                      <button className="flex h-12 items-center justify-center rounded-lg bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark px-6 text-slate-900 dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <span className="material-symbols-outlined mr-2 text-xl">play_circle</span>
                        View Demo
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500 font-medium">
                      <div className="flex -space-x-2">
                        <div className="size-6 rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-background-light dark:border-background-dark"></div>
                        <div className="size-6 rounded-full bg-gray-400 dark:bg-gray-600 border-2 border-background-light dark:border-background-dark"></div>
                        <div className="size-6 rounded-full bg-gray-500 dark:bg-gray-500 border-2 border-background-light dark:border-background-dark"></div>
                      </div>
                      <p>Trusted by 10,000+ freelancers</p>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 mt-8 lg:mt-0 relative group perspective-1000">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 rotate-y-12"></div>
                    <div className="relative w-full aspect-[4/3] rounded-xl bg-card-dark border border-border-dark overflow-hidden shadow-2xl rotate-y-12 transition-transform duration-500 hover:rotate-y-0 preserve-3d">
                      <div className="absolute inset-0 bg-background-dark flex flex-col p-6">
                        <div className="flex items-center justify-between mb-4 border-b border-border-dark pb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="text-xs text-slate-500 font-mono">proposal_v1.txt</div>
                        </div>
                        <div className="space-y-3 font-mono text-sm text-slate-300">
                          <div className="flex gap-2">
                            <span className="text-slate-600">01</span>
                            <span className="text-primary">Dear Hiring Manager,</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-slate-600">02</span>
                            <span>I noticed you're looking for a React expert to build a dashboard.</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-slate-600">03</span>
                            <span>With 5+ years of experience in <span className="text-green-400">Tailwind CSS</span> and modern UI...</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-slate-600">04</span>
                            <span className="bg-primary/20 text-white px-1">I can deliver the MVP within 2 weeks as requested.</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-slate-600">05</span>
                            <span>Here is a link to a similar project I completed: portfolio.com/dash</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-slate-600">06</span>
                            <span>Best regards,</span>
                          </div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-border-dark flex justify-between items-center">
                          <div className="flex gap-2">
                            <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs">High Match</span>
                            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">Professional Tone</span>
                          </div>
                          <button className="bg-primary hover:bg-primary/90 text-white text-xs px-3 py-1.5 rounded transition-colors">Copy to Clipboard</button>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-20 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-8 border-y border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-card-dark/50">
          <div className="layout-container flex justify-center px-4 md:px-10">
            <div className="layout-content-container flex flex-col max-w-[1200px] w-full items-center">
              <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">Works seamlessly with top platforms</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <svg className="h-8 md:h-9 w-auto fill-current text-slate-800 dark:text-white" viewBox="0 0 249 76" xmlns="http://www.w3.org/2000/svg">
                  <path d="M185.06 18.06c-11.66 0-21.84 6.13-27.17 15.19h-.44v-14.1H136.2v55.8h21.25V47.51c0-8.91 6.51-12.8 13.92-12.8 7.9 0 13.51 5.09 13.51 13.51v26.73h21.24V44.47c0-15.65-9.35-26.41-21.06-26.41zm-60.83-4.52h-21.14c-2.43 21.04-10.74 36.16-24.18 43.68v.53c13.48 2.05 24.16 8.35 29.84 17.11h23.82c-7.79-11.61-22.31-20.25-39.2-22.18 8.8-5.38 14.86-15.6 16.59-32.06l14.27 48.16h22.6l-19.16-55.24h-3.44zm-64.88 0H38.1v33.48c0 7.42-3.79 11.23-10.51 11.23-6.68 0-10.45-3.81-10.45-11.23V13.54H0v35.32c0 18.17 11.28 27.05 28.98 27.05 16.6 0 27.67-8.35 29.28-25.04l.4-37.33h.69z"></path>
                  <circle cx="218.45" cy="38.45" r="10.55"></circle>
                </svg>
                <div className="flex items-center gap-1">
                  <span className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">freelancer</span>
                </div>
                <svg className="h-8 md:h-9 w-auto fill-current text-slate-800 dark:text-white" viewBox="0 0 2500 2500" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2390.62 1032.81v-123.44H2237.5v123.44H2390.62zM2392.19 2200V1139.06h-154.69V2200H2392.19zM2035.94 2200V1364.06c0-104.69-78.12-160.94-159.38-160.94-73.44 0-142.19 50-165.62 121.88v-109.38H1557.81V2200h153.12v-715.62c0-57.81 35.94-98.44 87.5-98.44 46.88 0 78.12 37.5 78.12 90.62V2200h159.38zM1406.25 2200l-312.5-1060.94H929.688l-300 1060.94h165.625l82.812-328.12h387.5l82.812 328.12h157.813zM998.438 1746.88l153.125-564.06 153.127 564.06H998.438zM512.5 2200V1359.38h153.12v-220.32H512.5V957.812h198.44V740.625H357.812v1459.38H512.5zM229.688 2200V1139.06H75V2200h154.688zM228.125 1032.81v-123.44H75v123.44h153.125z"></path>
                </svg>
                <div className="flex items-center gap-1">
                  <span className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white font-serif italic">Toptal</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white"><span className="text-orange-500 opacity-80">P</span>PH</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-16 bg-white dark:bg-[#151a23] border-y border-gray-100 dark:border-border-dark/50" id="features">
          <div className="layout-container flex justify-center px-4 md:px-10">
            <div className="layout-content-container flex flex-col max-w-[1200px] w-full">
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4 text-center items-center">
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white max-w-[720px]">
                    Why Proposal Sniper?
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-normal leading-normal max-w-[600px]">
                    Our AI understands the nuances of freelancing platforms to help you close more deals with less effort.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-border-dark bg-background-light dark:bg-card-dark p-6 hover:border-primary/50 transition-colors group">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-3xl">psychology</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Context Awareness</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        The AI reads between the lines. It understands job nuances deeply to tailor every word to the client's specific needs.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-border-dark bg-background-light dark:bg-card-dark p-6 hover:border-primary/50 transition-colors group">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-3xl">graphic_eq</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tone Matching</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        Matches the client's vibe perfectly. Whether they are formal corporate or casual startup, we adjust the pitch.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-border-dark bg-background-light dark:bg-card-dark p-6 hover:border-primary/50 transition-colors group">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-3xl">timer</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Time Saver</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        10x your application speed. Apply to more jobs in less time and increase your chances of getting hired.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-16" id="how-it-works">
          <div className="layout-container flex justify-center px-4 md:px-10">
            <div className="layout-content-container flex flex-col max-w-[800px] w-full items-center">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold leading-tight tracking-tight mb-4">How It Works</h2>
                <p className="text-slate-500 dark:text-slate-400">Three simple steps to your next gig.</p>
              </div>
              <div className="w-full grid grid-cols-[60px_1fr] gap-x-6 md:gap-x-10">
                <div className="flex flex-col items-center gap-2 pt-2">
                  <div className="flex items-center justify-center size-12 rounded-full bg-card-dark border border-border-dark text-white z-10 shadow-lg shadow-black/50">
                    <span className="material-symbols-outlined">content_paste</span>
                  </div>
                  <div className="w-[2px] bg-gradient-to-b from-border-dark to-primary h-full grow min-h-[80px]"></div>
                </div>
                <div className="flex flex-col pt-2 pb-12">
                  <h3 className="text-xl font-bold text-white mb-2">Paste Job Description</h3>
                  <p className="text-slate-400 leading-relaxed">Simply copy the job details from Upwork, Freelancer, or LinkedIn and paste them into our dashboard.</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-[2px] bg-gradient-to-b from-primary to-primary h-8"></div>
                  <div className="flex items-center justify-center size-12 rounded-full bg-primary text-white z-10 shadow-lg shadow-primary/40 ring-4 ring-primary/20">
                    <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                  <div className="w-[2px] bg-gradient-to-b from-primary to-border-dark h-full grow min-h-[80px]"></div>
                </div>
                <div className="flex flex-col pt-2 pb-12">
                  <h3 className="text-xl font-bold text-white mb-2">AI Analysis</h3>
                  <p className="text-slate-400 leading-relaxed">Our engine analyzes keywords, requirements, and tone to construct a persuasive response strategy.</p>
                </div>
                <div className="flex flex-col items-center gap-2 pb-2">
                  <div className="w-[2px] bg-gradient-to-b from-border-dark to-transparent h-8"></div>
                  <div className="flex items-center justify-center size-12 rounded-full bg-card-dark border border-border-dark text-green-400 z-10 shadow-lg shadow-black/50">
                    <span className="material-symbols-outlined">file_download</span>
                  </div>
                </div>
                <div className="flex flex-col pt-2 pb-4">
                  <h3 className="text-xl font-bold text-white mb-2">Download Proposal</h3>
                  <p className="text-slate-400 leading-relaxed">Review the generated proposal, make any quick tweaks if you like, and hit send!</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-20 bg-gradient-to-b from-transparent to-[#0a0c10]">
          <div className="layout-container flex justify-center px-4 md:px-10">
            <div className="layout-content-container flex flex-col max-w-[1200px] w-full items-center text-center">
              <div className="flex flex-col gap-6 max-w-2xl items-center p-8 md:p-12 rounded-2xl bg-card-dark border border-border-dark shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 size-48 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 size-48 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none"></div>
                <h2 className="text-3xl md:text-4xl font-black text-white z-10">Ready to Land Your Dream Client?</h2>
                <p className="text-slate-400 text-lg z-10">Join thousands of freelancers who are saving time and earning more with Proposal Sniper.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center z-10 mt-4">
                  <button className="flex min-w-[160px] items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold shadow-lg shadow-primary/25 hover:bg-indigo-600 transition-colors">
                    Start For Free
                  </button>
                  <button className="flex min-w-[160px] items-center justify-center rounded-lg h-12 px-6 bg-transparent border border-border-dark text-white text-base font-bold hover:bg-border-dark transition-colors">
                    View Pricing
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 z-10">No credit card required for trial.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border-dark bg-[#0a0c10] py-10">
        <div className="layout-container flex justify-center px-4 md:px-10">
          <div className="layout-content-container flex flex-col md:flex-row justify-between items-center max-w-[1200px] w-full gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center text-primary/80">
                <span className="material-symbols-outlined text-2xl">target</span>
              </div>
              <h3 className="text-base font-bold text-slate-300">Proposal Sniper</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
              <a className="hover:text-primary transition-colors" href="#">Features</a>
              <a className="hover:text-primary transition-colors" href="/pricing">Pricing</a>
              <a className="hover:text-primary transition-colors" href="#">Blog</a>
              <a className="hover:text-primary transition-colors" href="#">Terms</a>
              <a className="hover:text-primary transition-colors" href="#">Privacy</a>
            </div>
            <p className="text-xs text-slate-600">© 2023 Proposal Sniper. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
