import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

const { Types, Creators } = createActions({
    getCampaigns: null,  //creates events name GET_EXAMPLE_API_DATA which we can map with reducers below
    getCampaignsResponse: ['campaigns'],
    getCampaignPost: ['campaignId'],
    getCampaignPostsResponse: ['hasMorePosts'],
    getCampaignAnalytics: ['campaignId'],
    getCampaignAnalyticsResponse: ['analytics'],
    getCampaignPostsPage: ['campaignId'],
    getCampaignPostsPageResponse: ['hasMorePosts'],
    getCampaignPostsSearchResult: ['campaignId', 'searchTerm'],
    clean: null,
});

const INITIAL_STATE = Immutable({
    list: [],
    analytics: [],
    loading: false,
    postLoading: false,
    postsPageLoaded: 0,
    hasMorePosts: false,
    postsSearchQuery: null
});

const setLoading = (state) =>
    state.merge({ loading: true})

const setCampaigns = (state, {campaigns}) =>
    state.merge({
        postsPageLoaded: 0,
        loading: false,
        list: campaigns
    });

const stopLoading = (state, {posts}) =>
    state.merge({
        loading: false
    });

const setCampaignPosts = (state) =>
    state.merge({
        postLoading: true
    });

const setCampaignAnalytics = (state, {analytics}) =>
    state.merge({
        loading: false,
        analytics: analytics
    });

const setHasMorePosts = (state, {hasMorePosts}) => {
    return state.merge({
        hasMorePosts: hasMorePosts,
        postsPageLoaded: state.postsPageLoaded + 1,
        loading: false,
        postLoading: false
    })
}

const setCampaignPostsSearchTerm = (state, {searchTerm}) =>
    state.merge({
        loading: true,
        postsPageLoaded: 0,
        postsSearchQuery: searchTerm,
        hasMorePosts: true
    })


const clean = state => state.merge(INITIAL_STATE)

const reducer = createReducer(INITIAL_STATE, {
    [Types.CLEAN]: clean,
    [Types.GET_CAMPAIGNS]: setLoading,
    [Types.GET_CAMPAIGNS_RESPONSE]: setCampaigns,
    [Types.GET_CAMPAIGN_POST]: setCampaignPosts,
    [Types.GET_CAMPAIGN_POSTS_RESPONSE]: setHasMorePosts,
    [Types.GET_CAMPAIGN_ANALYTICS]: setLoading,
    [Types.GET_CAMPAIGN_ANALYTICS_RESPONSE]: setCampaignAnalytics,
    [Types.GET_CAMPAIGN_POSTS_PAGE]: setLoading,
    [Types.GET_CAMPAIGN_POSTS_PAGE_RESPONSE]: setHasMorePosts,
    [Types.GET_CAMPAIGN_POSTS_SEARCH_RESULT]: setLoading,
    [Types.GET_CAMPAIGN_POSTS_SEARCH_RESULT]: setCampaignPostsSearchTerm,
});


export {
    reducer,
    INITIAL_STATE,
    Types,
    Creators
};