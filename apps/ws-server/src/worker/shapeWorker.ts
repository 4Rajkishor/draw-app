import { Worker } from "bullmq";
// import {Users} from "../index";
import {prismaClient} from "@repo/db/dbSchema"
const connection={host:"127.0.0.1",port: 6379};

export const shapeWorker= new Worker("shapeUpdates",
   async (job)=>{
    const {ShapeType,roomid,shape,senderId}=job.data;
    await prismaClient.$connect();
    console.log("db is connected");
    await prismaClient.shapes.create({
      data:{
        ShapeType:ShapeType,
        roomid:roomid,
        data:shape,
        userId:senderId,
      }
    })
    console.log("shape inserted",job.data);
    

     return "shape Broadcasted"
   }
,
   {connection}
);

shapeWorker.on("completed",(job)=>{
    console.log(`shape job ${job.id} processed`)
});

shapeWorker.on("failed",(job,err)=>{
    console.log(`shape update ${job?.id} failed ${err.message}`)
})