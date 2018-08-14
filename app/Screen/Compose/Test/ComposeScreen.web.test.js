import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ComposeScreen from '../ComposeScreen.web'
import createStore  from '../../../Redux/index.web'
const {store, persisted} = createStore();
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux';

it('It renders correctly', () => {
    const tree = renderer.create(
        <Provider store={store} >
            <MemoryRouter>
                <ComposeScreen />
            </MemoryRouter>
        </Provider>

    )
})