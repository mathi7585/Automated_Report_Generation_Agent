import { GoogleGenAI } from "@google/genai";

export async function generateProjectReport(repoData: any) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert technical writer and software architect. Your task is to generate a comprehensive, academic-style project report for a software repository.

Repository Details:
- Name: ${repoData.owner}/${repoData.repo}
- Description: ${repoData.description}
- Primary Language: ${repoData.language}
- Topics: ${repoData.topics?.join(", ") || "None"}

File Structure (Snapshot):
${repoData.treePaths.slice(0, 100).join("\n")}

README Content:
${repoData.readmeContent.substring(0, 10000) /* limit to 10k chars to avoid token limits */}

Based on the above information, generate a structured project report with the following sections formatted exactly as Markdown headers (H2):
## Abstract
## Introduction
## Literature Survey (infer from the domain and tech stack)
## Objective and Methodology
## Proposed Work
## Modules / Architecture
## Result and Discussion (infer expected results or running instructions)
## Conclusion and Suggestions for Future Work

Ensure the tone is professional, analytical, and well-structured. Do not hallucinate exact file contents, but accurately deduce the project's purpose and architecture from the README, description, and file structure. Expand on each section with rich detail.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.7,
            maxOutputTokens: 8000,
        }
    });

    return response.text;
}
