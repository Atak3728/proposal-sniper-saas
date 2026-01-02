"use client";

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; // Assuming use-debounce is installed or I'll implement a custom one. 
// Wait, I should better use a simple timeout for custom debounce to avoid huge deps if not needed, 
// OR check if use-debounce is available. User didn't specify. I'll use a custom hook or just inline it.
// Actually, standard practice:
import { Search } from 'lucide-react';

export default function SearchInput() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    // Simple debounce wrapper
    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const debouncedSearch = debounce(handleSearch, 300);

    return (
        <div className="relative group w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
                type="text"
                placeholder="Search active jobs..."
                onChange={(e) => debouncedSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
                className="w-full h-10 pl-9 pr-4 rounded-lg bg-white dark:bg-[#13151C] border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-gray-900 dark:text-gray-200 placeholder:text-gray-500"
            />
        </div>
    );
}
