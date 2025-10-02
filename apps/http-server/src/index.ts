import express from "express";
import {SignUpSchema,SigninSchema,CreateRoomSchema} from "@repo/common/Schema"
const app=express();
app.use(express());

app.post("/api/signup",async(req,res)=>{
    const parshedData=SignUpSchema.safeParse(req.body);
    if (!parshedData.success){
        res.status(401).json({
            message:"invalid format, please try again"
        })
    }
   
});

app.post("/api/signin",async(req,res)=>{

});

app.post("/api/createRoom",async(req,res)=>{

});

app.get("/api/getChat",async(req,res)=>{

});

app.listen(3002,()=>{
    console.log("port is listening on port 3002");
});