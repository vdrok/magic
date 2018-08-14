import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ChannelAnalyticsScreen from '../ChannelAnalyticsScreen.mob'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();

const navigation = {
    state: {
        params: {
            channel: {
                id: 0,
                name: 'Channel'
            }
        }
    }
}

it('It renders correctly', () => {
    const tree = renderer.create(
        <ChannelAnalyticsScreen
            store={store}
            navigation={navigation}/>
    )
})