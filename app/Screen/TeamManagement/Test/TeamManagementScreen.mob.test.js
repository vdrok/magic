import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import TeamManagementScreen from '../TeamManagementScreen.mob'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();

const navigation = {
    state: {
        params: {
            busy: true
        }
    }
}

it('It renders correctly', () => {
    //@TODO. fix
    // const tree = renderer.create(
    //     <TeamManagementScreen
    //         store={store}
    //         navigation={navigation}/>
    // )
})
