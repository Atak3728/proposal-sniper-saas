"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// --- Job Application Actions ---

export async function createApplication(data: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
}) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        console.log("Creating application for user:", userId);
        console.log("Data:", data);

        const application = await db.jobApplication.create({
            data: {
                ...data,
                status: "DRAFT", // Default status
                user: {
                    connectOrCreate: {
                        where: { userId: userId },
                        create: { userId: userId },
                    },
                },
            },
        });

        console.log("Application created successfully:", application.id);

        revalidatePath("/dashboard"); // Assuming dashboard lists applications? Or a new page.
        // Also revalidate generic applications list if we have one
        // revalidatePath("/applications"); 

        return { success: true, data: application };
    } catch (error) {
        console.error("Error creating application:", error);
        return { success: false, error: "Failed to create application" };
    }
}

export async function getApplication(id: string) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const application = await db.jobApplication.findUnique({
            where: {
                id,
                userId, // Enforce ownership
            },
        });

        if (!application) {
            return { success: false, error: "Application not found" };
        }

        return { success: true, data: application };
    } catch (error) {
        console.error("Error fetching application:", error);
        return { success: false, error: "Failed to fetch application" };
    }
}

export async function getApplications(query?: string) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const where: any = {
            userId,
        };

        if (query) {
            where.OR = [
                { companyName: { contains: query, mode: 'insensitive' } },
                { jobTitle: { contains: query, mode: 'insensitive' } },
            ];
        }

        const applications = await db.jobApplication.findMany({
            where,
            orderBy: {
                updatedAt: "desc",
            },
        });
        return { success: true, data: applications };
    } catch (error) {
        console.error("Error fetching applications:", error);
        return { success: false, error: "Failed to fetch applications" };
    }
}

export async function updateApplicationStatus(id: string, status: string) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // Use updateMany to safely update only if it belongs to the user
        const result = await db.jobApplication.updateMany({
            where: {
                id,
                userId,
            },
            data: {
                status,
            },
        });

        if (result.count === 0) {
            return { success: false, error: "Application not found or unauthorized" };
        }

        revalidatePath("/dashboard");
        revalidatePath(`/applications/${id}`);

        return { success: true };
    } catch (error) {
        console.error("Error updating application status:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function saveGeneratedAssets(id: string, assets: {
    tailoredResume?: any;
    coverLetter?: string;
    coldEmail?: string;
    linkedinMessage?: string;
}) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const result = await db.jobApplication.updateMany({
            where: {
                id,
                userId,
            },
            data: assets,
        });

        if (result.count === 0) {
            return { success: false, error: "Application not found or unauthorized" };
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error saving assets:", error);
        return { success: false, error: "Failed to save assets" };
    }
}

export async function deleteApplication(id: string) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const result = await db.jobApplication.deleteMany({
            where: {
                id,
                userId,
            },
        });

        if (result.count === 0) {
            return { success: false, error: "Application not found or unauthorized" };
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error deleting application:", error);
        return { success: false, error: "Failed to delete application" };
    }
}
