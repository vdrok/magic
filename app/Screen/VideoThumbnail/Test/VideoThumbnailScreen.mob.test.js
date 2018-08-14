import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import VideoThumbnailScreen from '../VideoThumbnailScreen.mob';
import createStore from '../../../Redux/index.mob';

const { store, persisted } = createStore();
const navigation = {
    navigate: jest.fn(),
    setParams: jest.fn(),
    state: {
        params: {
            media: {
                id: 1,
                name: 'My video'
            }
        }
    }
};

it('It renders correctly', () => {
    const tree = renderer.create(<VideoThumbnailScreen store={store} navigation={navigation} />);
});
