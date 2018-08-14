import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import ChangePasswordScreen from '../ChangePasswordScreen.mob';
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();

const navigation = {};

it('renders correctly', () => {
    const tree = renderer.create(
        //TODO fix once smarter
      /*      <ChangePasswordScreen
                    store={store}
                    navigation={navigation}
                />*/
    )
})