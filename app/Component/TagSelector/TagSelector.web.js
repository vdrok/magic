import React from 'react';
import PropTypes from 'prop-types';

import {  Dropdown } from 'semantic-ui-react'

class TagSelector extends React.Component {

    static propTypes = {
        tags: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            tags: !props.tags ? [] :props.tags.map(function(item){
                return {
                    value: item,
                    text: item,
                    key: item
                }
            })

        };
        this.onchangeValue = this.onchangeValue.bind(this);
    }


    render() {
        return <Dropdown placeholder='Video Tags' fluid selection multiple allowAdditions search
                         icon={null}
                         noResultsMessage='Type new tag name to add'
                         value={this.state.tags.map(function(item){
                             return item.value
                         })}
                         options={this.state.tags}
                         onChange={this.onchangeValue}
        />
    }

    onchangeValue(e,state){
        this.state.tags = state.value.filter(item => typeof item !== 'undefined').map(function(item){ return {
            value: item,
            text: item,
            key: item
        }});
        this.forceUpdate();
        this.props.onChange(this.state.tags.map(function(item){ return item.value }));
    }

    onChange(event, data) {
        this.props.onChange(this.state.tags.map(function(item){ return item.value }));
    }
}

export default TagSelector;