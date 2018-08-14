import { call, put, select } from 'redux-saga/effects'
import { path } from 'ramda'
import ChannelActions from '../Reducer/ChannelReducer'
import { Creators as PostActions } from '../Reducer/PostReducer'
import { callWithAuthToken } from './AuthSaga';
import ApiChannel from '../API/ApiChannel'

export function * fetchChannels () {
    try{
        const { channel } = yield select()
        yield put(PostActions.setPosts([]))
        
        if (channel.isLoaded) {
            const channels = [...channel.list]
            yield put(ChannelActions.getChannelsResponse(channels))
            return;
        }
        const response = yield callWithAuthToken(ApiChannel.getChannels)
        if (response.status === 200) {
            const channels = path(['data'], response)
            yield put(ChannelActions.getChannelsResponse(channels))
        }
    }catch(e){
        //do we need to support this?
    }
}


export function * addChannel(event) {
    const data = {
        id: event.id,
        name: event.name,
        type: event.channel_type,
        access_token: event.access_token,
        isMobile: event.isMobile

    }
    try {
        const response = yield callWithAuthToken(ApiChannel.addChannel, data);
        if (response.status >= 200 && response.status < 300) {
            //refresh
            yield put(ChannelActions.getChannels());
        }
    }catch(e){
        //already added
    }
}

export function * getChannelContent(event) {
    try {
        const response = yield callWithAuthToken(ApiChannel.getContent, event.channelId);
        yield put (PostActions.cleanPosts());
        if (response.status === 200) {
              const posts = path(['data'], response);
              //refresh
              const hasMore = posts.length > 0
              yield put(ChannelActions.getChannelContentResponse(hasMore));
              yield put(PostActions.setPosts(posts))
          }
    }catch(e){
    }
}

export function * fetchChannelContentPage (event) {
    try {
        const { channel } = yield select();
        if (channel.contentPageLoaded === 0) {
            yield put(PostActions.setPosts([]))
        }
        const response = yield callWithAuthToken(ApiChannel.getContent, event.channelId, channel.contentPageLoaded, channel.contentSearchQuery);
        if (response.status === 200) {
            const posts = path(['data'], response);
            const hasMore = posts.length > 0
            yield put(ChannelActions.getChannelContentPageResponse(hasMore))
            yield put(PostActions.addPosts(posts))
        }
    } catch (e) {
        // error like 500 in the api
    }
}

export function * fetchChannelContentSearchResult (event) {
    try {
        const { channel } = yield select();
        const response = yield callWithAuthToken(ApiChannel.getChannelContentSearch, event.channelId, channel.contentSearchQuery);
        if (response.status === 200) {
            const posts = path(['data'], response);
            yield put(ChannelActions.getChannelContentResponse(false))
            yield put(PostActions.setPosts(posts))
        }
    }
    catch (e) {
        //error like 500 in the api
    }
}

export function * fetchChannelAnalytics (event) {
    const data= {
        channelId: event.channelId,
        options: event.options
    }

    try{
        const response = yield callWithAuthToken(ApiChannel.getChannelAnalytics, data);
        if (response.status === 200) {
            const analytics = path(['data'], response);
            yield put(ChannelActions.getChannelAnalyticsResponse(analytics))
        }
    } catch (e){
        //error like 500 in the API
    }

}

export function * fetchChannelContentAnalytics (event) {
    try{
        const response = yield callWithAuthToken(ApiChannel.getChannelContentAnalytics, event.channelId);
        if (response.status === 200) {
            const contentAnalytics = path(['data'], response);
            yield put(ChannelActions.getChannelContentAnalyticsResponse(contentAnalytics))
        }
    } catch (e){
        //error like 500 in the API
    }

}