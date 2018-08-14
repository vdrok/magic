import { combineReducers } from 'redux'
import configureStore from './CreateStore.mob'
import rootSaga from '../Saga/'
import NavigationReducer from '../Reducer/NavigationReducer'

export default () => {

    const rootReducer = combineReducers({
        nav: NavigationReducer,
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

    return configureStore(rootReducer, rootSaga)
}
