import './app/Helpers/Global.mob'
import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
import { Root } from "native-base";
import { Provider } from 'react-redux';
import createStore  from './app/Redux/index.mob'
const {store, persisted} = createStore();
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Client, Configuration } from 'bugsnag-react-native';
import AppWithNavigationState from './app/Navigation/AppNavigation.mob';
import moment from 'moment';
import 'moment/min/locales.min';
import DeviceInfo from 'react-native-device-info';
import Platform from "./app/Helpers/Platform";
let configuration = new Configuration();
configuration.registerBeforeSendCallback(function(report, error) {
    if(!Platform.isProd()){
        return false;
    }
});
const bugsnag = new Client(configuration);
/** to run storybook uncomment the two lines below and comment the class and appRegistry below */
// import StorybookUI from './storybook/index'
// export default StorybookUI;


export default class App extends Component {

    componentDidMount() {
        const deviceLocale = DeviceInfo.getDeviceLocale();
        
        if (deviceLocale) {
            // Set user language for moment i18n with fallback to "en"
            moment.locale([deviceLocale, 'en'])
        }
    }

    render() {
        return <PersistGate persistor={persisted}>
            <Provider store={store}>
                <Root>
                    <AppWithNavigationState />
                </Root>
            </Provider>
        </PersistGate>;
    }
}

AppRegistry.registerComponent('Duo', () => App);
