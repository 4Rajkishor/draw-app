export default function InitDarw(canvas:HTMLCanvasElement){
      const ctx=canvas?.getContext("2d");
    
     if (!ctx){
      return
     }
  
    let clicked=false;
    let startX=0;
    let startY=0;

    canvas?.addEventListener("mouseup",(e)=>{

      clicked=false;
      

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
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle="orange"
        ctx.strokeRect(startX,startY,width,height)
       }

    });
}