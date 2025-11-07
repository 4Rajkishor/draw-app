import { ReactNode } from "react"


export const IconButton=({
    children,
    onClick,
    selected
}
:{
    children:ReactNode,
    onClick:()=>void,
    selected:boolean
}
)=>{

    return(
        <div
  onClick={onClick}
  className={`m-2 cursor-pointer rounded-full border p-2 bg-black hover:bg-gray-600 ${
    selected ? "text-red-400" : "text-black"
  }`}
>
  {children}
</div>
    )

}