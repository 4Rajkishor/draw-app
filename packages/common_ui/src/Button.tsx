import { ReactNode } from "react"

interface ButtonProps{
    sizeType:"sm" | "mg" | "lg"
    varient:"primary"|"secondary"
    children:ReactNode
    onClick?:()=>void
    fullWidth:boolean
}

export const Button=(prop:ButtonProps)=>{
    return(
        <button onClick={prop.onClick} className={``}>{prop.children}</button>
    )
}