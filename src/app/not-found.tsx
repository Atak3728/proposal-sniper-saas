import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f111a] text-gray-900 dark:text-gray-300 p-6">
            <div className="bg-white dark:bg-[#13151C] border border-gray-200 dark:border-gray-800 p-10 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-md w-full">
                <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-6">
                    <FileQuestion size={40} className="text-red-500" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    The application or page you are looking for does not exist or may have been deleted.
                </p>

                <Link
                    href="/dashboard"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}
