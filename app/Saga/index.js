import { takeLatest, takeEvery, fork, all } from 'redux-saga/effects'

/* ------------- Types ------------- */

import { ChannelTypes } from '../Reducer/ChannelReducer'
import { Types as MediaFolderTypes } from '../Reducer/MediaFolderReducer'
import { Types as MediaTypes } from '../Reducer/MediaFilesReducer'
import { Types as AuthTypes } from '../Reducer/AuthReducer'
import { Types as TemplateTypes } from '../Reducer/TemplateReducer'
import { Types as CampaignTypes } from '../Reducer/CampaignReducer'
import { Types as PublishingTypes } from '../Reducer/PublishingContent'
import { Types as SettingsTypes } from '../Reducer/SettingsReducer'
import { Types as UserTypes } from '../Reducer/UserReducer'
import { Types as AnalyticsTypes } from '../Reducer/AnalyticsReducer'

/* ------------- Sagas ------------- */

import { fetchChannels, addChannel, getChannelContent, fetchChannelContentPage, fetchChannelAnalytics, fetchChannelContentAnalytics, fetchChannelContentSearchResult } from './ChannelSaga'
import { fetchMediaFolder } from './MediaFolderSaga'
import { fetchMediaFiles, uploadFile, fetchSearchResults, fetchMediaFilesPage, deleteMediaFile } from './MediaFilesSaga'
import { authenticate, logout, resetPasswordRequest, verifyPin, verifyToken, changePassword, refreshTokenCycle, changeClient } from './AuthSaga'
import { fetchTemplates, createFromTemplate } from './TemplateSaga'
import { fetchCampaigns } from './CampaignSaga'
import { fetchCampaignPosts, fetchCampaignPostsPage, fetchCampaignPostsSearchResult } from './CampaignPostsSaga'
import { fetchCampaignAnalytics } from './CampaignAnalyticsSaga'
import { compose, createCampaignPost, editCampaignPost, deleteCampaignPost, updatePostStatus, updatePostCampaign, youtubeCompose, youtubeEdit } from './PublishingContentSaga'

import { fetchUser, inviteMember, fetchUsers, updatePermissions, removeAccess, newClient, createPushToken, removePushToken } from './UserSaga'
import { fetchMediaChannels } from './SettingsSaga'
import { rehydrate } from './SystemSaga'
import { fetchChannelAnalytics as fetchAnalyticsChannel } from './AnalyticsSaga'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
// const api = DebugSettings.useFixtures ? FixtureAPI : API.create()


/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
    yield fork(refreshTokenCycle);
    yield all([
        // some sagas only receive an action
        takeLatest(ChannelTypes.GET_CHANNELS, fetchChannels),
        takeEvery(ChannelTypes.ADD_CHANNEL_REQUEST, addChannel),
        takeLatest(ChannelTypes.GET_CHANNEL_CONTENT, getChannelContent),
        takeLatest(ChannelTypes.GET_CHANNEL_CONTENT_PAGE, fetchChannelContentPage),
        takeLatest(ChannelTypes.GET_CHANNEL_ANALYTICS, fetchChannelAnalytics),
        takeLatest(ChannelTypes.GET_CHANNEL_CONTENT_ANALYTICS, fetchChannelContentAnalytics),
        takeLatest(ChannelTypes.GET_CHANNEL_CONTENT_SEARCH_RESULT, fetchChannelContentSearchResult),

        takeLatest(MediaFolderTypes.GET_MEDIA_FOLDERS, fetchMediaFolder),
        takeEvery(MediaTypes.GET_MEDIA_FILES, fetchMediaFiles),
        takeLatest(MediaTypes.GET_MEDIA_FILES_PAGE, fetchMediaFilesPage),
        takeLatest(MediaTypes.GET_MEDIA_FILES_FOLDER, fetchSearchResults),
        takeLatest(MediaTypes.GET_SEARCH_RESULT, fetchSearchResults),
        //upload
        takeEvery(MediaTypes.PUT_MEDIA_FILE, uploadFile),
        takeLatest(MediaTypes.DELETE_MEDIA_FILE, deleteMediaFile),

        takeLatest(AuthTypes.LOGIN_REQUEST,authenticate ),
        takeLatest(AuthTypes.LOGOUT,logout ),
        takeLatest(AuthTypes.SEND_RESET_PASSWORD, resetPasswordRequest),
        takeLatest(AuthTypes.VERIFY_PIN, verifyPin),
        takeLatest(AuthTypes.VERIFY_TOKEN, verifyToken),
        takeLatest(AuthTypes.CHANGE_PASSWORD, changePassword),

        takeLatest(AuthTypes.GET_USER, fetchUser),
        takeLatest(AuthTypes.LOGIN_SUCCESS_RESPONSE, fetchUser),
        takeLatest(AuthTypes.LOGIN_SUCCESS_RESPONSE, fetchMediaChannels),
        takeLatest(AuthTypes.CHANGE_CLIENT, changeClient),


        takeLatest(TemplateTypes.GET_TEMPLATES,fetchTemplates),
        takeLatest(TemplateTypes.CREATE_FROM_TEMPLATE, createFromTemplate),
        takeLatest(CampaignTypes.GET_CAMPAIGNS, fetchCampaigns),
        takeLatest(CampaignTypes.GET_CAMPAIGN_POST, fetchCampaignPosts),
        takeLatest(CampaignTypes.GET_CAMPAIGN_POSTS_PAGE, fetchCampaignPostsPage),
        takeLatest(CampaignTypes.GET_CAMPAIGN_POSTS_SEARCH_RESULT, fetchCampaignPostsSearchResult),
        takeLatest(CampaignTypes.GET_CAMPAIGN_ANALYTICS, fetchCampaignAnalytics),

        takeLatest(PublishingTypes.COMPOSE, compose),
        takeLatest(PublishingTypes.CREATE_CAMPAIGN_POST, createCampaignPost),
        takeLatest(PublishingTypes.UPDATE_CAMPAIGN_POST, editCampaignPost),
        takeLatest(PublishingTypes.UPDATE_POST_STATUS, updatePostStatus),

        takeLatest(PublishingTypes.DELETE_CAMPAIGN_POST, deleteCampaignPost),

        takeLatest(SettingsTypes.GET_MEDIA_CHANNELS, fetchMediaChannels),
        takeLatest(PublishingTypes.UPDATE_POST_CAMPAIGN, updatePostCampaign),

        takeLatest(UserTypes.GET_USERS, fetchUsers),
        takeLatest(UserTypes.INVITE_MEMBER, inviteMember),
        takeLatest(UserTypes.UPDATE_PERMISSIONS, updatePermissions),
        takeLatest(UserTypes.REMOVE_ACCESS, removeAccess),
        takeLatest(UserTypes.NEW_CLIENT, newClient),
        takeLatest(UserTypes.CREATE_PUSH_TOKEN, createPushToken),
        takeLatest(UserTypes.REMOVE_PUSH_TOKEN, removePushToken),

        //youtube
        takeLatest(PublishingTypes.YOUTUBE_COMPOSE, youtubeCompose),
        takeLatest(PublishingTypes.YOUTUBE_EDIT, youtubeEdit),

        //analytics
        takeLatest(AnalyticsTypes.GET_CHANNELS_ANALYTICS, fetchAnalyticsChannel),

        takeLatest('persist/REHYDRATE', rehydrate),
    ]);
}
