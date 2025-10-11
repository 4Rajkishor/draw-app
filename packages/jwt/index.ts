import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve("/home/raj/cohort3.0/week-24-Poject/new-draw-app/packages/jwt/.env")  
});


  if (!process.env.JWT_SECRET) 
    throw new Error("JWT_SECRET missing");
  
export const JWT_SECRET = process.env.JWT_SECRET;

