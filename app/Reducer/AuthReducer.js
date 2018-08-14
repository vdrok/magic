import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

const { Types, Creators } = createActions({
    loginRequest: ['email', 'password'],  //creates events name GET_EXAMPLE_API_DATA which we can map with reducers below
    loginSuccessResponse: ['token', 'refresh_token'],
    refreshTokenSuccessResponse: ['token', 'refresh_token'],
    loginFailureResponse: null,
    logout: null,
    getUser: null,
    getUserResponse: ['user'],
    sendResetPassword: ['email'],
    sendResetPasswordResponse: ['successful'],
    verifyPin: ['user', 'pin'],
    verifyToken: ['token'],
    verifyTokenResponse: ['successful'],
    verifyConfirmationFailResponse: null,
    changePassword: ['plainPassword'],
    changePasswordResponse: ['successful'],
    resetPasswordStateRefresh: null,
    changeClient: ['client'],
    authClean: null
})

const INITIAL_STATE = Immutable({
    user: null,
    clients: null,
    currentClient: null,
    token: null,
    refresh_token: null,
    isAuthenticated: false,
    busy: false,
    sentResetPassword: false,
    tokenVerified: false,
    changedPassword: false
})

const setBusy = (state) => state.merge({
    busy: true,
});

const setCompleted = (state) => state.merge({
    busy: false
})

const setAuth = (state, { token, refresh_token }) =>
    state.merge({
        token: token,
        refresh_token: refresh_token,
        isAuthenticated: true,
        busy: false,
    });

const setLogout = (state) =>
    state.merge({
        token: null,
        refresh_token: null,
        isAuthenticated: false,
        busy: false,
    })

const setResetPasswordResponse = (state, { successful }) =>
    state.merge({
        busy: false,
        sentResetPassword: successful
    });

const logout = (state) => state.merge(INITIAL_STATE);

const getUser = state =>
    state.merge({
        busy: true
    });

const setUser = (state, { user }) => {
    const {id, username, email, name, default_client} = user;

    let currentClient = state.currentClient

    //update current client if exists or set default if not
    if (currentClient) {
        currentClient = user.clients.find(client => state.currentClient.id === client.id) || state.currentClient;
    } else {
        currentClient = user.clients[0];
    }

    return state.merge({
        busy: false,
        clients: user.clients,
        currentClient: currentClient,
        user: {
            id,
            username,
            email,
            name,
            default_client
        }
    });
};
const verifyPinFailResponse = state =>
    state.merge({
        busy: false
    });

const verifiedTokenResponse = (state, { successful }) =>
    state.merge({
        busy: false,
        tokenVerified: successful
    });

const changePasswordRequest = state =>
    state.merge({
        busy: true,
        changedPassword: false
    });

const changePasswordResponse = (state, { successful }) =>
    state.merge({
        busy: false,
        changedPassword: successful
    });

const resetPasswordStateRefresh = state =>
    state.merge({
        busy: false,
        changedPassword: false,
        sentResetPassword: false,
        tokenVerified: false
    });

const changeCurrentClient = (state, { client }) => state.merge({
        currentClient: client,
    })

const clean = state => state.merge(INITIAL_STATE)

const reducer = createReducer(INITIAL_STATE, {
    [Types.AUTH_CLEAN]: clean,
    [Types.LOGIN_REQUEST]: setBusy,
    [Types.LOGIN_SUCCESS_RESPONSE]: setAuth,
    [Types.REFRESH_TOKEN_SUCCESS_RESPONSE]: setAuth,
    [Types.LOGIN_FAILURE_RESPONSE]: setLogout,
    [Types.LOGOUT]: logout,
    [Types.GET_USER]: getUser,
    [Types.GET_USER_RESPONSE]: setUser,
    [Types.SEND_RESET_PASSWORD]: setBusy,
    [Types.SEND_RESET_PASSWORD_RESPONSE]: setResetPasswordResponse,
    [Types.VERIFY_PIN]: setBusy,
    [Types.VERIFY_TOKEN]: setBusy,
    [Types.VERIFY_TOKEN_RESPONSE]: verifiedTokenResponse,
    [Types.VERIFY_CONFIRMATION_FAIL_RESPONSE]: verifyPinFailResponse,
    [Types.CHANGE_PASSWORD]: changePasswordRequest,
    [Types.CHANGE_PASSWORD_RESPONSE]: changePasswordResponse,
    [Types.RESET_PASSWORD_STATE_REFRESH]: resetPasswordStateRefresh,
    [Types.CHANGE_CLIENT]: changeCurrentClient
})

export {
    reducer,
    INITIAL_STATE,
    Types,
    Creators
};