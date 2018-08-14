import React from 'react'
import { Text, View } from 'react-native';
import { withKnobs, number } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import WhiteBox from "../WhiteBox.mob";
import colors from '../../../../Styles/Colors'

const stories = storiesOf('WhiteBox', module);

stories.addDecorator(withKnobs);

stories
    .add('With text', () => <View style={{backgroundColor: colors.background, padding: 10}}>
        <WhiteBox ><Text>Here is my text</Text></WhiteBox>
        <WhiteBox selected={true} ><Text>selected</Text></WhiteBox>
        <WhiteBox onPress={action('click')} ><Text>clickable</Text></WhiteBox>
        <WhiteBox onPress={action('click')} selected={true} ><Text>clickable, selected</Text></WhiteBox>
    </View>)
