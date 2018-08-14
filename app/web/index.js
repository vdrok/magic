import { getUserLanguage } from '../Helpers'
import Platform from '../Helpers/Platform'
import bugsnag from 'bugsnag-js'
const bugsnagClient = bugsnag({
    apiKey: '976de0ef217bc10e74e6db29103c7eaf',
    beforeSend: (report) => {
       if(!Platform.isProd()) {
           return false
       }
    }
});

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import createPlugin from 'bugsnag-react'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { createMemoryHistory } from 'history'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import { createDevTools } from 'redux-devtools';
import moment from 'moment';
import 'moment/min/locales.min';
import  App from './App';
import { PersistGate } from 'redux-persist/lib/integration/react'

import createStore from '../Redux/index.web'

import 'semantic-ui-react'
import '../Styles/appStyle.scss'


let history;
//Check if DOM is available, otherwise is a test env (console)
if(!!(typeof window !== 'undefined' && window.document && window.document.createElement)){
    history = createHistory();
}else{
    history = createMemoryHistory();
}

const {store, persisted} = createStore(history);
const ErrorBoundary = bugsnagClient.use(createPlugin(React))

export default class WebApp extends Component{

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }

    componentDidMount() {
        const userLanguage = getUserLanguage();

        if (userLanguage) {
            // Set user language for moment i18n with fallback to "en"
            moment.locale([userLanguage, 'en'])   
        }
    }

    render() {
        return <PersistGate persistor={persisted}>
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <App />
                    </ConnectedRouter>
                </Provider>
            </PersistGate>
    }
}



//if DOM available
if(!!(typeof window !== 'undefined' && window.document && window.document.createElement)) {
    ReactDOM.render(<ErrorBoundary><WebApp/></ErrorBoundary>,
        document.getElementById('root')
    );
}