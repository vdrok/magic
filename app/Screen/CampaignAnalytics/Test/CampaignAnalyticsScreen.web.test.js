import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import CampaignAnalyticsScreen from '../CampaignAnalyticsScreen.web';
import createStore  from '../../../Redux/index.web';
import { MemoryRouter } from 'react-router-dom';
const {store, persisted} = createStore();

const location = {
    state: {
        campaign: {
            id: 0,
            name: "PEO2017"
        },
        postsList: []
    }
}

it('It renders correctly', () => {
    const tree = renderer.create(
        <MemoryRouter initialEntries={[ location ]}>
            <CampaignAnalyticsScreen store={store}/>
        </MemoryRouter>
    )
});