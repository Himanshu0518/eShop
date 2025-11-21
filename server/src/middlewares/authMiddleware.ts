import { asyncHandler, verifyAuthToken } from "../utils/utils";
import { prisma } from "../config/db";

export const VerifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  }

  try {
    const decoded_token = verifyAuthToken(token);
    const userId = decoded_token.userId;

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        email: true,
        name: true,
        img: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = {...user  ,token : token}; 
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Not authorized: ${(error as Error).message}`,
    });
  }
});
