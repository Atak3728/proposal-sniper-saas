"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveProposal(applicationId: string, content: string) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await db.jobApplication.updateMany({
            where: {
                id: applicationId,
                userId: userId,
            },
            data: {
                proposal: content,
            },
        });

        revalidatePath(`/applications/${applicationId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to save proposal:", error);
        return { success: false, error: "Failed to save proposal" };
    }
}
