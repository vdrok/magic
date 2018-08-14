import React from 'react'
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import VideoEditor from '../VideoEditor.mob'
import {number, withKnobs} from "@storybook/addon-knobs/react";
import { Provider } from 'react-redux'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();

const stories = storiesOf('VideoEditor Screen', module);

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
                media: {id: 2, name: 'my video'}
            }
        },
        setParams: () => {}
    }
    return <Provider store={store}><VideoEditor navigation={navigation}  /></Provider>
});
