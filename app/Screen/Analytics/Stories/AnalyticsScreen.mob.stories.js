import React from 'react'
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import {number, withKnobs} from "@storybook/addon-knobs/react";
import { Provider } from 'react-redux'
import createStore  from '../../../Redux/index.mob'
import {AnalyticsScreen} from "../AnalyticsScreen.mob";
const {store, persisted} = createStore();


const stories = storiesOf('AnalyticsScreen', module);

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

        },

    }

    return <Provider store={store}><AnalyticsScreen navigation={navigation}  /></Provider>
});
