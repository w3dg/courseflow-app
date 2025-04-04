import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "@/env";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const googleModel = google("gemini-1.5-flash");

const generateQuestions = async (subjectName: string, materialContent: string) => {
  const questionPrompt = `Generate 5 questions for exam on ${subjectName} based on the following material content: ${materialContent}`;
  const { object: questionData } = await generateObject({
    model: googleModel,
    schemaName: "Questions",
    schemaDescription: "Practice Questions for subject provided",
    schema: z.object({
      questions: z.array(
        z.object({
          question: z.string(),
          answers: z.array(z.object({ answer: z.string(), correct: z.boolean() })),
        })
      ),
    }),
    system:
      "You are a excellent question setter. Generate MCQ questions for the subject you will be provided with. Make sure to always generate 4 options as answer choices to the questions. Make all choices of relatively the same tone and length. Do not provide much more information in the correct option and less information for incorrect options, make all options sound and seem equally probable with sufficient text in each. ",
    prompt: questionPrompt,
  });

  return questionData.questions;
};

export async function POST(req: Request) {
  const { materialContent, subjectName }: { materialContent: string; subjectName: string } = await req.json();

  const result = await generateQuestions(subjectName, materialContent);

  console.log("Generated Q", result);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
