import axios from "axios";
import { json } from "stream/consumers";
type Shape={
    ShapeType:"react",
    x:number,
    y:number,
    width:number,
    height:number
} |
{
    ShapeType:"circle",
    x:number,
    y:number,
    radius:number
}


export default async function InitDarw(canvas:HTMLCanvasElement,socket:WebSocket,roomId:string){
      const ctx=canvas?.getContext("2d");
       if (!ctx){
      return
     }
      let existingShapes:Shape[]=[];
      try{
        existingShapes=await getExistingShapes(roomId) || [];
      }
      catch(e:any){
        console.log("effeting fetching messages",e.message)
      }

       ctx.clearRect(0,0,canvas.width,canvas.height);
       ctx.strokeStyle="orange";
      ClearCanvas(existingShapes, ctx)

     socket.onmessage=(event)=>{
    
       const drawings=JSON.parse(event.data);
        console.log("your drawing onMessage",drawings);
       if ( drawings.type==="chat"){
         const parsedData=JSON.parse(drawings.shape);
         console.log("pasrhed data",parsedData);
         existingShapes.push({
          ShapeType:drawings.ShapeType,
          ...parsedData
       })
       }
       ClearCanvas(existingShapes,ctx)
     }
    
    
  
    let clicked=false;
    let startX=0;
    let startY=0;

    canvas?.addEventListener("mouseup",(e)=>{

      clicked=false;
      const width=e.offsetX-startX;
      const height=e.offsetY-startY;

      const drawnShapes:Shape={
         ShapeType:"react",
        x:startX,
        y:startY,
        height,
        width
      }
     
         existingShapes.push(drawnShapes)
      
      socket.send(JSON.stringify({
        type:"chat",
        shape:JSON.stringify({
           x:startX,
        y:startY,
        height,
        width
        }),
        roomId,
        ShapeType:JSON.stringify(drawnShapes.ShapeType)
    

      }))
      console.log("drawn shapes",drawnShapes)
    });
    
    canvas?.addEventListener("mousedown",(e)=>{
      clicked=true;
      startX=e.offsetX;
      startY=e.offsetY


    });

    

    canvas?.addEventListener("mousemove",(e)=>{
       if (clicked){
        const width=e.offsetX-startX;
        const height=e.offsetY-startY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

       ClearCanvas(existingShapes,ctx);
       
         ctx.strokeStyle="orange";
         ctx.strokeRect(startX,startY,width,height)
      
     
         
       }

    });
}

function ClearCanvas(existingShapes:Shape[],ctx:CanvasRenderingContext2D){
   
    //    existingShapes.map((shape)=>{
    //     if (shape.type=="react"){
    //     ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
    //     }
    //    });
            console.log("your existing shapae data",existingShapes);
    existingShapes.forEach((shape)=>{
        if (shape.ShapeType=="react"){
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
        }
       
    })}


    export async function getExistingShapes(roomId:string){

      try{
       const token=localStorage.getItem("token");
         const res=await axios.get(`http://localhost:3002/api/getChat/${roomId}`,{
          headers:{
            Authorization:`${token}`
          }
         });
         console.log("here is your shape from database",res);
         const recivedfromDb=res.data.shapes;
         const shapes=recivedfromDb.map((x :{ShapeType:string,data:string})=>{
           const shapeData =JSON.parse(x.data);
           console.log("Shapes data",shapeData);
           return {
             ShapeType:JSON.parse(x.ShapeType),
             ...shapeData
           }
         })
          
         console.log("here is shape",shapes)
         return shapes
      }
      catch(e){
      console.log("error fetching shapes");
      }
    }