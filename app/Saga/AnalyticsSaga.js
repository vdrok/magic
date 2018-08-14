import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import { Creators as AnalyticsActions, getChannelsAnalyticsParams } from '../Reducer/AnalyticsReducer'
import ApiAnalytics from '../API/ApiAnalytics'
import { callWithAuthToken } from './AuthSaga';

export function * fetchChannelAnalytics (event:getChannelsAnalyticsParams) {
    try{
        const response = yield callWithAuthToken(ApiAnalytics.getChannelAnalytics, event.period);
        if (response.status === 200) {
            const analytics = path(['data'], response)
            yield put(AnalyticsActions.getChannelsAnalyticsResponse(analytics))
        }
    } catch(e){
        yield put(AnalyticsActions.getChannelsAnalyticsResponse())
    }
}
