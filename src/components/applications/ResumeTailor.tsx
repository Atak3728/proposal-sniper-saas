"use client";

import { useState } from 'react';
import { generateTailoredResume } from '@/actions/tailor-actions';
import { FileUser, Sparkles, Copy, Loader2, Check, FileDown, X } from 'lucide-react';
import { toast } from 'sonner';
import ResumePreview from './ResumePreview';

interface ResumeTailorProps {
    applicationId: string;
    initialData?: any;
}

export default function ResumeTailor({ applicationId, initialData }: ResumeTailorProps) {
    const [data, setData] = useState<any>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
    const [showPdfPreview, setShowPdfPreview] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateTailoredResume(applicationId);
            if (result.success && result.data) {
                setData(result.data);
                toast.success("Resume tailored successfully!");
            } else {
                toast.error(result.error || "Failed to tailor resume");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!data) return;
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        toast.success("Resume JSON copied to clipboard");
    };

    const handlePrint = () => {
        window.print();
    };

    if (!data && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6">
                    <FileUser size={40} className="text-indigo-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tailor Your Resume</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                    Use AI to rewrite your resume experience and summary to perfectly match this job description.
                </p>
                <button
                    onClick={handleGenerate}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Sparkles size={18} />
                    Tailor Resume Now
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col h-full bg-white dark:bg-[#13151C] relative">
                {/* Header */}
                <div className="h-14 border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-4 bg-gray-50/50 dark:bg-[#1c1f26]/50">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">
                            <Sparkles size={12} />
                            AI TAILORED
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-gray-200 dark:bg-white/5 rounded-lg p-0.5">
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-[#0f111a] shadow-sm text-indigo-600' : 'text-gray-500'}`}
                            >
                                PREVIEW
                            </button>
                            <button
                                onClick={() => setActiveTab('json')}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${activeTab === 'json' ? 'bg-white dark:bg-[#0f111a] shadow-sm text-indigo-600' : 'text-gray-500'}`}
                            >
                                JSON
                            </button>
                        </div>

                        <button
                            onClick={() => setShowPdfPreview(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 transition-colors ml-2"
                        >
                            <FileDown size={14} />
                            PDF
                        </button>

                        <div className="h-4 w-px bg-gray-300 dark:bg-white/10 mx-1"></div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="p-1.5 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                            title="Regenerate"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        </button>
                        <button
                            onClick={handleCopy}
                            className="p-1.5 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                            title="Copy JSON"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <Loader2 size={32} className="text-indigo-500 animate-spin" />
                            <p className="text-sm font-medium text-gray-500 animate-pulse">Optimizing keywords...</p>
                        </div>
                    ) : activeTab === 'json' ? (
                        <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    ) : (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            {/* A simple renderer for the resume JSON. 
                            Assumption: Use typical resume fields (name, summary, experience).
                            If specific structure is unknown, we iterate or show raw. 
                        */}

                            {data.firstName && <h1 className="text-2xl font-bold mb-1">{data.firstName} {data.lastName}</h1>}
                            {data.email && <p className="text-indigo-500 m-0">{data.email} | {data.phone}</p>}

                            {data.summary && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2 mb-3">Professional Summary</h3>
                                    <p className="text-gray-800 dark:text-gray-200">{data.summary}</p>
                                </div>
                            )}

                            {(data.experience || data.workExperience) && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2 mb-3">Experience</h3>
                                    {(data.experience || data.workExperience).map((exp: any, i: number) => (
                                        <div key={i} className="mb-4">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="font-bold text-gray-900 dark:text-white">{exp.company}</h4>
                                                <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">{exp.position}</p>
                                            <ul className="list-disc list-outside ml-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                                {exp.highlights?.map((h: string, j: number) => (
                                                    <li key={j}>{h}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Fallback for other fields or if structure differs */}
                            {JSON.stringify(data).length < 2 && <p className="text-red-500">Error: Empty Resume Data</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* PDF PREVIEW MODAL */}
            {showPdfPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
                    <div className="relative w-full max-w-5xl h-full flex flex-col items-center">

                        {/* Toolbar */}
                        <div className="w-full flex items-center justify-between bg-white dark:bg-[#1c1f26] rounded-xl p-4 mb-4 shadow-2xl no-print">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resume Preview</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
                                >
                                    <FileDown size={18} />
                                    Download PDF
                                </button>
                                <button
                                    onClick={() => setShowPdfPreview(false)}
                                    className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 p-2 rounded-lg transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Preview Area (Scrollable) */}
                        <div className="flex-1 w-full overflow-y-auto flex justify-center pb-10 no-print-scrollbar">
                            <ResumePreview data={data} />
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
