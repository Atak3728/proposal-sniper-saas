"use server";

export const getCheckoutUrl = async (userId: string, userEmail: string) => {
    if (!userId) {
        throw new Error("User ID is required to create a checkout session.");
    }

    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;

    if (!storeId || !variantId || !apiKey) {
        throw new Error("Missing Lemon Squeezy Store ID, Variant ID, or API Key configuration.");
    }

    try {
        const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json'
            },
            body: JSON.stringify({
                data: {
                    type: "checkouts",
                    attributes: {
                        checkout_data: {
                            email: userEmail,
                            custom: {
                                user_id: userId,
                                user_email: userEmail
                            }
                        },

                    // CHANGE THIS: Use 'product_options', NOT 'checkout_options'
                        product_options: {
                            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`
                        }                       
 
                    },
                    relationships: {
                        store: {
                            data: {
                                type: "stores",
                                id: storeId
                            }
                        },
                        variant: {
                            data: {
                                type: "variants",
                                id: variantId
                            }
                        }
                    }
                }
            })
        });

        const result = await response.json();

        if (result.errors) {
            console.error("Lemon Squeezy Checkout API Error:", result.errors);
            throw new Error(result.errors[0]?.detail || "Failed to create checkout session");
        }

        const checkoutUrl = result.data?.attributes?.url;

        if (!checkoutUrl) {
            throw new Error("Failed to retrieve checkout URL from Lemon Squeezy response.");
        }

        return checkoutUrl;

    } catch (error: any) {
        console.error("Failed to create checkout session:", error);
        throw new Error(error.message || "Failed to create checkout session");
    }
};
