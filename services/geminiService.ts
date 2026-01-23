
import { GoogleGenAI, Type } from "@google/genai";

export async function analyzeMaterial(base64Image: string) {
  // Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY}); and use the key directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: `You are an expert industrial recycling quality inspector. 
          Analyze this image of scrap material and provide a detailed quality assessment in JSON format.
          Include:
          1. detectedMaterial (one of: PET Plastic, HDPE Plastic, Aluminum, Copper, Paper/Cardboard, Glass)
          2. suggestedGrade (Grade A Clean, Grade B Mixed, Grade C Contaminated)
          3. confidenceScore (0-1)
          4. contaminationPercentage (0-100)
          5. observations (Brief summary of what you see)`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedMaterial: { type: Type.STRING },
          suggestedGrade: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          contaminationPercentage: { type: Type.NUMBER },
          observations: { type: Type.STRING }
        },
        required: ["detectedMaterial", "suggestedGrade", "confidenceScore", "contaminationPercentage", "observations"]
      }
    }
  });

  // Access .text directly from response
  return JSON.parse(response.text || '{}');
}
