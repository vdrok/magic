import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react'

import './Style/VideoPlayerStyle.scss';

import API from '../../API/ApiMediaFiles'
import ReactJWPlayer from 'react-jw-player';

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

    }

    constructor(props){
        super(props)
        this.state = {
            loaded: false,
            url: null,
        }

        this.loadVideo = this.loadVideo.bind(this);
    }


    componentDidMount() {
        this.initPlayer();
    }

    componentWillUnmount(){
        if(this.player){
            this.player.reset();
            this.player = null;
        }
    }

    loadVideo(streamURL){
        this.setState({'url': streamURL});
    }

    initPlayer(){
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            fluid: true,
            preload: 'auto',
            poster: this.props.media.thumbnail,
            hls: {
                withCredentials: false,
            },
            flash: {
                hls: {
                    withCredentials: false
                }
            },
            html5: {
                hls: {
                    withCredentials: false
                }
            }
        }
        const that = this;
       // this.player = videojs(this.videoNode,videoJsOptions);

       // this.player.on('loadedmetadata', () => this.setState({'loaded': true}) )

        API.getFileUrl(this.props.media.id).then((r) => {
                if (r.status === 200) {
                    that.loadVideo(r.data);
                }
            }
        );
    }

    renderPlayer(){
        if(!this.state.url) return;

        const playlist = [{
            file: this.state.url
        }];

        return <ReactJWPlayer
            playerId='video-player'
            playerScript='https://content.jwplatform.com/libraries/pbDJ5pX4.js'
            isAutoPlay={true}
            playlist={playlist}
        />
    }

    render() {
        return <div className="video-player">
                    { !this.state.url && <Dimmer active={!this.state.loaded}><Loader /></Dimmer> }

                    {this.renderPlayer()}
                </div>

    }
}