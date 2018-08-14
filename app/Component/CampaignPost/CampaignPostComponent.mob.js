import React from 'react';
import { withNavigation } from 'react-navigation';
import {Image, View, TouchableWithoutFeedback, Linking, ImageBackground, Text, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { pathOr, remove } from 'ramda';
import Flag from 'react-native-flags';

import {logo_socials, check_icon, CHANNEL_TYPES, getThumbnailUrl} from '../../Helpers'

import Style from './Style/CampaignPostComponentStyle';
import colors from '../../Styles/Colors'

import PostMediaComponent from '../PostMedia/PostMediaComponent.mob';
import WhiteBoxComponent from '../WhiteBox/WhiteBoxComponent.mob';
import moment from 'moment'
import { POST_STATUSES } from '../../Helpers'
import { Button, Spinner, ActionSheet, Picker, Item } from 'native-base';
import {Creators as PublishingActions} from "../../Reducer/PublishingContent";
import {connect} from "react-redux";
import twttr from "twitter-text";
import HTML from 'react-native-render-html';
import {isAllow, restrictions} from "../../Helpers/Permissions";

class CampaignPostComponent extends React.Component {

    static propTypes = {
        post: PropTypes.shape({}).isRequired,
        isLastPost: PropTypes.bool.isRequired,
        deleteCallback: PropTypes.func.isRequired,
        editCallback: PropTypes.func.isRequired,
        showCampaign: PropTypes.bool.isRequired,
        onChangeCampaignActionClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            busy: false,
            showTranslation: false,
            ottLanguage: 'de',
            post: props.post
        };

        this.actionSheet = null;
    }

    componentDidMount() {
        if (this.state.post.channel.type === CHANNEL_TYPES.OTT) {
            this.setOttData();
        }
    }

    componentWillReceiveProps(props) {
        if (props.selected && props.selected.id === props.post.id) {
            this.setState({
                busy: props.selected.busy
            })
        }
        //we only cancel busy state
        if(props.busy === false){
            this.setState({
                busy: props.busy
            });
        }

        this.setState({
            post: props.post
        }, () => {
            if (this.state.post.channel.type === CHANNEL_TYPES.OTT) {
                this.setOttData();
            }
        });
    }

    setOttData() {
        if (!this.state.post.ott) {
            return null;
        }

        const ottContent = this.state.post.ott.find(item => item.language === this.state.ottLanguage)

        this.setState({
            post: {
                ...this.state.post,
                media: ottContent.media,
                message: ottContent.message,
                title: ottContent.title
            }
        })
    }

    render() {
        const style = this.props.isLastPost ? [Style.fullHeight, Style.grayLineLast]
                                            : [Style.fullHeight, Style.grayLine];

        const wrapperStyle = this.props.isLastPost ? Style.lastChildWrapper : Style.elementWrapper;

        const showCampaign = this.props.showCampaign && this.state.post.campaign;

        return <TouchableWithoutFeedback onPress={this.onClickExpand.bind(this)}>
            <View style={[wrapperStyle, showCampaign ? Style.marginTopCampaign: null ]}>
                {this._renderCampaign()}
                <WhiteBoxComponent style={{position: 'relative'}}>
                    <View style={style}></View>
                    {this._renderInnerContent()}
                </WhiteBoxComponent>
                {this._renderBottomContent()}
                {this._renderExpandedData()}
            </View>
        </TouchableWithoutFeedback>
    }

    _renderInnerContent() {
        if(this.state.busy) return  <Spinner />;

        return <View style={Style.postWrapper}>
            {this._renderMediaIcon()}
            <View style={Style.postRow}>
                {this._renderPostHeading()}
            </View>
            {this.state.post.title ? this._renderTitleBar() : null}
            <View style={Style.postRow}>
                {this._renderThumbnail()}
                {this._renderTextContent()}
            </View>
        </View>
    }

    _renderMediaIcon() {
        const { channel } = this.state.post;
        const icon = logo_socials[channel.type];

        return <View style={{ flex: 0.05 }}>
            <View style={Style.circle}></View>
            <View style={Style.mediaIconWrapper}>
                <Image style={Style.mediaIcon} source={icon} resizeMode={Image.resizeMode.contain}/>
            </View>
        </View>
    }

    _renderPostHeading() {
      const { channel, published_date } = this.state.post;

      return <View style={{flex: 1}}>
          <View style={Style.postWrapper}>
              <Text style={Style.flex1}>{channel.name}</Text>
              <Text style={[Style.flex1, Style.floatRight, Style.textRight, Style.statusText]}>{this._renderPostStatus()}</Text>
          </View>
          <Text style={Style.dateText}>{moment(published_date).format('LLLL')}</Text>
      </View>;
    }

    _renderTitleBar() {
        const { title } = this.state.post;

        if(!title) return null;

        return <View style={Style.postRow}>
            <View style={Style.titleBarTextWrapper}>
                <Text>{title}</Text>
            </View>
            {/* <Picker
                textStyle={Style.pickerTextStyle}
                itemTextStyle={Style.pickerItemTextStyle}
                selectedValue={this.state.ottLanguage}
                iosHeader="Language"
                mode="dropdown"
                headerBackButtonTextStyle={Style.pickerBackButton}
                onValueChange={this.onLanguageChange.bind(this)}
            >
                <Item label={<Flag code="DE" size={24}/>} value="de" style={{padding: 0}}/>
                <Item label={<Flag code="US" size={24}/>} value="en" />
            </Picker>*/}
        </View>
    }

    _renderThumbnail() {
        const { media } = this.state.post;

        if (!media || !media.length || media.length === 0) {
            return null;
        }

        const playIcon = (media[0].type !== 'video') ? null : <Icon name="play-arrow" size={50} color={colors.white} style={Style.iconPlay}/>

        return <View style={Style.thumbnailWrapper}>
            <ImageBackground source={{ uri: getThumbnailUrl(media[0]) }} style={Style.thumbnail} resizeMode={Image.resizeMode.cover}>
                {playIcon}
            </ImageBackground>
            <PostMediaComponent media={media}/>
        </View>
    }

    _renderTextContent() {
        return <View style={Style.textContent}>
            {this._renderMessage()}
        </View>;
    }

    _renderMessage(){
        const { message, channel, translation } = this.state.post;

        let messageToDisplay = this.state.showTranslation ? translation : message;
        const slicedMessage = this.sliceMessage(messageToDisplay);
        messageToDisplay = this.state.expanded ? messageToDisplay : slicedMessage;

        if(channel.type === CHANNEL_TYPES.TWITTER && messageToDisplay){

            return <HTML
                html={twttr.autoLink(messageToDisplay.replace(/(?:\r\n|\r|\n)/g, '<br />')  , {targetBlank: true})}
                onLinkPress={(e, href) =>  Linking.openURL(href) }
            />
        }

        if (channel.type === CHANNEL_TYPES.OTT && messageToDisplay) {
            return <HTML
                html={messageToDisplay}
                onLinkPress={(e, href) =>  Linking.openURL(href)}
            />
        }

        return <Text>{messageToDisplay}</Text>;
    }

    onLanguageChange(language) {
        this.setState({
            ottLanguage: language
        }, () => {
            this.setOttData()
        })
    }

    sliceMessage(message) {
        if (!message) {
            return ''
        }

        const messageLength = 80;

        return message.length > messageLength ? `${message.slice(0, messageLength)}...` : message;
    }

    _renderCampaign() {
        if (!this.props.showCampaign) {
            return null;
        }

        if (this.state.post.campaign)
            return <TouchableWithoutFeedback onPress={this.goToCampaign.bind(this)}>
                <View style={Style.campaignButton}>
                    <Text style={ Style.blackText }>{this.state.post.campaign.name}</Text>
                </View>
            </TouchableWithoutFeedback>;
    }

    _renderPostStatus() {
        const {status} = this.state.post;

        switch (status) {
            case POST_STATUSES.APPROVED:
                return <Text style={Style.greenColorStatus}>approved</Text>;
            case POST_STATUSES.LIVE:
                return <Text style={Style.greenColorStatus}>live <Icon name="check" style={[Style.checkIcon, Style.statusIcon]}/></Text>;
            case POST_STATUSES.PUBLISHED:
                return <Text style={Style.greenColorStatus}>scheduled <Icon name="check" style={[Style.checkIcon, Style.statusIcon]}/></Text>;
            case POST_STATUSES.ERROR:
                return <Text>error</Text>;
            default:
                return <Text style={Style.grayColorStatus}>draft <Icon name="mode-edit" style={Style.statusIcon}/></Text>;
        }
    }

    switchContentText() {
        this.setState({
            showTranslation: !this.state.showTranslation
        });
    }

    _renderBottomContent() {
        const { tipType, tip } = this.state.post;

        if(!tipType && !tip) return;

        return <View style={Style.bottomContentWrapper}>
            <Text style={Style.bottomContentTitle}>({tipType})</Text>
            <Text style={Style.bottomContentText}>{tip}</Text>
        </View>
    }

    _renderExpandedData() {

        if (!this.state.expanded)
            return null;


        return <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
                {this._renderTranslateButton()}
            </View>

            <View style={{flex: 1}}>
                <Button small style={Style.floatRight} onPress={() => this._showActionSheet()}>
                    <Text style={Style.actionButtonText}>Actions</Text>
                </Button>
                <ActionSheet ref={(c) => { this.actionSheet = c; }} />
            </View>
        </View>;
    }

    _showActionSheet(){

        let BUTTONS = [];

        if(this.state.post.status !== POST_STATUSES.LIVE && this.state.post.status !== POST_STATUSES.PUBLISHED){
            BUTTONS.push('Edit');
            BUTTONS.push('Delete');

            const {status} = this.state.post;

            if (status === POST_STATUSES.APPROVED) {
                BUTTONS.push('Publish');
            }
            else if (status === POST_STATUSES.DRAFT) {
                BUTTONS.push('Approve');
            }
        }

        const campaignChangeBtn = this.state.post.campaign ? 'Change campaign' : 'Assign campaign';
        BUTTONS.push(campaignChangeBtn);

        BUTTONS.push('Cancel');
        if ( this.actionSheet !== null ) {
            // Call as you would ActionSheet.show(config, callback)
            this.actionSheet._root.showActionSheet({
                    options: BUTTONS,
                    cancelButtonIndex: BUTTONS.length - 1,
                    title: "Actions"
                }, (buttonIndex) => {
                //If we have 2 options, we should trigger 3'rd actions(assign campaign)
                if (BUTTONS.length === 2) {
                    this.optionMenuHandler(3)
                } else {
                    this.optionMenuHandler(buttonIndex)
                }
            })

        }

    }


    _renderTranslateButton() {
        const { translation } = this.state.post;

        if (!translation) {
            return null;
        }

        return <Button small active={true} onPress={this.switchContentText.bind(this)}>
            <Text style={Style.actionButtonText}>Show {this.state.showTranslation ? 'post' : 'translation'}</Text>
        </Button>
    }



    optionMenuHandler(buttonIndex) {
        const {status} = this.state.post;

        switch (buttonIndex) {
            case 0:
                return this.props.editCallback(this.state.post);
                break;
            case 1:
                return this.props.deleteCallback(this.state.post);
                break;
            case 2:
                if (status === POST_STATUSES.APPROVED) {
                    return this.updateStatus(POST_STATUSES.PUBLISHED);
                }
                if (status === POST_STATUSES.DRAFT) {
                    return this.updateStatus(POST_STATUSES.APPROVED);
                }
                break;
            case 3:
                this.props.onChangeCampaignActionClick(this.state.post)
                break;
        }
    }

    onClickExpand() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    goToCampaign() {
        return this.props.navigation.navigate('StorylineScreen', {
          campaign: this.state.post.campaign
        })
    }

    /**
     *
     * @param status
     */
    updateStatus(status){
        if (status === POST_STATUSES.APPROVED && !isAllow(this.props.currentClient, 'postApproval')) {
            Alert.alert(
                restrictions['postApproval'].permissions.message,
                ' \n Please contact your administrator'
            );

            return;
        }

        //validate
        if(status === POST_STATUSES.PUBLISHED &&
            this.state.post.channel.type && (
                this.state.post.channel.type === CHANNEL_TYPES.INSTAGRAM_BUSINESS  ||
                this.state.post.channel.type === CHANNEL_TYPES.INSTAGRAM
            )){
            alert("Direct publishing to Instagram is not supported");
            return;
        }


        if(status === POST_STATUSES.PUBLISHED &&
            !moment(this.state.post.published_date).isAfter(moment().add(30, 'm'))){

            alert("We can only schedule the post planned minimum 30 minutes in future");
            return;
        }
        //you cannot published posts without real channel
        if(status === POST_STATUSES.PUBLISHED && !this.state.post.channel.id){
            alert( "This post is not planned for connected channel \n\n Edit the post and select the channel from the list");
            return;
        }


        this.setState({
            busy: true
        });

        this.props.updatePostStatus(
            this.state.post.id,
            status
        );
    }
}


const mapStateToProps = state => ({
    busy: state.publishing.busy,
    currentClient: state.auth.currentClient
});


const mapDispatchToProps = dispatch => ({
    updatePostStatus: (id, status) => dispatch(PublishingActions.updatePostStatus(id, status))
});



export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(CampaignPostComponent));
