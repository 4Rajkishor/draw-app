"use client"
import { useEffect, useRef } from "react"
import InitDarw from "../../draw";

export default function Canvas(){
  const canvasRef=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const canvas=canvasRef.current;
     if (!canvas){
      return
     }
     InitDarw(canvas)

  },[]);

  return(
    <div>
     <canvas ref={canvasRef} height={500} width={1000}></canvas>
    </div>
  )
}