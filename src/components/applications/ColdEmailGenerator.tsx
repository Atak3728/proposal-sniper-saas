"use client";

import { useState } from 'react';
import { generateColdEmail } from '@/actions/email-actions';
import { Mail, Sparkles, Copy, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ColdEmailGeneratorProps {
    applicationId: string;
    initialData?: string; // Stored as stringified JSON in DB
}

export default function ColdEmailGenerator({ applicationId, initialData }: ColdEmailGeneratorProps) {
    const [data, setData] = useState<{ subject: string; body: string } | null>(
        initialData ? JSON.parse(initialData) : null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [tone, setTone] = useState('Professional');

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateColdEmail(applicationId, tone);
            if (result.success && result.data) {
                setData(result.data);
                toast.success("Cold email generated successfully!");
            } else {
                toast.error(result.error || "Failed to generate email");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text: string, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    if (!data && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center mb-6">
                    <Mail size={40} className="text-purple-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cold Email Generator</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                    Reach out to hiring managers with a strategic, AI-crafted message that gets opened.
                </p>

                {/* Tone Selector */}
                <div className="flex bg-gray-100 dark:bg-[#1c1f26] p-1 rounded-lg border border-gray-200 dark:border-white/10 mb-6">
                    {['Professional', 'Bold', 'Casual'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTone(t)}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${tone === t
                                ? 'bg-white dark:bg-[#2a2e38] text-purple-600 dark:text-purple-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleGenerate}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Sparkles size={18} />
                    Generate Email
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#13151C] relative">
            {/* Header */}
            <div className="h-14 border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-4 bg-gray-50/50 dark:bg-[#1c1f26]/50">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-1 rounded-md">
                        <Mail size={12} />
                        COLD EMAIL
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setData(null)} // Reset to generate again (or show tone selector again)
                        className="text-[10px] font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mr-2"
                    >
                        NEW DRAFT
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="p-1.5 rounded-md text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors"
                        title="Regenerate"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <Loader2 size={32} className="text-purple-500 animate-spin" />
                        <p className="text-sm font-medium text-gray-500 animate-pulse">Drafting outreach...</p>
                    </div>
                ) : (
                    <>
                        {/* Subject Line */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subject Line</label>
                            <div className="relative group">
                                <input
                                    readOnly
                                    value={data?.subject || ''}
                                    className="w-full bg-gray-50 dark:bg-[#1c1f26] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-200 focus:outline-none"
                                />
                                <button
                                    onClick={() => handleCopy(data?.subject || '', 'Subject')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-purple-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="space-y-2 flex-1 flex flex-col">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Body</label>
                            <div className="relative group flex-1">
                                <textarea
                                    value={data?.body || ''}
                                    onChange={(e) => setData(prev => prev ? { ...prev, body: e.target.value } : null)}
                                    className="w-full h-64 bg-gray-50 dark:bg-[#1c1f26] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-200 focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed"
                                />
                                <button
                                    onClick={() => handleCopy(data?.body || '', 'Body')}
                                    className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-purple-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Hint/Action */}
                        <div className="flex justify-end">
                            <a
                                href={`mailto:?subject=${encodeURIComponent(data?.subject || '')}&body=${encodeURIComponent(data?.body || '')}`}
                                className="text-xs font-bold text-purple-600 hover:text-purple-500 flex items-center gap-1"
                            >
                                <Send size={12} />
                                OPEN IN MAIL APP
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
