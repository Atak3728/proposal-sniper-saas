"use client";

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { X, Clock, ChevronRight, Copy, ArrowRight } from 'lucide-react';

interface HistoryItem {
    id: number;
    title: string;
    date: string;
    fullDate: string;
    prompt: string;
    content: string;
}

interface HistoryDrawerProps {
    open: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onLoad: (item: HistoryItem) => void;
}

const HistoryDrawer = ({ open, onClose, history, onLoad }: HistoryDrawerProps) => {
    // Mock data if history is empty (for visualization)
    const displayHistory = history.length > 0 ? history : [
        {
            id: 1,
            title: "Senior React Developer",
            date: "2m ago",
            fullDate: "Today",
            prompt: "Looking for a senior react developer...",
            content: "Here is a proposal..."
        },
        {
            id: 2,
            title: "Marketing Copywriter",
            date: "2h ago",
            fullDate: "Today",
            prompt: "Need a marketing copywriter...",
            content: "Here is a proposal..."
        },
        {
            id: 3,
            title: "Full Stack Engineer",
            date: "1d ago",
            fullDate: "Yesterday",
            prompt: "Full stack engineer needed...",
            content: "Here is a proposal..."
        },
        {
            id: 4,
            title: "UX/UI Designer",
            date: "2d ago",
            fullDate: "Yesterday",
            prompt: "UX/UI Designer job...",
            content: "Here is a proposal..."
        }
    ];

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
                        <Clock className="w-5 h-5 text-primary" />
                        <h2 className="text-white font-semibold text-lg">History</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-xs font-semibold text-gray-500 hover:text-red-400 transition-colors uppercase tracking-wider">
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
                    {displayHistory.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-[#1c1f26] border border-gray-800 hover:border-gray-700 hover:bg-[#252833] rounded-xl p-4 cursor-pointer transition-all duration-200 relative overflow-hidden"
                            onClick={() => {
                                onLoad(item as HistoryItem);
                                onClose();
                            }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-gray-200 font-medium text-sm truncate pr-8">{item.title}</h3>
                                <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap">{item.date}</span>
                            </div>

                            <p className="text-xs text-gray-500 font-mono line-clamp-2 leading-relaxed font-jetbrains">
                                {item.prompt}
                            </p>

                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-gradient-to-l from-[#252833] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end px-4 pointer-events-none">
                                <div className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg transform translate-x-4 group-hover:translate-x-0 transition-transform">
                                    <span>LOAD</span>
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>
                    ))}
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
