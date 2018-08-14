import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, TextInput } from 'react-native';
import { SearchInput } from 'react-native-search-input';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Style from "./Style";

import { Creators as MediaFilesAction } from '../../Reducer/MediaFilesReducer';

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
        return <View style={Style.searchWrapper}>
            <SearchInput
                ref="search_box"
                onChangeText={(searchTerm) => this.setState({searchTerm})}
                placeholder="Search"
                onSearch={this.runSearch}
                onCancel={() => this.clean()}
                onDelete={() => this.clean()}
                returnKeyType='search'
                autoCapitalize='none'
                keyboardDismissOnSubmit={true}
                backgroundColor='#ffffff'
                titleCancelColor='#444'
            />
            </View>;
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