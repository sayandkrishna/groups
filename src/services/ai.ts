// Google Generative AI Service
import { GoogleGenerativeAI } from '@google/generative-ai';

// LocalStorage key for user's API key
const USER_API_KEY_STORAGE = 'gemini_user_api_key';

// Helper functions for API key management
export const getUserApiKey = (): string | null => {
  return localStorage.getItem(USER_API_KEY_STORAGE);
};

export const setUserApiKey = (apiKey: string): void => {
  localStorage.setItem(USER_API_KEY_STORAGE, apiKey.trim());
};

export const removeUserApiKey = (): void => {
  localStorage.removeItem(USER_API_KEY_STORAGE);
};

export const hasUserApiKey = (): boolean => {
  return !!getUserApiKey();
};

// Get the active API key (user's key or fallback to server key)
const getActiveApiKey = (): string => {
  const userKey = getUserApiKey();
  if (userKey) {
    return userKey;
  }
  // Fallback to server-side key
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

// Create AI instance with active API key
const getAIModel = () => {
  const apiKey = getActiveApiKey();
  if (!apiKey) {
    throw new Error('No API key available. Please configure your Gemini API key in settings.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "models/gemini-flash-latest" });
};

export interface AISentimentResult {
  sentiment: 'roast' | 'glaze' | 'neutral';
  confidence?: number;
}

export const detectSentiment = async (text: string): Promise<AISentimentResult> => {
  if (!text || text.length < 3) return { sentiment: 'neutral' };
  
  try {
    const model = getAIModel();
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
    const model = getAIModel();
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
