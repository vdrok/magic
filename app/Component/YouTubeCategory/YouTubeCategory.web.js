import React from 'react';
import PropTypes from 'prop-types';

import {  Dropdown } from 'semantic-ui-react'
import ApiChannel from "../../API/ApiChannel";

class YouTubeCategory extends React.Component {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        channelId: PropTypes.number.isRequired,
        selected: PropTypes.string,
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            selected: props.selected,
            categories: [],
        };
        this.fechedChannelId = null;

        this.onValueChange = this.onValueChange.bind(this);
        this.fetchCategories(props.channelId);

    }

    componentWillReceiveProps({channelId}){
        if(this.fechedChannelId !== channelId){
            this.fetchCategories(channelId);
        }
    }

    fetchCategories(channelId){
        this.fechedChannelId = channelId;
        this.setState({
            'loading': true,
        })
        ApiChannel.getYouTubeCategories(channelId).then(
            response => {
                this.setState({
                    'loading': false,
                    'categories': response.data.map( function(data) {
                        return {
                            'key': data.id,
                            'text': data.title,
                            'value': data.id
                        }
                    })})
            })
    }


    render() {
        return <Dropdown placeholder='Select category' fluid selection
                         options={this.state.categories}
                         loading={this.state.loading}
                         value={this.state.selected}
                         onChange={this.onValueChange}/>
    }

    onValueChange(event, data) {
        this.state.selected = data.value;
        this.props.onChange(data.value);
    }
}

export default YouTubeCategory;