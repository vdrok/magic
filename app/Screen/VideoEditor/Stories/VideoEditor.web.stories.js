import React from 'react'
import { withKnobs, number } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import VideoEditor from "../VideoEditor.web";
import createStore  from '../../../Redux/index.web'
const {store, persisted} = createStore();
import { MemoryRouter } from 'react-router-dom'

const stories = storiesOf('VideoEditor Screen', module);

stories.addDecorator(withKnobs);

const location = {
    state:{
        media: {
            id: 2,
            name: "My video"
        }
    }
}

stories
    .add('Default', () => <MemoryRouter><VideoEditor store={store} location={location} history={{push: action('redirecting to')}} /></MemoryRouter>)
