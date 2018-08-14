import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

const { Types, Creators } = createActions({
    getChannels: null, //creates events name GET_EXAMPLE_API_DATA which we can map with reducers below
    getChannelsResponse: ['channels'],
    addChannelRequest: ['id', 'channel_type', 'access_token', 'name', 'isMobile'],
    getChannelContent: ['channelId'],
    getChannelContentResponse: ['hasMoreContent'],
    getChannelContentSearchResult: ['channelId', 'searchTerm'],
    getChannelContentPage: ['channelId'],
    getChannelContentPageResponse: ['hasMoreContent'],
    getChannelAnalytics: ['channelId', 'options'],
    getChannelAnalyticsResponse: ['analytics'],
    getChannelContentAnalytics: ['channelId'],
    getChannelContentAnalyticsResponse: ['contentAnalytics'],
    clean: null
});

export const ChannelTypes = Types;
export default Creators;

export const INITIAL_STATE = Immutable({
    hasMoreContent: false,
    contentPageLoaded: 0,
    contentSearchQuery: null,
    list: [],
    loading: false,
    isLoaded: false,
    contentLoading: false,
    analytics: [],
    contentAnalytics: []
});

//reducers here
const setLoading = state => state.merge({ loading: true });

const setChannels = (state, { channels }) =>
    state.merge({
        contentPageLoaded: 0,
        hasMoreContent: true,
        contentSearchQuery: null,
        loading: false,
        isLoaded: true,
        list: channels
    });

const setAddChannelRequest = state => state.merge({ isLoaded: false });

const endLoading = state => state.merge({ loading: false });

const setChannelContent = (state) =>
    state.merge({
        contentLoading: true
    });

const setChannelAnalytics = (state, {analytics}) =>
    state.merge({
        loading: false,
        analytics: analytics
    });

const setChannelContentAnalytics = (state, { contentAnalytics }) =>
    state.merge({
        loading: false,
        contentAnalytics: contentAnalytics
    });

const setHasMoreContent = (state, { hasMoreContent }) => {
    return state.merge({
        hasMoreContent: hasMoreContent,
        contentPageLoaded: state.contentPageLoaded + 1,
        loading: false,
        contentLoading: false
    })
}

const setChannelContentSearchTerm = (state, { searchTerm }) =>
    state.merge({
        loading: true,
        contentPageLoaded: 0,
        contentSearchQuery: searchTerm,
        hasMoreContent: true
    });

const clean = state => state.merge(INITIAL_STATE);

export const reducer = createReducer(INITIAL_STATE, {
    [Types.CLEAN]: clean,
    [Types.GET_CHANNELS]: setLoading,
    [Types.GET_CHANNELS_RESPONSE]: setChannels,
    [Types.ADD_CHANNEL_REQUEST]: setAddChannelRequest,
    [Types.GET_CHANNEL_CONTENT]: setChannelContent,
    [Types.GET_CHANNEL_CONTENT_RESPONSE]: setHasMoreContent,
    [Types.GET_CHANNEL_CONTENT_PAGE]: setLoading,
    [Types.GET_CHANNEL_CONTENT_PAGE_RESPONSE]: setHasMoreContent,
    [Types.GET_CHANNEL_CONTENT_SEARCH_RESULT]: setLoading,
    [Types.GET_CHANNEL_CONTENT_SEARCH_RESULT]: setChannelContentSearchTerm,
    [Types.GET_CHANNEL_ANALYTICS]: setLoading,
    [Types.GET_CHANNEL_ANALYTICS_RESPONSE]: setChannelAnalytics,
    [Types.GET_CHANNEL_CONTENT_ANALYTICS]: setLoading,
    [Types.GET_CHANNEL_CONTENT_ANALYTICS_RESPONSE]: setChannelContentAnalytics
});
