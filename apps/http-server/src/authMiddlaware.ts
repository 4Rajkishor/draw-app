import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/jwt/jwt";
export const authMiddleare=(req:Request,res:Response,next:NextFunction)=>{
    try{
      const token=req.headers["authorization"] || "";
    const decoded=jwt.verify(token,JWT_SECRET);
    if (decoded){
        if (typeof decoded !=="string" && "id" in decoded){
              req.id=decoded.id
        }
           
    }
  next();
  
    }
    catch(e){
        console.error("token is missing")
    }
}