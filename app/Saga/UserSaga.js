import { put } from 'redux-saga/effects'
import { path } from 'ramda'
import { push } from 'react-router-redux';
import { Creators as AuthActions } from '../Reducer/AuthReducer'
import { Creators as UserActions } from '../Reducer/UserReducer'
import { Creators as SettingsActions } from '../Reducer/SettingsReducer'
import ApiUser from '../API/ApiUser'
import Api from '../API/BaseApi'
import { callWithAuthToken } from './AuthSaga';

export function * fetchUser () {
    try{
        const response = yield callWithAuthToken(ApiUser.getLoggedInUser);
        if (response.status === 200) {
            const user = path(['data'], response);
            yield put(AuthActions.getUserResponse(user));
            if (!Api.clientId) {
                const { clients } = user;
                Api.clientId = clients[0].id
            }
        }
    }catch(e){
        //500 in the api
    }
}

export function * inviteMember(event) {
    try{
        const data = {
            email: event.email,
            name: event.name,
            client: event.client,
            permissions: event.permissions
        }

        const response = yield callWithAuthToken(ApiUser.inviteMember, data);
        if (response.status === 200) {
            const user = path(['data'], response);
            yield put(UserActions.inviteMemberResponse(user))
        }
    } catch (e){
        //error like 500 in the API
    }

}

export function * fetchUsers(event) {
    try {
        const response = yield callWithAuthToken(ApiUser.getUsers, event)

        if (response.status === 200) {
            const users = path(['data'], response);
            yield put(UserActions.getUsersResponse(users))
        }
    } catch (e) {
        //error like 500 in the API
    }
}

export function * updatePermissions(event) {
    try {
        const data = {
            user: event.user.id,
            client: event.client,
            permissions: event.permissions
        }
        const response = yield callWithAuthToken(ApiUser.updatePermissions, data)

        if (response.status === 204) {
            const clients = event.user.clients.map(item => item.id === event.client ?
                {
                    ...item,
                    permissions: event.permissions
                }
                : item)

            const user = {
                ...event.user,
                clients: clients
            }

            yield put(UserActions.updatePermissionsResponse(user))
        }
    } catch (e) {
        //error like 500 in the API
    }
}

export function * removeAccess(event) {
    try {
        const data = {
            user: event.user.id,
            client: event.client
        }

        const response = yield callWithAuthToken(ApiUser.removeAccess, data)

        if (response.status === 204) {
            yield put(UserActions.removeAccessResponse(event.user))
        }
    } catch (e) {
        //error like 500 in the API
    }
}

export function * newClient(event) {
    try {
        const response = yield callWithAuthToken(ApiUser.newClient, event)

        if (response.status === 201) {
            yield put(AuthActions.getUser())
            yield put(UserActions.newClientResponse())
        }
    } catch(e) {
        //error like 500 in the API
    }
}

export function * createPushToken(event) {
    try {
       const response = yield callWithAuthToken(ApiUser.createPushToken, event)

        if (response.status === 201) {
           yield put(SettingsActions.setPushToken(event.pushToken))
        }
    } catch (e) {
        //error like 500 in the API
    }
}

export function * removePushToken (event) {
    try {
        const response = yield callWithAuthToken(ApiUser.removePushToken, event)

        if (response.status === 204) {
            yield put(SettingsActions.setPushToken(null))
        }
    } catch (e) {
        //error like 500 in the API
    }
}