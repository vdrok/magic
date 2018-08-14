
import 'react-native';
import React from 'react';
import ComposeSocial from '../ComposeSocial.web';
import createStore  from '../../../Redux/index.web';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
const {store, persisted} = createStore();

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
                <ComposeSocial channel={channel}
                               campaign={{}}
                               post={{}}
                               channelType='facebook'/>
            </MemoryRouter>
        </Provider>

    )
});