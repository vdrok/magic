import { persistStore as persist, persistReducer, createTransform } from 'redux-persist';
import Immutable from 'seamless-immutable';


const IMMUTABLE_TRANSFORM = createTransform(
    state => Immutable.isImmutable(state) ? Immutable.asMutable(state) : state,
    state => Immutable(state)
);

const WHITE_LIST_REDUCERS = ['auth', 'settings'];

const CONFIG = {
    key: 'root',
    whitelist: WHITE_LIST_REDUCERS,
    transforms: [IMMUTABLE_TRANSFORM]
};


const updateReducers = (reducer, storage, isMobile = false) => {
    if (isMobile)
        return persistReducer({...CONFIG, storage}, reducer);

    return persistReducer({...CONFIG, storage}, reducer);
};

const persistStore = (store) => {
    return persist(store);
};

export {
    updateReducers,
    persistStore
}
