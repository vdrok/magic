import { combineReducers } from 'redux'
import configureStore from './CreateStore.web'
import rootSaga from '../Saga/'
import { routerReducer } from 'react-router-redux'

export default (history) => {

    const rootReducer = combineReducers({
        router: routerReducer,
        channel: require('../Reducer/ChannelReducer').reducer,
        mediaFolders: require('../Reducer/MediaFolderReducer').reducer,
        media: require('../Reducer/MediaFilesReducer').reducer,
        auth: require('../Reducer/AuthReducer').reducer,
        templates: require('../Reducer/TemplateReducer').reducer,
        campaign: require('../Reducer/CampaignReducer').reducer,
        settings: require('../Reducer/SettingsReducer').reducer,
        publishing: require('../Reducer/PublishingContent').reducer,
        posts: require('../Reducer/PostReducer').reducer,
        user: require('../Reducer/UserReducer').reducer,
        analytics: require('../Reducer/AnalyticsReducer').reducer
    });

    return configureStore(rootReducer, rootSaga, history)
}
