"use client";

import { useState, useRef, useEffect } from "react";

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
    <div className="flex h-full w-full overflow-hidden bg-background-light dark:bg-background-dark relative">
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
        <header className="h-16 border-b border-[rgba(0,0,0,0.08)] dark:border-border-dark flex items-center justify-between px-6 md:px-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-10 sticky top-0 transition-colors">
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
            <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-lg inline-flex w-full md:w-auto">
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
                <section className={`${containerClasses} p-5 md:p-6`}>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex flex-col items-center gap-3 min-w-[100px]">
                      <div className="relative group cursor-pointer">
                        <div
                          className="size-20 rounded-full bg-cover bg-center border border-gray-200 dark:border-border-dark group-hover:border-primary transition-colors"
                          style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC0XtAqNbgUa8HOOZzij_cq4qrO4WTGRheNZFknpiEbtfGh93RmvaRLtw0B6thZbH5sP280xCIFTQDdHhc9wsQ3p7hu4v1f2zW2qLY5A-BxlrKOxMOB1bOhuL2fTDTAVNBwxkN1JWldQRtdOFRTumbreukbFJBuDeOIKZt6OzjgGkMgBtDo3KXvLkGaCv6ZqSI1ESiHcdzhm8Eoye20Tg5PB9xFMHtJUlgCoNTgbedOa8CyfZ6xuhYJikXWGYBDp-NyFuAnhhcOLR2l")` }}
                        ></div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                        </div>
                      </div>
                      <button className="text-[10px] font-bold text-primary hover:text-primary-hover uppercase tracking-wider">Edit Photo</button>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                          Profile Information
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs font-medium text-gray-500 dark:text-[#ab9cba]">Full Name</span>
                          <input className="bg-gray-50 dark:bg-[#141118] border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" type="text" defaultValue="Alex Morgan" />
                        </label>
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs font-medium text-gray-500 dark:text-[#ab9cba]">Email Address</span>
                          <input className="bg-gray-50 dark:bg-[#141118] border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" type="email" defaultValue="alex@sniper.io" />
                        </label>
                        <label className="flex flex-col gap-1.5 md:col-span-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-[#ab9cba]">Job Title</span>
                          <input className="bg-gray-50 dark:bg-[#141118] border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" type="text" defaultValue="Senior Freelance Developer" />
                        </label>
                      </div>
                    </div>
                  </div>
                </section>

                <section className={`${containerClasses} p-6 md:p-8 relative overflow-hidden group`}>
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700"></div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">rocket_launch</span>
                        Subscription Plan
                      </h2>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Sniper Pro</span>
                        <span className="text-gray-500 dark:text-[#ab9cba] text-sm">Billed Monthly</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                      <button className="px-4 py-2 bg-transparent border border-gray-200 dark:border-border-dark text-gray-700 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Billing History</button>
                      <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black border border-transparent rounded-lg text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg shadow-black/10 dark:shadow-white/10">Manage Plan</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                    <div className="bg-gray-50 dark:bg-[#141118] border border-gray-200 dark:border-border-dark rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-500 dark:text-[#ab9cba] text-xs font-medium uppercase tracking-wider">Proposals Generated</p>
                        <span className="material-symbols-outlined text-primary/50 text-[20px]">edit_document</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">45</span>
                        <span className="text-sm text-gray-500 dark:text-[#ab9cba] mb-1">/ 50 limit</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-[#302839] h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#141118] border border-gray-200 dark:border-border-dark rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-500 dark:text-[#ab9cba] text-xs font-medium uppercase tracking-wider">Templates</p>
                        <span className="material-symbols-outlined text-primary/50 text-[20px]">layers</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">12</span>
                        <span className="text-sm text-gray-500 dark:text-[#ab9cba] mb-1">active</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-[#302839] h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-indigo-400 h-full rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#141118] border border-gray-200 dark:border-border-dark rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-500 dark:text-[#ab9cba] text-xs font-medium uppercase tracking-wider">Next Billing</p>
                        <span className="material-symbols-outlined text-primary/50 text-[20px]">calendar_month</span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">Oct 24</span>
                        <span className="text-sm text-gray-500 dark:text-[#ab9cba] mb-1">2023</span>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-xs text-green-600 dark:text-green-400">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        Auto-renew active
                      </div>
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
                  <section className={`${containerClasses} p-0 h-full flex flex-col overflow-hidden bg-[#0f111a] border-gray-800 shadow-2xl`}>

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
        <div className="border-t border-[rgba(0,0,0,0.08)] dark:border-border-dark bg-white dark:bg-[#141118] p-4 md:px-10 flex items-center justify-end gap-4 z-20 transition-colors">
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
