import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import AnalyticsScreen from '../AnalyticsScreen.mob'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();

it('It renders correctly', () => {
    const tree = renderer.create(
        <AnalyticsScreen
            store={store}
        />
    )
})