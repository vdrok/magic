import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Picker, Icon } from 'native-base';
import Style from "./Style";


class SearchBarComponent extends React.Component {

    static propTypes = {
        onSearchSubmit: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            searchTerm: ''
        };

        this.runSearch = this.runSearch.bind(this);
    }

    render() {
        return <Picker
            iosHeader=""
            mode='dropdown'
            iosIcon={<Icon name="ios-arrow-down-outline" />}
            selectedValue={this.state.selected.id}
            style={{flex: 1, minWidth: 200, height: '100%'}}
            onValueChange={this.onClientChange}>
            {this.state.clients.map(client => <Picker.Item key={client.id} label={client.name} value={client.id}/>)}
        </Picker>;
    }

    clean(){
        this.setState({searchTerm: ''});
        this.runSearch();
    }

    runSearch() {
        this.props.onSearchSubmit(this.state.searchTerm);
    }
}

export default SearchBarComponent;