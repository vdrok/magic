import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import {Creators as SettingsActions} from '../Reducer/SettingsReducer'
import { callWithAuthToken } from './AuthSaga';
import ApiMediaChannels from '../API/ApiMediaChannels'

export function * fetchMediaChannels () {
    try{
        const response = yield callWithAuthToken(ApiMediaChannels.getAll);
        if (response.status === 200) {
            const mediaChannels = path(['data'], response);
            yield put(SettingsActions.setMediaChannels(mediaChannels))
        }
    }catch (e){
        //error like 500 in the api
    }
}
