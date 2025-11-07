import express from "express";
import {SignUpSchema,SigninSchema,CreateRoomSchema} from "@repo/common/Schema";
import {prismaClient} from "@repo/db/dbSchema";
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/jwt/jwt"
import bcrypt from "bcrypt"
import { authMiddleare } from "./authMiddlaware";
import cors from "cors"
const app=express();
app.use(express.json());
app.use(cors())

app.post("/api/signup",async(req,res)=>{
    try{

    
    const parshedData=SignUpSchema.safeParse(req.body);
    console.log(`your req body data ${req.body}`);
    if (!parshedData.success){
       return res.status(401).json({
            message:"invalid format, please try again",
            error:Error
            
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
    }
    catch(e:any){
        if (e.code==="P2002"){
            res.status(402).json({
                message:"user already exists",
                error:e
            })
        }
        res.json({
            message:"something went wrong, please try again",
            error:e
        })
    }
   
});

app.post("/api/signin",async(req,res)=>{
    try{

    const parshedData= SigninSchema.safeParse(req.body);
console.log("data from the parshed:", parshedData);
    if (!parshedData.success){
        res.status(401).json({
            message:"invalid format, please try again"
        })
        return
    }
    const existingUser=await prismaClient.user.findUnique({
        where:{
            email:parshedData.data?.email
        }
    });
    console.log("here is your data ",existingUser);
    if (!existingUser || !existingUser.password){
        res.status(401).json({
            messge:"user does not exist",
            error:Error
        });
        return
    }
   const comparePassword=await bcrypt.compare(parshedData.data?.password,existingUser?.password);
   if (!comparePassword){
    return res.status(401).json({
        message:"incorrct password"
    })
   }
   const token=jwt.sign({
    id:existingUser.id
   },JWT_SECRET);
   if (!token){
    res.status(402).json({
        message:"something wrong with the token"
    });
   }
   
res.status(200).json({
    message:"you have been signed in successfully",
    token:token
});
}
catch(e){
    res.status(401).json("something is missing");
}
});


app.post("/api/createRoom",authMiddleare,async(req,res)=>{
    try {
         
        const parshedData=CreateRoomSchema.safeParse(req.body);
    const userId=req.userId;
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
   
    }
    catch(e){
        res.status(503).json({
            message:"something went wrong, please try again",
            error:Error
        });
    }
    
});

app.get("/api/getChat/:roomId",async(req,res)=>{
    const roomId=Number(req.params.roomId)
  const userId=req.userId;
 const shapes= await prismaClient.shapes.findMany({
    where:{
        roomid:roomId
    },
    orderBy:{
        id:"desc"
    },
    take:500
  })

  res.status(200).json({
    shapes:shapes
  })

});

app.listen(3002,()=>{
    console.log("port is listening on port 3002");
});