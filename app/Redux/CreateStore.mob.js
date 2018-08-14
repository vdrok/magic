import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { updateReducers, persistStore } from '../Service/RehydrationService';
import AsyncStorage from 'redux-persist/lib/storage/index.native';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
const navigationMiddleware = createReactNavigationReduxMiddleware('root', state => state.nav);
// creates the store
export default (rootReducer, rootSaga) => {
    /* ------------- Redux Configuration ------------- */
    const middleware = [];
    const enhancers = [];

    const sagaMiddleware = createSagaMiddleware();
    middleware.push(navigationMiddleware);
    middleware.push(sagaMiddleware);

    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
        middleware.push(logger);
    }
    
    enhancers.push(applyMiddleware(...middleware));

    let reducers = updateReducers(rootReducer, AsyncStorage, true);

    const store = createStore(reducers, compose(...enhancers));

    /* ------------- Saga Middleware ------------- */
    sagaMiddleware.run(rootSaga);

    let persisted = persistStore(store);

    return { store, persisted };
};
