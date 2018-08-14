import './app/Helpers/Global.mob'
import React, { Component } from 'react';
import {
    AppRegistry
} from 'react-native';
import { Provider } from 'react-redux';
import createStore  from './app/Redux/index.mob'
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

const {store, persisted} = createStore();

// console.disableYellowBox = true;

/** to run storybook uncomment the two lines below and comment the class and appRegistry below */
//import StorybookUI from './storybook/index'
//export default StorybookUI;

export default class App extends Component {

    componentDidMount() {
        let deviceLocale = DeviceInfo.getDeviceLocale();

        // https://github.com/moment/moment/issues/3624
        if (deviceLocale && deviceLocale.indexOf("-") >= 0) deviceLocale = deviceLocale.substr(0, deviceLocale.indexOf('-'));
        
        if (deviceLocale) {
            // Set user language for moment i18n with fallback to "en"
            moment.locale([deviceLocale, 'en'])
        }
    }

    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState />
            </Provider>
        );
    }
}

AppRegistry.registerComponent('Duo', () => App);