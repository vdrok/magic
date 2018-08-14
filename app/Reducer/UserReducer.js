import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { remove } from 'ramda'

const { Types, Creators } = createActions({
    getUsers: ['client'],
    getUsersResponse: ['users'],
    inviteMember: ['email', 'name', 'client', 'permissions'],
    inviteMemberResponse: ['user'],
    updatePermissions: ['user', 'client', 'permissions'],
    updatePermissionsResponse: ['user'],
    removeAccess: ['user', 'client'],
    removeAccessResponse: ['user'],
    newClient: ['name', 'client'],
    newClientResponse: null,
    createPushToken: ['pushToken'],
    removePushToken: ['pushToken'],
    clean: null,

})

const INITIAL_STATE = Immutable({
    list: [],
    busy: false
})

const setBusy = (state) =>
    state.merge({
        busy: true,
    });

const setCompleted = (state) =>
    state.merge({
        busy: false
    })

const setUsers = (state, {users}) =>
    state.merge({
        busy: false,
        list: users
    })


const addUser = (state, {user}) =>
    state.merge({
        busy: false,
        list: [
            user,
            ...state.list,
        ]
    })

const updateUser = (state, {user}) =>
    state.merge({
        list: state.list.map(
            content => content.id === user.id ? user : content
        ),
        busy: false
    })

const removeUser = (state, {user}) => {
    const index = state.list.indexOf(user);

    return state.merge({
        list: remove(index, 1, state.list),
        busy: false
    })
}

const setPushToken = (state, {pushToken}) =>
    state.merge({
        pushToken: pushToken,
        busy: false
    })

const clean = state => state.merge(INITIAL_STATE)

const reducer = createReducer(INITIAL_STATE, {
    [Types.CLEAN]: clean,
    [Types.GET_USERS]: setBusy,
    [Types.GET_USERS_RESPONSE]: setUsers,
    [Types.INVITE_MEMBER]: setBusy,
    [Types.INVITE_MEMBER_RESPONSE]: addUser,
    [Types.UPDATE_PERMISSIONS]: setBusy,
    [Types.UPDATE_PERMISSIONS_RESPONSE]: updateUser,
    [Types.REMOVE_ACCESS]: setBusy,
    [Types.REMOVE_ACCESS_RESPONSE]: removeUser,
    [Types.NEW_CLIENT]: setBusy,
    [Types.NEW_CLIENT_RESPONSE]: setCompleted,
    [Types.CREATE_PUSH_TOKEN]: setBusy,
    [Types.REMOVE_PUSH_TOKEN]: setBusy
})

export {
    reducer,
    INITIAL_STATE,
    Types,
    Creators
};