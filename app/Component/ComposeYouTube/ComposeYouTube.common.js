import {CHANNEL_TYPES, validatePostMedia} from "../../Helpers";
import twttr from "twitter-text";
import moment from "moment/moment";

export default class ComposeYouTubeCommon {

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

        if (!this.state.post.media  || this.state.post.media.length !== 1){
            this.state.errorMessage = 'You need to publish some video';
            return false;
        }

        if (this.state.post.media[0].type !== 'video'){
            this.state.errorMessage = 'We can publish only videos to youtube';
            return false;
        }

        if (!this.state.post.title.length ){
            this.state.errorMessage = 'Title is required';
            return false;
        }

        if (!this.state.post.category && this.state.channel.id > 0){
            this.state.errorMessage = 'Once you selected some youtube channel you must choose video category';
            return false;
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
        let { message, published_date, media, id, title,category,tags } = this.state.post;
        if(!published_date){
            published_date = moment();
        }
        if (!this.validate() ) {
            alert(this.state.errorMessage);
            return;
        }
        if(id){
            return this.props.youtubeEdit(id, channelId, channelName, channelType, campaignId, published_date,  media, title, message,category,tags);
        }
        return this.props.youtubeCompose(channelId, channelName, channelType, campaignId, published_date, media, title, message,category,tags);
    }
}