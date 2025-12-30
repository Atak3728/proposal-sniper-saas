"use server";

import { db } from "@/lib/db";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

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

export async function deleteHistoryItem(userId: string, id: string) {
    try {
        await db.proposalHistory.delete({
            where: {
                id,
                userId, // Security: Ensure deleting own record
            },
        });
        revalidatePath("/history");
        return { success: true };
    } catch (error) {
        console.error("Error deleting history item:", error);
        return { success: false, error: "Failed to delete item" };
    }
}

// --- User Profile (Brain Context) ---

export async function saveUserProfile(userId: string, bio: string, resumeProfile?: any) {
    try {
        const dataToUpdate: any = { bio };
        if (resumeProfile !== undefined) {
            dataToUpdate.resumeProfile = resumeProfile;
        }

        const profile = await db.userProfile.upsert({
            where: {
                userId,
            },
            update: dataToUpdate,
            create: {
                userId,
                bio,
                resumeProfile: resumeProfile || undefined,
            },
        });
        revalidatePath("/settings");
        return { success: true, data: profile };
    } catch (error) {
        console.error("Error saving user profile:", error);
        return { success: false, error: "Failed to save user profile" };
    }
}

export async function getBio(userId: string) {
    noStore();
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
