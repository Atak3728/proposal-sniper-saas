import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return new NextResponse("No file uploaded", { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Lazy load the library to bypass build-time bundling issues
    let pdfParser = require("pdf-parse");

    // Handle "Module Default" mismatch (CommonJS vs ESM)
    // If the library is wrapped in { default: function }, use that.
    if (typeof pdfParser !== 'function' && pdfParser.default) {
      pdfParser = pdfParser.default;
    }

    // Now run the parser
    const pdfData = await pdfParser(buffer);
    const pdfText = pdfData.text;

    // Generate JSON with Gemini
    const { object } = await generateObject({
      model: google('gemini-2.5-flash-lite'), // Keeping consistency with identified config
      schema: z.object({
        professionalSummary: z.string().describe("A professional summary written in first person, max 600 chars."),
        skills: z.string().describe("A comma-separated string of the top 10 technical skills."),
        workExperience: z.array(z.object({
          jobTitle: z.string(),
          company: z.string(),
          dateRange: z.string().describe("e.g., 'Jan 2022 - Present'"),
          description: z.string().describe("Short description of role and achievements.")
        })),
        education: z.array(z.object({
          school: z.string(),
          degree: z.string(),
          year: z.string()
        }))
      }),
      prompt: `Extract resume data from the following text. If fields are missing, infer them or leave empty:\n\n${pdfText}`,
    });

    return NextResponse.json(object);

  } catch (error) {
    console.error("Resume parsing error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}