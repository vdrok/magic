import React from 'react';
import PropTypes from 'prop-types';
import { remove } from 'ramda';
import { Button, Image, Grid, Header, Icon, Progress } from 'semantic-ui-react'
import ChannelSelector from '../ChannelSelector/ChannelSelector.web'
import Sortable from 'sortablejs';

import ComposerMediaElementComponent from '../ComposerMediaElement/ComposerMediaElementComponent.web';
import PostComposerComponent from '../PostComposer/PostComposer.web';

import {CHANNEL_TYPES, social_options_icons} from '../../Helpers';
import './Style/ComposeSocial.scss';
import 'react-datetime/css/react-datetime.css';
import Datetime from 'react-datetime'
import moment from "moment/moment";
import FacebookManager from "../../Manager/BaseFacebook";
import {connect} from "react-redux";
import {Creators as PublishingActions} from "../../Reducer/PublishingContent";
import ComposeSocialCommon from "./ComposeSocial.common";
import twttr from "twitter-text";
import MediaSelection from '../../Screen/MediaSelection/MediaSelection.web'
import CampaignSelector from "../CampaignSelector/CampaignSelector.web";

class ComposeSocial extends React.Component {

    static propTypes = {
        history: PropTypes.shape({}).isRequired, //to allow redirection
        channel: PropTypes.shape({}).isRequired,
        campaign: PropTypes.object,
        post: PropTypes.shape({
            status: PropTypes.any
        }),
        channelType: PropTypes.oneOf([
            'facebook',
            FacebookManager.Types.PAGE,
            FacebookManager.Types.ACCOUNT,
            'twitter',
            'instagram',
            'instagram-business',
            'youtube',
        ]).isRequired,
        mediaFilesValidation: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            post: props.post,
            campaign: props.campaign,
            channel: props.channel,
            showTranslation: false,
        }

        if(!this.state.post) this.state.post = {
            published_date: moment(),
            message: '',
            translation: '',
            media: []
        };

        if(!this.state.post.media) this.state.post.media = [];
        if(!this.state.post.message) this.state.post.message = '';
        if(!this.state.post.translation) this.state.post.translation = '';
        if(!this.state.post.published_date) this.state.post.published_date = moment();


        this.updateValue = this.updateValue.bind(this);
        this.updateMedia = this.updateMedia.bind(this);
        this.common = new ComposeSocialCommon(this.state, props);
    }

    updateValue(property, value) {
        this.setState({
            post: {
                ...this.state.post,
                [property]: value
            }
        });
    }

    componentDidMount() {
        const el = document.getElementById('media-list');
        if (el) {
            Sortable.create(el, {
                onUpdate: this.onSort.bind(this)
            });
        }
    }

    onSort(event) {
        const { newIndex, oldIndex } = event;
        let mediaList = this.props.currentContent.mediaList;
        const movedItem = mediaList.find((item, index) => index === oldIndex);
        const remainingItems = mediaList.filter((item, index) => index !== oldIndex);

        const reorderedItems = [
            ...remainingItems.slice(0, newIndex),
            movedItem,
            ...remainingItems.slice(newIndex)
        ];

        this.props.onUpdate({mediaList: reorderedItems});
    }

    render() {
        return <PostComposerComponent
            onUpdate={this.updateValue}
            heading={this._heading()}
            channelName={this.state.channel.name}
            bottomComponent={this._bottom()}
            textContent={this.state.post.message}
            translationTextContent={this.state.post.translation}
            onShowTranslationChange={this.showingTranslation.bind(this)}
        />;
    }

    showingTranslation(value){
        this.setState({
            'showTranslation': value
        })
    }
    
    _heading() {
        return <Grid columns={3} stackable>
            <Grid.Row>
            <Grid.Column>
                    <Header as='h5' >channel</Header>
                    <ChannelSelector channelType={this.state.channel.type}
                                     selectedChannel={this.state.channel}
                                     allowCustomChannel={this.state.campaign != null}
                                     onChannelChange={(channel) => { this.setState({channel: channel});  }}
                    />
            </Grid.Column>
            <Grid.Column>
                    <Header as='h5'>publishing date</Header>
                    {this._renderPublishDateField()}
            </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                        <Header as='h5'>story</Header>
                        <CampaignSelector
                            selected={this.state.campaign}
                            onChange={(campaign) => { this.setState({campaign: campaign});  }}
                        />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    }

    _bottom() {
        return <div>
            { this._renderTwitterCounter() }
            {this._renderSelectedMedia()}
            <div className="post-social-buttons">
                <Button basic color='green' onClick={this.goToMedia.bind(this)}>
                    <Image src={social_options_icons.photo} size="mini" inline={true} spaced="right" alt="photo" style={{width: 20}}/>
                    Photo/Video
                </Button>
            </div>
            {this.renderMediaPopup()}
        </div>;
    }

    renderMediaPopup(){
        if(!this.state.showMedia) return null;

        return <MediaSelection
            selectedMedia={this.state.post.media}
            updateMedia={this.updateMedia}
            channel={this.state.channel}
        />;
    }

    _renderTwitterCounter(){
        const {message} = this.state.post;
        if(this.state.showTranslation || this.props.channelType !== CHANNEL_TYPES.TWITTER | !message) return;

        return <Progress value={twttr.parseTweet(message).weightedLength} total='280' error={!twttr.parseTweet(message).valid}  progress='ratio' >
            { !twttr.parseTweet(message).valid && 'Tweet is too long' }
        </Progress>
    }

    _renderSelectedMedia() {
        if (!this.state.post.media || !this.state.post.media.length === 0)
            return;

        return <div id="media-list" className="selected-media-list">
            {this._renderSelectedMediaElement()}
        </div>
    }

    _renderSelectedMediaElement() {
        if (!this.state.post.media)
            return;

        return this.state.post.media.map((media, index) => {
            return <ComposerMediaElementComponent media={media}
                                                  onClick={this.removeMediaElement.bind(this)}
                                                  key={media.id}/>
        })
    }

    _renderPublishDateField() {
        const value = this.state.post.published_date ? moment(this.state.post.published_date).format('DD MMM YYYY HH:mm') : moment().add(1, 'h').format('DD MMM YYYY HH:mm');
        
        return <Datetime value={value}
                         dateFormat='DD MMM YYYY'
                         timeFormat='HH:mm'
                         onChange={(v) =>  this.updateValue('published_date', v)}  inputProps={{'placeholder': value}} />;

    }

    removeMediaElement(media) {
        let currentMediaList = this.state.post.media;
        let indexToRemove = currentMediaList.indexOf(media);
        currentMediaList = remove(indexToRemove, 1, currentMediaList);

        this.state.post.media = currentMediaList;
        this.forceUpdate();
    }

    goToMedia(){
            this.setState({
                showMedia: true
            })
    }

    updateMedia(media){
        this.state.post.media = media;
        this.state.showMedia = false;
        this.forceUpdate();
    }

    getChannel(){
        return this.state.channel;
    }

    save(){
        this.common.loadStateAndProps(this.state, this.props);
        this.common.save();
    }
}


const mapDispatchToProps = dispatch => ({
    compose: ( channelId,  channelName, channelType, campaignId, publishingDate, message, media, translationTextContent) => dispatch(PublishingActions.compose(channelId,  channelName, channelType, campaignId, publishingDate, message, media,  translationTextContent)),
    updateCampaignPost: (id, channelId, channelName, channelType, campaignId, publishingDate,  message, media, translationTextContent) => dispatch(PublishingActions.updateCampaignPost(id, channelId, channelName, channelType, campaignId, publishingDate,  message, media, translationTextContent)),
});

export default connect(null, mapDispatchToProps, null ,{withRef: true})(ComposeSocial);