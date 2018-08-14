import BaseApi from './BaseApi'
import moment from 'moment';
import { updatePostStatusParams } from '../Saga/PublishingContentSaga'

interface ComposeData {
    id: number;
    channelId: number;
    channelName: string;
    channelType: string;
    publishingDate: string;
    campaignId: number;
    message: string;
    media: [];
    translation: string;
    translationTextContent: string;
    title: string;
}

//Must be function instead of Object as Generators don't work with complex structure...I guess.
const ApiPublishing = ()=>{

    const _api = BaseApi.api;

    const compose = (data:ComposeData) => {
        let publishingDate = null;

        if(moment(data.publishingDate).isValid()){
            publishingDate = moment(data.publishingDate).toISOString();
        }
        const clientId = BaseApi.clientId ? BaseApi.clientId : null;


        return _api.post('publishing-content',{
            'channelId': data.channelId,
            'campaignId': data.campaignId,
            'publishedDate': publishingDate,
            'channelName': data.channelName,
            'channelType': data.channelType,
            'message': data.message,
            'media': data.media,
            'translation': data.translation,
            clientId
        });
    }

    const updatePostStatus = (data: updatePostStatusParams) => {
        return _api.put('publishing-content/'+data.id + '/status' , {
            'status': data.status
        });
    }

    const editPost = (data: ComposeData) => {
        let publishingDate = null;

        if(moment(data.publishingDate).isValid()){
            publishingDate = moment(data.publishingDate).toISOString();
        }

        return _api.put('publishing-content/'+data.id , {
            'channelId': data.channelId,
            'channelName': data.channelName,
            'channelType': data.channelType,
            'publishedDate': publishingDate,
            'campaignId': data.campaignId,
            'message': data.message,
            'media': data.media,
            'translation': data.translation,
            'title': data.title,
        });
    };

    const deleteCampaignPost = ({ post } ) => {
        return _api.delete('publishing-content/'+ post.id);
    };

    const updatePostCampaign = (data) => {
        return _api.put('publishing-content/'+data.id + '/campaign' , {
            'campaign': data.campaignId
        });
    }

    const youtubeCompose = (data) => {
        let publishingDate = null;

        if(moment(data.publishingDate).isValid()){
            publishingDate = moment(data.publishingDate).toISOString();
        }
        const clientId = BaseApi.clientId ? BaseApi.clientId : null;


        return _api.post('publishing-content/youtube',{
            'channelId': data.channelId,
            'campaignId': data.campaignId,
            'publishedDate': publishingDate,
            'channelName': data.channelName,
            'channelType': data.channelType,
            'message': data.message,
            'media': data.media,
            'title': data.title,
            'tags': data.tags,
            'category': data.category,
            clientId
        });
    }

    const youtubeEdit = (data) => {
        let publishingDate = null;

        if(moment(data.publishingDate).isValid()){
            publishingDate = moment(data.publishingDate).toISOString();
        }

        return _api.put('publishing-content/youtube/'+data.id , {
            'channelId': data.channelId,
            'channelName': data.channelName,
            'channelType': data.channelType,
            'publishedDate': publishingDate,
            'campaignId': data.campaignId,
            'message': data.message,
            'media': data.media,
            'title': data.title,
            'tags': data.tags,
            'category': data.category
        });
    };


    return {
        compose,
        editPost,
        deleteCampaignPost,
        updatePostStatus,
        updatePostCampaign,
        youtubeCompose,
        youtubeEdit,
    }
};

export default ApiPublishing();
