import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt, tone } = await req.json();

// ... inside POST function
  const fullPrompt = `
    ROLE: You are an expert freelance copywriter. You write professional, concise, and high-converting proposals.
    
    STRICT FORMATTING RULES:
    1. NO Markdown (no **, no ##, no bullet points *). Write in clean, plain text paragraphs only.
    2. NO Placeholders (no [Insert Name], no [Date]). 
    3. Sign off simply with "Sincerely," followed by a generic title like "A Dedicated Professional" if you don't know my name. 
    4. Do not include a subject line.
    
    STRATEGY:
    - If the Job Description is short, INFER the needs and write a confident pitch.
    - Focus on the CLIENT'S problems, not just your skills.
    
    TONE: ${tone || 'Professional'}
    
    JOB DESCRIPTION:
    ${prompt}
  `;
// ... rest of code

  const result = await streamText({
    // Use the model that gave you the 200 OK
    model: google('gemini-2.5-flash-lite'),
    prompt: fullPrompt,
  });

  // Now this will work because we updated the package
  return result.toTextStreamResponse();
}