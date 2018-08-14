import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux'
import ComposeYouTube from '../ComposeYouTube.mob';
import createStore  from '../../../Redux/index.mob'
const {store, persisted} = createStore();

const channel = {
    id: 0,
    name: "Europeanopen",
    description: "Speed up the process. Thereby, choosing the right business card design is important and require."
};

let currentContent = {
    textContent: ''
};

it('renders correctly', () => {
    const tree = renderer.create(
        <Provider store={store}>
            <ComposeYouTube channel={channel}
                                     post={{}}
                            campaign={{}}
            />
        </Provider>
    )
})