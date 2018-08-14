import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, TouchableWithoutFeedback, Text, ImageBackground, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Style from './Style/PostMediaComponentStyle';
import colors from '../../Styles/Colors'
import {getThumbnailUrl} from "../../Helpers";

export default class PostMediaComponent extends React.Component {
    static propTypes = {
        media: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            thumbnail: PropTypes.string,
        }))
    };

    render() {
        const { media } = this.props;

        if (!media || media.length <= 1) {
            return null;
        }

        return <View style={Style.listWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {this.renderMediaList()}
            </ScrollView>
            {this.renderTextInfo()}
        </View>
    }

    renderMediaList() {
        const { media } = this.props;
        return media.map((element, index) => {
            if (index === 0) {
                return null;
            }

            const playIcon = (element.type !== 'video') ? null : <Icon name="play-arrow" size={30} color={colors.white} style={Style.playIcon}/>;

            return <TouchableWithoutFeedback key={element.id}>
                <ImageBackground resizeMode={Image.resizeMode.cover} style={Style.image} source={{ uri: getThumbnailUrl(element) }} >
                    {playIcon}
                </ImageBackground>
            </TouchableWithoutFeedback>
        });
    }

    renderTextInfo() {
        const { media } = this.props;

        if (media.length <= 1) {
            return null;
        }

        const videoMedia = media.filter(element => element.type === 'video');

        const totalVideo = videoMedia.length;
        const totalImages = media.length - totalVideo;

        return <Text style={Style.textInfo}>
            {totalVideo} video, {totalImages} images
        </Text>;
    }
}
