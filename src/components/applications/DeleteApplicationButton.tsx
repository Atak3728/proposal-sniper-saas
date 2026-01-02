"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteApplication } from '@/actions/application-actions';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteApplicationButtonProps {
    applicationId: string;
}

export default function DeleteApplicationButton({ applicationId }: DeleteApplicationButtonProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const result = await deleteApplication(applicationId);
            if (result.success) {
                toast.success("Application deleted");
                router.push('/dashboard');
            } else {
                toast.error(result.error || "Failed to delete");
                setIsOpen(false);
            }
        } catch (error) {
            toast.error("Something went wrong");
            setIsOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 -mr-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                title="Delete Application"
            >
                <Trash2 size={18} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#1c1f26] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-full text-red-600 dark:text-red-500">
                                <AlertTriangle size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Delete Application?</h3>
                                <p className="text-xs text-gray-500 mt-1">This action cannot be undone. All tailored resumes and emails will be lost.</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
                            >
                                {isLoading && <Loader2 size={12} className="animate-spin" />}
                                Delete Forever
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
