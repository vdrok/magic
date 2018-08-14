import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import { updateReducers, persistStore } from '../Service/RehydrationService';
import WebStorage from 'redux-persist/lib/storage';

// creates the store
export default (rootReducer, rootSaga, history) => {
    /* ------------- Redux Configuration ------------- */

    const middleware = [];
    const enhancers = [];

    const sagaMiddleware = createSagaMiddleware();
    middleware.push(sagaMiddleware);
    
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
        middleware.push(logger);
    }
    
    middleware.push(routerMiddleware(history));

    enhancers.push(applyMiddleware(...middleware));

    let reducers = updateReducers(rootReducer, WebStorage);

    const store = createStore(reducers, compose(...enhancers));

    /* ------------- Saga Middleware ------------- */
    sagaMiddleware.run(rootSaga);

    let persisted = persistStore(store);

    return { store, persisted };
};
