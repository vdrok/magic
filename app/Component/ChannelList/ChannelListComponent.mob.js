import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import ChannelActions from '../../Reducer/ChannelReducer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './Style/ChannelListStyle';
import Colours from '../../Styles/Colors'

import WhiteBox from '../../Component/WhiteBox/WhiteBoxComponent.mob';
import ChannelIcon from '../../Component/ChannelIcon/ChannelIconComponent.mob';
import {CHANNEL_TYPES} from "../../Helpers";

class ChannelListComponent extends React.Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
    };

    constructor(){
        super();

        this.state = {
            channels: []
        }
    }

    componentDidMount(){
        this.props.getChannels();
    }

    componentWillReceiveProps({channels}){
        this.setState({
            channels: channels
        })
    }

    render() {
        return this.state.channels.map(channel => {
            if (channel.type === CHANNEL_TYPES.OTT) {
                return null;
            }
            const icon = (typeof channel.type == 'undefined') ? null : <ChannelIcon channel={channel.type} />

            return <WhiteBox key={channel.id} style={styles.channelBox}>
                <TouchableWithoutFeedback onPress={() => this.props.onClick(channel)}>
                    <View style={styles.innerContent}>
                        {icon}
                        <Text style={styles.channelName}>{channel.name}</Text>
                        <Icon name="keyboard-arrow-right" size={30} color={Colours.boxBorder} style={styles.channelArrow}/>
                    </View>
                </TouchableWithoutFeedback>
            </WhiteBox>;
        });
    }
}


const mapStateToProps = state => ({
    channels: state.channel.list
});

const mapDispatchToProps = dispatch => ({
    getChannels: () => dispatch(ChannelActions.getChannels())
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelListComponent);
