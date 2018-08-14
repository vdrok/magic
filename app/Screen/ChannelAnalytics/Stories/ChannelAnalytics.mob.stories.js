import React from 'react'
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import ChannelAnalyticsScreen from '../ChannelAnalyticsScreen.mob'
import {number, withKnobs} from "@storybook/addon-knobs/react";
import { Provider } from 'react-redux'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();
import { getExamplePublishingContent } from '../../../Fixtures/PublishingFixtures'


const stories = storiesOf('ChannelAnalytics Screen', module);

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
                channel: {
                    id: 1,
                    name: 'My facebook channel',
                    type: 'facebook-page'
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

    return <Provider store={store}><ChannelAnalyticsScreen  navigation={navigation}  /></Provider>
});
