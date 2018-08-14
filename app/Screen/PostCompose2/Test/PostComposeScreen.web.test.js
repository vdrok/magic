import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import PostComposeScreen from '../PostCompose2Screen.web'
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();
import { MemoryRouter } from 'react-router-dom'

it('It renders correctly', () => {
    /* TODO fix
    const tree = renderer.create(
        <MemoryRouter>
            <PostComposeScreen store={store} />
        </MemoryRouter>

    )*/
})