import { uploadToCloudinary,asyncHandler,NormalizeString } from "../utils/utils";
import {prisma} from "../config/db";
import { Request, Response } from "express";

const addProduct = asyncHandler(async (req: Request, res: Response) => {

     const { name, description, price, category,sizes, discount } = req.body;
     console.log("Request Body:", req.body);

     let imgLocalpath = req.file?.path;
    if(!imgLocalpath){
        return res.status(400).json({
            success:false,
            message:"Image is required"
        })
    }
     try{
         const uploadResult = await uploadToCloudinary(imgLocalpath!);
        
         const newProduct = await prisma.product.create({
            data:{
                name,
                description,
                price:parseFloat(price),
                category:NormalizeString(category),
                sizes: NormalizeString(sizes),
                discount:parseFloat(discount),
                img:uploadResult.url,
            }
         })

            return  res.status(201).json({
                success:true,
                message:"Product added successfully",
                data:newProduct
            })
     }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to add product: ${(error as Error).message}`,
        })
     }
});

const getAllProducts = asyncHandler(async (_: Request, res: Response) => {
    try{
        const products =  await prisma.product.findMany(
            {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        );
        return res.status(200).json({
            success:true,
            message:"Products fetched successfully",
            data:products
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to fetch products: ${(error as Error).message}`,
        })
    }
});

const getProductById = asyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params;
    
    try{
        const product = await prisma.product.findUnique({
            where:{
                id:parseInt(id)
            }
        });
         if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
       
        return res.status(200).json({
            success:true,
            message:"Product fetched successfully",
            data:product
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to fetch product: ${(error as Error).message}`,
        })
    }
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, category,sizes, discount } = req.body;

    try{
        const existingProduct = await prisma.product.findUnique({
            where:{
                id:parseInt(id)
            }
        });
        if(!existingProduct){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
       
        const imgLocalpath = req.file?.path;
        let imgUrl = existingProduct.img;
        if(imgLocalpath){
            const uploadResult = await uploadToCloudinary(imgLocalpath);
            imgUrl = uploadResult.url;
        }
        const updatedProduct = await prisma.product.update({
            where:{
                id:parseInt(id)
            },
            data:{
                name:name?name:existingProduct.name,
                description:description?description:existingProduct.description,
                price:parseFloat(price)?parseFloat(price):existingProduct.price,
                category:category?NormalizeString(category):existingProduct.category,
                sizes:sizes?NormalizeString(sizes):existingProduct.sizes,
                discount:parseFloat(discount)?parseFloat(discount):existingProduct.discount,
                img:imgUrl,
            }
        });
        return res.status(200).json({
            success:true,
            message:"Product updated successfully",
            data:updatedProduct
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to update product: ${(error as Error).message}`,
        })
    }
 
    
});

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try{
        const product = await prisma.product.delete({
            where:{
                id:parseInt(id)
            }
        });
        return res.status(200).json({
            success:true,
            message:"Product deleted successfully",
            data:product
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to delete product: ${(error as Error).message}`,
        })
    }
});

const addProductView = asyncHandler(async (req: Request, res: Response) => {
    const {productId} = req.params;
    const userId = req.user.id;

  
    try{

        const existingProductView = await prisma.productView.findUnique({
            where:{
                userId_productId:{
                    userId:userId,
                    productId:Number(productId)
                }
            }
        })

        if(existingProductView){
             return res.status(200).json({
            success:true,
            message:"Product view added successfully",
            data:existingProductView
        })
        }
        const productView = await prisma.productView.create({
            data:{
                productId:Number(productId),
                userId:Number(userId)
            }
        });
        return res.status(200).json({
            success:true,
            message:"Product view added successfully",
            data:productView
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to add product view: ${(error as Error).message}`,
        })
    }
    
})


const getProductViews = asyncHandler(async (req: Request, res: Response) => {
    try{
        const productViews = await prisma.productView.findMany(
            {
                include:{
                    product:true
                },
                orderBy: {
                    viewedAt: 'desc'
                },
                where: {
                    userId: req.user.id
                }
                
            }
           
        );
        return res.status(200).json({
            success:true,
            message:"Product views fetched successfully",
            data:productViews
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Unable to fetch product views: ${(error as Error).message}`,
        })
    }
    
})

export {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addProductView,
    getProductViews

};