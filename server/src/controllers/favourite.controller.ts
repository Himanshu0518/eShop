import { asyncHandler } from "../utils/utils";
import { prisma } from "../config/db";

const addToFavourite = asyncHandler(async (req, res) => {

    let { productId } = req.body;
    productId  = Number(productId) ;
     

    const userId  = Number(req.user.id) ;
    try {
      const item  = await prisma.favorite.create({
            data:{
                userId:userId,
                productId:productId,
            }
       });
        return res.status(200).json({
            success: true,
            message: "Item added to favorite successfully",
            data: item
        });
    } catch (error) {
       
    } 
        });



const getAllfavourite = asyncHandler(async (req, res) => {

    const userId  = Number(req.user.id) ;

    try{
        const favorites = await prisma.favorite.findMany({
            where:{
                userId:userId
            },
            include:{
                product:true
            }
        });

        return res.status(200).json({
            success:true,
            message:"Favorite items fetched successfully",
            data:favorites
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to fetch favorite items: ${(error as Error).message}`,
        })
    }
});


const removeFromFavorite = asyncHandler(async (req, res) => {
   const {favId} = req.params;

    try{
        await prisma.favorite.delete({
            where:{
                id:parseInt(favId)
            }
        });
        return res.status(200).json({
            success:true,
            message:"Item removed from favorite successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to remove item from favorite: ${(error as Error).message}`,
        })
    }
});

const toggleFavourite = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId  = Number(req.user.id) ;
    try {
        const existingFavourite = await prisma.favorite.findFirst({
            where: {
                userId: userId,
                productId: Number(productId),
            },
            include:{
                product:true 
            }
        });
        if (existingFavourite) {
            await prisma.favorite.delete({
                where: {
                    id: existingFavourite.id,
                },
            });
            return res.status(200).json({
                success: true,
                message: `${existingFavourite.product.name} removed from favorites successfully`,
            });
        } else {
            await prisma.favorite.create({
                data: {
                    userId: userId,
                    productId: Number(productId),
                },
            });
            return res.status(200).json({
                success: true,
                message: `${existingFavourite.product.name} added to favorites successfully`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to toggle favorite item: ${(error as Error).message}`,
        });
    }
});

export {
    addToFavourite,
    getAllfavourite,
    removeFromFavorite,
    toggleFavourite
};