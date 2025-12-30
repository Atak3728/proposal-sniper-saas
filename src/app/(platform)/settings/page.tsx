"use client";

import { useState, useRef, useEffect } from "react";
import { Crown, Loader2, CreditCard, Sparkles, Briefcase, GraduationCap, User, Plus, Link as LinkIcon } from "lucide-react";
import { UserProfile, useUser } from "@clerk/nextjs";
import { getCheckoutUrl } from "@/actions/payment-actions";
import { getBio, saveUserProfile } from "@/actions/db-actions";
import { toast } from 'sonner';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  date: string;
  desc: string;
}

interface EducationItem {
  id: string;
  school: string;
  degree: string;
  date: string;
}

interface ResumeData {
  experience: ExperienceItem[];
  education: EducationItem[];
}

const SettingsPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'general' | 'brain'>('general');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const [extractedSkills, setExtractedSkills] = useState("");
  const [extractedBio, setExtractedBio] = useState("");

  const [resumeData, setResumeData] = useState<ResumeData>({
    experience: [],
    education: []
  });

  // Auto-resize textarea Component
  const AutoResizeTextarea = ({ value, onChange, placeholder, className, minHeight, onBlur, spellCheck, ...props }: any) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Force height adjustment on every value change
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto'; // Reset to calculate true scrollHeight
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value]);

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${className} overflow-hidden resize-none`} // Hide scrollbar, disable manual resize
        style={{ minHeight: minHeight || '80px' }}
        onBlur={onBlur}
        spellCheck={spellCheck}
        {...props}
      />
    );
  };

  // Helper to safely parse resumeProfile from DB
  const parseResumeProfile = (profileData: any) => {
    if (!profileData) return;

    let profile = profileData;
    if (typeof profileData === 'string') {
      try {
        profile = JSON.parse(profileData);
      } catch (e) {
        console.error("Failed to parse resumeProfile JSON", e);
        return;
      }
    }

    // Skills are stored as string[] in DB but string in UI (extractedSkills)
    if (Array.isArray(profile.skills)) {
      setExtractedSkills(profile.skills.join(", "));
    }

    // Experience & Education
    if (profile.experience) setResumeData(prev => ({ ...prev, experience: profile.experience }));
    if (profile.education) setResumeData(prev => ({ ...prev, education: profile.education }));
  };

  // Load from DB on Mount
  useEffect(() => {
    const fetchBio = async () => {
      if (user?.id) {
        const res = await getBio(user.id);
        if (res.success && res.data) {
          setExtractedBio(res.data.bio || "");
          // @ts-ignore - resumeProfile exists after migration but types might lag
          if (res.data.resumeProfile) {
            // @ts-ignore
            parseResumeProfile(res.data.resumeProfile);
          }
          // @ts-ignore - Check if user is pro
          setIsPro(res.data.isPro || false);
        }
      }
    };
    fetchBio();
  }, [user?.id]);

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

      // Map API response to State
      setExtractedBio(data.professionalSummary || "");
      setExtractedSkills(data.skills || "");

      setResumeData(prev => ({
        ...prev,
        experience: data.workExperience?.map((item: any) => ({
          id: crypto.randomUUID(),
          title: item.jobTitle,
          company: item.company,
          date: item.dateRange,
          desc: item.description
        })) || [],
        education: data.education?.map((item: any) => ({
          id: crypto.randomUUID(),
          school: item.school,
          degree: item.degree,
          date: item.year
        })) || []
      }));

      toast.success("Resume imported successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to analyze resume. Please try again.");
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

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: crypto.randomUUID(), title: "", company: "", date: "", desc: "" }]
    }));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { id: crypto.randomUUID(), school: "", degree: "", date: "" }]
    }));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  const handleSaveAll = async () => {
    if (!user?.id) return;

    const structuredData = {
      skills: extractedSkills.split(",").map(s => s.trim()).filter(Boolean),
      experience: resumeData.experience,
      education: resumeData.education
    };

    await saveUserProfile(user.id, extractedBio, structuredData);
    setShowToast(true);
  };

  const handleUpgrade = async () => {
    if (!user) return;
    setIsUpgrading(true);
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
      setIsUpgrading(false);
    }
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
                <section className={`${containerClasses} p-5 md:p-6 bg-white dark:bg-[#13151C] border-gray-200 dark:border-gray-800 flex justify-center`}>
                  <UserProfile routing="hash" />
                </section>

                {/* Billing & Usage Card - Premium Gradient */}
                <section className="relative overflow-hidden rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 md:p-8 group shadow-xl dark:shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/10">
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-200/20 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-300/20 dark:group-hover:bg-indigo-600/20 transition-all duration-700"></div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
                    <div className="space-y-4 max-w-lg">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Current Plan</h2>
                          {isPro ? (
                            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-purple-500/40 tracking-wide border border-transparent">PRO PLAN</span>
                          ) : (
                            <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-indigo-500/40 tracking-wide border border-indigo-400">FREE PLAN</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {isPro ? (
                            <>You are currently on the <strong className="text-gray-900 dark:text-gray-300">Pro Tier</strong>. You have unlimited access to all features.</>
                          ) : (
                            <>You are currently on the <strong className="text-gray-900 dark:text-gray-300">Starter Tier</strong>. Upgrade to Pro to unlock unlimited generations, custom templates, and priority support for {user?.firstName}.</>
                          )}
                        </p>
                      </div>

                      {/* Usage Bar */}
                      <div className="bg-white/80 dark:bg-[#13151C]/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-500/20 shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-widest">Monthly Credits</span>
                          <span className="text-xs font-mono text-gray-900 dark:text-white">{isPro ? "∞ / ∞" : "4,250 / 5,000"}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] ${isPro ? 'bg-gradient-to-r from-green-400 to-emerald-500 w-full' : 'bg-gradient-to-r from-indigo-500 to-purple-500 w-[85%]'}`}></div>
                        </div>
                        {!isPro && <p className="text-[10px] text-gray-500 mt-2">Resets in 12 days</p>}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex flex-col items-center gap-3 min-w-[200px]">
                      {isPro ? (
                        <button
                          onClick={() => toast.info("Manage Subscription portal coming soon!")}
                          className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10">
                          <CreditCard size={18} />
                          Manage Subscription
                        </button>
                      ) : (
                        <button
                          onClick={handleUpgrade}
                          disabled={isUpgrading}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                          {isUpgrading ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Crown size={18} />
                              UPGRADE TO PRO
                            </>
                          )}
                        </button>
                      )}

                      {!isPro && <p className="text-[10px] text-gray-500">Starting at $19/mo</p>}
                    </div>
                  </div>
                </section>


              </div>
            )}

            {/* TAB 2: AI Brain - Premium Glass UI */}
            {activeTab === 'brain' && (
              <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                {/* 1. Global Font Import for JetBrains Mono */}
                <style dangerouslySetInnerHTML={{
                  __html: `
                  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
                  .font-jetbrains { font-family: 'JetBrains Mono', monospace; }
                `}} />

                {/* Left Column: Sidebar (Tone, Skills, Links) (Span 4) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

                  {/* Identity & Tone */}
                  <section className="bg-white dark:bg-white/5 dark:backdrop-blur-md border border-gray-200 dark:border-white/10 dark:shadow-2xl dark:shadow-black/50 rounded-xl p-6 shadow-sm group hover:border-indigo-500/20 transition-all duration-500">
                    <h2 className="text-xs font-bold text-gray-500 dark:text-indigo-300 flex items-center gap-3 mb-6 uppercase tracking-widest">
                      <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                        <User size={14} />
                      </span>
                      Persona
                    </h2>
                    <label className="flex flex-col gap-3">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 pl-1">Tone of Voice</span>
                      <div className="relative">
                        <select className="w-full appearance-none bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:ring-0 focus:border-indigo-500/50 outline-none transition-all font-medium hover:bg-gray-100 dark:hover:bg-white/5">
                          <option>Professional & Confident</option>
                          <option>Friendly & Approachable</option>
                          <option>Direct & Concise</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
                      </div>
                    </label>
                  </section>

                  {/* Skills */}
                  <section className="bg-white dark:bg-white/5 dark:backdrop-blur-md border border-gray-200 dark:border-white/10 dark:shadow-2xl dark:shadow-black/50 rounded-xl p-6 shadow-sm group hover:border-indigo-500/20 transition-all duration-500">
                    <h2 className="text-xs font-bold text-gray-500 dark:text-indigo-300 flex items-center gap-3 mb-6 uppercase tracking-widest">
                      <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                        <Sparkles size={14} />
                      </span>
                      Core Skills
                    </h2>
                    <label className="flex flex-col gap-2">
                      <AutoResizeTextarea
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 text-gray-900 dark:text-indigo-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none transition-all duration-300 placeholder:text-gray-500 font-sans tracking-wide leading-loose hover:bg-gray-100 dark:hover:bg-white/5"
                        placeholder="React, Node.js, TypeScript, UI/UX Design, Copywriting..."
                        value={extractedSkills}
                        onChange={(e: any) => setExtractedSkills(e.target.value)}
                        minHeight="140px"
                      />
                      <p className="text-[10px] text-gray-400 pl-1">Comma separated list of your best skills.</p>
                    </label>
                  </section>

                  {/* Portfolio Links */}
                  <section className="bg-white dark:bg-white/5 dark:backdrop-blur-md border border-gray-200 dark:border-white/10 dark:shadow-2xl dark:shadow-black/50 rounded-xl p-6 shadow-sm group hover:border-indigo-500/20 transition-all duration-500">
                    <h2 className="text-xs font-bold text-gray-500 dark:text-indigo-300 flex items-center gap-3 mb-6 uppercase tracking-widest">
                      <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                        <LinkIcon size={14} />
                      </span>
                      Online Presence
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 focus-within:bg-gray-100 dark:focus-within:bg-black/40 focus-within:border-indigo-500/50 transition-all">
                        <span className="material-symbols-outlined text-gray-400 text-[18px]">link</span>
                        <input
                          className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                          type="url"
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 focus-within:bg-gray-100 dark:focus-within:bg-black/40 focus-within:border-indigo-500/50 transition-all">
                        <span className="material-symbols-outlined text-gray-400 text-[18px]">language</span>
                        <input
                          className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                          type="url"
                          placeholder="https://dribbble.com/username"
                        />
                      </div>
                    </div>
                  </section>

                </div>

                {/* Right Column: Main Stage (Summary, Exp, Edu) (Span 8) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

                  {/* 1. Professional Summary (The Brain) */}
                  <section className="bg-white dark:bg-white/5 dark:backdrop-blur-md border border-gray-200 dark:border-white/10 dark:shadow-2xl dark:shadow-black/50 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[300px] relative group hover:border-indigo-500/20 transition-all duration-500">
                    {/* Header */}
                    <div className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-500 animate-pulse">
                          <Sparkles size={16} fill="currentColor" />
                        </span>
                        <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest">Professional Summary</h2>
                      </div>
                      {/* Compact Upload Control */}
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={onFileChange}
                          disabled={isAnalyzing}
                        />
                        <button
                          onClick={triggerFileInput}
                          className="bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 text-xs font-bold tracking-wide uppercase shadow-sm shadow-indigo-500/5"
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? <><Loader2 size={12} className="animate-spin" /> Extracting...</> : <><span className="material-symbols-outlined text-[16px]">upload_file</span> Import PDF</>}
                        </button>
                      </div>
                    </div>

                    {/* Editor */}
                    <div className="relative bg-[#0F1115]"
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                    >
                      {isDragging && (
                        <div className="absolute inset-0 z-50 bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center border-2 border-indigo-500 border-dashed m-2 rounded-lg">
                          <div className="flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-white text-3xl">cloud_upload</span>
                            <span className="text-white font-bold tracking-wide">DROP TO EXTRACT</span>
                          </div>
                        </div>
                      )}
                      <AutoResizeTextarea
                        className="w-full bg-transparent text-gray-900 dark:text-gray-100 font-sans text-base p-6 outline-none leading-relaxed placeholder:text-gray-500"
                        placeholder={`Professional Summary
This content is the primary context for the AI.
Upload a resume to auto-fill, or write a strong summary here...`}
                        value={extractedBio}
                        onChange={(e: any) => setExtractedBio(e.target.value)}
                        spellCheck="false"
                        minHeight="300px"
                      />

                      {/* Manual Save Indicator (Optional) */}
                      <div className="absolute bottom-3 right-3 text-[10px] text-gray-500 font-mono">
                        {extractedBio.length} chars
                      </div>
                    </div>
                  </section>

                  {/* 2. Work Experience */}
                  <section className="bg-white dark:bg-white/5 dark:backdrop-blur-md border border-gray-200 dark:border-white/10 dark:shadow-2xl dark:shadow-black/50 rounded-xl p-6 shadow-sm group hover:border-indigo-500/20 transition-all duration-500">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-xs font-bold text-gray-500 dark:text-indigo-300 flex items-center gap-3 uppercase tracking-widest">
                        <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                          <Briefcase size={14} />
                        </span>
                        Work Experience
                      </h2>
                      <button onClick={addExperience} className="text-indigo-500 dark:text-indigo-400 text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 uppercase tracking-wide">
                        <Plus size={12} /> Add Position
                      </button>
                    </div>

                    <div className="space-y-4">
                      {resumeData.experience.length === 0 ? (
                        <div className="border border-dashed border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-xl p-10 flex flex-col items-center justify-center text-gray-400 gap-3 cursor-pointer group/empty" onClick={addExperience}>
                          <div className="p-3 rounded-full bg-gray-100 dark:bg-white/5 group-hover/empty:bg-white/10 transition-colors">
                            <Briefcase size={20} className="opacity-40" />
                          </div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">No experience added yet</p>
                        </div>
                      ) : (
                        resumeData.experience.map((exp) => (
                          <div key={exp.id} className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-6 relative group transition-all hover:bg-white/[0.04] hover:border-white/10">
                            <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg"><span className="material-symbols-outlined text-[18px]">delete</span></button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider ml-1">Job Title</label>
                                <input
                                  value={exp.title}
                                  onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                  placeholder="e.g. Senior Frontend Engineer"
                                  className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300 placeholder:font-normal"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider ml-1">Company</label>
                                <input
                                  value={exp.company}
                                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                  placeholder="e.g. Google"
                                  className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5 mb-4">
                              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider ml-1">Date Range</label>
                              <input
                                value={exp.date}
                                onChange={(e) => updateExperience(exp.id, 'date', e.target.value)}
                                placeholder="e.g. Jan 2022 - Present"
                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-lg px-4 py-2.5 text-xs font-mono text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider ml-1">Description</label>
                              <AutoResizeTextarea
                                value={exp.desc}
                                onChange={(e: any) => updateExperience(exp.id, 'desc', e.target.value)}
                                placeholder="Detailed description of your role, achievements, and tech stack..."
                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-lg px-4 py-3 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300 leading-relaxed"
                                minHeight="100px"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>

                  {/* 3. Education */}
                  <section className="bg-white dark:bg-white/5 dark:backdrop-blur-md border border-gray-200 dark:border-white/10 dark:shadow-2xl dark:shadow-black/50 rounded-xl p-6 shadow-sm group hover:border-indigo-500/20 transition-all duration-500">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-xs font-bold text-gray-500 dark:text-indigo-300 flex items-center gap-3 uppercase tracking-widest">
                        <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                          <GraduationCap size={14} />
                        </span>
                        Education
                      </h2>
                      <button onClick={addEducation} className="text-indigo-500 dark:text-indigo-400 text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 uppercase tracking-wide">
                        <Plus size={12} /> Add Education
                      </button>
                    </div>

                    <div className="space-y-3">
                      {resumeData.education.length === 0 ? (
                        <div className="border border-dashed border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 gap-3 cursor-pointer group/empty" onClick={addEducation}>
                          <div className="p-3 rounded-full bg-gray-100 dark:bg-white/5 group-hover/empty:bg-white/10 transition-colors">
                            <GraduationCap size={20} className="opacity-40" />
                          </div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">No education added</p>
                        </div>
                      ) : (
                        resumeData.education.map((edu) => (
                          <div key={edu.id} className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl p-4 relative group flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-white/[0.04] hover:border-white/10 transition-all">
                            <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 md:top-auto md:right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg"><span className="material-symbols-outlined text-[16px]">close</span></button>

                            <div className="flex-1 w-full space-y-2">
                              <input
                                value={edu.school}
                                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                placeholder="School / University"
                                className="w-full bg-transparent text-sm font-bold text-gray-900 dark:text-white outline-none placeholder:text-gray-500 focus:ring-0"
                              />
                              <div className="flex gap-2">
                                <input
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                  placeholder="Degree / Certificate"
                                  className="flex-1 bg-transparent text-xs text-gray-600 dark:text-gray-400 outline-none placeholder:text-gray-600"
                                />
                                <input
                                  value={edu.date}
                                  onChange={(e) => updateEducation(edu.id, 'date', e.target.value)}
                                  placeholder="Year"
                                  className="w-24 bg-transparent text-xs text-gray-500 outline-none placeholder:text-gray-700 text-right font-mono focus:ring-0"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>

                  {/* Spacer for bottom scrolling */}
                  <div className="h-10"></div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions - Always Visible */}
        <div className="border-t border-gray-200 dark:border-border-dark bg-white dark:bg-[#141118] p-4 md:px-10 flex items-center justify-end gap-4 z-20 transition-colors">
          <button className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-[#ab9cba] hover:text-gray-900 dark:hover:text-white transition-colors">Discard</button>
          <button
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/25 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
