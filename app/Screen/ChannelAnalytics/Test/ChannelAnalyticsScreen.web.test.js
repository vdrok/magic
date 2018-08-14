import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ChannelAnalyticsScreen from '../ChannelAnalyticsScreen.web';
import createStore  from '../../../Redux/index.web';
import { MemoryRouter } from 'react-router-dom';
const {store, persisted} = createStore();

const location = {
    state: {
        channel: {
            id: 0,
            name: "Channel"
        },
        postsList: []
    }
}

it('It renders correctly', () => {
    const tree = renderer.create(
        <MemoryRouter initialEntries={[ location ]}>
            <ChannelAnalyticsScreen store={store}/>
        </MemoryRouter>
    )
});