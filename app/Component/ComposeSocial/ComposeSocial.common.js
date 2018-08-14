import {CHANNEL_TYPES, validatePostMedia} from "../../Helpers";
import twttr from "twitter-text";
import moment from "moment/moment";

export default class ComposeSocialCommon {

    constructor(state,props){
        this.state = state;
        this.props = props;
    }

    loadStateAndProps(state,props){
        this.state = state;
        this.props = props;
    }

    validate(){

        const { channel } = this.state;
        if (!channel.name) {
            this.state.errorMessage = 'Channel not selected';
            return false;
        }
        if (this.state.post.media.length === 0 &&  !this.state.post.message){
            this.state.errorMessage = 'You need to publish either some text or an image';
            return false;
        }


        if (this.props.channelType === CHANNEL_TYPES.TWITTER && this.state.post.message) {
            if(!twttr.parseTweet(this.state.post.message).valid){
                this.state.errorMessage = 'Your tweet is too long';
                return false;
            }
        }

        const {_valid, _message} = validatePostMedia(this.state.post.media, this.props.mediaFilesValidation);
        this.state.errorMessage = _message;


        return _valid;
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