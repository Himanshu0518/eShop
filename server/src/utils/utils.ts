import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import {v2 as cloudinary} from 'cloudinary';
import  fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void|any>;

export const asyncHandler = (fn: AsyncFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      res.status(error?.statusCode || 500).json({
        success: false,
        error: error?.message || "Internal Server Error",
      });
    }
  };
};

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}

export const createAuthToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
    });
}

export const verifyAuthToken = (token: string): any => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
}

export const uploadToCloudinary = async (localfilePath:string)=>{
 console.log(localfilePath)
    try{
        const uploadResult = await cloudinary.uploader
       .upload(
           localfilePath, {
               resource_type:"auto",
           } )
           
           fs.unlinkSync(localfilePath)
           return uploadResult
    }
    catch{
     fs.unlinkSync(localfilePath)
     return  null 
    }
}

export const deleteFromCloudinary = async (publicId:string)=>{
    try{
        const deleteResult = await cloudinary.uploader.destroy(publicId)
        return deleteResult
    }
    catch{
        return null
    }
}

export const NormalizeString = (str:string):string[]=>{
   
   const strArray = Array.isArray(str) 
            ? str 
            : typeof str === 'string' 
                ? str.split(',').map(c => c.trim()) 
                : [str];

    return strArray;
}