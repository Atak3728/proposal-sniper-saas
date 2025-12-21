"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Zap, Building2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const TEMPLATES = [
    {
        id: 'freelance',
        title: 'Freelance Bid',
        description: 'Perfect for Upwork, Fiverr, or direct client pitches. Focuses on solution and capabilities.',
        icon: Briefcase,
        badge: 'Popular',
        color: 'text-indigo-500 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-500/10',
        content: `// FREELANCE PROPOSAL FOR [CLIENT_NAME]

Hi [CLIENT_NAME],

I noticed your job posting for [PROJECT_TITLE] and it perfectly aligns with my expertise in [MY_CORE_SKILL]. It sounds like you are looking to [PROJECT_GOAL]—which is exactly the kind of challenge I love solving.

// MY SOLUTION
I propose we approach this by:
1. [STEP_1]: ...
2. [STEP_2]: ...
3. [STEP_3]: ...

// RELEVANT EXPERIENCE
I have previously delivered similar results for [PAST_CLIENT], where I [ACHIEVEMENT].

I am available to start immediately. Let’s discuss how we can get this built.

Best,
[MY_NAME]`
    },
    {
        id: 'cold-outreach',
        title: 'Cold Outreach',
        description: 'Short, punchy, and value-driven. Best for LinkedIn DMs or cold emails.',
        icon: Zap,
        badge: 'Short',
        color: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-50 dark:bg-yellow-500/10',
        content: `// COLD OUTREACH TO [PROSPECT_NAME]

Subject: Quick idea for [COMPANY_NAME]...

Hi [PROSPECT_NAME],

I've been following [COMPANY_NAME] for a while and noticed [OBSERVATION/PROBLEM].

I help companies like yours [VALUE_PROP]. recently I helped [COMPETITOR/SIMILAR_CLIENT] achieve [RESULT].

Would you be open to a 5-minute chat to see if we could do the same for you?

Cheers,
[MY_NAME]`
    },
    {
        id: 'corporate',
        title: 'Formal RFP Response',
        description: 'Detailed, polite, and structured. Use this for corporate clients or agencies.',
        icon: Building2,
        badge: 'Corporate',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        content: `// RFP RESPONSE FOR [COMPANY_NAME]

Dear Hiring Manager,

Re: Proposal for [PROJECT_TITLE]

Thank you for the opportunity to submit a proposal for [PROJECT_TITLE]. After reviewing your requirements, I am confident that my background in [MY_FIELD] makes me an ideal candidate for this project.

// UNDERSTANDING OF REQUIREMENTS
You require a professional who can [REQUIREMENT_1] and [REQUIREMENT_2] within [TIMELINE]. This is critical to ensuring [BUSINESS_OBJECTIVE].

// PROPOSED METHODOLOGY
My approach ensures quality and timeliness:
- Phase 1: Discovery & Planning
- Phase 2: Execution ([SPECIFIC_TASK])
- Phase 3: Review & Handover

// QUALIFICATIONS
With over [YEARS] years of experience, I have...

I look forward to the possibility of working together.

Sincerely,
[MY_NAME]`
    }
];

const TemplatesPage = () => {
    const router = useRouter();

    const handleUseTemplate = (content: string) => {
        // 1. Save to local storage
        localStorage.setItem('proposal_draft', content);
        // 2. Redirect to dashboard
        router.push('/dashboard');
    };

    return (
        <div className="flex flex-col h-full w-full p-8 font-display bg-gray-50 dark:bg-[#0f111a] overflow-y-auto transition-colors duration-300">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Proposal Templates</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Jumpstart your workflow with battle-tested structures.</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TEMPLATES.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => handleUseTemplate(template.content)}
                            className="group relative bg-white dark:bg-[#13151C] border border-gray-200 dark:border-gray-800 rounded-xl p-6 overflow-hidden cursor-pointer transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={clsx("p-3 rounded-lg", template.bg, template.color)}>
                                    <template.icon size={28} />
                                </div>
                                {template.badge && (
                                    <span className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                        {template.badge}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-gray-900 dark:text-white text-xl font-semibold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {template.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                                {template.description}
                            </p>

                            <div className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors gap-2 mt-auto">
                                <span>USE TEMPLATE</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>

                            {/* Decorative Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplatesPage;
