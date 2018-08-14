import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import { callWithAuthToken } from './AuthSaga';
import { Creators as CampaignActions } from '../Reducer/CampaignReducer'
import ApiCampaigns from '../API/ApiCampaigns'


interface fetchCampaignAnalyticsParams{
  campaignId: number;
}

export function * fetchCampaignAnalytics (event:fetchCampaignAnalyticsParams) {
  try{
    const response = yield callWithAuthToken(ApiCampaigns.getCampaignAnalytics,event.campaignId);
    if (response.status === 200) {
      const analytics = path(['data'], response);
      yield put(CampaignActions.getCampaignAnalyticsResponse(analytics))
    }
  } catch (e){
    //error like 500 in the API
  }

}
