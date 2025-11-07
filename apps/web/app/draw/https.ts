import axios from "axios";
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
             ShapeType:x.ShapeType,
             ...shapeData
           }
         })
          
         console.log("here is shape",shapes)
         return shapes
      }
      catch(e){
      console.log("error fetching shapes",e);
      }
    }