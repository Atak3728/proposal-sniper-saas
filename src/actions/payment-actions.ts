"use server";

import { checkout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

// Initialize Lemon Squeezy with the API key from environment variables
lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
});

export const getCheckoutUrl = async (userId: string, userEmail: string) => {
    if (!userId) {
        throw new Error("User ID is required to create a checkout session.");
    }

    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

    if (!storeId || !variantId) {
        throw new Error("Missing Lemon Squeezy Store ID or Variant ID configuration.");
    }

    try {
        // Create a new checkout
        const checkoutResult = await checkout({
            storeId: storeId,
            variantId: variantId,
            checkoutData: {
                email: userEmail,
                custom: {
                    userId: userId // CRITICAL: This allows us to map the webhook back to the user
                }
            }
        });

        // Check for errors in the response
        if (checkoutResult.error) {
            console.error("Lemon Squeezy Checkout Error:", checkoutResult.error);
            throw new Error(checkoutResult.error.message);
        }

        const checkoutUrl = checkoutResult.data?.data?.attributes?.url;

        if (!checkoutUrl) {
            throw new Error("Failed to retrieve checkout URL from Lemon Squeezy response.");
        }

        return checkoutUrl;

    } catch (error: any) {
        console.error("Failed to create checkout session:", error);
        throw new Error(error.message || "Failed to create checkout session");
    }
};
