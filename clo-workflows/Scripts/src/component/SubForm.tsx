import * as React from "react"
export interface ISubFormProps {
  children: JSX.Element[] | JSX.Element
}

export const SubForm = (props: ISubFormProps) => {
  return <div>{props.children}</div>
}
