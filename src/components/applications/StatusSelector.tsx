"use client";

import { useState } from 'react';
import { updateApplicationStatus } from '@/actions/application-actions';
import { ChevronDown, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface StatusSelectorProps {
    applicationId: string;
    currentStatus: string;
}

const STATUS_OPTIONS = [
    { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' },
    { value: 'APPLIED', label: 'Applied', color: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
    { value: 'INTERVIEWING', label: 'Interviewing', color: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800' },
    { value: 'OFFER', label: 'Offer', color: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' },
    { value: 'REJECTED', label: 'Rejected', color: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' },
];

export default function StatusSelector({ applicationId, currentStatus }: StatusSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(currentStatus);

    const handleStatusChange = async (newStatus: string) => {
        setIsOpen(false);
        if (newStatus === status) return;

        setIsLoading(true);
        // Optimistic update
        const previousStatus = status;
        setStatus(newStatus);

        try {
            const result = await updateApplicationStatus(applicationId, newStatus);
            if (result.success) {
                toast.success(`Status updated to ${newStatus}`);
            } else {
                setStatus(previousStatus); // Revert
                toast.error(result.error || "Failed decrease status");
            }
        } catch (error) {
            setStatus(previousStatus);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const currentOption = STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 transition-all ${currentOption.color} hover:brightness-95`}
            >
                {isLoading ? <Loader2 size={12} className="animate-spin" /> : currentOption.label}
                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-[#1c1f26] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-1">
                        {STATUS_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleStatusChange(option.value)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${status === option.value
                                        ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full mr-2 ${option.color.split(' ')[0].replace('bg-', 'bg-').split('/')[0]}`}></span>
                                {option.label}
                                {status === option.value && <Check size={12} className="text-gray-900 dark:text-white" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Click outside closer (simple implementation for MVP) */}
            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            )}
        </div>
    );
}
