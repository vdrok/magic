import {createActions, createReducer} from 'reduxsauce'
import Immutable from "seamless-immutable";

const { Types, Creators } = createActions({
    compose: ['channelId',  'channelName', 'channelType', 'campaignId', 'publishingDate', 'message', 'media',  'translation'],  //creates events name GET_EXAMPLE_API_DATA which we can map with reducers below
    composeFinished: null,
    createCampaignPost: ['channelId', 'channelName', 'channelType' ,'campaignId', 'publishingDate', 'message', 'media', 'translation'],
    createCampaignPostResponse: null,
    updateCampaignPost: ['id','channelId', 'channelName', 'channelType' ,'campaignId', 'publishingDate', 'message', 'media', 'translation'],
    updatePostStatus: ['id','status'],
    updateCampaignPostResponse: ['post'],
    deleteCampaignPost: ['post'],
    deleteCampaignPostResponse: null,
    updatePostCampaign: ['id', 'campaignId', 'screen'],
    updatePostCampaignResponse: null,
    youtubeCompose: ['channelId',  'channelName', 'channelType', 'campaignId', 'publishingDate', 'media', 'title' ,'message','category','tags'],
    youtubeEdit: ['id','channelId', 'channelName', 'channelType' ,'campaignId', 'publishingDate', 'media', 'title' ,'message','category','tags'],
});

const INITIAL_STATE = Immutable({
    busy: false,
});


const setBusy = (state) =>
    state.merge({ busy: true })

const setCompleted = (state) =>
    state.merge({ busy: false })


const reducer = createReducer(INITIAL_STATE, {
    [Types.COMPOSE]: setBusy,
    [Types.COMPOSE_FINISHED]: setCompleted,
    [Types.CREATE_CAMPAIGN_POST]: setBusy,
    [Types.CREATE_CAMPAIGN_POST_RESPONSE]: setCompleted,
    [Types.UPDATE_CAMPAIGN_POST]: setBusy,
    [Types.UPDATE_POST_STATUS]: setBusy,
    [Types.UPDATE_CAMPAIGN_POST_RESPONSE]: setCompleted,
    [Types.DELETE_CAMPAIGN_POST]: setBusy,
    [Types.DELETE_CAMPAIGN_POST_RESPONSE]: setCompleted,
    [Types.UPDATE_POST_CAMPAIGN]: setBusy,
    [Types.UPDATE_POST_CAMPAIGN_RESPONSE]: setCompleted,
    [Types.YOUTUBE_COMPOSE]: setBusy,
    [Types.YOUTUBE_EDIT]: setBusy
});

export {
    reducer,
    INITIAL_STATE,
    Types,
    Creators
};