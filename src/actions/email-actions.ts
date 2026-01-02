"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { revalidatePath } from "next/cache";

export async function generateColdEmail(applicationId: string, tone: string = "Professional") {
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

        // 2. Prepare AI Prompt
        const companyName = application.companyName;
        const jobTitle = application.jobTitle;
        // Fallback to "Applicant" if firstName is missing, though Clerk usually provides it via useUser locally, 
        // db might not have it unless synced. We'll use a generic placeholder if missing in DB for now
        // or we could pass it from client. Let's start with a generic fallback or empty string.
        // Ideally we sync firstName to UserProfile, but schema doesn't have it. 
        // We'll rely on the prompt context: "My Name" placeholder or let user fill it.
        // Actually, prompt says: "My Name: ${user.firstName}". 
        // Server action `auth()` doesn't give profile details, `currentUser()` does.
        // Let's import currentUser to get the name reliably.

        // Changing approach slightly to get name:
        const { currentUser } = await import("@clerk/nextjs/server");
        const clerkUser = await currentUser();
        const userName = clerkUser?.firstName || "Candidate";

        const systemPrompt = `
      You are an expert Career Coach and Outreach Specialist. 
      Write a concise, high-impact cold email to a hiring manager or recruiter.
      
      STRUCTURE:
      - Subject Line: Catchy but professional.
      - Body: Under 150 words. Focus on the value proposition and why I am a great fit.
      
      OUTPUT FORMAT:
      Return ONLY valid JSON with this structure:
      {
        "subject": "Email Subject Here",
        "body": "Email Body Here"
      }
      Do not include markdown blocks.
    `;

        const userPrompt = `
      Company: ${companyName}
      Role: ${jobTitle}
      My Name: ${userName}
      Tone: ${tone}
    `;

        // 3. Call AI
        const { text } = await generateText({
            model: google("gemini-2.5-flash-lite"),
            system: systemPrompt,
            prompt: userPrompt,
        });

        // 4. Parse & Validate JSON
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        let emailJson;

        try {
            emailJson = JSON.parse(cleanText);
        } catch (e) {
            console.error("AI returned invalid JSON:", cleanText);
            // Fallback or retry logic could go here. For now return error.
            return { success: false, error: "AI generation failed to produce valid JSON." };
        }

        // 5. Save to Database
        // Schema has 'coldEmail' as String. We should stringify the JSON to store it, 
        // or if the schema intended it to be just the body text? 
        // "coldEmail String? @db.Text" in schema.
        // The requirement says: Update JobApplication -> coldEmail: JSON.stringify(result).
        // So we store the full JSON string.
        await db.jobApplication.update({
            where: { id: applicationId },
            data: { coldEmail: JSON.stringify(emailJson) },
        });

        revalidatePath(`/applications/${applicationId}`);
        return { success: true, data: emailJson };

    } catch (error) {
        console.error("Error generating cold email:", error);
        return { success: false, error: "Failed to generate cold email" };
    }
}
