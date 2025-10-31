import { useEffect, useRef, useState } from "react";
import InitDarw from "../draw";

export default function Canvas({
    roomId,
    socket
}:
{
    roomId:string,
    socket:WebSocket
}){
  const canvasRef=useRef<HTMLCanvasElement>(null);
 

  useEffect(()=>{
    const canvas=canvasRef.current;
     if (!canvas){
      return
     }
     InitDarw(canvas,socket,roomId)
      
  },[roomId,socket]);




  return(
    <div >
      <div className="mb-10">
        
      </div>
     <canvas ref={canvasRef} height={500} width={1000}></canvas>
    </div>
  )
}