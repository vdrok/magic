import React from 'react';
import PropTypes from 'prop-types';
import {   ActivityIndicator,  View } from 'react-native';
import Style from './Style/VideoPlayerStyle'
import VideoPlayerNative  from 'react-native-video-controls';
import Colors from '../../Styles/Colors';
import API from '../../API/ApiMediaFiles'
/**
 * This component implement the default style for the text
 */
export default class VideoPlayer extends React.Component {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.number,
            PropTypes.shape({}),
        ]),
        media: PropTypes.shape({
            id: PropTypes.number.isRequired,
            thumbnail: PropTypes.string.isRequired,
        }).isRequired,
        onClose: PropTypes.func.isRequired,
}

    constructor(){
        super()
        this.player = null;
        this.state = {
            source: null,
        }
    }

    componentDidMount(){
        API.getFileUrl(this.props.media.id).then((r) => {
                if (r.status === 200) {
                    this.setState({source: r.data})
                }
            }
        );
    }

    render() {
        const { style } = this.props;
        const { source } = this.state;

        if(!source) return <ActivityIndicator size='large' color={Colors.green} style={Style.loader}/>;


        return <View style={{backgroundColor: '#f0f000', flex: 1,}}><VideoPlayerNative
            ref={(ref) => {
                this.player = ref
            }}
            muted={false}
            rate={1.0}
            disableFullscreen={true}
            seekColor={ Colors.green }
            onBack={ () => this.props.onClose() }
            progressUpdateInterval={500.0}
            source={{uri: source}}
            paused={this.state.paused}
            resizeMode='contain'
            style={[Style.player, style]}
        /></View>;
    }
}