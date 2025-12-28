"use client";

import { useEffect, useState } from "react";
import { getHistory, deleteHistoryItem } from "@/actions/db-actions";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { Copy, RefreshCw, FileText, Calendar, MoreHorizontal, ArrowRight, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

interface HistoryItem {
    id: string;
    sourceText: string;
    generatedOutput: string;
    createdAt: Date;
}

export default function HistoryPage() {
    const { user } = useUser();
    const router = useRouter();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (user?.id) {
                try {
                    const res = await getHistory(user.id);
                    if (res.success && res.data) {
                        setHistory(res.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch history", err);
                    toast.error("Failed to load history.");
                } finally {
                    setLoading(false);
                }
            } else if (!user) {
                // If user loads but is null, stop loading
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Proposal copied to clipboard!");
    };

    const reuseProposal = (sourceText: string, generatedOutput: string) => {
        localStorage.setItem('proposal_draft', sourceText);
        localStorage.setItem('proposal_output_draft', generatedOutput);
        router.push('/dashboard');
        toast.info("Draft loaded into Dashboard.");
        toast.info("Draft loaded into Dashboard.");
    };

    const handleDelete = async (id: string) => {
        if (!user?.id) return;

        const deletePromise = async () => {
            const res = await deleteHistoryItem(user.id, id);
            if (!res.success) throw new Error(res.error);
            // Optimistic update
            setHistory(prev => prev.filter(item => item.id !== id));
            router.refresh();
        };

        toast.promise(deletePromise(), {
            loading: 'Deleting proposal...',
            success: 'Proposal deleted permanently',
            error: 'Failed to delete proposal'
        });
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col p-6 animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-white/5 w-1/4 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-background-dark transition-colors duration-300">
            <header className="flex-shrink-0 h-16 border-b border-gray-200 dark:border-border-dark flex items-center justify-between px-6 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-10 sticky top-0 transition-colors">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#ab9cba]">
                    <span className="material-symbols-outlined text-[20px]">history</span>
                    <span className="font-semibold text-gray-900 dark:text-white">Proposal History</span>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Archive</h1>
                        <p className="text-gray-500 dark:text-[#ab9cba]">View and manage your previously generated proposals.</p>
                    </div>

                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <FileText size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No history returned</h3>
                            <p className="text-gray-500 mb-6 max-w-md">It looks like you haven't generated any proposals yet. Start by creating your first one!</p>
                            <Link href="/dashboard" className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2">
                                <span>Go to Dashboard</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {history.map((item) => (
                                <div key={item.id} className="group bg-white dark:bg-[#13151C] border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-[320px]">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            <Calendar size={12} />
                                            <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item.id);
                                            }}
                                            className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                                            title="Delete Proposal"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>

                                    {/* Job Source Preview */}
                                    <div className="mb-4">
                                        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Source Job</h4>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-relaxed">
                                            {item.sourceText}
                                        </p>
                                    </div>

                                    {/* Divider with Icon */}
                                    <div className="flex items-center gap-3 my-2 opacity-30">
                                        <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
                                        <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                                        <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
                                    </div>

                                    {/* Output Preview */}
                                    <div className="flex-1 min-h-0 mb-4 bg-gray-50 dark:bg-[#0b0d12] rounded-lg p-3 border border-gray-100 dark:border-white/5">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-4 font-mono leading-relaxed opacity-80">
                                            {item.generatedOutput}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 mt-auto">
                                        <button
                                            onClick={() => copyToClipboard(item.generatedOutput)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white text-xs font-bold py-2.5 rounded-lg transition-colors border border-gray-200 dark:border-white/5"
                                        >
                                            <Copy size={14} />
                                            Copy
                                        </button>
                                        <button
                                            onClick={() => reuseProposal(item.sourceText, item.generatedOutput)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold py-2.5 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-500/20"
                                        >
                                            <RefreshCw size={14} />
                                            Reuse
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
