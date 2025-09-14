
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Removed placeholder API key logic to strictly use environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storySchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise, well-formed user story title, typically starting with 'As a user...'",
    },
  },
  required: ["title"],
};

export const generateStories = async (prompt: string): Promise<{ title: string }[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following feature description, generate 5 user stories: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: storySchema,
        },
      },
    });

    const jsonText = response.text.trim();
    const stories = JSON.parse(jsonText);
    
    if (!Array.isArray(stories) || !stories.every(s => typeof s.title === 'string')) {
        throw new Error("AI returned data in an unexpected format.");
    }

    return stories;
  } catch (error) {
    console.error("Error generating stories with Gemini:", error);
    // You might want to throw a more user-friendly error message
    throw new Error("Failed to communicate with the AI service.");
  }
};
