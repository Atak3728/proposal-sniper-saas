
// scripts/get-lemon-ids.ts

// 1. Load environment variables
require('dotenv').config({ path: '.env.local' });

async function getLemonIds() {
    const API_KEY = process.env.LEMONSQUEEZY_API_KEY;

    if (!API_KEY) {
        console.error("❌ Error: LEMONSQUEEZY_API_KEY is missing from .env.local");
        process.exit(1);
    }

    console.log("🔄 Fetching variants from Lemon Squeezy...");

    try {
        const response = await fetch("https://api.lemonsqueezy.com/v1/variants?include=product", {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error: ${response.status} ${response.statusText}`);
            console.error("Details:", errorText);
            process.exit(1);
        }

        const json = await response.json();
        const variants = json.data;
        const products = json.included; // Products are in the 'included' array

        console.log(`✅ Found ${variants.length} variants.\n`);

        variants.forEach((variant: any) => {
            // Find the related product
            // variant.relationships.product.data.id maps to an item in 'included' where type is 'products' and id matches
            const productId = variant.relationships.product.data.id;
            const product = products.find(
                (p: any) => p.type === "products" && p.id === productId
            );

            const productName = product ? product.attributes.name : "Unknown Product";
            const variantName = variant.attributes.name;
            const variantId = variant.id;
            const storeId = variant.attributes.store_id || product?.attributes.store_id;

            console.log(`📦 Product: ${productName}`);
            console.log(`   Variant: ${variantName}`);
            console.log(`   ID:      ${variantId}`);
            console.log(`   Store:   ${storeId}`);
            console.log("--------------------------------------------------");
        });

    } catch (error) {
        console.error("❌ Fetch failed:", error);
        process.exit(1);
    }
}

getLemonIds();
