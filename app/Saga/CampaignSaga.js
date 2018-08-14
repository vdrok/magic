import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import { Creators as CampaignActions } from '../Reducer/CampaignReducer'
import ApiCampaign from '../API/ApiCampaigns'
import { callWithAuthToken } from './AuthSaga';

export function * fetchCampaigns () {
    try{
        const response = yield callWithAuthToken(ApiCampaign.getCampaigns);
        if (response.status === 200) {
            const campaigns = path(['data'], response)
            yield put(CampaignActions.getCampaignsResponse(campaigns))
        }
    } catch(e){
        yield put(CampaignActions.getCampaignsResponse())
        //error like 500 error in the api
    }
}
