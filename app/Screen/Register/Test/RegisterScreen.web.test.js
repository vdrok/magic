import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import RegisterScreen from '../RegisterScreen.web';
import createStore from '../../../Redux/index.web';
import { MemoryRouter } from 'react-router-dom';

const { store, persisted } = createStore();

it('It renders correctly', () => {
    const tree = renderer.create(
        <MemoryRouter>
            <RegisterScreen store={store} />
        </MemoryRouter>
    );
});
