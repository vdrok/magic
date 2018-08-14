import React from 'react';
import PropTypes from 'prop-types';
import { remove } from 'ramda';
import {Button, Image, Item, Header, Icon, Input, TextArea, Grid} from 'semantic-ui-react';
import ChannelSelector from '../ChannelSelector/ChannelSelector.web'
import Sortable from 'sortablejs';

import ComposerMediaElementComponent from '../ComposerMediaElement/ComposerMediaElementComponent.web';

import {social_options_icons} from '../../Helpers';
import './Style/ComposeYouTube.scss';
import 'react-datetime/css/react-datetime.css';
import Datetime from 'react-datetime'
import moment from "moment/moment";
import {connect} from "react-redux";
import {Creators as PublishingActions} from "../../Reducer/PublishingContent";
import ComposeYouTubeCommon from "./ComposeYouTube.common";
import MediaSelection from '../../Screen/MediaSelection/MediaSelection.web'
import YouTubeCategory from "../YouTubeCategory/YouTubeCategory.web";
import TagSelector from "../TagSelector/TagSelector.web";
import CampaignSelector from "../CampaignSelector/CampaignSelector.web";

class ComposeYouTube extends React.Component {

    static propTypes = {
        history: PropTypes.shape({}).isRequired, //to allow redirection
        channel: PropTypes.shape({}).isRequired,
        campaign: PropTypes.object,
        post: PropTypes.shape({
            status: PropTypes.any
        }),
        mediaFilesValidation: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            post: props.post,
            channel: props.channel
        }

        if(!this.state.post) this.state.post = {
            published_date: moment(),
            message: '',
            title: '',
            media: []
        };

        if(!this.state.post.media) this.state.post.media = [];
        if(!this.state.post.tags) this.state.post.tags = [];

        this.updateValue = this.updateValue.bind(this);
        this.updateMedia = this.updateMedia.bind(this);
        this.common = new ComposeYouTubeCommon(this.state, props);
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
        return <div>
            {this._heading()}

            <Item.Group  className='form'>

                {this.state.channel.id > 0 &&
                <Item>
                    <Item.Content>
                        <YouTubeCategory onChange={(value) => { this.updateValue('category',value); }}
                                         channelId={this.state.channel.id}
                                         selected={this.state.post.category}
                        />
                    </Item.Content>
                </Item> }


                <Item>
                    <Item.Content>
                        <TagSelector onChange={(value) => this.updateValue('tags',value) } tags={this.state.post.tags} />
                    </Item.Content>
                </Item>

                <Item>
                    <Item.Content>
                        <Input placeholder='Video title' value={this.state.post.title} onChange={(c, v) => this.updateValue('title',v.value) } />
                    </Item.Content>
                </Item>

                <Item>
                    <Item.Content>
                        <TextArea autoHeight placeholder='Video description' value={this.state.post.message} onChange={(c, v) => this.updateValue('message',v.value) } />
                    </Item.Content>
                </Item>

            </Item.Group>


            {this._bottom()}
        </div>;
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
            {this._renderSelectedMedia()}
            <div className="post-social-buttons">
                <Button basic color='green' onClick={this.goToMedia.bind(this)}>
                    <Image src={social_options_icons.photo} size="mini" inline={true} spaced="right" alt="photo" style={{width: 20}}/>
                    Select a Video
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
            rules={{
                max: 1
            }}
        />;
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
                         dateFormat="DD MMM YYYY"
                         timeFormat="HH:mm"
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
    youtubeCompose: ( channelId,  channelName, channelType, campaignId, publishingDate, media, title, message,category,tags) => dispatch(PublishingActions.youtubeCompose(channelId,  channelName, channelType, campaignId, publishingDate, media, title, message,category,tags)),
    youtubeEdit: (id, channelId, channelName, channelType, campaignId, publishingDate, media, title, message,category,tags) => dispatch(PublishingActions.youtubeEdit(id, channelId, channelName, channelType, campaignId, publishingDate, media, title, message,category,tags)),
});

export default connect(null, mapDispatchToProps, null ,{withRef: true})(ComposeYouTube);