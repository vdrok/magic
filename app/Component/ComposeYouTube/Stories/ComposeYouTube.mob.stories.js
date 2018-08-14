import React from 'react'
import {View} from 'react-native'
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import {number, withKnobs} from "@storybook/addon-knobs/react";
import { Provider } from 'react-redux'
import createStore  from '../../../Redux/index.mob'
import ComposeYouTube from "../ComposeYouTube.mob";
const {store, persisted} = createStore();

const stories = storiesOf('ComposeYouTube', module);

stories.addDecorator(withKnobs);
stories.add('Selected', () => {

    const media = [{
        id: 1,
        status : 2,
        thumbnail :"https://duo-thumbnails.s3.eu-west-1.amazonaws.com/media_gallery/14_romancetvpolska/20180327_105722_18_grzechy_i_grzeszki_5.jpg",
        type: "image",
    }]

    return <Provider store={store}>
            <ComposeYouTube channel={{
                id: 1,
                name: 'YouTubeChannel1',
                type: 'youtube',
                thumbnail: 'https://scontent-amt2-1.cdninstagram.com/vp/3230896e49952035c4a21d078561d30f/5B1DB27A/t51.2885-19/11906329_960233084022564_1448528159_a.jpg',
            }} currentContent={{
                mediaList: media
            }}
                             onChange={action('change')}
                             goToMedia={action('gotoMedia')}
                             changeChannel={action('change Channel')}
                             setRules={action('setting vadlidation rules')}

            />
    </Provider>
});