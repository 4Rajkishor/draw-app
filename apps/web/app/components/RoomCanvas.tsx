
"use client"
import { useEffect, useState } from "react"
import Canvas from "./canvas"

export default function Roomcanvas({roomId}:{roomId:string}){

    const [socket,setSocket]=useState<WebSocket>();

    useEffect(()=>{
       const ws= new WebSocket(`${"ws://localhost:8080"}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI1OGI5ODlkLWJiNTUtNDUyMC04NzMwLTA1ZmQ0MWQyNWQxNiIsImlhdCI6MTc2MjYxNjcxMn0.JwaHxd5JEgfX8JvWtG4e8_EgQI-poolvKaUQfI0nnaE`);
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