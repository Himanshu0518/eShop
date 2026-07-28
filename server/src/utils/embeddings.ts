import { GoogleGenAI } from "@google/genai";

const getApiKeys = (): string[] => {
    const keys: string[] = [];
    
    if (process.env.GEMINI_API_KEYS) {
        keys.push(...process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()));
    }
    
    let i = 1;
    while (process.env[`GEMINI_API_KEY_${i}`]) {
        keys.push(process.env[`GEMINI_API_KEY_${i}`]!.trim());
        i++;
    }
    
    if (process.env.GEMINI_API_KEY) {
        keys.push(process.env.GEMINI_API_KEY.trim());
    }

    return [...new Set(keys)].filter(Boolean);
};

let currentKeyIndex = 0;

export const getEmbeddings = async (text: string) => {
    try {
        const keys = getApiKeys();
        if (keys.length === 0) {
            throw new Error("No Gemini API keys found");
        }

        const apiKey = keys[currentKeyIndex % keys.length];
        currentKeyIndex++;

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: text,
            config: {
                outputDimensionality: 512
            }
        });

        return response.embeddings;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}
