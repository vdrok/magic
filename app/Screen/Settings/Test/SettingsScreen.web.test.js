import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import SettingsScreen from '../SettingsScreen.web'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();
import { MemoryRouter } from 'react-router-dom'
import { shallow, expect } from 'enzyme';

it('It renders correctly', () => {

    const tree = renderer.create(
        <MemoryRouter>
            <SettingsScreen store={store} />
        </MemoryRouter>

    )
})