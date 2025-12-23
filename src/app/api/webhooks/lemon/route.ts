import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db as prisma } from '@/lib/db'; // Adjust path to your prisma instance if different

export async function POST(req: NextRequest) {
    try {
        const text = await req.text();
        const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '');
        const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
        const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');

        // Verify Signature
        if (!crypto.timingSafeEqual(digest, signature)) {
            console.error("Lemon Squeezy Webhook: Invalid Signature");
            return new NextResponse('Invalid signature', { status: 401 });
        }

        const payload = JSON.parse(text);
        const eventName = payload.meta.event_name;
        const customData = payload.meta.custom_data;

        console.log(`Lemon Squeezy Webhook received: ${eventName}`);

        if (eventName === 'order_created') {
            const userId = customData?.userId;

            if (userId) {
                console.log(`Processing Pro upgrade for userId: ${userId}`);

                // Update User Profile in Database
                await prisma.userProfile.update({
                    where: { userId: userId },
                    data: {
                        isPro: true,
                        credits: 100000 // Unlimited credits
                    }
                });

                console.log(`SUCCESS: User ${userId} upgraded to Pro.`);
            } else {
                console.warn("Webhook received but no userId found in custom_data.");
            }
        }

        return new NextResponse('Webhook processed', { status: 200 });

    } catch (error) {
        console.error('Lemon Squeezy Webhook Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
