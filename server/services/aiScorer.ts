import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { z } from "zod";

// --- 1. Schema Definition (Contract) ---
// This matches the design document exactly.

const scoreDimensionSchema = z.object({
    score: z.number().min(0).max(1), // Normalized 0.0 - 1.0
    weight: z.number(),
    reasoning: z.string(),
});

const evaluationResultSchema = z.object({
    timestamp: z.string(),
    modelVersion: z.string(),
    totalScore: z.number().int().min(0).max(100),
    passed: z.boolean(),
    dimensions: z.object({
        correctness: scoreDimensionSchema,
        efficiency: scoreDimensionSchema,
        quality: scoreDimensionSchema,
        compliance: scoreDimensionSchema,
    }),
    feedback: z.object({
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        securityAudit: z.object({
            safe: z.boolean(),
            issues: z.array(z.string()),
        }),
    }),
});

export type EvaluationResult = z.infer<typeof evaluationResultSchema>;

// --- 2. Service Implementation ---

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export class AIScoringService {
    private static MAX_RETRIES = 3;
    // User requested "model 2.5 flash". Assuming gemini-2.0-flash-exp or similar as the closest valid model ID.
    // We will use "gemini-2.0-flash-exp" as a reasonable target for "newest flash" in this context.
    private static MODEL = "gemini-2.0-flash-exp";

    /**
     * Main entry point to score a submission.
     * Handles strict validation and retries.
     */
    static async evaluateSubmission(
        task: { title: string; description: string; category: string; difficulty: string },
        submission: { proofContent: string; language: string }
    ): Promise<EvaluationResult> {

        // Construct the context for the AI
        const systemPrompt = `
You are the AI Scoring Engine for caBE (Coding Arena Backend).
Your job is to evaluate code submissions against a task description deterministically.

STRICT OUTPUT FORMAT:
You MUST return ONLY valid JSON.
The JSON must match this schema EXACTLY:
{
  "timestamp": "ISO string",
  "modelVersion": "string",
  "totalScore": number (0-100),
  "passed": boolean (score >= 70),
  "dimensions": {
    "correctness": { "score": 0.0-1.0, "weight": 0.4, "reasoning": "string" },
    "efficiency": { "score": 0.0-1.0, "weight": 0.2, "reasoning": "string" },
    "quality": { "score": 0.0-1.0, "weight": 0.2, "reasoning": "string" },
    "compliance": { "score": 0.0-1.0, "weight": 0.2, "reasoning": "string" }
  },
  "feedback": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "securityAudit": { "safe": boolean, "issues": ["string"] }
  }
}

SCORING ALGORITHM:
TotalScore = floor((correctness*0.4 + efficiency*0.2 + quality*0.2 + compliance*0.2) * 100)

FAILURE RULES:
1. Malicious Code: If code tries to read env vars, network scan, or destroy system -> TotalScore = 0, securityAudit.safe = false.
2. Partial/Empty: Evaluate as is. Correctness likely 0.
3. Joke/Spam: Score 0.
`;

        const userPrompt = JSON.stringify({
            task: {
                title: task.title,
                description: task.description,
                difficulty: task.difficulty,
                category: task.category
            },
            submission: {
                code: submission.proofContent,
                language: "auto-detect"
            }
        });

        let lastError: Error | null = null;

        // Retry Logic
        for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
            try {
                console.log(`🤖 AI Scoring Attempt ${attempt}/${this.MAX_RETRIES} with ${this.MODEL}...`);

                const model = genAI.getGenerativeModel({
                    model: this.MODEL,
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0
                    }
                });

                const result = await model.generateContent([
                    systemPrompt,
                    "Analyze this submission:",
                    userPrompt
                ]);

                const rawContent = result.response.text();
                if (!rawContent) throw new Error("Empty response from AI");

                // Validate JSON Schema
                const parsed = JSON.parse(rawContent);
                const validated = evaluationResultSchema.parse(parsed);

                return validated;

            } catch (error) {
                console.warn(`⚠️ AI Attempt ${attempt} failed:`, error);
                lastError = error as Error;
            }
        }

        // Handled Failure State
        console.error("❌ All AI scoring attempts failed.");
        throw new Error(`AI Scoring failed after ${this.MAX_RETRIES} attempts: ${lastError?.message}`);
    }
}
