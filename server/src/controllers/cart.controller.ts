import { asyncHandler } from "../utils/utils";
import { prisma } from "../config/db";

const addToCart = asyncHandler(async (req, res) => {

    let { productId, quantity } = req.body;
    productId  = Number(productId) ;
    quantity  = Number(quantity) ;

    const userId  = Number(req.user.id) ;
    try {
        // Check if the cart item already exists for the user and product
        let cartItem = await prisma.cartItem.findFirst({
            where: {
                userId: userId,
                productId: productId,
            },
        });
        if (cartItem) {
            // If it exists, update the quantity
            cartItem = await prisma.cartItem.update({
                where: {
                    id: cartItem.id,
                },
                data: {
                    quantity: cartItem.quantity + quantity,
                },
            });
        }
        else {
            // If it doesn't exist, create a new cart item
            cartItem = await prisma.cartItem.create({
                data: {
                    userId: userId,
                    productId: productId,
                    quantity: quantity,
                },
            });
        }
        return res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            data: cartItem,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to add item to cart: ${(error as Error).message}`,
        });
    } 
        });



const getCartItems = asyncHandler(async (req, res) => {

    const userId  = Number(req.user.id) ;

    try{
        const cartItems = await prisma.cartItem.findMany({
            where:{
                userId:userId
            },
            include:{
                product:true
            }
        });

        return res.status(200).json({
            success:true,
            message:"Cart items fetched successfully",
            data:cartItems
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to fetch cart items: ${(error as Error).message}`,
        })
    }
});


const removeFromCart = asyncHandler(async (req, res) => {

    const { cartItemId } = req.params;

    try{
        await prisma.cartItem.delete({
            where:{
                id:parseInt(cartItemId)
            }
        });
        return res.status(200).json({
            success:true,
            message:"Item removed from cart successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to remove item from cart: ${(error as Error).message}`,
        })
    }
});

const setItemQuantity = asyncHandler(async (req, res) => {

    const { cartItemId } = req.params;
    let { quantity } = req.body;
    quantity  = Number(quantity) ;

    if(quantity < 1){
        return res.status(400).json({
            success:false,
            message:"Quantity must be at least 1",
        })
    }

    try{
       const updatedCartItem = await prisma.cartItem.update({
            where:{
                id:parseInt(cartItemId)
            },
            data:{
                quantity:quantity
            }
        });


        return res.status(200).json({
            success:true,
            message:"Item quantity updated successfully",
            data:updatedCartItem
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to update item quantity: ${(error as Error).message}`,
        })
    }
});

export {
    addToCart,
    getCartItems,
    removeFromCart,
    setItemQuantity
};