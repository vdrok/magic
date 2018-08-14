import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import RegisterScreen from '../RegisterScreen.mob';
import createStore from '../../../Redux/index.mob';

const { store, persisted } = createStore();

it('It renders correctly', () => {
    const tree = renderer.create(<RegisterScreen store={store} />);
});
