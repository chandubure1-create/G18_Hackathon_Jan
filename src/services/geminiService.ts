import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GOOGLE_API_KEY is missing");
}

const ai = new GoogleGenAI({ apiKey });

export async function analyzeMaterial(base64Image: string) {
  // NOTE: this is a simple placeholder call structure
  // You can expand it later exactly as in your old logic

  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64Image,
        mimeType: "image/png",
      },
    },
    "Analyze this material and return insights",
  ]);

  return result.response.text();
}
