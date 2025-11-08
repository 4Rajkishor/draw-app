import { getExistingShapes } from "./https";
import { Tool } from "../components/canvas";
type Shape = {
    ShapeType: "rect",
    x: number,
    y: number,
    width: number,
    height: number
} |
{
    ShapeType: "circle",
    centerX: number,
    centerY: number,
    radius: number
} |

{
    ShapeType: "pencil",
    startX: number,
    startY: number,
    endX:number,
    endY:number
}



export class Game {
    private roomId: string;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "circle"
    socket: WebSocket

    constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
        this.canvas = canvas
        this.ctx = canvas?.getContext("2d")!;
        this.roomId = roomId;
        this.existingShapes = [];
        this.clicked = false;
        this.socket = socket;
        this.init();
        this.initHandlers();
        this.initMousehandlers();
    }

      destroy() {
        this.canvas.removeEventListener("mousedown", this.mousedownHandler);

        this.canvas.removeEventListener("mouseup", this.mouseuphandlers);

        this.canvas.removeEventListener("mousemove", this.mousemoveHandler);
    }

    setTool(Tool: "circle" | "rect" | "pencil") {
        this.selectedTool = Tool;
    }


    async init() {

        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();

    }

    initHandlers() {

        this.socket.onmessage = (event) => {

            const drawings = JSON.parse(event.data);
            console.log("your drawing onMessage", drawings);
            if (drawings.type === "chat") {
                console.log("drawing shapes raw value",drawings.shape);
                console.log("typeof drawings.shape:", typeof drawings.shape);
                const parsedData = JSON.parse(drawings.shape);
                console.log("pasrhed data", parsedData);
                this.existingShapes.push(parsedData)
                   this.clearCanvas();
            }
            
        }

    }

    initMousehandlers() {
     this.canvas.addEventListener("mousedown",(this.mousedownHandler));
     this.canvas.addEventListener("mouseup",(this.mouseuphandlers));
     this.canvas.addEventListener("mousemove",(this.mousemoveHandler));
    

    }

    clearCanvas() {


        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle="orange"
        console.log(" Clearing and redrawing", this.existingShapes.length, "shapes");
        this.existingShapes.map((shape) => {
            if (shape.ShapeType === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }

            else if (shape.ShapeType ==="circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
                this.ctx.stroke();
                this.ctx.closePath();
            }
           else if (shape.ShapeType==="pencil"){
            this.ctx.beginPath();
            this.ctx.moveTo(shape.startX,shape.startY);
            this.ctx.lineTo(shape.endX,shape.endY);
            this.ctx.stroke();
            this.ctx.closePath();
           }
        })
    }

    mousedownHandler = (e:any) => {
        this.clicked = true;
        this.startX = e.offsetX;
        this.startY = e.offsetY;
    }

    mousemoveHandler = (e:any) => {
        if (!this.clicked){return};
          const x=Math.min(this.startX,e.offsetX);
          const y= Math.min(this.startY,e.offsetY);
        const width = Math.abs(e.offsetX - this.startX);
        const height = Math.abs(e.offsetY - this.startY);

        
       const radius = Math.max(width, height) / 2;
        const centerX = (this.startX+e.offsetX)/2;
        const centerY = (this.startY+e.offsetY)/2;
        this.clearCanvas();
         this.ctx.strokeStyle="orange";


        if (this.selectedTool==="rect"){
            this.ctx.strokeRect(x,y,width,height);
  
        }
          else if (this.selectedTool==="circle"){
            this.ctx.beginPath();
            this.ctx.arc(centerX,centerY,radius,0,2*Math.PI);
            this.ctx.stroke();
            this.ctx.closePath();
          }

          else if (this.selectedTool==="pencil"){

          
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX,this.startY);
            this.ctx.lineTo(e.offsetX,e.offsetY);
            this.ctx.stroke();
            this.ctx.closePath();
          }
    }

    mouseuphandlers = (e:any) => {

        this.clicked = false;
      const x=Math.min(this.startX,e.offsetX);
      const y= Math.min(this.startY,e.offsetY);
        const width = Math.abs(e.offsetX - this.startX);
        const height = Math.abs(e.offsetY - this.startY);
       

        let drawnShapes: Shape | null = null;
        if (this.selectedTool === "rect") {
            drawnShapes = {
                ShapeType: "rect",
                x,
                y,
                height,
                width,

            }
        }
        else if (this.selectedTool === "circle") {
        const radius = Math.max(width, height) / 2;
        const centerX = (this.startX+e.offsetX)/2;
        const centerY = (this.startY+e.offsetY)/2;
            drawnShapes = {
                ShapeType: "circle",
                centerX,
                centerY,
                radius

            }
       
        }

        else if (this.selectedTool==="pencil"){
            const endX=e.offsetX;
            const endY=e.offsetY;
            drawnShapes={
                ShapeType:"pencil",
                startX:this.startX,
                startY:this.startY,
                endX,
                endY
            }
        }

        if (!drawnShapes) {
            return
        }



        // this.existingShapes.push(drawnShapes)

        if (this.selectedTool === "rect") {

        }

       this.socket.send(JSON.stringify({
            type: "chat",
            shape: JSON.stringify(drawnShapes),
            roomId: this.roomId,
            ShapeType: drawnShapes.ShapeType
        }));
        console.log("sent to server", drawnShapes)

    }

}