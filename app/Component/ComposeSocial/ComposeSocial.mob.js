import React from 'react';
import { remove } from 'ramda';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableWithoutFeedback, ScrollView, Dimensions, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { keyBy } from 'lodash';

import PostComposer from '../PostComposer/PostComposer.mob';
import SwipeMenu from '../SwipeMenu/SwipeMenu.mob';
import ComposerMediaElementComponent from '../ComposerMediaElement/ComposerMediaElementComponent.mob';
import SortableList from 'react-native-sortable-list';

import Style from './Style/ComposeSocialStyle';
import {CHANNEL_TYPES, social_options_icons, validatePostMedia} from '../../Helpers';
import ChannelSelector from "../ChannelSelector/ChannelSelector.mob";
import DateInput from "../PublishingContent/DateInput/DateInput.mob";
import {connect} from "react-redux";
import {Creators as PublishingActions} from "../../Reducer/PublishingContent";
import {NavigationActions} from "react-navigation";
import FacebookManager from "../../Manager/BaseFacebook";
import twttr from "twitter-text";
import ComposeSocialCommon from "./ComposeSocial.common";
import WhiteBox from "../WhiteBox/WhiteBoxComponent.mob";
import RowItem from "../Layout/RowItem/RowItem.mob";
import CampaignSelector from "../CampaignSelector/CampaignSelector.mob"


class ComposeSocial extends React.Component {
    static propTypes = {
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

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({'keyboardVisibile': true  }));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({'keyboardVisibile': false }));
    }

    componentWillUnmount () {
        if(this.keyboardDidShowListener){
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }

    constructor(props){
        super(props);
        this.state = {
            keyboardVisibile: false,
            post: props.post,
            campaign: props.campaign,
            channel: props.channel,
            showTranslation: false,
        }

        if(!this.state.post) this.state.post = {};
        if(!this.state.post.description) this.state.post.description = null;
        if(!this.state.post.published_date) this.state.post.published_date = moment();
        if(!this.state.post.message) this.state.post.message = '';
        if(!this.state.post.translation) this.state.post.translation = '';

        if(!this.state.post.media){
            this.state.post.media = [];
        }

        this.updateValue = this.updateValue.bind(this);
        this.common = new ComposeSocialCommon(this.state, props);
    }



    onDateChanged(date){
        this.state.post.published_date = date;
        this.forceUpdate();
    }

    render() {

        const { name } = this.state.channel;
        const { message, translation } = this.state.post;

        return <PostComposer
                heading={this._renderHeading()}
                channelName={name}
                bottomComponent={this._renderBottomMenu()}
                textContent={message}
                translationTextContent={translation}
                showTranslation={this.state.showTranslation}
                onChange={this.updateValue}
            />;
    }

    updateValue(property, value) {
        this.setState({
            post: {
                ...this.state.post,
                [property]: value
            }
        })
    }

    _renderHeading() {
        const { published_date } = this.state.post;

        return  <View style={[Style.row, Style.justifyCenter, Style.headingWrapper]}>
            <RowItem >
                <ChannelSelector channel={this.state.channel} onChange={value => this.setState({'channel': value})}
                                 type={this.props.channelType}
                                 allowCustomChannel={this.state.campaign != null}/>
            </RowItem>
            <RowItem hideTopBorder={true} style={{paddingVertical: 0}}>
                <DateInput publishing_date={published_date} onChange={this.onDateChanged.bind(this)}/>
            </RowItem>
            <RowItem hideTopBorder={true} style={{backgroundColor: '#00000000', flexDirection: 'row'}} >
                <WhiteBox style={{ paddingVertical: 5, marginRight: 10 }}>
                    <Text style={Style.buttonSmallText}>type</Text>
                    <Text style={Style.buttonSmallText}>Share update</Text>
                </WhiteBox>
                <WhiteBox style={{ paddingVertical: 5, position: 'relative' }}>
                    <Text style={[Style.buttonSmallText, Style.buttonSmallTextAbsolute]}>story</Text>
                    <CampaignSelector style={{ paddingTop: 10 }} selected={this.state.campaign} onChange={value => this.setState({'campaign': value})}   />
                </WhiteBox>
            </RowItem>

            { this.state.showTranslation && <Text style={Style.translation}>Editing translation</Text> }

        </View>

    }

    _renderTwitterCounter(){
        if(this.state.showTranslation || this.props.channelType !== CHANNEL_TYPES.TWITTER) return;
        const {message} = this.state.post;

        const isError = !twttr.parseTweet(message).valid;
        const count = twttr.parseTweet(message).weightedLength;

        return <View style={Style.counter}>
            <Text style={[Style.counterText, isError? Style.counterTextInvalid : null]}>{count} / 280</Text>
        </View>
    }

    _renderBottomMenu() {

        if(this.state.keyboardVisibile) {
            return <View >
                {this._renderTwitterCounter()}
            </View>;
        }

        return <View >
            {this._renderTwitterCounter()}
            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                {this._renderMediaList()}
            </View>
            <SwipeMenu closedText={"Click for more options"} ref="swipe">
                <View>
                    <TouchableWithoutFeedback onPress={this.toMedia.bind(this)}>
                        <View style={Style.optionWrapper}>
                            <Image source={social_options_icons.photo} style={Style.optionImage} resizeMode={Image.resizeMode.contain}/>
                            <Text style={Style.optionText}>Photo / Video</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this.switchLanguage.bind(this)}>
                        <View style={Style.optionWrapper}>
                            <Icon name="translate" size={25} style={Style.optionImage}/>
                            <Text style={Style.optionText}>Show {this.state.showTranslation ? 'original' : 'translation'} text</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </SwipeMenu>
        </View>
    }

    toMedia() {
        this.props.navigate('MediaSelection', {
            channel: this.state.channel,
            post: this.state.post,
            campaign: this.props.campaign,
            rules: {
                max: 10
            }
        });
        this.refs.swipe.swipeDown();
    }

    switchLanguage() {
        this.refs.swipe.swipeDown();
        this.setState({
            showTranslation: !this.state.showTranslation
        });
    }

    _renderMediaList() {
        if (!this.state.post.media)
            return;

        const mediaListKeyed = this.getMediaKeyed();

        return <SortableList
            style={{
                marginVertical: 10,
                height: 140,
                width: Dimensions.get('window').width,
            }}
            horizontal
            onChangeOrder={this.reorderCallback.bind(this)}
            data={mediaListKeyed}
            renderRow={({data, active}) => <ComposerMediaElementComponent key={data.id} media={data} onClick={this.removeMediaElement.bind(this)} />}
        />;
    }

    reorderCallback(newOrder) {
        const keyedList = this.getMediaKeyed();
        const orderedList = newOrder.map((id) => {
            return keyedList[id];
        });

        this.state.post.media = orderedList;
        this.forceUpdate();
    }

    getMediaKeyed() {
        const mediaList = this.state.post.media;
        return keyBy(mediaList, 'id');
    }

    removeMediaElement(media) {
        let currentMediaList = this.state.post.media;
        let indexToRemove = currentMediaList.indexOf(media);
        currentMediaList = remove(indexToRemove, 1, currentMediaList);

        this.state.post.media = currentMediaList;
        this.forceUpdate();
    }

    redirectToChannel(){
        if(this.state.channel.id > 0){
            this.props.navigate('ChannelStorylineScreen', {
                channel: this.state.channel
            });
            return true;
        }

        return false;
    }

    validate(){
        this.common.loadStateAndProps(this.state, this.props);
        return this.common.validate();
    }

    save(){
        const channelId = this.state.channel.id;
        const channelType = this.state.channel.type;
        const channelName = this.state.channel.name;
        const campaignId = this.state.campaign ? this.state.campaign.id : 0;
        let { message, published_date, media, id, translation } = this.state.post;
        if(!published_date){
            published_date = moment();
        }
        if (!this.validate() ) {
            alert(this.state.errorMessage);
            return;
        }

        if(id){
            return this.props.updateCampaignPost(id, channelId, channelName, channelType, campaignId, published_date, message, media, translation);
        }
        return this.props.compose(channelId, channelName, channelType, campaignId, published_date, message, media, translation);
    }
}

const mapDispatchToProps = dispatch => ({
    compose: ( channelId,  channelName, channelType, campaignId, publishingDate, message, media, translationTextContent) => dispatch(PublishingActions.compose(channelId,  channelName, channelType, campaignId, publishingDate, message, media,  translationTextContent)),
    updateCampaignPost: (id, channelId, channelName, channelType, campaignId, publishingDate,  message, media, translationTextContent) => dispatch(PublishingActions.updateCampaignPost(id, channelId, channelName, channelType, campaignId, publishingDate,  message, media, translationTextContent)),
    navigate: (scene, params) => dispatch(NavigationActions.navigate({ routeName: scene, key: scene, params })),
});

export default connect(null, mapDispatchToProps, null ,{withRef: true})(ComposeSocial);