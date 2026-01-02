"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { revalidatePath } from "next/cache";

export async function generateTailoredResume(applicationId: string) {
    const { userId } = await auth();

    if (!userId) {
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

        if (!userProfile?.resumeProfile) {
            return { success: false, error: "No resume profile found. Please upload your resume in Settings first." };
        }

        // 2. Prepare AI Prompt
        const resumeJson = JSON.stringify(userProfile.resumeProfile);
        const jobDescription = application.jobDescription;

        const systemPrompt = `
      You are an expert Resume Strategist and ATS Optimizer. 
      Your goal is to tailor the user's resume to perfectly align with the provided Job Description.
      
      RULES:
      1. Keep the EXACT SAME JSON structure as the input "User Resume". Do not add or remove top-level keys unless necessary.
      2. Optimize the "summary" (or professional profile) to highlight relevant skills for this specific job.
      3. Rewrite bullet points in "experience" to emphasize achievements relevant to the JD keywords.
      4. Ensure the output is VALID JSON. Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.
    `;

        const userPrompt = `
      JOB DESCRIPTION:
      ${jobDescription}

      USER RESUME (JSON):
      ${resumeJson}
    `;

        // 3. Call AI
        const { text } = await generateText({
            model: google("gemini-2.5-flash-lite"),
            system: systemPrompt,
            prompt: userPrompt,
        });

        // 4. Parse & Validate JSON
        // Clean up potential markdown code blocks if the model ignores the rule
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        let tailoredJson;

        try {
            tailoredJson = JSON.parse(cleanText);
        } catch (e) {
            console.error("AI returned invalid JSON:", cleanText);
            return { success: false, error: "AI generation failed to produce valid JSON." };
        }

        // 5. Save to Database
        await db.jobApplication.update({
            where: { id: applicationId },
            data: { tailoredResume: tailoredJson },
        });

        revalidatePath(`/applications/${applicationId}`);
        return { success: true, data: tailoredJson };

    } catch (error) {
        console.error("Error tailoring resume:", error);
        return { success: false, error: "Failed to generate tailored resume" };
    }
}
