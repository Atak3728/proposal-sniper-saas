import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamText({
    // Use the explicit preview model that we know exists
    model: google('gemini-2.5-flash-lite-preview-09-2025'),
    system: "You are a helpful AI assistant.",
    prompt: prompt || 'Hello',
  });

  // We use this because your TypeScript validates it (TS 2551)
  return result.toTextStreamResponse();
}