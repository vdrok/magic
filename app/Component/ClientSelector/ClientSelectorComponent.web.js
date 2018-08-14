import React from 'react';
import { Dropdown } from 'semantic-ui-react'

import './Style/ClientSelectorComponent.scss';
import {Creators as AuthActions} from "../../Reducer/AuthReducer";
import {connect} from "react-redux";

class ClientSelectorComponent extends React.Component {

    constructor(props){
        super()
        this.state = {
            clients: props.clients,
            selected: props.selected
        }
        this.onClientChange = this.onClientChange.bind(this);
    }

    componentWillReceiveProps({clients, selected}) {
        this.setState({
            clients: clients,
            selected: selected
        });
    }

    render() {
        if(!this.state.clients || !this.state.selected){
            return null;
        }

        const options = this.state.clients.map(client => { return {
                key: client.id,
                text: client.name,
                value: client.id
            } });

        return  <Dropdown className='client-selector' fluid selection
                          options={options}
                          defaultValue={this.state.selected.id}
                          onChange={(e,status) => this.onClientChange(status.value)}
                          disabled={this.state.clients.length === 1}
                          loading={this.state.clients.length === 0}
        >
        </Dropdown>
    }


    onClientChange(clientId){
        const client = this.state.clients.filter(i => i.id === clientId);

        if(client[0] && this.state.selected.id !== client[0].id){
            this.props.changeClient(client[0]);
        }

    }
}


const mapDispatchToProps = dispatch => ({
    changeClient: (client) => dispatch(AuthActions.changeClient(client))
});

const mapStateToProps = (state) => {
    return {
        clients: state.auth.clients,
        selected: state.auth.currentClient
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientSelectorComponent)