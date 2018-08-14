import React from 'react';
import { remove } from 'ramda';
import { Dropdown } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import FacebookManager from "../../Manager/BaseFacebook";
import {connect} from "react-redux";
import ChannelActions from "../../Reducer/ChannelReducer";
import './Style/style.scss';

class ChannelSelector extends React.Component {

    static propTypes = {
        channelType: PropTypes.oneOf([
            FacebookManager.Types.PAGE,
            FacebookManager.Types.ACCOUNT,
            'twitter',
            'instagram',
            'youtube',
            'instagram-business']).isRequired,
        selectedChannel: PropTypes.shape({}),
        allowCustomChannel: PropTypes.bool.isRequired,
        onChannelChange: PropTypes.func.isRequired,
    };
    state = {
        channels: [],
        selected: null,
    }


    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.getChannels();
    }


    isCorrectChannelType(type){
        if(type === this.props.channelType) return true;

        if(type ===  FacebookManager.Types.PAGE && this.props.channelType === FacebookManager.Types.ACCOUNT) return true;
        if(type ===  FacebookManager.Types.ACCOUNT && this.props.channelType === FacebookManager.Types.PAGE) return true;

        if(type === "instagram" && this.props.channelType === "instagram-business") return true;
        if(type === "instagram-business" && this.props.channelType === "instagram") return true;

        return false;
    }

    componentWillReceiveProps({channels}){

        let stateChannels = this.state.channels;
        channels.forEach((c) => {
            if(this.isCorrectChannelType(c.type) ) {
                if(this.state.channels.filter(ch => c.id === ch.key).length === 1) return;

                stateChannels.push({
                    key: c.id,
                    text: c.name ,
                    value: c.id,
                    image: { avatar: true, src:  c.thumbnail },
                    type: c.type,
                    thumbnail: c.thumbnail,
                    channel_id: c.channel_id,
                });

                if(this.props.selectedChannel &&
                    c.id === this.props.selectedChannel.id){

                    this.state.selected = c.id;
                }
            }
        });


        //for custom channel if not already added
        if(this.props.selectedChannel &&
            this.props.selectedChannel.id === null &&
            this.state.channels.filter(ch => this.props.selectedChannel.name === ch.value).length === 0
        ){
            stateChannels.push({
                key: this.props.selectedChannel.name,
                text: this.props.selectedChannel.name ,
                value: this.props.selectedChannel.name,
            });
            this.state.selected = this.props.selectedChannel.name;
        }

        this.state.channels = stateChannels;
        this.forceUpdate();
    }



    render() {

        const { selected } = this.state;

        return <div className="channel-selector">
            <Dropdown
                options={this.state.channels}
                placeholder='Select channel'
                search
                selection
                allowAdditions={this.props.allowCustomChannel}
                value={selected}
                onAddItem={this.handleAddition.bind(this)}
                onChange={this.handleChange.bind(this)}
            />
        </div>

    }

    handleAddition = (e, { value }) => {
        this.setState({
            channels: [{ text: value, value }, ...this.state.channels],
        })
    }

    handleChange(e, { value }){
        this.setState({selected: value});
        const selectedChannel = this.state.channels.filter((e) => e.value === value)[0];

        //Added item
        if(!selectedChannel && value){
            this.props.onChannelChange({
                id: null,
                name: value,
                thumbnail: null,
                type: this.props.channelType,
                channel_id: null
            });
        }else{
            //we selected previously added channel
            if(!selectedChannel.key){
                this.props.onChannelChange({
                    id: selectedChannel.value,
                    name: selectedChannel.text,
                    thumbnail: null,
                    type: this.props.channelType,
                    channel_id: null
                });

                return;
            }
            this.props.onChannelChange({
                id: selectedChannel.value,
                name: selectedChannel.text,
                thumbnail: selectedChannel.thumbnail,
                type: selectedChannel.type,
                channel_id: selectedChannel.channel_id

            });
        }
    }
}

const mapStateToProps = state => ({
    channels: state.channel.list
});
const mapDispatchToProps = dispatch => ({
    getChannels: () => dispatch(ChannelActions.getChannels())
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelSelector);