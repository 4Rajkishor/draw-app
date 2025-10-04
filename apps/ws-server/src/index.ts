import { WebSocketServer,WebSocket } from "ws";
import * as  jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/jwt/index"
const wss= new WebSocketServer({port:8080});
interface User{
    ws:WebSocket,
    rooms:[]
    userId:string
}
const Users:User[]=[]

const checkUser=(token:string | null)=>{
   if (!token){
    return null;
   }
  const decoded=jwt.verify(token,JWT_SECRET);
    if (!decoded){
        return null
    }
    if (typeof decoded!=="string" && "id" in decoded)
        return decoded.id
    
}
 wss.on("connection",(ws,request)=>{
    const url=request.url;
    if(!url){
      return
    }
    const urlSchema=new URLSearchParams(url.split("?")[1]);
    const token=urlSchema.get("token");
    
    const userId=checkUser(token);
    if (!userId){
        console.log("token is missing");
        ws.close();
    }
    Users.push({
        userId,
        ws,
        rooms:[]

    })

   ws.on("message",(data)=>{
    ws.send(`you have sent ${data}`);
   })
 });