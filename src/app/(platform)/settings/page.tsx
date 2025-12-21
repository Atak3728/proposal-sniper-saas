"use client";

import { useState, useRef, useEffect } from "react";
import { Crown } from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'brain'>('general');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [extractedSkills, setExtractedSkills] = useState("");
  const [extractedBio, setExtractedBio] = useState("");

  // Load from LocalStorage on Mount
  useEffect(() => {
    const savedIdentity = localStorage.getItem('sniper_identity');
    if (savedIdentity) {
      const { bio, skills } = JSON.parse(savedIdentity);
      setExtractedBio(bio || "");
      setExtractedSkills(skills || "");
    }
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const containerClasses = "bg-white border-gray-200 shadow-sm dark:bg-glass-panel dark:border-glass-border dark:backdrop-blur-sm dark:shadow-2xl rounded-xl border transition-colors";

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const data = await response.json();
      setExtractedBio(data.bio);
      setExtractedSkills(data.skills);
      localStorage.setItem('sniper_identity', JSON.stringify({ bio: data.bio, skills: data.skills }));
      setShowToast(true); // Trigger success toast
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-gray-50 dark:bg-background-dark relative transition-colors duration-300">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-24 right-10 z-50 flex items-center gap-3 bg-white dark:bg-[#1b1f27] border border-green-500/20 shadow-xl rounded-lg px-4 py-3 animate-in slide-in-from-right-10 fade-in duration-300">
          <div className="bg-green-500/10 p-1.5 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-green-500 text-xl">check</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Brain Updated</p>
            <p className="text-xs text-gray-500 dark:text-[#ab9cba]">Your AI context is now active.</p>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-300">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <header className="h-16 border-b border-gray-200 dark:border-border-dark flex items-center justify-between px-6 md:px-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-10 sticky top-0 transition-colors">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#ab9cba]">
            <span>Settings</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {activeTab === 'general' ? 'General & Billing' : 'AI Brain'}
            </span>
          </div>
          <button className="md:hidden text-gray-900 dark:text-white p-2">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">

            {/* Page Title */}
            <div className="flex flex-col gap-2 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Account Settings</h1>
              <p className="text-gray-500 dark:text-[#ab9cba] text-base font-light max-w-2xl">Manage your personal details and AI configuration.</p>
            </div>

            {/* Tab Navigation (Segmented Control) */}
            <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-lg inline-flex w-full md:w-auto border border-gray-200 dark:border-transparent">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'general'
                  ? 'bg-white dark:bg-glass-panel text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-[#ab9cba] hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                General & Billing
              </button>
              <button
                onClick={() => setActiveTab('brain')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'brain'
                  ? 'bg-white dark:bg-glass-panel text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-[#ab9cba] hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                AI Brain
              </button>
            </div>

            {/* TAB 1: General & Billing */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Profile Section */}
                <section className={`${containerClasses} p-5 md:p-6 bg-white dark:bg-[#13151C] border-gray-200 dark:border-gray-800`}>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex flex-col items-center gap-3 min-w-[100px]">
                      <div className="relative group cursor-pointer">
                        <div className="size-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-[#1c1f26] shadow-md dark:shadow-none">
                          AM
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                        </div>
                      </div>
                      <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 uppercase tracking-wider transition-colors">Change Photo</button>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Details</h2>
                          <p className="text-xs text-gray-500">Manage your public identity</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Full Name</span>
                          <div className="relative">
                            <input
                              className="w-full bg-gray-50 dark:bg-[#1c1f26] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium"
                              type="text"
                              defaultValue="Alex Morgan"
                            />
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 text-[16px]">edit</span>
                          </div>
                        </label>
                        <label className="flex flex-col gap-1.5 opacity-60">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Email Address</span>
                          <div className="relative">
                            <input
                              className="w-full bg-gray-50 dark:bg-[#1c1f26] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 rounded-lg px-3 py-2.5 text-sm outline-none cursor-not-allowed font-medium"
                              type="email"
                              defaultValue="alex@proposal-sniper.io"
                              disabled
                            />
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 text-[16px]">lock</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Billing & Usage Card - Premium Gradient */}
                <section className="relative overflow-hidden rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 md:p-8 group shadow-xl dark:shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/10">
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-200/20 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-300/20 dark:group-hover:bg-indigo-600/20 transition-all duration-700"></div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
                    <div className="space-y-4 max-w-lg">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Current Plan</h2>
                          <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-indigo-500/40 tracking-wide border border-indigo-400">FREE PLAN</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          You are currently on the <strong className="text-gray-900 dark:text-gray-300">Starter Tier</strong>. Upgrade to Pro to unlock unlimited generations, custom templates, and priority support.
                        </p>
                      </div>

                      {/* Usage Bar */}
                      <div className="bg-white/80 dark:bg-[#13151C]/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-500/20 shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-widest">Monthly Credits</span>
                          <span className="text-xs font-mono text-gray-900 dark:text-white">4,250 / 5,000</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2">Resets in 12 days</p>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex flex-col items-center gap-3 min-w-[200px]">
                      <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                        <Crown size={18} />
                        UPGRADE TO PRO
                      </button>
                      <p className="text-[10px] text-gray-500">Starting at $19/mo</p>
                    </div>
                  </div>
                </section>

                <section className={`${containerClasses} p-5 md:p-6 flex items-center justify-between`}>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-500 dark:text-red-400 text-[20px]">logout</span>
                      Sign Out
                    </h2>
                    <p className="text-gray-500 dark:text-[#ab9cba] text-xs mt-1">End your current session safely.</p>
                  </div>
                  <button className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    Logout
                  </button>
                </section>
              </div>
            )}

            {/* TAB 2: AI Brain */}
            {activeTab === 'brain' && (
              <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-280px)] min-h-[600px]">
                {/* 1. Global Font Import for JetBrains Mono */}
                <style dangerouslySetInnerHTML={{
                  __html: `
                  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
                  .font-jetbrains { font-family: 'JetBrains Mono', monospace; }
                `}} />

                {/* Left Column: Core Settings (Span 4) */}
                <div className="col-span-12 lg:col-span-4 h-full flex flex-col gap-6">
                  <section className={`${containerClasses} p-6 h-full flex flex-col`}>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                      <span className="material-symbols-outlined text-primary">psychology</span>
                      Core Settings
                    </h2>

                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-[#ab9cba] uppercase tracking-wider">Tone of Voice</span>
                        <div className="relative">
                          <select className="w-full appearance-none bg-gray-50 dark:bg-[#141118] border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-medium">
                            <option>Professional & Confident</option>
                            <option>Friendly & Approachable</option>
                            <option>Direct & Concise</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
                        </div>
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-[#ab9cba] uppercase tracking-wider">Top Skills</span>
                        <input
                          className="bg-gray-50 dark:bg-[#141118] border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium"
                          type="text"
                          placeholder="React, Node, Copywriting..."
                          value={extractedSkills}
                          onChange={(e) => setExtractedSkills(e.target.value)}
                        />
                        <p className="text-[10px] text-gray-400 ml-1">Comma separated list of your best skills.</p>
                      </label>

                      <div className="space-y-3">
                        <span className="text-xs font-medium text-gray-500 dark:text-[#ab9cba] uppercase tracking-wider">Portfolio Links</span>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#141118] border border-gray-200 dark:border-border-dark rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                          <span className="material-symbols-outlined text-gray-400 text-[18px]">link</span>
                          <input
                            className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            type="url"
                            placeholder="https://github.com/username"
                          />
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#141118] border border-gray-200 dark:border-border-dark rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                          <span className="material-symbols-outlined text-gray-400 text-[18px]">language</span>
                          <input
                            className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            type="url"
                            placeholder="https://dribbble.com/username"
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Context Extractor (Span 8) */}
                <div className="col-span-12 lg:col-span-8 h-full">
                  <section className={`${containerClasses} p-0 h-full flex flex-col overflow-hidden bg-[#0f111a] border-gray-200 dark:border-gray-800 shadow-2xl`}>

                    {/* Header: Upload Control & Status */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0f111a]">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500">terminal</span>
                        <span className="text-sm font-medium text-gray-400">Context Extractor</span>
                      </div>

                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={onFileChange}
                      />

                      <button
                        onClick={triggerFileInput}
                        disabled={isAnalyzing}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-400 hover:text-white transition-all group"
                      >
                        {isAnalyzing ? (
                          <>
                            <span className="material-symbols-outlined text-[14px] animate-spin text-primary">progress_activity</span>
                            <span className="text-primary">Extracting...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[14px] group-hover:text-primary transition-colors">upload_file</span>
                            <span>Upload PDF Resume</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex-1 relative group w-full bg-[#0f111a]"
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                    >
                      {/* Drag Overlay */}
                      {isDragging && (
                        <div className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm border-2 border-primary border-dashed m-4 rounded-xl flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2 animate-bounce">
                            <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
                            <span className="text-primary font-bold">Drop Resume to Extract</span>
                          </div>
                        </div>
                      )}

                      {/* The Editor Input */}
                      <textarea
                        className="w-full h-full bg-[#0f111a] text-[#6b7280] font-jetbrains text-sm p-6 outline-none resize-none leading-relaxed placeholder:text-gray-700 custom-scrollbar"
                        placeholder={`// NO CONTEXT LOADED
// Upload a PDF resume to initialize the neural extraction layer...
// Or type manually to override context parameters.

> Waiting for input...`}
                        value={extractedBio}
                        onChange={(e) => setExtractedBio(e.target.value)}
                        spellCheck="false"
                      ></textarea>

                      {/* Local Save Bio Button (Hidden by default, visible on hover) */}
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => {
                            localStorage.setItem('sniper_identity', JSON.stringify({ bio: extractedBio, skills: extractedSkills }));
                            setShowToast(true);
                          }}
                          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded shadow-lg shadow-primary/20 flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all border border-white/10"
                        >
                          <span className="material-symbols-outlined text-[16px]">save</span>
                          SAVE BIO TO MEMORY
                        </button>
                      </div>
                    </div>

                    {/* Status Footer Bar */}
                    <div className="h-8 bg-[#0b0d12] border-t border-white/5 flex items-center justify-between px-4 text-[10px] text-gray-600 font-jetbrains select-none">
                      <div className="flex items-center gap-4">
                        <span>UTF-8</span>
                        <span>{extractedBio.length} CHARS</span>
                        <span className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${extractedBio ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                          {extractedBio ? 'ACTIVE' : 'IDLE'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Ln {extractedBio.split('\n').length}, Col 1</span>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions - Always Visible */}
        <div className="border-t border-gray-200 dark:border-border-dark bg-white dark:bg-[#141118] p-4 md:px-10 flex items-center justify-end gap-4 z-20 transition-colors">
          <button className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-[#ab9cba] hover:text-gray-900 dark:hover:text-white transition-colors">Discard</button>
          <button className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/25 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
