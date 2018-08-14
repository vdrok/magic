import 'react-native';
import React from 'react';
import OoyalaDetails from '../OoyalaDetails.web'
import createStore  from '../../../../Redux/index.mob'
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
const {store, persisted} = createStore();
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux';

configure({ adapter: new Adapter() });


it('It renders correctly', () => {
    const tree = shallow(
        <Provider store={store}>
            <MemoryRouter>
                <OoyalaDetails
                    mediaId={2}
                    ooyala={[]}
                />
            </MemoryRouter>
        </Provider>

    )
});