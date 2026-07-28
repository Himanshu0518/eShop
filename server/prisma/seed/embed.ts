import { PrismaClient } from "@prisma/client";
import { GoogleGenAI } from '@google/genai';
import "dotenv/config";

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getEmbeddings = async (text: string) => {
    try {
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: text,
        });
        return response.embeddings;
    } catch (error) {
        console.error("Error in getEmbeddings:", error);
        throw error;
    }
}

async function main() {
    console.log("🌱 Starting bulk embedding generation...");
    try {
        const products = await prisma.product.findMany({
            where: { embedding: null },
            take: 200
        });
        if (products.length === 0) {
            console.log("All products already have embeddings");
            return;
        }

        let successCount = 0;
        let failedCount = 0;
        const batchSize = 5;

        for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);
            const batchPromises = batch.map(async (product) => {
                try {
                    const text = `${product.description} ${product.category} ${product.name}`;
                    const embeddings = await getEmbeddings(text);
                    if (!embeddings || !embeddings[0] || !embeddings[0].values) {
                        throw new Error("No embeddings returned");
                    }
                    const embedding = embeddings[0].values;
                    const vector = `[${embedding.join(",")}]`;

                    await prisma.$executeRawUnsafe(
                        `INSERT INTO "ProductEmbedding" ("productId", "embedding", "createdAt", "updatedAt")
                        VALUES ($1, $2::vector, NOW(), NOW())
                        ON CONFLICT ("productId") 
                        DO UPDATE SET 
                            "embedding" = EXCLUDED.embedding,
                            "updatedAt" = NOW();`,
                        product.id,
                        vector
                    );

                    successCount++;
                    console.log(`✓ Processed product ${product.id}: ${product.name}`);
                } catch (error: any) {
                    failedCount++;
                    console.error(`✗ Failed product ${product.id}:`, error.message);
                }
            });

            await Promise.all(batchPromises);

            if (i + batchSize < products.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        console.log(`🎉 Completed! Success: ${successCount}, Failed: ${failedCount}`);
    } catch (error: any) {
        console.error("❌ Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
