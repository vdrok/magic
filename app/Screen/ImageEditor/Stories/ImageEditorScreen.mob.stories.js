import React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import createStore from '../../../Redux/index.mob';
import ImageEditorScreen from '../ImageEditorScreen.mob';

const { store, persisted } = createStore();
const stories = storiesOf('ImageEditor Screen', module);

stories.addDecorator(withKnobs);
stories.add('Default', () => {
    const navigation = {
        state: {
            params: {
                media: { id: 1, name: 'my image' }
            }
        },
        setParams: () => {}
    };
    return (
        <Provider store={store}>
            <ImageEditorScreen navigation={navigation} />
        </Provider>
    );
});
