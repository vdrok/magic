import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import {Creators as MediaFolderAction} from '../Reducer/MediaFolderReducer'
import { callWithAuthToken } from './AuthSaga';
import ApiMediaFolder from '../API/ApiMediaFolder'

export function * fetchMediaFolder () {
    try{
        const response = yield callWithAuthToken(ApiMediaFolder.getMediaFolders);

        if (response.status === 200) {
            const folders = path(['data'], response)
            yield put(MediaFolderAction.getMediaFoldersResponse(folders))
        }
    }catch (e){
        //error like 500 in the api
    }
}
