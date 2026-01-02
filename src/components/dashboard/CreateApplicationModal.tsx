"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createApplication } from "@/actions/application-actions";
import { X, Check, Briefcase, Building2, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateApplicationModal({ isOpen, onClose }: CreateApplicationModalProps) {
    const router = useRouter();
    const modalRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: "",
        jobTitle: "",
        jobDescription: "",
    });

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.companyName || !formData.jobTitle || !formData.jobDescription) return;

        setIsLoading(true);
        try {
            const result = await createApplication(formData);
            if (result.success && result.data) {
                toast.success("Application created successfully!");
                // Redirect to the new application page (War Room)
                router.push(`/applications/${result.data.id}`);
            } else {
                console.error("Failed to create application:", result.error);
                toast.error(result.error || "Failed to create application. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className="w-full max-w-lg bg-white dark:bg-[#13151C] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="h-14 px-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-[#1c1f26]/50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <Briefcase size={16} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Track New Job</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    {/* Company Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                            <Building2 size={12} />
                            Company Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Google, Netflix, Stark Industries"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-[#0f111a] border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                            required
                        />
                    </div>

                    {/* Job Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                            <Briefcase size={12} />
                            Job Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Senior Frontend Engineer"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-[#0f111a] border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                            required
                        />
                    </div>

                    {/* Job Description */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                                <FileText size={12} />
                                Job Description
                            </label>
                            <span className="text-[10px] text-gray-400">Paste the full JD here</span>
                        </div>
                        <textarea
                            placeholder="Paste the entire job description..."
                            value={formData.jobDescription}
                            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                            className="w-full h-32 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-[#0f111a] border border-gray-200 dark:border-white/10 text-xs font-mono text-gray-900 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none custom-scrollbar"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Check size={16} />
                                    Start Tracking Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
