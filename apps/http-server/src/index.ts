import express from "express";
import {SignUpSchema,SigninSchema,CreateRoomSchema} from "@repo/common/Schema";
import {prismaClient} from "@repo/db/dbSchema";
import bcrypt from "bcrypt"
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
    const existingPartner=await prismaClient.user.findFirst({
        where:{
            email:parshedData.data?.email
        }
    });
    if (!existingPartner || existingPartner.password){
        res.status(401).json({
            messge:"user does not exist"
        });
        return
    }
   const comparePassword=await bcrypt.compare(parshedData.data?.password,existingPartner?.password)
});

app.post("/api/createRoom",async(req,res)=>{

});

app.get("/api/getChat",async(req,res)=>{

});

app.listen(3002,()=>{
    console.log("port is listening on port 3002");
});