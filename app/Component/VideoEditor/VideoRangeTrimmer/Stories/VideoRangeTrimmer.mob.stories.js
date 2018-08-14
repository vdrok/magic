import React from 'react'
import {View} from 'react-native'
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import VideoRangeTrimmer from '../VideoRangeTrimmer.mob'
import {number, withKnobs} from "@storybook/addon-knobs/react";


const stories = storiesOf('VideoRangeTrimmer', module);

stories.addDecorator(withKnobs);
stories.add('Default', () => {
    const options = {
        range: true,
        min: 0,
        max: 720000,
        step: 1000,
    };
    const currentTime = number('currentTime', 3000, options);
    return <View style={{flex: 1, backgroundColor: '#000'}} >
            <VideoRangeTrimmer currentTime={currentTime} length={720000} onRangeChange={ action('range changed')} />
        </View>
});
