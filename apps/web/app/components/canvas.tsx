"use client"
import { useEffect, useRef, useState } from "react";
import InitDarw from "../draw";
import { IconButton } from "@repo/ui/IconButtons";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Button } from "@repo/ui/Button";
import { Game } from "../draw/game";

export type Tool = "circle" | "rect" | "pencil"

export default function Canvas({
  roomId,
  socket
}:
  {
    roomId: string,
    socket: WebSocket
  }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setselectedTool] = useState<Tool>("rect")
  const [game,setgame]=useState<Game>()
  const [cordinates,setcordinates]=useState([]);

  useEffect(() => {
    game?.setTool(selectedTool)
  }, [selectedTool,game])

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return
    }

     const g=new Game(canvas,socket,roomId)

   setgame(g);

  }, [canvasRef]);




  return (
    <div >

      <canvas ref={canvasRef} height={500} width={1000}></canvas>
      <TopBar selectedTool={selectedTool} setselectedTool={setselectedTool} />
    </div>
  )
}

const TopBar = (
  { selectedTool, setselectedTool }: { selectedTool: Tool, setselectedTool: (s: Tool) => void }

) => {

  return (
    <div className="fixed top-10 left-10 bg-gray-500 text-white py-4 shadow-md z-50">
      <div className="bg-blue-500 text-white p-4">Tailwind test</div>
      <div className="flex justify-top">
        <IconButton selected={selectedTool === "circle"} onClick={() => { setselectedTool("circle"); alert("circle selected") }}><Circle /></IconButton>
        <IconButton selected={selectedTool === "rect"} onClick={() => { setselectedTool("rect") }}><RectangleHorizontalIcon /></IconButton>
        <IconButton selected={selectedTool === "pencil"} onClick={() => { setselectedTool("pencil");alert("pencil selected") }}><Pencil /></IconButton>
      </div>

      <div className="fixed top-10">
        hi there
        <Button variant="primary" size="mg" children="click me" />
      </div>

    </div>
  )
}