// scripts/test-webhook.ts
import crypto from 'crypto';

// 1. CONFIGURATION
const WEBHOOK_SECRET = "secure_lemon_123"; // Must match .env.local
const USER_ID = "user_37ByZevLET0VAK8uU5EZSvbrXxw"; // Copy from Prisma Studio
const WEBHOOK_URL = "http://localhost:3000/api/webhooks/lemon";

async function simulateWebhook() {
  console.log("🚀 Preparing Test Webhook...");

  // 2. CONSTRUCT PAYLOAD (Mimics Lemon Squeezy)
  const payload = {
    meta: {
      event_name: "order_created",
      custom_data: {
        user_id: USER_ID, // This tells your app WHO bought it
      },
    },
    data: {
      type: "orders",
      id: "test_order_123",
      attributes: {
        status: "paid",
        total_usd: 1900,
        user_email: "test@example.com",
      },
    },
  };

  const payloadString = JSON.stringify(payload);

  // 3. GENERATE SIGNATURE (Your app verifies this!)
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = Buffer.from(hmac.update(payloadString).digest("hex"), "utf8");
  const signature = digest.toString("utf8");

  console.log(`🔑 Generated Signature: ${signature}`);

  // 4. SEND REQUEST
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Signature": signature, // The secret handshake
      },
      body: payloadString,
    });

    if (response.ok) {
      console.log("✅ SUCCESS! Webhook accepted.");
      console.log("👉 Check Prisma Studio: User should now be PRO.");
    } else {
      console.error(`❌ FAILED: Server returned ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error("Response:", text);
    }
  } catch (error) {
    console.error("❌ NETWORK ERROR:", error);
  }
}

simulateWebhook();