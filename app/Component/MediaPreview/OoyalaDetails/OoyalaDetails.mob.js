import React from 'react';
import { Image,  Modal, TouchableWithoutFeedback, View} from 'react-native';
import {connect} from "react-redux";
import {folder_icons} from "../../../Helpers";
import PropTypes from 'prop-types';
import { OOYALA_STATUES, MEDIA_CHANNEL_TYPES } from '../../../Helpers/index'
import ApiMediaFiles from '../../../API/ApiMediaFiles'
import {Creators as MediaFileActions} from "../../../Reducer/MediaFilesReducer";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input, Form, Header, Content, Card, CardItem, Body, Text, Button, Spinner, Item, Label } from 'native-base';
import Style from "./Style/OoyalaDetails";

class OoyalaDetails extends React.Component {

    static propTypes = {
        mediaId: PropTypes.number.isRequired,
        ooyala: PropTypes.arrayOf(PropTypes.shape({
            channel_id: PropTypes.number.isRequired,
            channel_name: PropTypes.string.isRequired,
            embed_code: PropTypes.string,
            player_id: PropTypes.string,
            metadata: PropTypes.oneOfType(
                PropTypes.object,
                PropTypes.array,
            ),
            status: PropTypes.number.isRequired
        })).isRequired,
    };

    constructor(props){
        super();
        this.state = {
            ooyala: props.ooyala,
            ooyalaChannels: props.ooyalaChannels,
            status: [],
        }
    }

    _renderOoyalaCard(channel){
        return (<View key={channel.id}>

                <Card>
                    <CardItem header style={Style.headerWrapper}>
                        <Image style={Style.buttonIcon} source={folder_icons.ooyala}/>
                        <Text style={Style.channelName}>{channel.name}</Text>
                        {this.isUploadedToOoyala(channel) && this._renderStatus(this.getOoyalaData(channel))}
                    </CardItem>
                    <CardItem>
                        <Body>
                        {!this.isUploadedToOoyala(channel) && this._renderUploadButton(channel)}
                        {this.isUploadedToOoyala(channel) && this._renderOoyalaData(this.getOoyalaData(channel))}
                        </Body>
                    </CardItem>
                </Card>
            </View>
        );
    }

    componentDidMount(){
        this.checkStatus()
    }

    render() {
        return this.state.ooyalaChannels.map(channel => this._renderOoyalaCard(channel));
    }

    _renderMetadata(ooyala){
        const { metadata } = ooyala;
        if(!metadata ||  metadata.length === 0) return;

        return <View>
            <Text style={Style.metadataLabel}>Metadata</Text>
            {Object.keys(metadata).map( (key) =>
                <Item floatingLabel underline={false} key={ooyala.channel_id + key}>
                    <Label>{key}</Label>
                    <Input selectTextOnFocus={true} placeholder={metadata[key]} value={metadata[key]}/>
                </Item>
            )}
        </View>;
    }

    _renderOoyalaData(ooyala){
        const loading = ooyala.status < OOYALA_STATUES.READY;
        if(loading){
            return <View style={Style.center}><Spinner /></View>
        }
        return <View style={Style.center}>
            <Form underline={false}>
            <Item  underline={false} floatingLabel >
                <Label>Embed code</Label>
                <Input  underline={false} selectTextOnFocus={true} placeholder='Embed code' value={ooyala.embed_code}/>
            </Item>

            <Item floatingLabel>
                <Label>Player ID</Label>
                <Input underline={false} selectTextOnFocus={true} placeholder='Player ID' value={ooyala.player_id}/>
            </Item>

            {this._renderMetadata(ooyala)}
            </Form>
        </View>;
    }

    _renderStatus(ooyala){
        const { status } = ooyala;

        if(OOYALA_STATUES.READY === status) return <Text style={Style.status}><Icon name="check" style={[Style.statusIconReady]} /></Text>;
        if(OOYALA_STATUES.INITIALIZED <= status) return <Text style={Style.status}>processing</Text>;

        return null;
    }

    _renderUploadButton(ooyala){
        return <View style={Style.center}>
            <Button full light disabled={this.state.status[ooyala.id] && this.state.status[ooyala.id].uploadClicked} onPress={() => this.uploadToOoyala(ooyala.id)}>
                <Text>Send to {ooyala.name}</Text>
            </Button>
            {this._renderErrorMessage(ooyala)}
        </View>
    }

    _renderErrorMessage(ooyala){
        if(this.state.status[ooyala.id] && this.state.status[ooyala.id].error)
            return <Text style={Style.error}>{this.state.status[ooyala.id].error}</Text>

        return null;
    }

    /**
     * Check if we have the media data available for that channel
     * @param channel
     * @returns {boolean}
     */
    isUploadedToOoyala(channel){
        return this.state.ooyala.filter(o => o.channel_id === channel.id).length === 1;
    }

    isAnyStillProcessing(){
        if(!this.state.ooyala) return false;
        return this.state.ooyala.filter(o => o.status !== OOYALA_STATUES.READY).length === 1;
    }

    /**
     * Gets ooyala data per channel
     * @param channel
     * @returns {boolean}
     */
    getOoyalaData(channel){
        return this.state.ooyala.filter(o => o.channel_id === channel.id)[0];
    }

    updateOoyalaState(ooyalaData){
        this.setState({
            ooyala: ooyalaData
        });
    }

    uploadToOoyala(channelId){
        const that = this;
        this.state.status[channelId] = [];
        this.state.status[channelId].uploadClicked = true;
        this.forceUpdate();
         ApiMediaFiles.copyToChannel(this.props.mediaId,channelId).then(
            (r) => {
                if(r.data.ooyala) that.updateOoyalaState(r.data.ooyala);
                that.props.updateMediaFile(r.data);
                setTimeout(() => that.checkStatus(), 30000);
            },
            (error) => {
                that.state.status[channelId].uploadClicked = false;
                that.state.status[channelId].error = 'We found some problem. Please contact us to resolve the problem';
                that.forceUpdate();
            }
        )

    }

    checkStatus(){
        //in case of changing the view this can be the issue for asyc function
        if(this.isAnyStillProcessing()){
            const that = this;
            ApiMediaFiles.getMediaFile(this.props.mediaId).then(
                (r) => {
                    if(r.data.ooyala) that.updateOoyalaState(r.data.ooyala);
                    that.props.updateMediaFile(r.data);
                }
            )
            //check again in 30s if any still processing
            setTimeout(() => this.checkStatus(), 30000);
        }

    }
}

const mapDispatchToProps = dispatch => ({
    updateMediaFile: (mediaFile) => {
        return dispatch(MediaFileActions.updateMediaFile(mediaFile))
    }
});

const mapStateToProps = (state) => {
    return {
        ooyalaChannels: state.settings.mediaChannels.filter(c => c.type === MEDIA_CHANNEL_TYPES.OOYALA)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OoyalaDetails)
