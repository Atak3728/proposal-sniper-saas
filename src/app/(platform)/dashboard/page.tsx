"use client";

import { useState, useEffect } from 'react';
import HistoryDrawer from '@/components/HistoryDrawer';

const DashboardPage = () => {
  // State for the inputs
  const [tone, setTone] = useState('Professional');
  const [prompt, setPrompt] = useState('');

  // New State for Model
  const [model, setModel] = useState('GPT-4o');

  // State for the AI Output
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load History on Mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('sniper_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save to History Helper
  const saveToHistory = (promptText: string, content: string) => {
    const newEntry = {
      id: Date.now(),
      title: promptText.split(' ').slice(0, 5).join(' ') + "...",
      date: new Date().toLocaleTimeString(),
      fullDate: new Date().toLocaleDateString(),
      prompt: promptText,
      content: content
    };

    const updatedHistory = [newEntry, ...history].slice(0, 10); // Keep top 10
    setHistory(updatedHistory);
    localStorage.setItem('sniper_history', JSON.stringify(updatedHistory));
  };

  const loadHistoryItem = (item: any) => {
    setPrompt(item.prompt);
    setCompletion(item.content);
  };

  // The "Manual" Generation Function (Exactly like your Test Page)
  const generateProposal = async () => {
    if (!prompt) return;

    setIsLoading(true);
    setCompletion(""); // Clear previous output
    let fullContent = "";

    try {
      const identity = JSON.parse(localStorage.getItem('sniper_identity') || '{}');

      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt, tone, userBio: identity.bio, userSkills: identity.skills }),
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

        fullContent += text;
        setCompletion((prev) => prev + text);
      }

      // Save to History after completion
      saveToHistory(prompt, fullContent);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full font-display bg-[#0f111a] text-gray-300">

      {/* 1. TOP TOOLBAR - Modern, Glassy, Horizontal Controls */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-[#0f111a]/80 backdrop-blur-md z-20 flex-shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold leading-none tracking-tight">Workspace</h1>
            <p className="text-gray-500 text-[10px] font-medium pt-1">Drafting Proposal v2.4</p>
          </div>

          <div className="h-8 w-px bg-white/10 mx-2"></div>

          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Model</span>
            <div className="relative group">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-[#1c1f26] border border-white/10 text-white text-xs font-semibold rounded-lg h-8 pl-3 pr-8 appearance-none cursor-pointer hover:border-primary/50 focus:outline-none transition-all"
              >
                <option>GPT-4o</option>
                <option>Claude 3.5 Sonnet</option>
                <option>Gemini Pro 1.5</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none text-gray-500">expand_more</span>
            </div>
          </div>

          {/* Tone Selector pills */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Tone</span>
            <div className="flex bg-[#1c1f26] p-1 rounded-lg border border-white/10">
              {['Professional', 'Casual', 'Urgent'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${tone === t
                    ? 'bg-[#2a2e38] text-primary shadow-sm border border-white/5'
                    : 'text-gray-500 hover:text-white'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${isHistoryOpen
                ? 'text-indigo-400 bg-indigo-500/10'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            title="View History"
          >
            <span className="material-symbols-outlined text-[20px]">history</span>
          </button>
          <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center justify-center" title="Templates">
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
          </button>

          <div className="h-6 w-px bg-white/10 mx-1"></div>

          <button className="bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 text-xs font-bold px-4 py-2 rounded-lg transition-all">
            Export
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE - 2 Cards Layout */}
      <main className="flex-1 overflow-hidden relative p-6 flex gap-6">

        {/* LEFT CARD: SOURCE */}
        <div className="flex-1 bg-[#13151C] border border-gray-800 rounded-xl flex flex-col relative overflow-hidden shadow-2xl">
          {/* Display Header */}
          <div className="h-12 bg-[#1c1f26] border-b border-gray-800 flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <span className="material-symbols-outlined text-primary text-[16px]">code</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Source Job Description</span>
            </div>
            <button onClick={() => setPrompt('')} className="text-[10px] text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-[14px]">delete</span> CLEAR
            </button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative flex flex-col group">
            <div className="flex-1 flex relative">
              {/* Line Numbers */}
              <div className="w-12 bg-[#161821] border-r border-gray-800 pt-6 text-right pr-3 flex flex-col gap-1 select-none flex-shrink-0">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                  <span key={n} className="text-xs text-gray-600 font-mono">{n}</span>
                ))}
              </div>

              {/* Text Input */}
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 h-full w-full bg-transparent border-none text-gray-300 font-mono text-sm p-6 resize-none focus:ring-0 focus:outline-none leading-relaxed placeholder:text-gray-600 custom-scrollbar"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                placeholder={`// PASTE JOB DESCRIPTION HERE...
// 
// The AI will analyze the requirements and match them
// with your portfolio to create a winning proposal.`}
              ></textarea>
            </div>

            {/* Sticky Action Footer */}
            <div className="h-20 bg-[#13151C]/95 backdrop-blur-sm border-t border-gray-800 flex items-center px-6 gap-4 flex-shrink-0 relative z-10 transition-all">
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">Creativity</span>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-primary/50"></div>
                </div>
              </div>

              <button
                onClick={generateProposal}
                disabled={isLoading || !prompt.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all flex items-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
              >
                <span className={`material-symbols-outlined transition-transform ${isLoading ? 'animate-spin' : 'group-hover/btn:rotate-12'}`}>
                  {isLoading ? 'progress_activity' : 'bolt'}
                </span>
                {isLoading ? 'GENERATING...' : 'GENERATE PROPOSAL'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: OUTPUT */}
        <div className="flex-1 bg-[#13151C] border border-gray-800 rounded-xl flex flex-col relative overflow-hidden shadow-2xl">
          {/* Display Header */}
          <div className="h-12 bg-[#1c1f26] border-b border-gray-800 flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-electric-purple text-[16px]">auto_awesome</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Generated Output</span>
              {completion && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 ml-2">Success</span>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={generateProposal}
                className="p-1.5 rounded-md hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                title="Regenerate"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(completion)}
                className="p-1.5 rounded-md hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                title="Copy"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
              </button>
            </div>
          </div>

          {/* Output Area */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-[#13151C]">
            <div className="prose prose-sm max-w-none prose-invert">
              {completion ? (
                <div className="whitespace-pre-wrap font-medium text-gray-300 leading-7">{completion}</div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[50vh] text-gray-600 select-none">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                    <span className="material-symbols-outlined text-3xl opacity-50">auto_awesome</span>
                  </div>
                  <p className="font-medium text-sm">Ready to generate</p>
                  <p className="text-xs opacity-50 mt-1">Output will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* History Slide-Over */}
      <HistoryDrawer
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoad={loadHistoryItem}
      />
    </div>
  );
};

export default DashboardPage;