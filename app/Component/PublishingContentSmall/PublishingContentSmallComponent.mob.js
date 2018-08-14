import React from 'react';
import {Text, View, Image} from 'react-native';
import PropTypes from 'prop-types';

import {logo_socials, post_status } from '../../Helpers'

import style from './Style/PublishingContentSmallComponentStyle';
import moment from "moment/moment";


class PublishingContentSmallComponent extends React.Component {

    static propTypes = {
        post: PropTypes.shape({}).isRequired,
        showChannel: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            post: props.post,
            showChannel: props.showChannel
        }
    }

    render() {
        return <View style={[style.fullHeight, style.innerContentWrapper]}>
            {this._renderChannel()}
            {this._renderPublishingDate()}
            <View style={[style.horizontal, style.postContentWrapper]}>
                {this._renderThumbnail()}
                {this._renderTextContent()}
            </View>
        </View>
    }

    _renderPublishingDate(){

        if(!this.state.post.published_date){ return null }

        return <View style={[style.horizontal, style.channelContainer]}>
            <View style={style.channelContent}>
                <Text style={style.publishingDate}>{moment(this.state.post.published_date).format('DD MMM YYYY HH:mm')}</Text>
            </View>
        </View>
    }


    _renderChannel() {
        if (!this.state.showChannel) {
            return null;
        }

        const { channel } = this.state.post
        const icon = logo_socials[channel.type]

        return <View style={[style.horizontal, style.channelContainer]}>
            <View style={style.channelContent}>
                <Image source={icon} resizeMode={Image.resizeMode.contain} style={[style.channelIcon]}/>
                <Text style={style.channelName}>{channel.name}</Text>
            </View>
        </View>

    }

    _renderThumbnail() {
        const { media } = this.state.post;

        if (!media || media.length === 0) {
            return null;
        }

        return <View style={style.thumbnailWrapper}>
            <Image source={{ uri: media[0].thumbnail }} style={style.thumbnail} resizeMode={Image.resizeMode.cover}/>
        </View>
    }

    _renderTextContent() {
        return <View style={style.textContentWrapper}>
            <Text numberOfLines={3} style={style.textContent}>{this.state.post.message}</Text>
        </View>
    }
}

PublishingContentSmallComponent.defaultProps = {
    showChannel: true
};

export default PublishingContentSmallComponent;