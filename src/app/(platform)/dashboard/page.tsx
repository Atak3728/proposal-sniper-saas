"use client";

import { useState } from 'react';

const DashboardPage = () => {
  // State for the inputs
  const [tone, setTone] = useState('Professional');
  const [prompt, setPrompt] = useState('');
  
  // State for the AI Output
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // The "Manual" Generation Function (Exactly like your Test Page)
  const generateProposal = async () => {
    if (!prompt) return;
    
    setIsLoading(true);
    setCompletion(""); // Clear previous output

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt, tone }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to generate");
      }

      // Stream Reader (The magic part)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        
        // Append new text to the existing completion
        setCompletion((prev) => prev + text);
      }
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full font-display">
      <aside className="w-80 h-full flex flex-col border-r border-[rgba(0,0,0,0.08)] dark:border-glass-border bg-white dark:bg-[#13161c] relative z-20 flex-shrink-0 transition-colors duration-300">
        <div className="p-6 border-b border-[rgba(0,0,0,0.08)] dark:border-glass-border h-[88px] flex items-center">
          <div className="flex flex-col justify-center">
            <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">Proposal Sniper</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-normal">v2.1.0 • Pro Edition</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">AI Model</label>
            <div className="relative group">
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1c1f26] border border-gray-200 dark:border-glass-border text-gray-900 dark:text-white text-sm rounded-lg h-12 px-4 appearance-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
              >
                <option value="Professional">Professional</option>
                <option value="Casual">Casual</option>
                <option value="Urgent">Urgent</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Tone</label>
            <div className="flex p-1 bg-gray-50 dark:bg-[#1c1f26] rounded-full border border-gray-200 dark:border-glass-border">
              {['Professional', 'Casual', 'Urgent'].map((t) => (
                <label key={t} className="flex-1 cursor-pointer relative">
                  <input
                    className="peer sr-only"
                    name="tone"
                    type="radio"
                    value={t}
                    checked={tone === t}
                    onChange={() => setTone(t)}
                  />
                  <div className="w-full py-2 px-3 text-center text-xs font-medium text-gray-500 rounded-full peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-lg transition-all">
                    {t}
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Parameters</label>
            <div className="flex items-center justify-between group cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-white transition-colors">Include Portfolio</span>
              <div className="w-10 h-6 bg-primary rounded-full relative shadow-inner cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"></div>
              </div>
            </div>
            <div className="flex items-center justify-between group cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-white transition-colors">Max Length</span>
              <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded">200 words</span>
            </div>
          </div>
          <div className="mt-auto pt-6 border-t border-[rgba(0,0,0,0.08)] dark:border-glass-border">
            <label className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 block">Recent History</label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group">
                <span className="material-symbols-outlined text-gray-500 group-hover:text-primary text-[20px]">history</span>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">Senior React Developer...</span>
                  <span className="text-xs text-gray-500">2 mins ago</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group">
                <span className="material-symbols-outlined text-gray-500 group-hover:text-primary text-[20px]">history</span>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">UX/UI Designer for SaaS</span>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-[rgba(0,0,0,0.08)] dark:border-glass-border bg-gray-50 dark:bg-[#0E1117] flex flex-col gap-4">
          <details className="relative group/menu">
            <summary className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors list-none select-none">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-electric-purple to-purple-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                JD
              </div>
              <div className="flex flex-col flex-1 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                <p className="text-xs text-gray-500">Freelancer Plan</p>
              </div>
              <span className="material-symbols-outlined text-gray-500 group-open/menu:rotate-180 transition-transform">expand_less</span>
            </summary>
            <div className="absolute bottom-[105%] left-0 w-full mb-1 bg-white dark:bg-[#1c1f26] border border-gray-200 dark:border-glass-border rounded-xl shadow-lg dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-1 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px] text-gray-500">dashboard</span>
                <span className="text-xs font-medium">Dashboard</span>
              </a>
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px] text-gray-500">manage_accounts</span>
                <span className="text-xs font-medium">Account Settings</span>
              </a>
              <div className="h-px bg-gray-200 dark:bg-white/5 my-1 mx-2"></div>
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px] text-gray-500 hover:text-red-500 dark:hover:text-red-400">logout</span>
                <span className="text-xs font-medium">Sign Out</span>
              </a>
            </div>
          </details>
          <button className="w-full bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white py-2.5 px-4 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group border border-white/10">
            <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform text-white">diamond</span>
            <span className="text-xs font-bold tracking-wider text-white">UPGRADE TO PRO</span>
          </button>
          <div className="flex items-center justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-help mt-1" title="Connection Secured with 256-bit Encryption">
            <span className="material-symbols-outlined text-green-500 text-[14px]">lock</span>
            <span className="text-[10px] text-gray-500 font-mono tracking-tight">SECURE API CONNECTED</span>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-[#0E1117] relative">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-5 dark:opacity-20 blur-sm"></div>
          <div className="absolute inset-0 bg-background-light dark:bg-[#0E1117]/95"></div>
        </div>
        <div className="relative z-10 flex h-full p-6 gap-6">
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">code</span>
                <h2 className="text-gray-900 dark:text-white font-medium text-sm tracking-wide">SOURCE JOB DESCRIPTION</h2>
              </div>
              <button 
                onClick={() => setPrompt('')} 
                className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span> Clear
              </button>
            </div>
            <div className="flex-1 rounded-2xl bg-white dark:bg-[#13161c] border border-gray-200 dark:border-glass-border shadow-xl dark:shadow-2xl overflow-hidden flex flex-col relative group transition-colors duration-300">
              <div className="h-10 bg-gray-50 dark:bg-[#1c1f26] border-b border-gray-200 dark:border-glass-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <span className="ml-4 text-xs text-gray-500 font-mono">job_description.txt</span>
              </div>
              <div className="flex-1 relative flex">
                <div className="w-12 bg-gray-50 dark:bg-[#1c1f26] border-r border-gray-200 dark:border-glass-border pt-4 text-right pr-3 flex flex-col gap-1 select-none">
                  <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">1</span>
                  <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">2</span>
                  <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">3</span>
                  <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">4</span>
                  <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">5</span>
                  <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">6</span>
                  <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">7</span>
                  <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">8</span>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 bg-transparent border-none text-gray-800 dark:text-gray-300 font-mono text-sm p-4 resize-none focus:ring-0 focus:outline-none leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-700 h-full w-full"
                  placeholder={`// Paste the job description here...
// The AI will analyze requirements and generate a tailored proposal.
Looking for a Senior Frontend Developer...`}
                ></textarea>
              </div>
              <div className="absolute bottom-6 right-6 z-20">
                <button
                  onClick={generateProposal}
                  disabled={isLoading || !prompt.trim()}
                  className="bg-primary text-white font-bold text-sm px-6 py-3 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-105 transition-all flex items-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className={`material-symbols-outlined transition-transform ${isLoading ? 'animate-spin' : 'group-hover/btn:rotate-12'}`}>
                    {isLoading ? 'progress_activity' : 'bolt'}
                  </span>
                  {isLoading ? 'SNIPPING...' : 'GENERATE PROPOSAL'}
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-electric-purple text-[20px]">auto_awesome</span>
                <h2 className="text-gray-900 dark:text-white font-medium text-sm tracking-wide">GENERATED PROPOSAL</h2>
              </div>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded bg-electric-purple/10 text-electric-purple border border-electric-purple/20">Draft v1</span>
              </div>
            </div>
            <div className="flex-1 rounded-2xl bg-white/50 dark:bg-glass-panel border border-white/20 dark:border-glass-border shadow-xl dark:shadow-2xl overflow-hidden flex flex-col relative backdrop-blur-sm">
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button 
                  onClick={generateProposal} 
                  disabled={isLoading}
                  className="h-9 w-9 rounded-full bg-white dark:bg-[#1c1f26] hover:bg-gray-100 dark:hover:bg-[#2a2e38] border border-gray-200 dark:border-glass-border flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" 
                  title="Regenerate"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
                </button>
                <button 
                  onClick={() => navigator.clipboard.writeText(completion)}
                  className="h-9 w-9 rounded-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black border border-transparent flex items-center justify-center shadow-lg transition-colors group" 
                  title="Copy to Clipboard"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </button>
              </div>
              <div className="p-8 h-full overflow-y-auto">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {completion ? (
                    <div className="whitespace-pre-wrap">{completion}</div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 opacity-50">
                      <span className="material-symbols-outlined text-4xl mb-2">auto_awesome</span>
                      <p>Paste a job description to generate a proposal...</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-[#0E1117]/80 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;