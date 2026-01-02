"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { revalidatePath } from "next/cache";

export async function generateCoverLetter(applicationId: string) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // 1. Fetch Application & User Profile
        const application = await db.jobApplication.findUnique({
            where: { id: applicationId, userId },
        });

        if (!application) {
            return { success: false, error: "Application not found" };
        }

        const userProfile = await db.userProfile.findUnique({
            where: { userId },
        });

        const resumeContext = userProfile?.resumeProfile || userProfile?.bio || "No resume provided.";
        const jobDescription = application.jobDescription || "No job description provided.";
        const companyName = application.companyName;
        const jobTitle = application.jobTitle;
        const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

        // 2. Generate Cover Letter via AI
        const prompt = `
            Write a formal and persuasive cover letter for the position of ${jobTitle} at ${companyName}.
            
            CANDIDATE NAME: ${userName}
            CANDIDATE RESUME/PROFILE: ${JSON.stringify(resumeContext)}
            
            JOB DESCRIPTION: ${jobDescription}
            
            INSTRUCTIONS:
            - Tone: Professional, Confident, Concise (max 300 words).
            - Structure: 
              1. Introduction (State excitement and specific role).
              2. The "Hook" (Connect candidate's specific skills from resume to challenges in the JD).
              3. Conclusion (Call to action/Request interview).
            - Do not include placeholders like "[Your Name]" or "[Date]" inside the body text. Return ONLY the body paragraphs.
            - Focus on adding value.
        `;

        const { text } = await generateText({
            model: google("gemini-2.5-flash-lite"),
            prompt: prompt,
        });

        // 3. Save to Database
        await db.jobApplication.update({
            where: { id: applicationId },
            data: {
                coverLetter: text,
            },
        });

        revalidatePath(`/applications/${applicationId}`);
        return { success: true, data: text };

    } catch (error) {
        console.error("Error generating cover letter:", error);
        return { success: false, error: "Failed to generate cover letter" };
    }
}

export async function saveCoverLetter(applicationId: string, content: string) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await db.jobApplication.update({
            where: { id: applicationId, userId },
            data: { coverLetter: content },
        });

        revalidatePath(`/applications/${applicationId}`);
        return { success: true };
    } catch (error) {
        console.error("Error saving cover letter:", error);
        return { success: false, error: "Failed to save" };
    }
}
