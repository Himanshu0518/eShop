"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbeddings = void 0;
const genai_1 = require("@google/genai");
const getEmbeddings = async (text) => {
    try {
        const ai = new genai_1.GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
        const response = await ai.models.embedContent({
            model: 'text-embedding-004',
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
