import React from 'react'
import { withKnobs, number } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import MediaElement from "../MediaElementComponent.web";
import createStore  from '../../../Redux/index.web'
const {store, persisted} = createStore();
import { MemoryRouter } from 'react-router-dom'
import moment from 'moment'

const stories = storiesOf('MediaElement', module);

stories.addDecorator(withKnobs);

const media = {
            id: 2,
            status: 3,
            type: 'image',
            name: "My image",
            thumbnail: 'https://placeimg.com/640/480/nature'
}

const mediaVideo = {
    id: 2,
    status: 3,
    length: 23333,
    type: 'video',
    name: "My image",
    thumbnail: 'https://placeimg.com/640/480/nature'
}

const livestreamInFuture = {
    id: 2,
    status: 3,
    length: 23333,
    type: 'live',
    name: "My image",
    thumbnail: 'https://placeimg.com/640/480/nature',
    start_date: moment().add(5, 'day').toISOString(),
    end_date: moment().add(6, 'day').toISOString()
}

const livestreamNow = {
    id: 2,
    status: 3,
    length: 23333,
    type: 'live',
    name: "My image",
    thumbnail: 'https://placeimg.com/640/480/nature',
    start_date: moment().toISOString(),
    end_date: moment().add(1, 'hour').toISOString()
}

const livestreamCompleted = {
    id: 2,
    status: 3,
    length: 23333,
    type: 'live',
    name: "My image",
    thumbnail: 'https://placeimg.com/640/480/nature',
    start_time: moment().subtract(2, 'hour').toISOString(),
    end_time: moment().subtract(1, 'hour').toISOString()
}


stories
    .add('Loaded Image', () => <MemoryRouter><MediaElement media={media} store={store} /></MemoryRouter>)
    .add('Loaded Video', () => <MemoryRouter><MediaElement media={mediaVideo} store={store} /></MemoryRouter>)
    .add('Livestream in Future', () => <MemoryRouter><MediaElement media={livestreamInFuture} store={store} /></MemoryRouter>)
    .add('Livestream now', () => <MemoryRouter><MediaElement media={livestreamNow} store={store} /></MemoryRouter>)
    .add('Livestream finished', () => <MemoryRouter><MediaElement media={livestreamCompleted} store={store} /></MemoryRouter>)
