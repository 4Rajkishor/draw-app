import express from "express";
import {SignUpSchema,SigninSchema,CreateRoomSchema} from "@repo/common/Schema";
import {prismaClient} from "@repo/db/dbSchema";
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/jwt/jwt"
import bcrypt from "bcrypt"
import { authMiddleare } from "./authMiddlaware";
const app=express();
app.use(express());

app.post("/api/signup",async(req,res)=>{
    try{

    }
    catch(e){
        res.json({
            message:"something went wrong, please try again",
            error:e
        })
    }
    const parshedData=SignUpSchema.safeParse(req.body);
    if (!parshedData.success){
       return res.status(401).json({
            message:"invalid format, please try again"
        });
    }   
    const saltPassword=await bcrypt.hash(parshedData.data.password,10);
  await prismaClient.user.create({
    data:{
        username:parshedData.data?.username,
        password:saltPassword,
        email:parshedData.data?.email
    }
  })
res.status(200).json({
    message:"congratulations!! you have been signed up successfully"
})
    
   
});

app.post("/api/signin",async(req,res)=>{

    const parshedData= SigninSchema.safeParse(req.body);
    if (!parshedData.success){
        res.status(401).json({
            message:"invalid format, please try again"
        })
        return
    }
    const exisgingUser=await prismaClient.user.findFirst({
        where:{
            email:parshedData.data?.email
        }
    });
    if (!exisgingUser || exisgingUser.password){
        res.status(401).json({
            messge:"user does not exist"
        });
        return
    }
   const comparePassword=await bcrypt.compare(parshedData.data?.password,exisgingUser?.password);
   if (!comparePassword){
    return res.status(401).json({
        message:"incorrct password"
    })
   }
   const token=jwt.sign({
    id:exisgingUser.id
   },JWT_SECRET);
   
res.status(200).json({
    message:"you have been signed in successfully",
    token:token
});

});


app.post("/api/createRoom",authMiddleare,async(req,res)=>{
    const parshedData=CreateRoomSchema.safeParse(req.body);
    const userId=req.id;
    if (!parshedData.success){
        return res.status(401).json({
            message:"invalid slug format, please try again"
        });

    }
     await prismaClient.room.create({
        data:{
            adminid:userId,
            slug:parshedData.data.slug
        }
     });

     res.status(200).json({
        messge:`${parshedData.data.slug} room has been created `
     })
   
});

app.get("/api/getChat/:roomId",authMiddleare,async(req,res)=>{
    const roomId=Number(req.params.roomid)
  const userId=req.id;
 const message= await prismaClient.shapes.findMany({
    where:{
        roomid:roomId
    },
    orderBy:{
        id:"desc"
    },
    take:5
  })

});

app.listen(3002,()=>{
    console.log("port is listening on port 3002");
});