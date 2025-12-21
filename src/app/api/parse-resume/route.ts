import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import PDFParser from 'pdf2json'; // Modern import

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response('No file uploaded', { status: 400 });
    }

    // 1. Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Parse PDF (Using pdf2json wrapped in a Promise)
    console.log("Parsing PDF with pdf2json...");

    const resumeText = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1); // 1 = Text content only

      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("PDF Parser Error:", errData.parserError);
        reject(new Error(errData.parserError));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        // Extract raw text from the messy JSON structure
        const rawText = pdfParser.getRawTextContent();
        resolve(rawText);
      });

      // Feed the buffer
      pdfParser.parseBuffer(buffer);
    });

    console.log("PDF Parsed. Text length:", resumeText.length);

    // 3. AI Extraction
    console.log("Sending to Gemini...");
    const result = await generateObject({
      model: google('gemini-2.5-flash-lite-preview-09-2025'),
      schema: z.object({
        bio: z.string().describe("A professional first-person bio summary (150-200 words). Highly detailed."),
        skills: z.string().describe("A comma-separated list of the top 5 hard technical skills."),
      }),
      prompt: `Analyze this resume text and extract the summary and skills. Ignore any messy formatting artifacts.
      
      For the 'bio':
      - Write a detailed first-person professional summary.
      - Do NOT be brief. Expand on the user's roles, specific achievements, and technical expertise.
      - Target length: 150-200 words.
      - Tone: Confident and expert.
      
      Resume Context:
      ${resumeText.slice(0, 15000)}`,
    });

    return Response.json(result.object);

  } catch (error: any) {
    console.error("RESUME PARSE ERROR:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}