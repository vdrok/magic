import React from 'react';
import PropTypes from 'prop-types';

import {View, ImageBackground, TouchableWithoutFeedback, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Style from './Style/ComposerMediaElementStyle';
import {getThumbnailUrl} from "../../Helpers";


export default class ComposerMediaElementComponent extends React.Component{
    static propTypes = {
        media: PropTypes.object.isRequired,
        onClick: PropTypes.func
    };

    render() {
        const {thumbnail, name} = this.props.media;
        const onClick = this.props.onClick || (() => {});
        const videoIcon = this.props.media.type !== 'video' ? null : <Icon name="play-arrow" size={30} color={'#fff'} style={Style.iconPlay}/>;
        return <View style={Style.element}>
                <TouchableWithoutFeedback onPressIn={() => onClick(this.props.media)}>
                    <View style={Style.closeWrapper}>
                        <Text style={Style.closeText}>X</Text>
                    </View>
                </TouchableWithoutFeedback>

                <View style={[Style.wrapper]}>
                    <ImageBackground source={{uri: getThumbnailUrl(this.props.media)}}
                                     style={Style.image}
                                     resizeMode={Image.resizeMode.cover}>
                        {videoIcon}
                    </ImageBackground>
                    <Text numberOfLines={2}>{name}</Text>
                </View>
             </View>
    }
}