import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#0b0d12] transition-colors">
            <div className="relative flex flex-col items-center gap-4">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>

                {/* Icon */}
                <div className="relative bg-primary p-4 rounded-2xl shadow-lg shadow-primary/30 animate-bounce">
                    <span className="material-symbols-outlined text-white text-4xl">crisis_alert</span>
                </div>

                {/* Text */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Proposal Sniper</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>Loading application...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
