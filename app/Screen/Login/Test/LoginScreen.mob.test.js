import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import LoginScreen from '../LoginScreen.mob'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();

it('It renders correctly', () => {
    const tree = renderer.create(
        <LoginScreen store={store}/>
    )
})
