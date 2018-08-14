import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ChangePasswordScreen from '../ChangePasswordScreen.web';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import createStore  from '../../../Redux/index.mob'

const {store, persisted} = createStore();


it('It renders correctly', () => {
    const tree = renderer.create(
        <MemoryRouter>
            <Provider store={store}>
                <ChangePasswordScreen/>
            </Provider>
        </MemoryRouter>

    )
});