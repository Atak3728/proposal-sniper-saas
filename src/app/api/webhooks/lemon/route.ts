import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db as prisma } from "@/lib/db"; // ✅ Kept your original import style

export async function POST(req: NextRequest) {
  try {
    // 1. READ HEADERS & BODY
    const clonedReq = req.clone();
    const eventType = req.headers.get("X-Event-Name");
    const signature = req.headers.get("X-Signature");
    const body = await clonedReq.text(); // Raw body for signature check
    
    // Parse the body safely
    let payload;
    try {
      payload = JSON.parse(body);
    } catch (e) {
      console.error("❌ ERROR: Could not parse JSON body");
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    console.log("------------------------------------------------");
    console.log("🍋 LEMON WEBHOOK RECEIVED (DEBUG MODE)");
    console.log("🔹 Event Type:", eventType || payload.meta?.event_name);
    
    // 2. VERIFY SECRET
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("❌ ERROR: LEMONSQUEEZY_WEBHOOK_SECRET is missing in .env.local");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // 3. VERIFY SIGNATURE (HMAC)
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(body).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature || "", "utf8");

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      console.error("❌ ERROR: Invalid Signature. Secrets do not match.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 4. EXTRACT USER ID (The Fix 🛠️)
    // We check ALL possible locations:
    const customData = payload.meta?.custom_data || payload.data?.attributes?.custom_data || {};
    // Check both snake_case (Lemon default) and camelCase (Custom default)
    const userId = customData.user_id || customData.userId;

    console.log("🔹 Extracted Custom Data:", JSON.stringify(customData));
    console.log("🔹 Extracted Target User ID:", userId);

    if (!userId) {
      console.error("❌ ERROR: No user_id found. We checked meta.custom_data and data.attributes.");
      return NextResponse.json({ error: "No user ID found" }, { status: 400 });
    }

    // 5. UPDATE DATABASE
    // We check both event locations just to be safe
    const isOrderCreated = payload.meta?.event_name === "order_created" || eventType === "order_created";

    if (isOrderCreated) {
      console.log(`🔄 Attempting to upgrade User ${userId}...`);
      
      const updatedUser = await prisma.userProfile.update({
        where: { userId: userId }, 
        data: {
          isPro: true,
          credits: 100000,
        },
      });

      console.log("✅ SUCCESS: User upgraded in Database!", updatedUser.id);
    } else {
      console.log(`⚠️ Ignored event: ${payload.meta?.event_name}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("❌ CRITICAL ERROR in Webhook:", error.message);
    if (error.code === 'P2025') {
       console.error("❌ PRISMA ERROR: User ID not found in database.");
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}