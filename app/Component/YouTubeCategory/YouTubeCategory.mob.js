import React from 'react';
import PropTypes from 'prop-types';
import {Picker, Icon } from 'native-base';
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
                        }
                    })})
            })
    }

    render() {
        const {style} = this.props;
        return <Picker
            iosHeader="Category"
            placeholder="Select category"
            mode='dropdown'
            selectedValue={this.state.selected}
            style={style}
            textStyle={{ width: '100%', paddingLeft: 0, paddingRight: 0}}
            onValueChange={this.onValueChange}>
            {this.state.categories.map(client => <Picker.Item key={client.key} label={client.text} value={client.key}/>)}
        </Picker>;
    }

    onValueChange(selectedId) {
        this.state.selected = selectedId;
        this.props.onChange(selectedId);
    }
}

export default YouTubeCategory;