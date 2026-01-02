"use client";

import { useUser } from "@clerk/nextjs";

interface ResumePreviewProps {
    data: any;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
    const { user } = useUser();

    if (!data) return null;

    // Fallback contact info if not in resume JSON
    const email = data.email || user?.primaryEmailAddress?.emailAddress || "email@example.com";
    const phone = data.phone || "Phone Number";
    const linkedin = data.linkedin || data.linkedIn || "";
    const location = data.location || "";

    return (
        <div
            id="resume-preview-container"
            className="mx-auto bg-white text-black p-[15mm] shadow-2xl origin-top"
            style={{
                width: '210mm',
                minHeight: '297mm',
                fontFamily: 'Georgia, Times New Roman, serif'
            }}
        >
            {/* HEADER */}
            <header className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
                    {data.firstName || user?.firstName || "First"} {data.lastName || user?.lastName || "Last"}
                </h1>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
                    {location && <span>{location}</span>}
                    <span>{email}</span>
                    <span>{phone}</span>
                    {linkedin && <span>{linkedin}</span>}
                </div>
            </header>

            {/* SUMMARY */}
            {data.summary && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 pb-1">Professional Summary</h2>
                    <p className="text-sm leading-relaxed text-gray-800 text-justify">
                        {data.summary}
                    </p>
                </section>
            )}

            {/* EXPERIENCE */}
            {(data.experience || data.workExperience) && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 pb-1">Work Experience</h2>
                    <div className="space-y-4">
                        {(data.experience || data.workExperience).map((exp: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">{exp.position || exp.role}</h3>
                                    <span className="text-sm text-gray-600 italic whitespace-nowrap ml-4">
                                        {exp.startDate} – {exp.endDate}
                                    </span>
                                </div>
                                <div className="text-sm font-semibold italic mb-2">{exp.company}</div>

                                {(exp.highlights || exp.points) && (
                                    <ul className="list-disc list-outside ml-4 text-sm space-y-1 text-gray-800 leading-snug">
                                        {(exp.highlights || exp.points).map((point: string, j: number) => (
                                            <li key={j} className="pl-1">{point}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* EDUCATION */}
            {data.education && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 pb-1">Education</h2>
                    <div className="space-y-2">
                        {data.education.map((edu: any, i: number) => (
                            <div key={i} className="flex justify-between items-baseline">
                                <div>
                                    <div className="font-bold text-sm">{edu.degree || edu.degreeTitle}</div>
                                    <div className="text-sm italic">{edu.school || edu.institution}</div>
                                </div>
                                <div className="text-sm text-gray-600">{edu.date || edu.year}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* SKILLS */}
            {(data.skills || data.coreSkills) && (
                <section>
                    <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2 pb-1">Skills</h2>
                    <div className="text-sm leading-relaxed text-gray-800">
                        {Array.isArray(data.skills) ? data.skills.join(" • ") : data.skills}
                    </div>
                </section>
            )}

        </div>
    );
}
