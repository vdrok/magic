jest.mock('../../../Component/ImageEditor/ImageCrop/ImageCropComponent.mob', () => 'ImageCropComponent');

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ImageEditorScreen from '../ImageEditorScreen.mob';
import createStore from '../../../Redux/index.mob';

const { store, persisted } = createStore();
const navigation = {
    navigate: jest.fn(),
    setParams: jest.fn(),
    state: {
        params: {
            media: {
                id: 0,
                name: 'Image'
            }
        }
    }
};

it('It renders correctly', () => {
    const tree = renderer.create(<ImageEditorScreen store={store} navigation={navigation} />);
});
