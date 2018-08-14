import React from 'react';
import PropTypes from 'prop-types';
import {Image, Text, View, TouchableWithoutFeedback, ActivityIndicator, ImageBackground} from 'react-native';
import { withNavigation } from 'react-navigation';
import colors from '../../Styles/Colors';
import Style from './Style/MediaElement'
import {getThumbnailUrl, msToLength, folder_icons} from '../../Helpers'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colours from '../../Styles/Colors'
import MediaFileHelper from '../../Helpers/MediaFile'
import ApiMediaFile from '../../API/ApiMediaFiles'
import {Creators as MediaFileActions} from "../../Reducer/MediaFilesReducer";
import {connect} from "react-redux";
import moment from 'moment';
import Countdown from 'react-countdown-now';

class MediaElementComponent extends React.Component {

    static propTypes = {
        media: PropTypes.shape({}).isRequired,
        isSelected: PropTypes.bool.isRequired,
        selectCallback: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            thumbnailLoaded: false,
            media: props.media,
        };
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

    renderVideoLength() {
        if (this.props.media.type === 'video') {
            return <Text style={Style.videoLength}>{msToLength(this.props.media.length)}</Text>
        }
    }

    renderMediaTypeIcon() {
        if (this.props.media.type === 'live') {
            return <Image style={Style.mediaTypeIcon} source={folder_icons.live}/>
        }
    }

    renderLiveCountdown() {
        if (this.props.media.type === 'live') {
            const endRenderer = ({ hours, minutes, seconds, completed }) => {
                if (completed) return null;
                const text = "finishes in\n" + hours + ":" + minutes + ":" + seconds;
                return <Text style={Style.liveCountdown}>{text}</Text>;
            };

            const startRenderer = ({ days, hours, minutes, seconds, completed }) => {
                if (completed) {
                    return <Countdown
                        renderer={endRenderer}
                        date={moment(this.state.media.end_time).toDate()}
                    />;
                } else {
                    const text = "starts in\n" + days + ":" + hours + ":" + minutes + ":" + seconds;
                    return <Text style={Style.liveCountdown}>{text}</Text>;
                }
            };

            return <Countdown
                renderer={startRenderer}
                date={moment(this.state.media.start_time).toDate()}
            />
        }
    }

    checkStatusUpdate(){
        const {type, status} = this.state.media;
        if(MediaFileHelper.isReady(type, status) || !this._mounted){
            return;
        }


        const that = this;
        const waitTime = this.state.media.type === 'image' ? 5000 : 15000;
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

    render() {
        const {type, status} = this.state.media;

        if(MediaFileHelper.isReady(type, status)){
            return this._renderThumbnail()
        }

        return this._renderProgressBar();
    }



    _renderProgressBar(){
        const { name,  id } = this.state.media;

        return <View style={[Style.flexElement, Style.element]}>
            <View style={Style.image} >
                <ActivityIndicator size='small' color={colors.green} style={[Style.loader, {flex: 0}]}/>
                <Text>Processing</Text>
            </View>
            <Text numberOfLines={1} ellipsizeMode='tail' style={Style.descriptionText}>{name}</Text>
        </View>
    }

    _renderThumbnail(){
        const { name } = this.state.media;
        const videoIcon = (this.state.media.type !== 'video') ? null : <Icon name="play-arrow" size={50} color={Colours.white} style={Style.iconPlay}/>

        const elementStyle = this.props.isSelected ? [Style.selectedElement,Style.flexElement, Style.element ] : [Style.flexElement, Style.element];
        const testStyle = this.props.isSelected ? [Style.descriptionText, Style.descriptionTextSelected ] : [Style.descriptionText];
        const imageStyle = this.props.isSelected ? [Style.image, Style.imageSelected] : Style.image;
        //to avoid red screen if thumbnail is not provided

        return <TouchableWithoutFeedback onPress={() => this.props.selectCallback(this.state.media)}>
            <View style={elementStyle}>
                <ImageBackground source={{uri: getThumbnailUrl(this.state.media)}} style={imageStyle} resizeMode={Image.resizeMode.cover}>
                    {videoIcon}
                    {this.renderLiveCountdown()}
                    {this.renderVideoLength()}
                    {this.renderMediaTypeIcon()}
                </ImageBackground>
                <Text numberOfLines={1} ellipsizeMode='tail' style={testStyle}>{name}</Text>
            </View>
        </TouchableWithoutFeedback>;
    }

}

const mapDispatchToProps = dispatch => ({
    updateMediaFile: (mediaFile) => {
        return dispatch(MediaFileActions.updateMediaFile(mediaFile))
    }
});

export default withNavigation(connect(null,mapDispatchToProps)(MediaElementComponent));