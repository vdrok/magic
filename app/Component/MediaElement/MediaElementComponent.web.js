import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Style/MediaElement.scss'
import { Dimmer, Loader, Card, Icon} from 'semantic-ui-react'
import {getThumbnailUrl, msToLength, folder_icons} from '../../Helpers'
import MediaFileHelper from '../../Helpers/MediaFile'
import ApiMediaFile from '../../API/ApiMediaFiles'
import {Creators as MediaFileActions} from "../../Reducer/MediaFilesReducer";
import {connect} from "react-redux";
import Countdown from 'react-countdown-now';
import moment from 'moment';

class MediaElementComponent extends React.Component {

    static propTypes = {
        media: PropTypes.shape({}).isRequired,
        onSelectHandler: PropTypes.func.isRequired,
        selected: PropTypes.bool.isRequired
    };

    constructor(props){
        super(props);
        this.state = {
            thumbnailLoaded: false,
            media: props.media
        }
    }

    componentDidMount(){
        this._mounted = true;
        this.checkStatusUpdate();
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    _thumbnailLoaded(){
        this.setState({
            thumbnailLoaded: true,
        })
    }

    renderVideoLength(){
        if(this.state.media.type === 'video' && this.state.thumbnailLoaded){

            return <p className="video-length">{ msToLength(this.state.media.length)}</p>
        }
    }

    renderLivestream(){
        if(this.state.media.type === 'live'){

            return <div>
                    {this.renderLivestreamCounter() }
                    <img className="video-length" src={ folder_icons.live }/>
            </div>
        }
    }

    renderLivestreamCounter(){
        const endRenderer = ({ hours, minutes, seconds, completed }) => {
            if (completed) return null;

            return <span className="counter">finishes in<br />{hours}:{minutes}:{seconds}</span>;
        };


        const startRenderer = ({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
                return <Countdown
                    renderer={endRenderer}
                    date={moment(this.state.media.end_time).toDate()}
                />;
            } else {
                return <span className="counter">starts in<br />{days}:{hours}:{minutes}:{seconds}</span>;
            }
        };

        return <Countdown
            renderer={startRenderer}
            date={moment(this.state.media.start_time).toDate()}
        />
    }

    render() {
        const {type, status} = this.state.media;

        if(MediaFileHelper.isReady(type, status)){
            return this._renderThumbnail()
        }

        return this._renderProgressBar();

    }

    checkStatusUpdate(){
        const {type, status} = this.state.media;
        if(MediaFileHelper.isReady(type, status) || !this._mounted){
            return;
        }

        const that = this;
        const waitTime = 5000;
        setTimeout(() => {
            ApiMediaFile.getMediaFile(this.state.media.id).then(
                (res) => {
                    if(res.status === 200){
                        that.setState({media: res.data});
                        that.props.updateMediaFile(res.data);

                        that.checkStatusUpdate();
                    }
                }

            );
        },waitTime);
    }


    /** once we uploaded we check if the assets is ready */
    _renderProgressBar(){
        const { name,  id } = this.state.media;

        return <Card className="media-element"
                     key={id}>
            <div className="thumbnail-wrapper min-height">
                <Dimmer active><Loader /><p>Processing</p></Dimmer>
            </div>
            <Card.Content extra>
                {name}
            </Card.Content>
        </Card>
    }

    _renderThumbnail(){

        const { name,  id } = this.state.media;
        const loader = (this.state.thumbnailLoaded) ? null : <Dimmer active><Loader /></Dimmer>;
        const videoIcon = (this.state.media.type === 'video' && this.state.thumbnailLoaded) ?
            <Icon name="play" inverted={true} size='big' /> : null;
        const {selected} = this.props;
        const loadingStyle = {
            opacity: this.state.thumbnailLoaded ? 1 : 0
        };

        const className = selected ? "media-element selected" : "media-element";

        return <Card onClick={() => this.props.onSelectHandler(this.state.media)}
                     className={className}
                     key={id}>
            <div className="thumbnail-wrapper">
                {loader}
                <img src={getThumbnailUrl(this.state.media)} alt="Image" style={ loadingStyle } className="ui image" onLoad={this._thumbnailLoaded.bind(this)}/>
                {videoIcon}
                {this.renderVideoLength()}
                {this.renderLivestream()}
            </div>
            <Card.Content extra>
                {name}
            </Card.Content>
        </Card>
    }
}


const mapDispatchToProps = dispatch => ({
    updateMediaFile: (mediaFile) => {
        return dispatch(MediaFileActions.updateMediaFile(mediaFile))
    }
});


export default withRouter(connect(null,mapDispatchToProps)(MediaElementComponent));