import React from 'react'
import { withKnobs, number } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import VideoRangeTrimmer from "../VideoRangeTrimmer.web";


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
        return <VideoRangeTrimmer currentTime={currentTime} length={720000} onRangeChange={ action('range changed')} />
    });


stories.
add('Long video', () => {
    const options = {
        range: true,
        min: 0,
        max: 7200000,
        step: 1000,
    };
    const currentTime = number('currentTime', 3000, options);
    return <VideoRangeTrimmer currentTime={currentTime} length={7200000} onRangeChange={action('range changed')}/>
});