import React from 'react';
import {Text, View, Image} from 'react-native';
import PropTypes from 'prop-types';

import {CHANNEL_TYPES, logo_socials, numberFormatWithSeparator} from '../../Helpers'

import style from './Style/AnalyticsChannelStyle';

class AnalyticsChannelComponent extends React.Component {

    static propTypes = {
        channel: PropTypes.shape({}).isRequired,
        displayAnalytics: PropTypes.shape({}).isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            channel: props.channel,
            displayAnalytics: {}
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            displayAnalytics: newProps.displayAnalytics,
            channel: newProps.channel
        })
    }

    render() {
        return <View style={style.channelWrapper}>
            {this._renderChannel()}
            {this._renderStats()}
        </View>
    }

    _renderChannel() {
        const {type, name} = this.state.channel
        const icon = logo_socials[type]
        const textStyle = type === CHANNEL_TYPES.FACEBOOK_ACCOUNT || type === CHANNEL_TYPES.FACEBOOK_PAGE ? style.textMargin : {}

        return <View style={[style.horizontal, style.channelContainer]}>
            <View style={style.channelContent}>
                <Image source={icon} resizeMode={Image.resizeMode.contain} style={style.channelIcon}/>
                <Text style={[style.channelName, textStyle]}>{name}</Text>
            </View>
        </View>
    }

    _renderStats() {
        const description = this.state.displayAnalytics.key ? this.state.displayAnalytics.description[this.state.channel.type] : ''
        const value = this.state.channel.contentAnalytics[this.state.displayAnalytics.key] ? this.state.channel.contentAnalytics[this.state.displayAnalytics.key] : 'n/a'

        return <View style={style.statsWrapper}>
            <Text style={style.statsValue}>{numberFormatWithSeparator(value)}</Text>
            <Text style={style.statsDescription}>{description}</Text>
        </View>
    }
}

export default AnalyticsChannelComponent;