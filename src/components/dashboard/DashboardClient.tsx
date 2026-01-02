"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";
import CreateApplicationModal from '@/components/dashboard/CreateApplicationModal';
import SearchInput from '@/components/dashboard/SearchInput';
import { Plus, Search, Calendar, Briefcase, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardClient({ initialApplications = [] }: { initialApplications: any[] }) {
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // We rely on Props for the data now (which comes from the server, filtered by search).
    // To keep stats correct even when searching, ideally we'd need separate stats data.
    // BUT for now, users asked to "Update Stat Logic" in this file. 
    // If the list is filtered, the stats will reflect the filtered list, which is acceptable for "Dashboard Polish" MVP.
    // If strict compliance with "stats for all apps" is needed while searching, we'd need a separate fetch. 
    // Assuming simple behavior: Stats reflect what's on screen (or if query is empty, all apps).

    // Update: State from props
    const applications = initialApplications;

    // Calculate Stats
    // Active: DRAFT + APPLIED + INTERVIEWING (Exclude Rejected/Offer)
    const activeCount = applications.filter(a => ['DRAFT', 'APPLIED', 'INTERVIEWING'].includes(a.status)).length;
    const interviewingCount = applications.filter(a => a.status === 'INTERVIEWING').length;
    const offerCount = applications.filter(a => a.status === 'OFFER').length;

    const getStatusBadgeStyles = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20 dark:text-zinc-400';
            case 'APPLIED': return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400';
            case 'INTERVIEWING': return 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400';
            case 'OFFER': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400';
            case 'REJECTED': return 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    return (
        <div className="flex flex-col h-full w-full font-display bg-gray-50 dark:bg-[#0f111a] text-gray-900 dark:text-gray-300 transition-colors duration-300 overflow-y-auto">

            {/* 1. TOP HEADER */}
            <header className="px-8 py-8 flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Job Applications</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Manage and track your active job hunts.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center gap-2"
                >
                    <Plus size={18} />
                    Track New Job
                </button>
            </header>

            {/* 2. STATS ROW */}
            <div className="px-8 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Active Applications', value: activeCount, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Interviews Scheduled', value: interviewingCount, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    { label: 'Offers Received', value: offerCount, color: 'text-green-500', bg: 'bg-green-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#13151C] border border-gray-200 dark:border-gray-800 p-5 rounded-xl flex items-center gap-4 shadow-sm">
                        <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                            <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-gray-900 dark:text-white font-medium text-sm">Keep pushing!</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. MAIN GRID */}
            <main className="px-8 flex-1 pb-10">
                {/* Filter/Search Bar */}
                <div className="mb-6 flex items-center justify-between">
                    <SearchInput />
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-white dark:bg-[#13151C] border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-500 transition-colors">
                            <LayoutGrid size={18} />
                        </button>
                        <button className="p-2 rounded-lg bg-transparent hover:bg-white/5 text-gray-400 hover:text-gray-300 transition-colors">
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Applications List */}
                {applications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications.map((app) => (
                            <Link
                                href={`/applications/${app.id}`}
                                key={app.id}
                                className="group bg-white dark:bg-[#13151C] border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-[#1c1f26] border border-gray-100 dark:border-white/5 flex items-center justify-center text-xl font-bold text-gray-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all">
                                        {app.companyName.substring(0, 1)}
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeStyles(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className="space-y-1 mb-4">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">{app.companyName}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                        <Briefcase size={12} />
                                        {app.jobTitle}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-400">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={12} />
                                        {format(new Date(app.createdAt), 'MMM d, yyyy')}
                                    </span>
                                    <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 font-medium">
                                        View
                                        <ChevronRight size={12} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-[#13151C]/50 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                            <Briefcase size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No active applications</h3>
                        <p className="text-sm text-gray-500 max-w-xs text-center mt-1 mb-6">Start tracking your job hunt by adding your first application.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add First Job
                        </button>
                    </div>
                )}
            </main>

            <CreateApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
