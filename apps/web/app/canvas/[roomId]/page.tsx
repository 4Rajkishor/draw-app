
import Roomcanvas from "../../components/RoomCanvas"


export default async function CanvasPage({params}:{
params:{
  roomId:string
}
}) {
  const roomId= (await params).roomId;
    console.log("on Canvas page, room id is ",roomId);
    
  return (
    <div>
       <Roomcanvas roomId={roomId}/>
    </div>
  )
}

