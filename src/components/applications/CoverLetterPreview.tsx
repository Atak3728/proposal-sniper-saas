"use client";

import { useUser } from "@clerk/nextjs";

interface CoverLetterPreviewProps {
    content: string;
    companyName: string;
    jobTitle: string;
    userProfile?: any;
}

export default function CoverLetterPreview({ content, companyName, jobTitle, userProfile }: CoverLetterPreviewProps) {
    const { user } = useUser();
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const userName = userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName}` : (user?.fullName || "Candidate Name");
    const userEmail = userProfile?.email || user?.primaryEmailAddress?.emailAddress || "email@example.com";
    const userPhone = userProfile?.phone || "";

    return (
        <div
            id="cover-letter-preview-container"
            className="mx-auto bg-white text-black p-[25mm] shadow-2xl origin-top"
            style={{
                width: '210mm',
                minHeight: '297mm',
                fontFamily: 'Times New Roman, Georgia, serif',
                fontSize: '12pt',
                lineHeight: '1.5'
            }}
        >
            {/* Header (Contact Info) */}
            <header className="mb-8 border-b-2 border-black pb-4">
                <h1 className="text-2xl font-bold uppercase mb-2">{userName}</h1>
                <div className="text-sm text-gray-700">
                    {userEmail} {userPhone && `| ${userPhone}`}
                </div>
            </header>

            {/* Date */}
            <div className="mb-8">
                {date}
            </div>

            {/* Recipient */}
            <div className="mb-8">
                <div>Hiring Manager</div>
                <div className="font-bold">{companyName}</div>
            </div>

            {/* Body */}
            <div className="whitespace-pre-wrap mb-8 text-justify">
                {content || "No cover letter generated yet."}
            </div>

            {/* Sign-off */}
            <div className="mt-12">
                <p>Sincerely,</p>
                <div className="h-10"></div> {/* Space for signature */}
                <p className="font-bold">{userName}</p>
            </div>

        </div>
    );
}
