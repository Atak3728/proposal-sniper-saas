"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- Proposal History ---

export async function saveProposal(
    userId: string,
    source: string,
    output: string
) {
    try {
        const proposal = await db.proposalHistory.create({
            data: {
                userId,
                sourceText: source,
                generatedOutput: output,
            },
        });
        return { success: true, data: proposal };
    } catch (error) {
        console.error("Error saving proposal:", error);
        return { success: false, error: "Failed to save proposal" };
    }
}

export async function getHistory(userId: string) {
    try {
        const history = await db.proposalHistory.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 20,
        });
        return { success: true, data: history };
    } catch (error) {
        console.error("Error fetching history:", error);
        return { success: false, error: "Failed to fetch history" };
    }
}

// --- User Profile (Brain Context) ---

export async function saveBio(userId: string, bio: string) {
    try {
        const profile = await db.userProfile.upsert({
            where: {
                userId,
            },
            update: {
                bio,
            },
            create: {
                userId,
                bio,
            },
        });
        revalidatePath("/settings");
        return { success: true, data: profile };
    } catch (error) {
        console.error("Error saving bio:", error);
        return { success: false, error: "Failed to save bio" };
    }
}

export async function getBio(userId: string) {
    try {
        const profile = await db.userProfile.findUnique({
            where: {
                userId,
            },
        });
        return { success: true, data: profile };
    } catch (error) {
        console.error("Error fetching bio:", error);
        return { success: false, error: "Failed to fetch bio" };
    }
}
