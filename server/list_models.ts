import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const testEmbed = async () => {
    try {
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: "test",
            config: {
                outputDimensionality: 512
            }
        });
        console.log("Success with gemini-embedding-001 with outputDimensionality");
    } catch (error) {
        console.error("Error with gemini-embedding-001:", error);
    }
    
    try {
        const response = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: "test",
            config: {
                outputDimensionality: 512
            }
        });
        console.log("Success with text-embedding-004 with outputDimensionality");
    } catch (error) {
        console.error("Error with text-embedding-004:", error);
    }
};

testEmbed();
