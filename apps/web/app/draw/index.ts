import axios from "axios";
import { ReactNode } from "react";


type Shape={
    ShapeType:"rect",
    x:number,
    y:number,
    width:number,
    height:number
} |
{
    ShapeType:"circle",
    centerX:number,
    centerY:number,
    radius:number
} |

{
  ShapeType:"pencil",
  x:Number,
  y:Number,
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
        console.log("error fetching messages",e.message)
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
      //  ClearCanvas(existingShapes,ctx)
     }
    
    
  
    let clicked=false;
    let startX=0;
    let startY=0;

    canvas?.addEventListener("mouseup",(e)=>{

      clicked=false;
      const width=Math.abs(e.offsetX-startX);
      const height=Math.abs(e.offsetY-startY);
      const radius=Math.max(width,height)/2;
      const centerX=(radius+startX);
      const centerY=(radius+startY);

    //@ts-ignore
      const selectedTool=window.selectedTool;
      let drawnShapes:Shape | null =null;
      if (selectedTool==="rect"){
          drawnShapes={
         ShapeType:"rect",
        x:startX,
        y:startY,
        height,
        width,
        
      } 
      }
      else if (selectedTool==="circle"){
        
        drawnShapes={
         ShapeType:"circle",
        centerX,
       centerY,
       radius
        
      } 

      }

      if (!drawnShapes){
        return
      }

       
     
         existingShapes.push(drawnShapes)

         if (selectedTool==="rect"){

         }
      
      socket.send(JSON.stringify({
        type:"chat",
        shape:JSON.stringify({
           x:startX,
        y:startY,
        height,
        width,
        centerX,
        centerY,
        radius
        }),
        roomId,
        ShapeType:(drawnShapes.ShapeType)
    

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
        const width=Math.abs(e.offsetX-startX);
        const height=Math.abs(e.offsetY-startY) ;
        const radius=Math.max(width,height)/2;
      const centerX=startX+radius;
      const centerY=startY+radius;
  //@ts-ignore
      const selectedTool=window.selectedTool;

      if (selectedTool==="rect"){
         ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeRect(startX,startY,width,height)
        
      } else if (selectedTool==="circle"){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();   

        // console.log(`Radius is ${radius}, centerX is ${centerX},centerY is ${centerY}`);
      }

          else if (selectedTool==="pencil"){
             

            ctx.clearRect(0,0,canvas.width,canvas.height);
           
            ctx.beginPath()
            ctx.moveTo(startX,startX);
            ctx.lineTo(startX,startX);
            ctx.stroke();
                    ctx.strokeStyle="orange";
          }
    
        
       ClearCanvas(existingShapes,ctx);
       
         ctx.strokeStyle="orange";
        

      // new code above this.

      //   ctx.clearRect(0, 0, canvas.width, canvas.height);
      //   ctx.beginPath();
      //   ctx.arc(centerX,centerY,radius,0,2*Math.PI);
      //  ClearCanvas(existingShapes,ctx);
       
      //    ctx.strokeStyle="orange";
      //    ctx.strokeRect(startX,startY,width,height)
      
      
         
       }

    });
}

function ClearCanvas(existingShapes:Shape[],ctx:CanvasRenderingContext2D){
   
    
            console.log("your existing shapae data",existingShapes);
    existingShapes.forEach((shape)=>{
        if (shape.ShapeType=="rect"){
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
        }

        else if (shape.ShapeType==="circle"){
          ctx.beginPath();
          ctx.arc(shape.centerX,shape.centerY,shape.radius,0,2*Math.PI);
          ctx.stroke();
          ctx.closePath();
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
             ShapeType:(x.ShapeType),
             ...shapeData
           }
         })
          
         console.log("here is shape",shapes)
         return shapes
      }
      catch(e){
      console.log("error while fetching data from db",e);
         }
    }