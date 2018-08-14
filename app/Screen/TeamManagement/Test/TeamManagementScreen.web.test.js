import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import TeamManagementScreen from '../TeamManagementScreen.web'
import createStore  from '../../../Redux/index.mob'
import { MemoryRouter } from 'react-router-dom'
import { expect } from 'enzyme';

const {store,} = createStore();

it('It renders correctly', () => {
    const tree = renderer.create(
        <MemoryRouter>
            <TeamManagementScreen store={store} />
        </MemoryRouter>

    )
})
