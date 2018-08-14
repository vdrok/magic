import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import MediaPreviewScreen from '../MediaPreviewScreen.web'
import createStore  from '../../../Redux/index.web'
const {store, persisted} = createStore();
import { MemoryRouter } from 'react-router-dom'

it('It renders correctly', () => {

    const location = {
        state: {
            media:{
                id: 1,
                name: 'test'
            }
        }

    }

    const tree = renderer.create(
        //TODO fix once smarter
        /*<MemoryRouter>
            <MediaPreviewScreen store={store} location={location} />
        </MemoryRouter>*/

    )
})