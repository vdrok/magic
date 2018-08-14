import { combineReducers } from 'redux';
//import Immutable from 'seamless-immutable';

import { AppNavigator } from '../Navigation/AppNavigation.mob';

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Login'));

export default function navReducer(state = initialState, action) {

    if (action.type === 'RESET_NAVIGATION') {
        return AppNavigator.router.getStateForAction(
            AppNavigator.router.getActionForPathAndParams('NavWithTab')
        );
    }


    const nextState = AppNavigator.router.getStateForAction(action, state);
    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
};