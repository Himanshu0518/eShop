import { asyncHandler } from "../utils/utils";
import { prisma } from "../config/db";

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