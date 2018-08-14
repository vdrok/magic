import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import { Creators as PublishingActions } from '../Reducer/PublishingContent'
import { Creators as PostActions } from '../Reducer/PostReducer'
import ApiPublishing from '../API/ApiPublishing'
import { callWithAuthToken } from './AuthSaga';

interface ComposeParam{
    channelId: number;
    message: string;
    media: [];
}

export interface updatePostStatusParams{
    id: number;
    status: number;
}

export function * compose (event:ComposeParam) {
    try{
        if (event.media)
            event.media = extractMediaId(event.media);

        yield callWithAuthToken(ApiPublishing.compose, event);
        yield put(PublishingActions.composeFinished())
    } catch(e){
        yield put(PublishingActions.composeFinished())
        //error like 500 error in the api
    }
}

function extractMediaId(mediaList) {
    return mediaList.map(media => {
        return media.id;
    })
}

export function * createCampaignPost (event) {
    try{
        const {campaignId, channelId, channelName, channelType, message, publishingDate, translation} = event;

        const request = {
            campaignId,
            channelId,
            channelName,
            channelType,
            message,
            publishingDate,
            translation
        };

        if (event.media) {
            request.media = extractMediaId(event.media);
        }

        yield callWithAuthToken(ApiPublishing.createCampaignPost, request);
        yield put(PublishingActions.createCampaignPostResponse());
    } catch(e){
        //error like 500 error in the api
    }
}

export function * updatePostStatus (event:updatePostStatusParams) {

    try{
        const request = {
            id: event.id,
            status: event.status,
        };

        const response = yield callWithAuthToken(ApiPublishing.updatePostStatus, request);
        yield put(PublishingActions.updateCampaignPostResponse(response.data));
    } catch(e){
        //error like 500 error in the api
    }
}

export function * editCampaignPost (event) {

    try{
        const request = {
            id: event.id,
            campaignId: event.campaignId,
            channelName: event.channelName,
            channelType: event.channelType,
            channelId: event.channelId,
            message: event.message,
            publishingDate: event.publishingDate,
            end_date: event.end_date,
            status: event.status,
            translation: event.translation
        };

        if (event.media) {
            request.media = extractMediaId(event.media);
        }
        const response = yield callWithAuthToken(ApiPublishing.editPost, request);
        yield put(PublishingActions.updateCampaignPostResponse(response.data));
    } catch(e){
        //error like 500 error in the api
    }
}

export function * deleteCampaignPost (event) {
    try{
        yield callWithAuthToken(ApiPublishing.deleteCampaignPost, event);
        yield put(PublishingActions.deleteCampaignPostResponse());
        yield put(PostActions.removePost(event.post));
    } catch(e){
        //error like 500 error in the api
    }
}

export function * updatePostCampaign(event) {
    try {
        const request = {
            id: event.id,
            campaignId: event.campaignId,
        };

        const response = yield callWithAuthToken(ApiPublishing.updatePostCampaign, request);
        yield put(PublishingActions.updatePostCampaignResponse(response.data));
        if (event.screen === 'channel') {
            yield put(PostActions.updateCampaignPostResponse(response.data));
        } else {
            yield put(PostActions.removePost(response.data));
        }
    } catch (e) {
        //error like 500 error in the api
    }
}

export function * youtubeCompose (event) {
    try{
        if (event.media)
            event.media = extractMediaId(event.media);

        yield callWithAuthToken(ApiPublishing.youtubeCompose, event);
        yield put(PublishingActions.composeFinished())
    } catch(e){
        yield put(PublishingActions.composeFinished())
        //error like 500 error in the api
    }
}


export function * youtubeEdit (event) {
    try{

        if (event.media) {
            event.media = extractMediaId(event.media);
        }
        const response = yield callWithAuthToken(ApiPublishing.youtubeEdit, event);
        yield put(PublishingActions.updateCampaignPostResponse(response.data));
    } catch(e){
        yield put(PublishingActions.composeFinished());
        //error like 500 error in the api
    }
}