// Google Generative AI Service
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-flash-latest" });

export interface AISentimentResult {
  sentiment: 'roast' | 'glaze' | 'neutral';
  confidence?: number;
}

export const detectSentiment = async (text: string): Promise<AISentimentResult> => {
  if (!text || text.length < 3) return { sentiment: 'neutral' };
  
  try {
    const prompt = `
      Analyze the sentiment of this message: "${text}". 
      Is it a 'Roast' (insult, teasing, attack), a 'Glaze' (praise, compliment, hype), or 'Neutral'? 
      Respond ONLY with one word: Roast, Glaze, or Neutral.
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const sentiment = response.text().trim().toLowerCase();
    
    if (sentiment.includes('roast')) return { sentiment: 'roast' };
    if (sentiment.includes('glaze')) return { sentiment: 'glaze' };
    return { sentiment: 'neutral' };
  } catch (err) {
    console.error("AI Error:", err);
    return { sentiment: 'neutral' };
  }
};

export const translateToSlang = async (text: string): Promise<string> => {
  if (!text) return "";
  
  try {
    const prompt = `
      Rewrite this sentence into hilarious Gen Z slang / brainrot lingo: "${text}".
      Make it sound like a chronically online zoomed. Use terms like 'no cap', 'fr', 'bet', 'based', 'cringe', 'L', 'W', 'rizz', 'skibidi' if appropriate but don't overdo it to the point of unreadable.
      Keep it short and punchy. Return ONLY the rewritten text.
    `;
    
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error("AI Error:", err);
    return text; // Fallback to original
  }
};
