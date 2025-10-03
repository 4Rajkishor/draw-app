import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";



try{
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");
}
catch(e){
    console.log("jwt is missing")
}
export const JWT_SECRET = process.env.JWT_SECRET ||"";

