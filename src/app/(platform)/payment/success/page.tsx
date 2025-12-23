"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = "/dashboard";
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0b0d12] text-gray-900 dark:text-gray-300">
            <div className="bg-white dark:bg-[#13151c] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 flex flex-col items-center gap-6 max-w-sm w-full mx-4">
                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Payment Successful!
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Activating Pro Plan...
                    </p>
                </div>

                <div className="w-full bg-gray-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 animate-[loading_4s_ease-in-out_forwards] w-full origin-left"></div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes loading {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>
        </div>
    );
}
