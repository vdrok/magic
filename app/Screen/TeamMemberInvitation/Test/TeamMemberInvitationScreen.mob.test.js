import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import TeamMemberInvitationScreen from '../TeamMemberInvitationScreen.mob'
import createStore  from '../../../Redux/index.mob'

const {store} = createStore();
const navigation = {
    state: {
        params: {
            user: null
        }
    }
}

it('It renders correctly', () => {
    //@TODO. fix
    // const tree = renderer.create(
    //     <TeamMemberInvitationScreen store={store}
    //                                 navigation={navigation}/>
    // )
})
