"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbeddings = void 0;
const genai_1 = require("@google/genai");
const getApiKeys = () => {
    const keys = [];
    if (process.env.GEMINI_API_KEYS) {
        keys.push(...process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()));
    }
    let i = 1;
    while (process.env[`GEMINI_API_KEY_${i}`]) {
        keys.push(process.env[`GEMINI_API_KEY_${i}`].trim());
        i++;
    }
    if (process.env.GEMINI_API_KEY) {
        keys.push(process.env.GEMINI_API_KEY.trim());
    }
    return [...new Set(keys)].filter(Boolean);
};
let currentKeyIndex = 0;
const getEmbeddings = async (text) => {
    try {
        const keys = getApiKeys();
        if (keys.length === 0) {
            throw new Error("No Gemini API keys found");
        }
        const apiKey = keys[currentKeyIndex % keys.length];
        currentKeyIndex++;
        const ai = new genai_1.GoogleGenAI({ apiKey });
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: text,
            config: {
                outputDimensionality: 512
            }
        });
        return response.embeddings;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.getEmbeddings = getEmbeddings;
