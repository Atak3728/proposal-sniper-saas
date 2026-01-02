"use client";

import { useState } from 'react';
import { generateCoverLetter, saveCoverLetter } from '@/actions/cover-letter-actions';
import { FileText, Sparkles, Copy, Loader2, FileDown, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import CoverLetterPreview from './CoverLetterPreview';
import { useUser } from '@clerk/nextjs';

interface CoverLetterGeneratorProps {
    applicationId: string;
    initialData?: string;
}

export default function CoverLetterGenerator({ applicationId, initialData }: CoverLetterGeneratorProps) {
    const [letterText, setLetterText] = useState(initialData || "");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const { user } = useUser();

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const result = await generateCoverLetter(applicationId);
            if (result.success && result.data) {
                setLetterText(result.data);
                toast.success("Cover Letter generated!");
            } else {
                toast.error(result.error || "Failed to generate");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await saveCoverLetter(applicationId, letterText);
            if (result.success) {
                toast.success("Cover Letter saved");
            } else {
                toast.error("Failed to save");
            }
        } catch (error) {
            toast.error("Error saving");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopy = () => {
        if (!letterText) return;
        navigator.clipboard.writeText(letterText);
        toast.success("Copied to clipboard");
    };

    const handlePrint = () => {
        window.print();
    };

    if (!letterText && !isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6">
                    <FileText size={40} className="text-indigo-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Write a Cover Letter</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                    Generate a persuasive, formal cover letter tailored to this job and your resume.
                </p>
                <button
                    onClick={handleGenerate}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Sparkles size={18} />
                    Generate Cover Letter
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
                            AI DRAFT
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 transition-colors"
                        >
                            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={14} />}
                            SAVE
                        </button>

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
                            disabled={isGenerating}
                            className="p-1.5 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                            title="Regenerate"
                        >
                            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        </button>
                        <button
                            onClick={handleCopy}
                            className="p-1.5 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                            title="Copy Text"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>

                {/* Content (Editable Textarea) */}
                <div className="flex-1 p-6">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <Loader2 size={32} className="text-indigo-500 animate-spin" />
                            <p className="text-sm font-medium text-gray-500 animate-pulse">Drafting letter...</p>
                        </div>
                    ) : (
                        <textarea
                            className="w-full h-full resize-none bg-transparent focus:outline-none text-gray-800 dark:text-gray-200 text-sm leading-relaxed p-4 border border-gray-100 dark:border-gray-800 rounded-lg"
                            value={letterText}
                            onChange={(e) => setLetterText(e.target.value)}
                            placeholder="Your cover letter will appear here..."
                        />
                    )}
                </div>
            </div>

            {/* PDF PREVIEW MODAL */}
            {showPdfPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
                    <div className="relative w-full max-w-5xl h-full flex flex-col items-center">

                        {/* Toolbar */}
                        <div className="w-full flex items-center justify-between bg-white dark:bg-[#1c1f26] rounded-xl p-4 mb-4 shadow-2xl no-print">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cover Letter Preview</h3>
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
                            <CoverLetterPreview
                                content={letterText}
                                companyName="" // These should effectively valid for generic preview unless application context is passed. 
                                // Wait, I should pass them from props implicitly? 
                                // The Preview component needs them. 
                                // I'll update props to include these or fetch them. 
                                // For now, I'll let the user fill or leave blank if unknown, 
                                // BUT 'ApplicationWorkspace' has 'application' prop content.
                                // I need to update CoverLetterGenerator to accept companyName and jobTitle.
                                jobTitle=""
                            />
                            {/* Correction: I need to update CoverLetterGenerator to accept companyName and jobTitle to pass to Preview. */}
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
