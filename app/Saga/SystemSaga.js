import { select } from 'redux-saga/effects'
import { path } from 'ramda'
import Api from '../API/BaseApi'


export function * rehydrate() {
    const { auth } = yield select();
    if(auth.currentClient){
        Api.clientId = auth.currentClient.id;
    }
}
