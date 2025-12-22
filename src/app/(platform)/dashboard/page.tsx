"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from "jspdf";
import { FileText, Download, Clipboard, ChevronDown, Check } from 'lucide-react';
import { useUser } from "@clerk/nextjs";
import HistoryDrawer, { HistoryItem } from '@/components/HistoryDrawer';
import SourceEditor from '@/app/components/SourceEditor';
import { saveProposal } from '@/actions/db-actions';

const DashboardPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for the inputs
  const [tone, setTone] = useState('Professional');
  const [prompt, setPrompt] = useState('');

  // New State for Model
  const [model, setModel] = useState('GPT-4o');

  // State for the AI Output
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // History State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Export State
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Handle URL params for History trigger
  useEffect(() => {
    if (searchParams.get('history') === 'true') {
      setIsHistoryOpen(true);
      // Clean request
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  // Click outside handler for Export menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Checks for Templates Drafts on Mount
  useEffect(() => {
    const draft = localStorage.getItem('proposal_draft');
    if (draft) {
      setPrompt(draft);
      setToastMessage('✨ Template Loaded');
      setShowToast(true);
      localStorage.removeItem('proposal_draft');
    }
  }, []);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);



  const loadHistoryItem = (item: any) => {
    setPrompt(item.sourceText || item.prompt || "");
    setCompletion(item.generatedText || item.content || "");
  };

  // --- Export Functions ---

  const handleCopy = () => {
    if (!completion) return;
    navigator.clipboard.writeText(completion);
    setToastMessage('📋 Copied to Clipboard');
    setShowToast(true);
    setIsExportOpen(false);
  };

  const handleExportMD = () => {
    if (!completion) return;
    const blob = new Blob([completion], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposal-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
  };

  const handleExportPDF = () => {
    if (!completion) return;
    const doc = new jsPDF();

    // Split text to fit page
    const splitText = doc.splitTextToSize(completion, 180); // 180mm width (A4 is ~210mm)

    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.text(splitText, 15, 20); // x: 15, y: 20

    doc.save(`proposal-${Date.now()}.pdf`);
    setIsExportOpen(false);
  };


  // Generation Function
  const generateProposal = async () => {
    if (!prompt) return;

    setIsLoading(true);
    setCompletion("");
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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });

        fullContent += text;
        setCompletion((prev) => prev + text);
      }

      // Save to DB
      if (user?.id) {
        await saveProposal(user.id, prompt, fullContent);
      }

    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full font-display bg-gray-50 dark:bg-[#0f111a] text-gray-900 dark:text-gray-300 relative transition-colors duration-300">

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-white dark:bg-[#1c1f26] border border-gray-200 dark:border-indigo-500/20 shadow-xl rounded-lg px-4 py-3 animate-in slide-in-from-right-10 fade-in duration-300">
          <div className="bg-indigo-50 dark:bg-indigo-500/10 p-1.5 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-indigo-500 dark:text-indigo-400 text-lg">auto_awesome</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{toastMessage}</p>
        </div>
      )}

      {/* 1. TOP TOOLBAR */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0f111a]/80 backdrop-blur-md z-20 flex-shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-none tracking-tight">Welcome, {user?.firstName}</h1>
            <p className="text-gray-500 text-[10px] font-medium pt-1">Drafting Proposal v2.4</p>
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-2"></div>

          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Model</span>
            <div className="relative group">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-gray-100 dark:bg-[#1c1f26] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-xs font-semibold rounded-lg h-8 pl-3 pr-8 appearance-none cursor-pointer hover:border-primary/50 focus:outline-none transition-all"
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
            <div className="flex bg-gray-100 dark:bg-[#1c1f26] p-1 rounded-lg border border-gray-200 dark:border-white/10">
              {['Professional', 'Casual', 'Urgent'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${tone === t
                    ? 'bg-white dark:bg-[#2a2e38] text-primary shadow-sm border border-gray-200 dark:border-white/5'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
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
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
              : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
              }`}
            title="View History"
          >
            <span className="material-symbols-outlined text-[20px]">history</span>
          </button>
          <button
            onClick={() => router.push('/templates')}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
            title="Templates"
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1"></div>

          {/* Export Button & Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="bg-transparent border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2"
            >
              Export
              <ChevronDown size={14} className={`transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`} />
            </button>

            {isExportOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1c1f26] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-1">
                  <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-left">
                    <FileText size={14} className="text-red-500" />
                    Download PDF
                  </button>
                  <button onClick={handleExportMD} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-left">
                    <Download size={14} className="text-blue-500" />
                    Download Markdown
                  </button>
                  <div className="h-px bg-gray-100 dark:bg-white/5 my-1"></div>
                  <button onClick={handleCopy} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-left">
                    <Clipboard size={14} className="text-green-500" />
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 overflow-hidden relative p-6 flex gap-6">

        {/* LEFT CARD: SOURCE */}
        <div className="flex-1 bg-white dark:bg-[#13151C] border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col relative overflow-hidden shadow-sm dark:shadow-2xl transition-colors duration-300">
          {/* Display Header */}
          <div className="h-12 bg-gray-50 dark:bg-[#1c1f26] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 flex-shrink-0 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <span className="material-symbols-outlined text-primary text-[16px]">code</span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source Job Description</span>
            </div>
            <button onClick={() => setPrompt('')} className="text-[10px] text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 flex items-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-[14px]">delete</span> CLEAR
            </button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative flex flex-col group">
            <div className="flex-1 flex relative bg-white dark:bg-[#13151C]">
              {/* Text Input -> Now SourceEditor */}
              <SourceEditor
                value={prompt}
                onChange={setPrompt}
                placeholder={`// PASTE JOB DESCRIPTION OR USE A TEMPLATE...
// 
// [CLIENT_NAME] will be highlighted
// [PROJECT_GOAL] will be highlighted`}
              />
            </div>

            {/* Sticky Action Footer */}
            <div className="h-20 bg-white/95 dark:bg-[#13151C]/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 flex items-center px-6 gap-4 flex-shrink-0 relative z-10 transition-all">
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">Creativity</span>
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-primary/70 dark:bg-primary/50"></div>
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
        <div className="flex-1 bg-white dark:bg-[#13151C] border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col relative overflow-hidden shadow-sm dark:shadow-2xl transition-colors duration-300">
          {/* Display Header */}
          <div className="h-12 bg-gray-50 dark:bg-[#1c1f26] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 flex-shrink-0 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-electric-purple text-[16px]">auto_awesome</span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Generated Output</span>
              {completion && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 ml-2">Success</span>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={generateProposal}
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Regenerate"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Copy"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
              </button>
            </div>
          </div>

          {/* Output Area */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white dark:bg-[#13151C] transition-colors duration-300">
            <div className="prose prose-sm max-w-none dark:prose-invert font-medium text-gray-700 dark:text-gray-300 leading-7">
              {isLoading && !completion ? (
                <div className="flex items-center gap-3 animate-pulse text-gray-400 dark:text-gray-500 py-4">
                  <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce delay-200"></div>
                  <span className="text-xs tracking-wider font-mono">THINKING...</span>
                </div>
              ) : completion ? (
                <ReactMarkdown>{completion}</ReactMarkdown>
              ) : (
                <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400 dark:text-gray-600 select-none">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4 border border-gray-200 dark:border-white/5">
                    <span className="material-symbols-outlined text-3xl opacity-50">auto_awesome</span>
                  </div>
                  <p className="font-medium text-sm text-gray-500 dark:text-gray-400">Ready to generate</p>
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
        onLoad={loadHistoryItem}
      />
    </div>
  );
};

export default DashboardPage;