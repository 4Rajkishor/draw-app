import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/jwt/jwt";
export const authMiddleare=(req:Request,res:Response,next:NextFunction)=>{
    try{
      const token=req.headers["authorization"] || "";
      if (!token){
        res.status(401).json({
          message:"token is missing"
        })
        return;
      }
    const decoded=jwt.verify(token,JWT_SECRET);
    if (decoded){
        if (typeof decoded !=="string" && "id" in decoded){
              req.userId=decoded.id
        }
           
    }
  next();
  
    }
    catch (error: any) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};