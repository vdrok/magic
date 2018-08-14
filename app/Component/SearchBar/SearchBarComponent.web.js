import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Creators as MediaFilesAction } from '../../Reducer/MediaFilesReducer';
import { Icon, Input, Button} from 'semantic-ui-react'

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
        this.onChange = this.onChange.bind(this);
    }


    render() {
        return <Input placeholder='Search...'
                      onChange={searchTerm => this.setState({searchTerm})}
                      action
                >
            <input onKeyPress={(e) => (e.key === 'Enter')? this.runSearch(): null } onChange={e => {  this.setState({searchTerm: e.target.value})  }  } />

            <Button type='submit' onClick={this.runSearch} icon='search' />
        </Input>
    }

    onChange(event) {
        if (event.key === 'Enter') {
            this.props.onSearchSubmit(this.state.searchTerm);
        }
    }

    runSearch() {
        this.props.onSearchSubmit(this.state.searchTerm);
    }
}

export default SearchBarComponent;