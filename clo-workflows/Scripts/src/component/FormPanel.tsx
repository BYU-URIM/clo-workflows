import * as React from 'react';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import FormControlGroup from './FormControlGroup';
import { observer, inject } from 'mobx-react';
import { ClientStore } from '../store/ClientStore';
@inject("rootStore")
@observer
export class PanelMediumExample extends React.Component<any, {
  showPanel: boolean;
}> {

  constructor(props: {}) {
    super(props);
    this.state = { showPanel: false };
  }
  clientStore:ClientStore = this.props.rootStore.clientStore

  public render() {
    return (
      <div>
        <DefaultButton
          description='Opens the Sample Panel'
          onClick={ this._setShowPanel(true) }
          text='Open Panel'
        />
        <Panel
          isOpen={ this.state.showPanel }
          onDismiss={ this._setShowPanel(false) }
          type={ PanelType.medium }
          headerText='Medium Panel'
        >
 <div>
                        <FormControlGroup
                            data={this.clientStore.newProject}
                            formControls={this.clientStore.getViewState.projectTypeForm()}
                            validation={this.clientStore.newProjectValidation}
                            onChange={this.clientStore.updateNewProject}
                        />
                    </div>        </Panel>
      </div>
    );
  }

  @autobind
  private _setShowPanel(showPanel: boolean): () => void {
    return (): void => {
      this.setState({ showPanel });
    };
  }
}