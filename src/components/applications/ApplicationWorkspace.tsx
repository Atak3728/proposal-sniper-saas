"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Briefcase, FileText, Mail, FileUser } from 'lucide-react';
import LegacyProposalGenerator from '@/components/dashboard/LegacyProposalGenerator';
import ResumeTailor from '@/components/applications/ResumeTailor';
import ColdEmailGenerator from '@/components/applications/ColdEmailGenerator';
import StatusSelector from '@/components/applications/StatusSelector';
import DeleteApplicationButton from '@/components/applications/DeleteApplicationButton';
import CoverLetterGenerator from '@/components/applications/CoverLetterGenerator';

interface ApplicationWorkspaceProps {
    application: {
        id: string;
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        status: string;
        tailoredResume?: any | null;
        coldEmail?: string | null;
        coverLetter?: string | null;
        proposal?: string | null;
        // Add other fields as needed
    };
}

export default function ApplicationWorkspace({ application }: ApplicationWorkspaceProps) {
    const [activeTab, setActiveTab] = useState<'proposal' | 'resume' | 'email' | 'cover-letter'>('proposal');

    return (
        <div className="flex flex-col h-full w-full font-display bg-gray-50 dark:bg-[#0f111a] text-gray-900 dark:text-gray-300 relative transition-colors duration-300">

            {/* 1. TOP NAVBAR */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0f111a]/80 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none flex items-center gap-2">
                            {application.companyName}
                            <span className="text-gray-300 dark:text-gray-600 font-normal">/</span>
                            <span className="text-gray-500 font-medium text-base">{application.jobTitle}</span>
                        </h1>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <StatusSelector applicationId={application.id} currentStatus={application.status} />
                    <div className="h-6 w-px bg-gray-200 dark:bg-white/10"></div>
                    <DeleteApplicationButton applicationId={application.id} />
                </div>
            </header>

            {/* 2. SPLIT LAYOUT */}
            <main className="flex-1 overflow-hidden p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[calc(100vh-64px)]">

                {/* LEFT COLUMN: CONTEXT (Reads JD) */}
                <div className="flex flex-col bg-white dark:bg-[#13151C] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm h-full">
                    <div className="h-12 bg-gray-50 dark:bg-[#1c1f26] border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-2 flex-shrink-0">
                        <Briefcase size={16} className="text-gray-500" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Job Description</span>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        <div className="prose prose-sm max-w-none dark:prose-invert font-medium text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {application.jobDescription}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: TOOLS (Tabs) */}
                <div className="flex flex-col h-full gap-4">

                    {/* Tab Matcher */}
                    <div className="flex bg-gray-100 dark:bg-[#1c1f26] p-1 rounded-xl border border-gray-200 dark:border-gray-800 flex-shrink-0">
                        <button
                            onClick={() => setActiveTab('proposal')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'proposal'
                                ? 'bg-white dark:bg-[#2a2e38] text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <FileText size={14} />
                            Proposal
                        </button>
                        <button
                            onClick={() => setActiveTab('cover-letter')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'cover-letter'
                                ? 'bg-white dark:bg-[#2a2e38] text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <FileText size={14} />
                            Cover Letter
                        </button>
                        <button
                            onClick={() => setActiveTab('resume')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'resume'
                                ? 'bg-white dark:bg-[#2a2e38] text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <FileUser size={14} />
                            Resume
                        </button>
                        <button
                            onClick={() => setActiveTab('email')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'email'
                                ? 'bg-white dark:bg-[#2a2e38] text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <Mail size={14} />
                            Email
                        </button>
                    </div>

                    {/* Tools Content */}
                    <div className="flex-1 bg-white dark:bg-[#13151C] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm relative">

                        {activeTab === 'proposal' && (
                            <div className="absolute inset-0 overflow-hidden">
                                <LegacyProposalGenerator
                                    initialJobDescription={application.jobDescription}
                                    variant="integrated"
                                    initialContent={application.proposal ?? undefined}
                                    applicationId={application.id}
                                />
                            </div>
                        )}

                        {activeTab === 'resume' && (
                            <div className="absolute inset-0 overflow-hidden">
                                <ResumeTailor
                                    applicationId={application.id}
                                    initialData={application.tailoredResume ?? undefined}
                                />
                            </div>
                        )}

                        {activeTab === 'email' && (
                            <div className="absolute inset-0 overflow-hidden">
                                <ColdEmailGenerator
                                    applicationId={application.id}
                                    initialData={application.coldEmail ?? undefined}
                                />
                            </div>
                        )}

                        {activeTab === 'cover-letter' && (
                            <div className="absolute inset-0 overflow-hidden">
                                <CoverLetterGenerator
                                    applicationId={application.id}
                                    initialData={application.coverLetter ?? undefined}
                                    companyName={application.companyName}
                                    jobTitle={application.jobTitle}
                                />
                            </div>
                        )}

                    </div>

                </div>
            </main>
        </div>
    );
}
