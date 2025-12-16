import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateGreeting = async (prompt: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Happy Birthday! (API Key missing)";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, warm, and elegant greeting card message for the following occasion/recipient: "${prompt}". 
      Keep it under 30 words. Do not use quotes in the output. Just the message text.`,
    });
    
    return response.text?.trim() || "Wishing you joy and happiness!";
  } catch (error) {
    console.error("Error generating greeting:", error);
    return "Wishing you a wonderful day!";
  }
};