import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import LoginScreen from '../LoginScreen.web'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();
import { MemoryRouter } from 'react-router-dom'

it('It renders correctly', () => {
    const tree = renderer.create(
        <MemoryRouter>
            <LoginScreen store={store} />
        </MemoryRouter>

    )
})