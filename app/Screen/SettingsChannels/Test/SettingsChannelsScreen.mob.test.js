import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import SettingsChannelsScreen from '../SettingsChannelsScreen.mob'
import createStore  from '../../../Redux/index.mob'

const {store, persisted} = createStore();


jest.mock('NativeModules', () => {
    return {
        RNTwitterSignIn: {
            init: jest.fn(),
        },
        AsyncLocalStorage: {
            multiSet: jest.fn()
        }
    };
});

it('It renders correctly', () => {
    const tree = renderer.create(
        <SettingsChannelsScreen store={store}/>
    )
})
