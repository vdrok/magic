import React from 'react';
import { remove } from 'ramda';
import PropTypes from 'prop-types';
import {View, Text, Image, TouchableWithoutFeedback, Dimensions, Keyboard, TextInput, ScrollView } from 'react-native';
import { keyBy } from 'lodash';
import { NavigationActions } from 'react-navigation';
import ComposerMediaElementComponent from '../ComposerMediaElement/ComposerMediaElementComponent.mob';
import SortableList from 'react-native-sortable-list';

import Style from './Style/ComposeYouTubeStyle';
import { social_options_icons } from '../../Helpers';

import ChannelSelector from "../ChannelSelector/ChannelSelector.mob";
import DateInput from "../PublishingContent/DateInput/DateInput.mob";
import Colors from "../../Styles/Colors";
import {Creators as PublishingActions} from "../../Reducer/PublishingContent";
import {connect} from "react-redux";
import moment from "moment/moment";
import ComposeYouTubeCommon from "./ComposeYouTube.common";
import YouTubeCategory from "../YouTubeCategory/YouTubeCategory.mob";
import RowItem from "../Layout/RowItem/RowItem.mob";
import WhiteBox from "../WhiteBox/WhiteBoxComponent.mob";
import CampaignSelector from "../CampaignSelector/CampaignSelector.mob";

class ComposeYouTube extends React.Component {
    static propTypes = {
        channel: PropTypes.shape({}).isRequired,
        campaign: PropTypes.object,
        post: PropTypes.shape({
            status: PropTypes.any
        }),
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
            channel: props.channel,
            campaign: props.campaign
        }

        if(!this.state.post) this.state.post = {};
        if(!this.state.post.title) this.state.post.title = null;
        if(!this.state.post.description) this.state.post.description = null;
        if(!this.state.post.published_date) this.state.post.published_date = moment();

        if(!this.state.post.tags) this.state.post.tags = [];
        if(!this.state.post.media){
            this.state.post.media = [];
        }

        this.updateValue = this.updateValue.bind(this);
        this.common = new ComposeYouTubeCommon(this.state, props);
    }



    onDateChanged(date){
        this.state.post.published_date = date;
        this.forceUpdate();
    }

    render() {

        return <ScrollView contentContainerStyle={Style.fullHeight}>
            {this._renderHeading()}
            {this._renderCategory()}
            {this._renderName()}
            {this._renderTextField()}
            {this._renderSelectMedia()}
            {this._renderMediaList()}
        </ScrollView>
    }

    _renderCategory(){
        if(this.state.channel.id > 0){
            return <YouTubeCategory onChange={(value) => { this.updateValue('category',value); }}
                                    channelId={this.state.channel.id}
                                    selected={this.state.post.category}
                                    style={[Style.textInput, { borderRadius: 0 }]}
            />
        }

        return null;
    }

    _renderName() {

        return <TextInput multiline={false}
                          style={[Style.textInput]}
                          placeholder='Video name'
                          placeholderTextColor={Colors.textGray}
                          onChangeText={value => this.updateValue('title', value)}
                          value={this.state.post.title}
        />;
    }

    _renderTextField() {
        return <TextInput multiline={true}
                          style={[Style.textInput, Style.textArea]}
                          placeholder="Video description"
                          placeholderTextColor={Colors.textGray}
                          onChangeText={value => this.updateValue('message', value)}
                          value={this.state.post.message}
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
        return  <View style={[Style.row, Style.justifyCenter, Style.headingWrapper]}>
            <RowItem >
                <ChannelSelector channel={this.state.channel} onChange={value => this.setState({channel:  value} )} type='youtube' allowCustomChannel={this.props.campaign != null}/>
            </RowItem>
            <RowItem hideTopBorder={true} style={{paddingVertical: 0}}>
             <DateInput publishing_date={this.state.post.published_date} onChange={this.onDateChanged.bind(this)}/>
            </RowItem>
            <RowItem hideTopBorder={true} style={{backgroundColor: '#00000000', flexDirection: 'row'}} >
                <WhiteBox style={{ paddingVertical: 5, position: 'relative' }}>
                    <Text style={[Style.buttonSmallText, Style.buttonSmallTextAbsolute]}>story</Text>
                    <CampaignSelector style={{ paddingTop: 10 }} selected={this.state.campaign} onChange={value => this.setState({'campaign': value})}   />
                </WhiteBox>
            </RowItem>
        </View>

    }

    toMedia() {
        this.props.navigate('MediaSelection', {
            channel: this.state.channel,
            post: this.state.post,
            campaign: this.props.campaign,
            rules: {
                max: 1
            }
        });
    }

    _renderSelectMedia(){
        if (this.state.post.media.length > 0)
            return;

        return <TouchableWithoutFeedback onPress={this.toMedia.bind(this)}>
            <View style={[Style.optionWrapper, Style.imageSelector]}>
                <Image source={social_options_icons.photo} style={Style.optionImage} resizeMode={Image.resizeMode.contain}/>
                <Text style={Style.optionText}>Select a video</Text>
            </View>
        </TouchableWithoutFeedback>
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

    save(){
        this.common.loadStateAndProps(this.state, this.props);
        this.common.save();
    }
}

const mapDispatchToProps = dispatch => ({
    youtubeCompose: ( channelId,  channelName, channelType, campaignId, publishingDate, media, title, message,category,tags) => dispatch(PublishingActions.youtubeCompose(channelId,  channelName, channelType, campaignId, publishingDate, media, title, message,category,tags)),
    youtubeEdit: (id, channelId, channelName, channelType, campaignId, publishingDate, media, title, message,category,tags) => dispatch(PublishingActions.youtubeEdit(id, channelId, channelName, channelType, campaignId, publishingDate, media, title, message,category,tags)),
    navigate: (scene, params) => dispatch(NavigationActions.navigate({ routeName: scene, key: scene, params })),
});

export default connect(null, mapDispatchToProps, null ,{withRef: true})(ComposeYouTube);