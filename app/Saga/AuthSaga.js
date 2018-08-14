import { call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { path } from 'ramda'
import ApiLogin from '../API/ApiLogin'
import Api from '../API/BaseApi'
import { Creators as AuthAction } from '../Reducer/AuthReducer'
import { Creators as MediaFilesAction } from '../Reducer/MediaFilesReducer'
import { Creators as PostAction } from '../Reducer/PostReducer'
import { Creators as MediaFolderAction } from '../Reducer/MediaFolderReducer'
import ChannelAction from '../Reducer/ChannelReducer'
import { Creators as CampaignAction } from '../Reducer/CampaignReducer'
import { Creators as UserActions } from '../Reducer/UserReducer'
import { push } from 'react-router-redux';
import Platform from "../Helpers/Platform";
import {Creators as SettingsAction} from "../Reducer/SettingsReducer";



export function * authenticate (event) {

    try {
        const response = yield call(ApiLogin.login, event.email, event.password);
        if (response.status === 200) {
            const {token, refresh_token} = path(['data'], response);
            Api.authToken = token;
            yield put(AuthAction.loginSuccessResponse(token, refresh_token))
        }
    }catch(e){
        yield put(AuthAction.loginFailureResponse());
    }
}


export function * logout (event) {
    const {settings} = yield select();
    if (settings.pushToken) {
        yield put(UserActions.removePushToken(settings.pushToken))
    }

    Api.authToken = null;
    Api.clientId = null;
    yield put(MediaFilesAction.clean());
    yield put(PostAction.cleanPosts());
    yield put(MediaFolderAction.clean());
    yield put(ChannelAction.clean());
    yield put(CampaignAction.clean());
    yield put(AuthAction.authClean());
    yield put(UserActions.clean());
    yield put(SettingsAction.clean());

    yield put({type: "Navigation/NAVIGATE", routeName: 'Login'});
}

export function * resetPasswordRequest(event) {
    try {
        const response = yield call(ApiLogin.resetPasswordRequest, event.email);
        yield put(AuthAction.sendResetPasswordResponse(response.status === 200));
    } catch(e){
        yield put(AuthAction.sendResetPasswordResponse(false));
    }
}

export function * verifyPin(event) {
    try {
        const requestData = {
            user: event.user,
            confirmationPin: event.pin
        };

        const response = yield call(ApiLogin.verifyPin, requestData);

        if (response.status === 200) {
            const {token, refresh_token} = path(['data'], response);
            Api.authToken = token;
            yield put(AuthAction.loginSuccessResponse(token, refresh_token));
        }
    }
    catch (e) {
        yield put(AuthAction.verifyConfirmationFailResponse());
    }
}

export function * verifyToken(event) {
    try {
        const requestData = {
            confirmationToken: event.token
        };

        const response = yield call(ApiLogin.verifyToken, requestData);

        if (response.status === 200) {
            const {token, refresh_token} = path(['data'], response);
            Api.authToken = token;
            yield put(AuthAction.verifyTokenResponse(true))
            yield put(AuthAction.loginSuccessResponse(token, refresh_token));
        }
    }
    catch (e) {
        yield put(AuthAction.verifyConfirmationFailResponse());
    }
}


export function * changePassword(event) {
    try {
        const response = yield call(ApiLogin.changePassword, event.plainPassword);

        yield put(AuthAction.changePasswordResponse(response.status === 200));
    }
    catch (e) {
        yield put(AuthAction.changePasswordResponse(false));

    }
}
/**
 * Do the standard call, if 401 is returned, refresh the token and try again.
 *
 * @returns {*}
 */
export function * callWithAuthToken() {
    try {
        return yield call(...arguments);
    }
    catch (e) {
        if (e.message && is401Error(e.message)) {
            yield refreshToken();
            return yield call(...arguments);
        }
    }
}

/**
 * check if error is 401.
 * @param error
 * @returns {boolean}
 */
function is401Error(error) {
    return error.indexOf('401') > -1;
}

export function * refreshTokenCycle() {
    while (true) {
        yield delay(1200000); //every 20 minutes, as session on server last 1h
        let {auth} = yield select();
        if(auth.isAuthenticated){
            yield refreshToken();
        }
    }

}

export function * refreshToken() {
    try {
        let {auth} = yield select();
        const refreshToken = auth.refresh_token;
        const response = yield call(ApiLogin.refreshToken, refreshToken);

        if (response.status === 200) {
            const {token, refresh_token} = path(['data'], response);
            Api.authToken = token;
            yield put(AuthAction.refreshTokenSuccessResponse(token, refresh_token))
        }
    }catch(e){
        yield put(AuthAction.loginFailureResponse());
    }
}

export function * changeClient({client}){
    Api.clientId = client.id;
    yield put(MediaFilesAction.clean());
    yield put(PostAction.cleanPosts());
    yield put(MediaFolderAction.clean());
    yield put(ChannelAction.clean());
    yield put(CampaignAction.clean());
    yield put(UserActions.clean());
    yield put(SettingsAction.getMediaChannels());

    //redirect
    if(Platform.isWeb()){
        yield put(push('/'));
        yield put(CampaignAction.getCampaigns());
    }else{
        //on mobile as all the tabs could be mounted componentDidMount will never be fired, so we refresh
        yield put(CampaignAction.getCampaigns()); //homeTab + settings
        yield put(ChannelAction.getChannels()); //compose
        yield put(MediaFilesAction.getMediaFiles()); //MediaTab

        yield put({type: "RESET_NAVIGATION"});
    }

}