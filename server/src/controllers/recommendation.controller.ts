import { asyncHandler } from "../utils/utils";
import { prisma } from "../config/db";
import { getEmbeddings } from "../utils/embeddings";


export const getReccomendationByProduct = asyncHandler(async (req, res) => {

    const { productId } = req.params;
    try {
        
      const productEmbed = await prisma.$queryRawUnsafe(`
    SELECT * FROM "ProductEmbedding" 
    WHERE "productId" = ${productId}
`);

    const recommendedProducts = await prisma.$queryRawUnsafe(`
            SELECT p.*
            FROM "ProductEmbedding" pe
            JOIN "Product" p ON p.id = pe."productId"
            WHERE pe."productId" != ${productId}
            ORDER BY pe.embedding <=> '${productEmbed[0].embedding}'::vector
            LIMIT 4;
        `);


        return res.status(200).json({
            success: true,
            data: recommendedProducts
        })
    }catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: `Unable to fetch products: ${error.message}`,
        })
    }
});


export const getRecommendationByQuery = asyncHandler(async (req, res) => {

  const query = req.query.query;
    if(!query){
        return res.status(400).json({
            success: false,
            message: `Query is required`,
        })
    }
    try {
          // FIX 1: await the embedding API
        const embeddings = await getEmbeddings(String(query));
        const queryEmbedding = embeddings[0].values;

        // FIX 2: convert array → pgvector format
        const vectorStr = `[${queryEmbedding.join(',')}]`;

        const recommendedProducts = await prisma.$queryRawUnsafe(`
            SELECT p.*
            FROM "ProductEmbedding" pe
            JOIN "Product" p ON p.id = pe."productId"
            ORDER BY pe.embedding <=> '${vectorStr}'::vector
            LIMIT 10
        `);

        return res.status(200).json({
            success: true,
            data: recommendedProducts
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: `Unable to fetch products: ${error.message}`,
        })
    }
});