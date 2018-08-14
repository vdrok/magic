import React from 'react';
import {connect} from "react-redux";
import { Card, Form, Button } from 'semantic-ui-react'
import {folder_icons} from "../../../Helpers";
import PropTypes from 'prop-types';
import { OOYALA_STATUES, MEDIA_CHANNEL_TYPES } from '../../../Helpers/index'
import './Style/OoyalaDetails.scss'
import ApiMediaFiles from '../../../API/ApiMediaFiles'
import {Creators as MediaFileActions} from "../../../Reducer/MediaFilesReducer";

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
            status: []
        }
    }

    _renderOoyalaCard(channel){
        return (<div className='ooyala-details' key={channel.id}>

                <Card>
                    <Card.Content>
                        <Card.Header>
                            <img src={folder_icons.ooyala} alt="Ooyala" className='left floated'/>
                            <p>{channel.name}</p>
                            {this.isUploadedToOoyala(channel) && this._renderStatus(this.getOoyalaData(channel))}
                        </Card.Header>
                        <Card.Description>
                            {!this.isUploadedToOoyala(channel) && this._renderUploadButton(channel)}
                            {this.isUploadedToOoyala(channel) && this._renderOoyalaData(this.getOoyalaData(channel))}
                        </Card.Description>
                    </Card.Content>
                </Card>
            </div>
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

        return <div>
            <p>Metadata</p>
            {Object.keys(metadata).map( (key) => <Form.Input key={key} label={key} onFocus={ (e) => e.target.select() } readOnly value={metadata[key]}/>)}
        </div>;
    }

    _renderOoyalaData(ooyala){
        const loading = ooyala.status < OOYALA_STATUES.READY;
        
        return <Form size='mini' loading={loading} >
            <Form.Field>
                <Form.Input label='Embed code' onFocus={ (e) => e.target.select() } readOnly value={ooyala.embed_code ? ooyala.embed_code : ''}/>
                { ooyala.player_id && <Form.Input onFocus={ (e) => e.target.select() } label='Player id' readOnly value={ooyala.player_id}/> }
                {this._renderMetadata(ooyala)}
            </Form.Field>

        </Form>
    }

    _renderStatus(ooyala){
        const { status } = ooyala;

        if(OOYALA_STATUES.READY === status) return <i className="material-icons ready status">done</i>;
        if(OOYALA_STATUES.INITIALIZED <= status) return <span className="status in-progress">processing</span>;

        return null;
    }

    _renderUploadButton(ooyala){
        return <div>
            <Button className="" size='small' fluid loading={this.state.status[ooyala.id] && this.state.status[ooyala.id].uploadClicked} onClick={() => this.uploadToOoyala(ooyala.id)}>Send to {ooyala.name}</Button>
            {this._renderErrorMessage(ooyala)}
        </div>
    }

    _renderErrorMessage(ooyala){
        if(this.state.status[ooyala.id] && this.state.status[ooyala.id].error)
            return <p className='error'>{this.state.status[ooyala.id].error}</p>

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
        if(typeof this.isAnyStillProcessing === 'function' && this.isAnyStillProcessing()){
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
