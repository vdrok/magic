import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

const { Types, Creators } = createActions({
    useFixtures: ['useFixtures'],
    setTwitterOauthSecret: ['token'],
    getMediaChannels: null,
    setMediaChannels: ['mediaChannels'],
    setPushToken: ['pushToken'],
    clean: null
})

const INITIAL_STATE = Immutable({
    useFixtures: false,
    twitterOAuthSecret: null,
    mediaChannels: [],
    pushToken: null
})

const setUseFixtures = (state,{ useFixtures }) =>
    state.merge({
        useFixtures: useFixtures,
    })

const setTwitterOauthSecret = (state, { token }) =>
    state.merge({
        twitterOAuthSecret: token
    })

const setMediaChannels = (state, { mediaChannels }) =>
    state.merge({
        mediaChannels: mediaChannels
    })

const setPushToken = (state, {pushToken}) =>
    state.merge({
        pushToken: pushToken
    })

const clean = state => state.merge(INITIAL_STATE)

const reducer = createReducer(INITIAL_STATE, {
    [Types.CLEAN]: clean,
    [Types.USE_FIXTURES]: setUseFixtures,
    [Types.SET_TWITTER_OAUTH_SECRET]: setTwitterOauthSecret,
    [Types.SET_MEDIA_CHANNELS]: setMediaChannels,
    [Types.SET_PUSH_TOKEN]: setPushToken
})

export {
    reducer,
    INITIAL_STATE,
    Types,
    Creators
};