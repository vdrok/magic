import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

export interface getChannelsAnalyticsParams{
    period: string
}


const { Types, Creators } = createActions({
    getChannelsAnalytics: ['period'],  //creates events name GET_EXAMPLE_API_DATA which we can map with reducers below
    getChannelsAnalyticsResponse: ['values'],
    clean: null,
});

const INITIAL_STATE = Immutable({
    channels: [],
    loading: false,
});

const setLoading = (state) =>
    state.merge({ loading: true})

const setChannelValues = (state, {values}) => {
    return state.merge({
        loading: false,
        channels: values
    });
}


const clean = state => state.merge(INITIAL_STATE)

const reducer = createReducer(INITIAL_STATE, {
    [Types.CLEAN]: clean,
    [Types.GET_CHANNELS_ANALYTICS]: setLoading,
    [Types.GET_CHANNELS_ANALYTICS_RESPONSE]: setChannelValues,
});


export {
    reducer,
    INITIAL_STATE,
    Types,
    Creators
};