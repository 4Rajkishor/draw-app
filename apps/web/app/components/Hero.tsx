"use client"
import { Button } from "@repo/ui/Button";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-4">
      <h1 className="text-4xl font-bold">Excalidraw Clone</h1>
      <p className="text-gray-600 mt-4 max-w-xl">
        A collaborative whiteboard where you can draw, share, and brainstorm in real time.
      </p>

      
     <Button variant="secondary" size="sm" children="Start Drawing" onClick={()=>alert("draw-page is empty for now")}/>
    </section>
  );
}
