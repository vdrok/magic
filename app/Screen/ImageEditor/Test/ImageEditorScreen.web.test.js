import React from 'react';
import renderer from 'react-test-renderer';
import ImageEditorScreen from '../ImageEditorScreen.web';
import createStore from '../../../Redux/index.web';
import { MemoryRouter } from 'react-router-dom';

const { store, persisted } = createStore();
const location = {
    state: {
        media: {
            id: 1,
            name: 'My image'
        }
    }
};
const history = {
    push: jest.fn()
};

it('It renders correctly', () => {
    const tree = renderer.create(
        <MemoryRouter>
            <ImageEditorScreen store={store} location={location} history={history} />
        </MemoryRouter>
    );
});
