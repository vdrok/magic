import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import CampaignAnalyticsScreen from '../CampaignAnalyticsScreen.mob'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();

const navigation = {
    state: {
        params: {
            campaign: {
                id: 0,
                name: 'PEO2017'
            },
            postsList: []
        }
    }
}

it('It renders correctly', () => {
    const tree = renderer.create(
        <CampaignAnalyticsScreen
            store={store}
            navigation={navigation}/>
    )
})