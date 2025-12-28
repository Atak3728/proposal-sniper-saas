# Proposal Sniper SaaS

An AI-powered tool helping freelancers and agencies generate winning proposals, cover letters, and outreach messages in seconds. Tailors content to specific job descriptions using a personalized "AI Brain."

## Tech Stack

*   ![Next.js](https://img.shields.io/badge/Framework-Next.js_14-black?logo=next.js) **Next.js 14 (App Router)**
*   ![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript) **TypeScript**
*   ![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_+_Shadcn_UI-38B2AC?logo=tailwind-css) **Tailwind CSS + Shadcn UI (Lucide Icons)**
*   ![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_(Neon)-336791?logo=postgresql) **PostgreSQL (via Neon) + Prisma ORM**
*   ![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk) **Clerk**
*   ![Lemon Squeezy](https://img.shields.io/badge/Payments-Lemon_Squeezy-FFC40D?logo=lemon) **Lemon Squeezy (Webhooks & Checkout)**
*   ![OpenAI](https://img.shields.io/badge/AI-OpenAI_GPT--4o-412991?logo=openai) **OpenAI GPT-4o (Streaming)**

## Key Features

*   **🤖 Smart Generation:** Streaming AI responses tailored to user's bio and style.
*   **📂 History Archive:** Auto-saves generations. View, Copy, Reuse, or Delete past proposals.
*   **📝 Template Library:** 6+ Pre-built professional templates (Freelance, Agency, Cold Outreach).
*   **💎 Pro Subscription:** Monthly credit system, "Pro" badge UI, and secure billing portal integration.
*   **🎨 UI Polish:** Dark/Light mode, smooth scrolling, responsive sidebar, and loading skeletons.

## Environment Setup

Required `.env` variables:

*   `DATABASE_URL`
*   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
*   `OPENAI_API_KEY`
*   `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_WEBHOOK_SECRET`

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Generate Prisma client:
    ```bash
    npx prisma generate
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
