import * as React from "react"
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown"
import { IMusicWork } from "../model/Work"
export interface IWorkProps {
  workType: string[]
}

export const Work = (props: IWorkProps) => {
  const options = [{ key: "Header", text: "Work Types", itemType: DropdownMenuItemType.Header }]
  props.workType.map(field =>
    options.push({ key: `key_${field}`, text: `${field}`, itemType: DropdownMenuItemType.Normal }),
  )

  return (
    <div>
      <Dropdown
        className="WorkTypeDropdownClass"
        placeHolder="Select an Option"
        label="Select the Work Type:"
        id="WorkTypeDropdown"
        ariaLabel="Work Type Dropdown"
        options={options}
      />
    </div>
  )
}
