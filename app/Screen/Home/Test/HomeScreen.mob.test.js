import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from '../HomeScreen.mob'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();

it('It renders correctly', () => {
    const tree = renderer.create(
        <HomeScreen store={store}/>
    )
})
