import { call, put, take, fork, select } from 'redux-saga/effects'
import { path } from 'ramda'
import { delay } from 'redux-saga'
import {Creators as MediaFilesAction, Types as MediaTypes} from '../Reducer/MediaFilesReducer'
import ApiMediaFiles from '../API/ApiMediaFiles'
import type {updateMediaFileParams} from "../API/ApiMediaFiles";
import { callWithAuthToken } from './AuthSaga';


export interface uploadFileParams {
    file_type?: 'image' | 'video';
    // can be either file from UploadFile or uri in mobiles
    file?: string|Object;
    mime_type: string;
    name: string;
    size: number;
}


export function * fetchMediaFiles () {
    try{
        const response = yield callWithAuthToken(ApiMediaFiles.getMediaFiles);
        if (response.status === 200) {
            const files = path(['data'], response);
                yield put(MediaFilesAction.getMediaFilesResponse(files));
        }
    }catch(e){
        // error like 500 in the api
    }
}

export function * fetchMediaFilesPage () {
    try{
        const { media } = yield select();
        const response = yield callWithAuthToken(ApiMediaFiles.getMediaFiles, media.pageLoaded , media.searchQuery, media.selectedFolder);
        if (response.status === 200) {
            const files = path(['data'], response);
            yield put(MediaFilesAction.getMediaFilesPageResponse(files));
        }
    }catch(e){
        // error like 500 in the api
    }
}

export function * fetchSearchResults () {
    try{
        const { media } = yield select();
        const response = yield callWithAuthToken(ApiMediaFiles.getSearch, media.searchQuery, media.selectedFolder);
        if (response.status === 200) {
            const files = path(['data'], response);
            yield put(MediaFilesAction.getMediaFilesResponse(files));
        }
    }catch(e){
        //error like the 500 api
    }
}

export function * uploadFile (event:uploadFileParams) {

    try{
        const response = yield callWithAuthToken(ApiMediaFiles.addMediaFile, event);
        if (response.status === 200) {
            //upload in progress
            yield put(MediaFilesAction.putMediaFileResponse(response.data.id,event.file_type, event.name, event.size));

            const uploader = ApiMediaFiles.upload(event.file, response.data.signedUrl, event.mime_type, response.data.formInputs, response.data.formData);
            try{
                while (true) {
                    const { progress = 0, stats, err, success } = yield take(uploader);
                    if (err) {
                        return;
                    }
                    if (success) {
                        const params: updateMediaFileParams = {
                            status: 1,
                        }
                        const upload = yield callWithAuthToken(ApiMediaFiles.updateMediaFile, response.data.id , params);
                        yield put(MediaFilesAction.uploadMediaFileCompleted(response.data.id));

                        //refresh the list of media
                        yield delay(1000);
                        yield put(MediaFilesAction.getMediaFiles());
                        return;
                    }
                    yield put(MediaFilesAction.uploadMediaFileProgress(response.data.id, progress, stats,event.name ));
                }
            } finally {

            }
        }
    }catch(e){
        console.log(e);
        yield put(MediaFilesAction.uploadMediaFileCompleted(false));
    }
}

export function * deleteMediaFile (event) {
    try{
        const response = yield callWithAuthToken(ApiMediaFiles.deleteMediaFile, event.id);
        if (response.status === 200) {
            yield put(MediaFilesAction.deleteMediaFileResponse('success'));
            yield put(MediaFilesAction.getMediaFiles());
        }
    }catch(e){
        yield put(MediaFilesAction.deleteMediaFileResponse('error'));
    }
}
