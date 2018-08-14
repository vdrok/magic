import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import TeamMemberInvitationScreen from '../TeamMemberInvitationScreen.web'
import createStore  from '../../../Redux/index.mob'
import { MemoryRouter } from 'react-router-dom'
const {store, persisted} = createStore();

const location = {
    state: {
       user: null
    }
}

it('It renders correctly', () => {

    const tree = renderer.create(
        <MemoryRouter initialEntries={[ location ]}>
            <TeamMemberInvitationScreen store={store} />
        </MemoryRouter>

    )
})
