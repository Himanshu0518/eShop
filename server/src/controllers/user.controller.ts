import { prisma } from "../config/db"
import {asyncHandler} from "../utils/utils"
import { Request, Response, CookieOptions } from "express"
import { hashPassword, comparePassword, createAuthToken } from "../utils/utils"
const SignupUser = asyncHandler(async (req: Request, res: Response) => {

    const user = req.body;

    try{
       const existingUser = await prisma.user.findUnique({
        where:{
            email:user.email
        }
       });
         if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists with this email"
            })
         }
         const hashedPassword = await hashPassword(user.password);
         const newUser = await prisma.user.create({
            data:{
                name:user.name,
                email:user.email,
                password:hashedPassword,
                img:user.img
            }
         });
       return res.status(201).json({
            success:true,
            message:"User created successfully",
            data:newUser
         });

    } catch(error) {
        return res.status(500).json({
            success:false,
            message:`Unable to create user: ${(error as Error).message}`,
        })
    }

})

const LoginUser = asyncHandler(async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try{
        const existingUser = await prisma.user.findUnique({
            where:{
                email:email
            }
        });
        if(!existingUser){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        const isPasswordMatch = await comparePassword(password, existingUser.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid credentials please check and try again"
            })
        }
       const accessToken = createAuthToken(String(existingUser.id));
        
          const options: CookieOptions = {
            httpOnly: true,
            secure: true,
           sameSite: "none",
          };

    const user_db = await prisma.user.findUnique({
        where: { email: email },
        select: {
          name: true,
          email: true,
          img: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true,      
        },
    })
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
        .json({
            success:true,
            message:"User logged in successfully",
            data:{...user_db, token:accessToken}
        });

    } catch(error) {
        return res.status(500).json({
            success:false,
            message:`Unable to login user: ${(error as Error).message}`,
        })
    }
    
})

const LogoutUser = asyncHandler(async (_: Request, res: Response) => {

    return res
    .status(200)
    .clearCookie("accessToken")
    .json({
        success:true,
        message:"User logged out successfully"
    });
    
})

const GetCurrentUser = asyncHandler(async (req: Request, res: Response) => {

    const user = req.user;
    
    const currentUser = {
        token: user?.token,
        name: user?.name,
        email: user?.email,
        img: user?.img,
        isAdmin: user?.isAdmin,
        createdAt: String(user?.createdAt),
        updatedAt: String(user?.updatedAt)
    }

    if(!user){
        return res.status(401).json({
            success:false,
            message:"Not authorized"
        })
    }
    return res.status(200).json({
        success:true,
        message:"Current user fetched successfully",
        data: currentUser
    });
    
})

const UpdateUserProfile = asyncHandler(async (req: Request, res: Response) => {})


export { 
    SignupUser,
    LoginUser,
    LogoutUser,
    GetCurrentUser,
    UpdateUserProfile
}