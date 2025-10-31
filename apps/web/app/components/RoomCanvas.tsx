
"use client"
import { useEffect, useState } from "react"
import Canvas from "./canvas"

export default function Roomcanvas({roomId}:{roomId:string}){

    const [socket,setSocket]=useState<WebSocket>();

    useEffect(()=>{
       const ws= new WebSocket(`${"ws://localhost:8080"}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUwZTcwOWFiLWQ3ZWItNGNhZi1hMGNkLWQxMzA1YmFmOTQyNyIsImlhdCI6MTc2MTc1NjIxOX0.ri_F1VQbQCjgtm2z7KNP3GtROJpuCATqiPITBSw5584`);
       ws.onopen=()=>{
        setSocket(ws);
        ws.send(JSON.stringify({
            type:"join_room",
            roomId
        }))
       }
       return ()=>{

       }
    },[])
      
    if (!socket){
        return <div>
            ... conncting to the server
        </div>
    }

    return(
        <div>
            <Canvas roomId={roomId} socket={socket}></Canvas>
        </div>
    )
}