import React from 'react'
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import CampaignAnalyticsScreen from '../CampaignAnalyticsScreen.mob'
import {number, withKnobs} from "@storybook/addon-knobs/react";
import { Provider } from 'react-redux'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();
import { getExamplePublishingContent } from '../../../Fixtures/PublishingFixtures'


const stories = storiesOf('CampaignAnalyticsScreen', module);

stories.addDecorator(withKnobs);
stories.add('Default', () => {
    const options = {
        range: true,
        min: 0,
        max: 720000,
        step: 1000,
    };
    const navigation = {
        state:{
            params:{
                campaign: {
                    id: 1,
                    name: 'My campaign',
                },
                postsList: [{
                    ...getExamplePublishingContent()
                },
                    {
                        ...getExamplePublishingContent()
                    },
                    {
                        ...getExamplePublishingContent()
                    }
                ]
            }
        },

    }

    return <Provider store={store}><CampaignAnalyticsScreen  navigation={navigation}  /></Provider>
});
