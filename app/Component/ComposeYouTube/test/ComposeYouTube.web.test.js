import 'react-native';
import React from 'react';
import ComposeYouTube from '../ComposeYouTube.web'
import createStore  from '../../../Redux/index.mob'
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
const {store, persisted} = createStore();
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux';

configure({ adapter: new Adapter() });

const channel = {
    id: 0,
    name: "Europeanopen",
    description: "Speed up the process. Thereby, choosing the right business card design is important and require."
};

let currentContent = {
    textContent: ''
};

it('It renders correctly', () => {
    const tree = shallow(
        <Provider store={store}>
            <MemoryRouter>
                <ComposeYouTube
                    channel={channel}
                    campaign={{}}
                    post={{}}
                />
            </MemoryRouter>
        </Provider>

    )
});