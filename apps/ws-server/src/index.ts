import { WebSocketServer,WebSocket } from "ws";
// import { shapeQueue } from "./queue/shapeQueue"
import  jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/jwt/jwt"
import { prismaClient } from "@repo/db/dbSchema";
const wss= new WebSocketServer({port:8080});
interface User{
    ws:WebSocket,
    rooms:string[]
    userId:string
}
export const Users:User[]=[]

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

    });

   ws.on("message",async (data)=>{
    const str=typeof data=="string"? data:data.toString();
    let parsedData:any
    try{
         parsedData=JSON.parse(str);
         console.log("your parshed data is",parsedData)
         
    }
   
   catch(err){
    console.error("invalid json format",str,err);
    ws.send(JSON.stringify({
      type:"error",
      message:"invalid message format, please try again",
      err:Error
    }));
    return
   }
 
   if (parsedData.type==="join_room"){
     const user=Users.find(x=>x.ws===ws);
      user?.rooms.push(parsedData.roomId)
    }

if (parsedData.type==="leave_room"){
    const user=Users.find(x=>x.ws===ws);
    if (!user){
        return
    }
    const removeuser=user.rooms.filter(x=>x!==parsedData.roomId);
    user.rooms=removeuser;
 }
 if (parsedData.type==="chat"){
    const senders=Users.find(x=>x.ws===ws);
    const {shape,ShapeType}=parsedData;
    const roomId=Number(parsedData.roomId);
     if (!senders){
        ws.send(JSON.stringify({
            type:"error",
            message:`you have not joined to ${roomId}`
        }))
        return
     } 
  //  await shapeQueue.add("shapeUpdates",{
  //   roomId,
  //   shape,
  //   sender:senders.userId
  //  })
// add to the db.



     Users.forEach(user=>{
        if (user.rooms.includes(roomId.toString())){
            user.ws.send(JSON.stringify({
                type:"chat",
                ShapeType:ShapeType,
                roomId:roomId,
                shape:shape
            }))
        }
     })

     await prismaClient.shapes.create({
      data:{
        ShapeType:ShapeType,
        roomid:roomId,
        data:shape,
        userId
      }
    })
 }
   });
 });