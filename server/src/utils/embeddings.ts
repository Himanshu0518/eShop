import { GoogleGenAI } from "@google/genai";

export const getEmbeddings = async (text: string) => {
    try {
        const ai = new GoogleGenAI({});

        const response = await ai.models.embedContent({
            model: 'text-embedding-004', // Updated model that supports dimensionality
            contents: text,
            config: {
                outputDimensionality: 512
            }
        });

        return response.embeddings;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw to handle in calling function
    }
}