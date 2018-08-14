import React from 'react';

import {Picker, Icon } from 'native-base';
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

        return <Picker
            iosHeader="Change client"
            mode='dropdown'
            iosIcon={<Icon name="ios-arrow-down-outline" />}
            selectedValue={this.state.selected.id}
            style={{flex: 1, minWidth: 200, height: '100%'}}
            onValueChange={this.onClientChange}>
            {this.state.clients.map(client => <Picker.Item key={client.id} label={client.name} value={client.id}/>)}
        </Picker>
    }


    onClientChange(clientId){
        const client = this.state.clients.filter(i => i.id === clientId)
        if(this.state.selected.id === client[0].id) return;

        this.props.changeClient(client[0]);
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