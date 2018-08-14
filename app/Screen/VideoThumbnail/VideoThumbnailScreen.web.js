import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Item, Button, Grid } from 'semantic-ui-react';
import 'videojs-contrib-hls';
import 'videojs-framebyframe';

import APIMediaFile from '../../API/ApiMediaFiles';
import BackButtonComponent from '../../Component/BackButton/BackButtonComponent.web';
import 'video.js/dist/video-js.min.css';
import './Style/VideoThumbnailScreenStyle.scss';

class VideoThumbnailScreen extends React.Component {
    static propTypes = {
        location: PropTypes.shape({
            state: PropTypes.shape({
                media: PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    name: PropTypes.string.isRequired
                }).isRequired
            })
        }),
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        const { media } = this.props.location.state;

        this.videoNode = null;
        this.videoPlayer = null;
        this.state = {
            media: media,
            loading: true,
            saving: false,
            error: '',
            starttime: 0,
            endtime: 0,
            currentTimeMs: 0
        };

        this.handleBack = this.handleBack.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        this.initPlayer();
    }

    initPlayer() {
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            fluid: true,
            preload: 'auto',
            hls: {
                withCredentials: false
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
            },
            plugins: {
                framebyframe: {
                    fps: 23.98,
                    steps: [
                        { text: '-10', step: -10 },
                        { text: '-5', step: -5 },
                        { text: '-1', step: -1 },
                        { text: '+1', step: 1 },
                        { text: '+5', step: 5 },
                        { text: '+10', step: 10 }
                    ]
                }
            }
        };

        this.videoPlayer = videojs(this.videoNode, videoJsOptions);
        this.initPlayerListeners();

        APIMediaFile.getFileUrl(this.state.media.id)
            .then(success => {
                if (success.status === 200) {
                    this.loadVideo(success.data);
                }
            })
            .catch(error => {
                alert(error && error.message);
            });
    }

    initPlayerListeners() {
        this.videoPlayer.on('loadedmetadata', () => {
            this.setState({
                loading: false,
                endtime: this.videoPlayer.duration()
            });
        });

        this.videoPlayer.on('timeupdate', t => {
            if (this.videoPlayer.currentTime() > this.state.endtime) {
                this.videoPlayer.currentTime(this.state.endtime);
            }
            if (this.videoPlayer.currentTime() < this.state.starttime) {
                this.videoPlayer.currentTime(this.state.starttime);
            }
            this.setState({
                currentTimeMs: parseInt(this.videoPlayer.currentTime() * 1000)
            });
        });
    }

    loadVideo(streamURL) {
        this.videoPlayer.src({
            src: streamURL,
            type: 'application/x-mpegURL'
        });
    }

    handleBack() {
        this.props.history.push('/media-preview', {
            media: this.state.media
        });
    }

    handleSave() {
        this.setState({
            saving: true
        });

        const data = {
            time_ms: this.state.currentTimeMs
        };

        APIMediaFile.createVideoThumbnail(this.state.media.id, data)
            .then(success => {
                this.setState({
                    saving: false
                });
                this.props.history.push('/media');
            })
            .catch(error => {
                this.setState({
                    saving: false,
                    error:
                        error.response.status < 500
                            ? error.response.data.message
                            : 'Error while saving. Please try again or contact tech support'
                });
            });
    }

    render() {
        return (
            <Grid className="page-video-thumbnail" stackable>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <BackButtonComponent onClickCallback={this.handleBack} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16} className="video-thumbnail">
                        {this.state.loading && <Loader active inline="centered" />}
                        <div className={!this.state.loading ? null : 'is-loading'}>
                            <div data-vjs-player className="video-player">
                                <video
                                    ref={node => {
                                        this.videoNode = node;
                                    }}
                                    className="video-js vjs-default-skin"
                                />
                            </div>
                            <Item>
                                <Button
                                    className="btn btn-save"
                                    floated="right"
                                    content="Select"
                                    loading={this.state.saving}
                                    onClick={this.handleSave}
                                />
                                {this.state.error && <p className="error">{this.state.error}</p>}
                            </Item>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default VideoThumbnailScreen;
