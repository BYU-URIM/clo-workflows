import * as React from 'react'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn
} from 'office-ui-fabric-react/lib/DetailsList'
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'

let _items: any[] = []

let _columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Project',
    fieldName: 'project',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for project'
  },
  {
    key: 'column2',
    name: 'Process',
    fieldName: 'process',
    minWidth: 50,
    maxWidth: 100,
    isResizable: true,
    ariaLabel: 'Operations for process'
  },
  {
    key: 'column3',
    name: 'Process Description',
    fieldName: 'processDescription',
    minWidth: 100,
    maxWidth: 300,

    isResizable: true,
    ariaLabel: 'Operations for process',
    isMultiline: true
  },
  {
    key: 'column4',
    name: 'Process Status',
    fieldName: 'processStatus',
    minWidth: 75,
    maxWidth: 75,
    ariaLabel: 'process status'
  }
]

export class InProgressList extends React.Component<
  {},
  {
    items: {}[]
    selectionDetails: {}
  }
> {
  private _selection: Selection

  constructor(props: {}) {
    super(props)

    // Populate with items for demos.
    if (_items.length === 0) {
      for (let i = 0; i < 200; i++) {
        _items.push({
          key: i,
          project: `Project ${i + 1}`,
          process: i + 1,
          processDescription:
            'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam vel quisquam ipsam iure odio sint, natus unde velit tempora nulla ad mollitia magnam quasi beatae, eos earum numquam? Vitae, et!',
          processStatus: 'complete'
        })
      }
    }

    this._selection = new Selection({
      onSelectionChanged: () =>
        this.setState({ selectionDetails: this._getSelectionDetails() })
    })

    this.state = {
      items: _items,
      selectionDetails: this._getSelectionDetails()
    }
  }

  public render() {
    let { items, selectionDetails } = this.state

    return (
      <div>
        <div>{selectionDetails}</div>
        <TextField label="Filter by name:" onChanged={this._onChanged} />
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            items={items}
            columns={_columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            onItemInvoked={this._onItemInvoked}
          />
        </MarqueeSelection>
      </div>
    )
  }

  private _getSelectionDetails(): string {
    let selectionCount = this._selection.getSelectedCount()

    switch (selectionCount) {
      case 0:
        return 'No items selected'
      case 1:
        return (
          '1 item selected: ' +
          (this._selection.getSelection()[0] as any).project
        )
      default:
        return `${selectionCount} items selected`
    }
  }

  @autobind
  private _onChanged(text: any): void {
    this.setState({
      items: text
        ? _items.filter(i => i.project.toLowerCase().indexOf(text) > -1)
        : _items
    })
  }

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.project}`)
  }
}
