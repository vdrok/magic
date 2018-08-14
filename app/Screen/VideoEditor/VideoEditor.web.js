import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Item, Button, Modal, Form, Grid, Input } from 'semantic-ui-react';
import 'videojs-contrib-hls';
import APIMediaFile from '../../API/ApiMediaFiles';
import './Style/VideoEditorStyle.scss';
import 'video.js/dist/video-js.min.css';
import 'rc-slider/assets/index.css';
import 'videojs-abloop'
import { getVttUrl } from '../../Helpers';
import '../../Lib/videojsButtons';
import '../../Component/SportsRadar/SportsRadar.web';

import VideoRangeTrimmer from "../../Component/VideoEditor/VideoRangeTrimmer/VideoRangeTrimmer.web";
import BackButtonComponent from '../../Component/BackButton/BackButtonComponent.web';
import SportsRadar from "../../Component/SportsRadar/SportsRadar.web";

class VideoEditor extends React.Component {

    static propTypes = {
        location: PropTypes.shape({
            state: PropTypes.shape({
                media: PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    name: PropTypes.string.isRequired,
                }).isRequired
            })
        }),
        history: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.videoNode = null;
        this.videoPlayer = null;
        this.state = {
            loading: true,
            ended: false,
            duration: 0,
            currentTimeMs: 0,
            starttime: 0,
            endtime: 0,
            showModal: false,
            name: props.location.state.media.name,
            saving: false,
            vttURL: null // URL with list of thumbnails for the video
        };

        this.seek = this.seek.bind(this);
        this.setCurrentAsStart = this.setCurrentAsStart.bind(this);
        this.setCurrentAsEnd = this.setCurrentAsEnd.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this.preSelect = this.preSelect.bind(this);
    }

    componentDidMount() {
        this.initPlayer();
        document.addEventListener("keydown", this._handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown);
    }

    _handleKeyDown(e){
        e.preventDefault();
        if ( e.code === "Space" && this.videoPlayer) {

            if ( this.videoPlayer.paused() === true ) {
                this.videoPlayer.play();
            } else {
                this.videoPlayer.pause();
            }
            return;
        }

        if( e.code === "ArrowRight" && this.videoPlayer){
            this.seek(2);
            return;
        }

        if( e.code === "ArrowLeft" && this.videoPlayer){
            this.seek(- 2);
            return;
        }
    }

    showModal() {
        if (this.state.endtime - this.state.starttime > 600) {
            alert('The new video cannot be longer than 10 minutes');
            return;
        }

        this.setState({
            showModal: true,
        })
        document.removeEventListener("keydown", this._handleKeyDown);
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
                abLoopPlugin: {
                    createButtons: false
                },
                buttons: {
                        steps: [
                            { text: 'Set Start', callback: () => this.setCurrentAsStart() },
                            { text: '<<<', callback: () => this.seek(-2) },
                            { text: '<<', callback: () => this.seek(-0.1) },
                            { text: '<', callback: () => this.seek(-0.02) },
                            { text: '>', callback: () => this.seek(0.02) },
                            { text: '>>', callback: () => this.seek(0.1) },
                            { text: '>>>', callback: () => this.seek(2) },
                            { text: 'Set End', callback: () => this.setCurrentAsEnd() },
                        ]
                }
            }
        };

        this.videoPlayer = videojs(this.videoNode, videoJsOptions);
        this.initPlayerListeners();

        APIMediaFile.getFileUrl(this.props.location.state.media.id)
            .then(r => {
                if (r.status === 200) {
                    this.loadVideo(r.data);
                }
            })
            .catch(e => {
                alert(e && e.message);
            });
    }

    setCurrentAsStart(){
        this.videoPlayer.abLoopPlugin.setStart(this.videoPlayer.currentTime());
        this.setState({
            starttime: this.videoPlayer.currentTime(),
        });

    }

    setCurrentAsEnd(){
        this.videoPlayer.abLoopPlugin.setEnd(this.videoPlayer.currentTime());
        this.setState({
            endtime: this.videoPlayer.currentTime(),
        });
    }

    seek(change){
        const time = this.videoPlayer.currentTime() + change;
        if(time < 0 || time > this.duration) return;

        this.videoPlayer.pause();

        if(time > this.state.endtime){
            this.videoPlayer.abLoopPlugin.setEnd(time);
            this.setState({
                endtime: time,
            });
        }
        if(time < this.state.starttime){
            this.videoPlayer.abLoopPlugin.setEnd(time);
            this.setState({
                starttime: time,
            });
        }
        this.videoPlayer.currentTime(time);
    }

    initPlayerListeners() {
        this.videoPlayer.on('loadedmetadata', (data, data2) => {
            this.setState({
                loading: false,
                endtime: this.videoPlayer.duration(),
                duration: parseInt(this.videoPlayer.duration() * 1000) > 0? parseInt(this.videoPlayer.duration() * 1000) : 0 //TODO FIX FOR LIVESTREAM
            });
        });

        this.videoPlayer.on('ready', () => {
            this.videoPlayer.abLoopPlugin.setStart(0).setEnd(this.state.endtime).playLoop();
        });

        this.videoPlayer.on('timeupdate', (t) => {
            if (this.videoPlayer.currentTime() > this.state.endtime ) {
                this.videoPlayer.currentTime( this.state.starttime );
            }
            this.state.currentTimeMs = parseInt(this.videoPlayer.currentTime() * 1000);

            //livestream case, When it's live current time can be longer then last known duration
            if(this.videoPlayer.currentTime() *1000 > this.state.duration){

                this.videoPlayer.abLoopPlugin.disable(); // allow to watch livestream in the editor
                this.state.endtime = this.videoPlayer.currentTime();
                this.state.duration = this.videoPlayer.currentTime() * 1000;
                this.videoPlayer.duration(this.videoPlayer.currentTime());
            }

            this.forceUpdate();
        });
    }

    loadVideo(streamURL) {
        this.videoPlayer.src({
            src: streamURL,
            type: 'application/x-mpegURL'
        });

        this.state.vttURL = getVttUrl(streamURL);


    }

    preSelect(time){
        this.videoPlayer.currentTime( time );
        this.state.currentTime = parseInt(time / 1000);
        this.state.currentTimeMs = parseInt(time);
        //preselect - 30s + 30s
        this.onRangeChange(time - 30000,time,time + 30000);
        this.forceUpdate();
        window.scrollTo(0, 0);
    }

    onRangeChange(min, current, max){
        this.setState({
            starttime: min / 1000,
            endtime: max / 1000
        });

        this.videoPlayer.abLoopPlugin.setStart(min / 1000 ).setEnd(max / 1000).enable();

        if(this.state.currentTimeMs < min){
            return this.videoPlayer.currentTime( min / 1000 );
        }
        if(this.state.currentTimeMs > max){
            return this.videoPlayer.currentTime( max / 1000  );
        }

        return this.videoPlayer.currentTime( current / 1000  );
    }

    render() {
        const { loading, duration, currentTimeMs, starttime, endtime  } = this.state;
        return <Grid className="page-video-editor" stackable>
                <Grid.Row>
                <Grid.Column width={16}>
                    <BackButtonComponent onClickCallback={() => {this.props.history.push('/media')}}/>
                </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16} className="video-editor">
                        {loading && <Loader active inline="centered" />}
                        <div className={!loading ? null : 'is-loading'}>
                            <div data-vjs-player className="video-player">
                                <video
                                    ref={node => {
                                        this.videoNode = node;
                                    }}
                                    className="video-js vjs-default-skin"
                                    data-setup='{ "inactivityTimeout": 0 }'
                                />
                            </div>
                            <Item>
                                <VideoRangeTrimmer currentTime={currentTimeMs} startTime={starttime} endTime={endtime} length={duration} onRangeChange={this.onRangeChange.bind(this)} vttURL={this.state.vttURL} />
                            </Item>

                            <Item>
                                <Button  floated='right' content='Save as new' loading={false} className="btn" icon='plus' labelPosition='left' onClick={this.showModal.bind(this)} />


                            </Item>

                            <Item className='sport-data-wrapper'>
                                {this.props.location.state.media.type === 'live' &&
                                    <SportsRadar media={this.props.location.state.media}
                                             goTo={this.preSelect}/>
                                }
                            </Item>
                        </div>
                        {this.renderModal()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
    }

    renderModal(){
        return <Modal open={this.state.showModal} closeIcon onClose={() => {
            this.setState({showModal: false});
            document.addEventListener("keydown", this._handleKeyDown);
        }}>

            <Modal.Header>
                How to name the new file?
            </Modal.Header>
            <Modal.Content>
                <Form loading={this.state.saving} >
                    <Form.Field required>
                        <label>New video name</label>
                        <Input ref="videoEditorNewName" name="name" required placeholder={this.props.location.state.media.name} value={this.state.name} onChange={(v) => this.setState({name: v.target.value}) }  />
                    </Form.Field>
                </Form>

            </Modal.Content>
            <Modal.Actions>
                <Form.Button disabled={this.state.saving}  onClick={() => this.handleSave()}>
                    Create new video
                </Form.Button>
            </Modal.Actions>

        </Modal>
    }

    handleSave() {

        this.setState({
            saving: true
        })

        APIMediaFile.createVideo(
            this.props.location.state.media.id,
            this.state.starttime * 1000, //ms
            this.state.endtime * 1000, //ms
            this.state.name).then(
                (success) => this.props.history.push('/media'),
                (error) => this.setState({saving: false, error: "Error while saving. Please try again or contact tech support"}))
    }
}

export default VideoEditor;
