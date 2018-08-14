import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number } from '@storybook/addon-knobs/react';
import createStore from '../../../Redux/index.web';
import ImageEditorScreen from '../ImageEditorScreen.web';

const { store, persisted } = createStore();
const stories = storiesOf('ImageEditor Screen', module);

stories.addDecorator(withKnobs);

const location = {
    state: {
        media: {
            id: 1,
            name: 'My image'
        }
    }
};

stories.add('Default', () => (
    <MemoryRouter>
        <ImageEditorScreen store={store} location={location} history={{ push: action('redirecting to') }} />
    </MemoryRouter>
));
