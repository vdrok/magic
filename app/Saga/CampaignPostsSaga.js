import {call, put, select} from 'redux-saga/effects'
import { path } from 'ramda'
import { callWithAuthToken } from './AuthSaga';
import { Creators as CampaignActions } from '../Reducer/CampaignReducer'
import { Creators as PostActions } from '../Reducer/PostReducer'
import ApiCampaigns from '../API/ApiCampaigns'


interface fetchCampaingPostParams{
    campaignId: number;
}

export function * fetchCampaignPosts (event:fetchCampaingPostParams) {
    try{
        const response = yield callWithAuthToken(ApiCampaigns.getCampaignPosts, event.campaignId);
        yield put (PostActions.cleanPosts());
        if (response.status === 200) {
            const posts = path(['data'], response);
            const hasMore = posts.length > 0
            yield put(CampaignActions.getCampaignPostsResponse(hasMore));
            yield put(PostActions.setPosts(posts))
        }
    } catch (e){
        //error like 500 in the API
    }

}

export function * fetchCampaignPostsPage(event) {
    try {
        const { campaign } = yield select();
        if (campaign.postsPageLoaded === 0) {
            yield put(PostActions.cleanPosts())
        }
        const response = yield callWithAuthToken(ApiCampaigns.getCampaignPosts, event.campaignId, campaign.postsPageLoaded, campaign.postsSearchQuery)
        if (response.status === 200) {
            const posts = path(['data'], response);
            const hasMore = posts.length > 0
            yield put(CampaignActions.getCampaignPostsPageResponse(hasMore))
            yield put(PostActions.addPosts(posts))
        }
    } catch (e) {
        // error like 500 in the api
    }
}

export function * fetchCampaignPostsSearchResult (event) {
    try {
        const { campaign } = yield select();
        const response = yield callWithAuthToken(ApiCampaigns.getCampaignPostsSearch, event.campaignId, campaign.postsSearchQuery);
        if (response.status === 200) {
            const posts = path(['data'], response);
            yield put(CampaignActions.getCampaignPostsResponse(false))
            yield put(PostActions.setPosts(posts))
        }
    }
    catch (e) {
        //error like 500 in the api
    }
}