import { ReactNode } from "react";

interface ButtonProp{
  variant:"primary" | "secondary"
  size:"sm" |"mg" | "lg"
  children : ReactNode
  onClick?:()=>void
  fullWidth?:boolean
}

const varientType={
  primary:"ui:bg-blue-600 ui:rounded-lg ui:text-white ui:cursor-pointer",
  secondary:"ui:bg-blue-300 ui:rounded-lg ui:text-white ui:cursor-pointer"
}

const sizeType={
  sm:"ui:px-4 ui:py-2",
  mg:"ui:px-6 ui:py-3",
  lg:"ui:px-7 ui:px-5"
}




export const Button = (prop:ButtonProp) => {
  return (
    <button onClick={prop.onClick} className={`${varientType[prop.variant]} ${sizeType[prop.size]} ${prop.fullWidth?"ui:w-full" :""}`}>
      {prop.children}
    </button>
  );
};
