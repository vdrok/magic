import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import MediaScreen from '../MediaScreen.mob'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();

it('It renders correctly', () => {
    /* TODO fix
    const tree = renderer.create(
        <MediaScreen store={store}/>
    )
    */
})
