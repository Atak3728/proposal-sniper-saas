"use client";

import { useEffect } from 'react';
import clsx from 'clsx';
import { X, Clock, ArrowRight } from 'lucide-react';

export interface HistoryItem {
    id: string; // Changed to string as per request (UUID or timestamp string)
    sourceText: string;
    generatedText: string;
    timestamp: number;
    preview: string;
}

interface HistoryDrawerProps {
    open: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onLoad: (item: HistoryItem) => void;
    onClear: () => void;
}

const HistoryDrawer = ({ open, onClose, history, onLoad, onClear }: HistoryDrawerProps) => {

    // Helper to format relative time
    const getRelativeTime = (timestamp: number) => {
        const now = Date.now();
        const diffInSeconds = Math.floor((now - timestamp) / 1000);

        if (diffInSeconds < 60) return 'Just now';

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    }

    // Handle escape key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
                    open ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={clsx(
                    "fixed top-0 right-0 h-full w-96 bg-[#13151C] border-l border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col",
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-white font-semibold text-lg">History</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClear}
                            className="text-xs font-semibold text-gray-500 hover:text-red-400 transition-colors uppercase tracking-wider"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-600">
                            <Clock size={32} className="opacity-20 mb-2" />
                            <p className="text-sm">No history yet</p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-[#1c1f26] border border-gray-800 hover:border-gray-700 hover:bg-[#252833] rounded-xl p-4 cursor-pointer transition-all duration-200 relative overflow-hidden hover:translate-x-1"
                                onClick={() => {
                                    onLoad(item);
                                    onClose();
                                }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-gray-200 font-medium text-sm truncate pr-8" title={item.preview}>
                                        {item.preview}
                                    </h3>
                                    <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap">
                                        {getRelativeTime(item.timestamp)}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-500 font-mono line-clamp-2 leading-relaxed font-jetbrains">
                                    {item.sourceText}
                                </p>

                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-gradient-to-l from-[#252833] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end px-4 pointer-events-none">
                                    <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg transform translate-x-4 group-hover:translate-x-0 transition-transform">
                                        <span>LOAD</span>
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        )))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 bg-[#161821]">
                    <p className="text-[10px] text-center text-gray-600">
                        History is stored locally on your device.
                    </p>
                </div>
            </div>
        </>
    );
};

export default HistoryDrawer;
