import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import PostComposeScreen from '../PostCompose2Screen.mob'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();

it('It renders correctly', () => {
    /* TODO FIX
    const tree = renderer.create(
        <PostComposeScreen store={store}/>
    )
    */
})
