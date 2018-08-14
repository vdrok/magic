import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux'
import createStore  from '../../../../Redux/index.mob'
import OoyalaDetails from '../OoyalaDetails.mob'
const {store, persisted} = createStore();


it('renders correctly', () => {
    const tree = renderer.create(
        <Provider store={store}>
            <OoyalaDetails
                mediaId={2}
                ooyala={[]}
            />
        </Provider>
    )
})