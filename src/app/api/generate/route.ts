import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { currentUser } from '@clerk/nextjs/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt, tone, userBio, userSkills } = await req.json();
  const user = await currentUser();

  const fullPrompt = `
    ROLE: You are an expert freelance copywriter. You write professional, concise, and high-converting proposals.
    
    MY PROFILE:
    - Bio: ${userBio || "Generic Freelancer"}
    - Skills: ${userSkills || "General Skills"}

    STRICT FORMATTING RULES:
    1. NO Markdown (no **, no ##, no bullet points *). Write in clean, plain text paragraphs only.
    2. NO Placeholders (no [Insert Name], no [Date]). 
    3. Structure the proposal with clear paragraph breaks.
    4. Sign off with the name: ${user?.firstName || 'A Pro Freelancer'}.
    5. Do not include a subject line.
    
    STRATEGY:
    - If the Job Description is short, INFER the needs and write a confident pitch.
    - Focus on the CLIENT'S problems, not just your skills.
    
    TONE: ${tone || 'Professional'}
    
    INSTRUCTION: Write a proposal for the Job Description below. USE MY PROFILE to prove fit.
    
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