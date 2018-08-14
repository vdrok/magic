import React from 'react';
import renderer from 'react-test-renderer';
import VideoThumbnailScreen from '../VideoThumbnailScreen.web';
import createStore from '../../../Redux/index.web';
import { MemoryRouter } from 'react-router-dom';

const { store, persisted } = createStore();
const location = {
    state: {
        media: {
            id: 1,
            name: 'My video'
        }
    }
};
const history = {
    push: jest.fn()
};

it('It renders correctly', () => {
    const tree = renderer.create(
        <MemoryRouter>
            <VideoThumbnailScreen store={store} location={location} history={history} />
        </MemoryRouter>
    );
});
