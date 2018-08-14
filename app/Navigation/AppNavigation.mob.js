import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Colors from '../Styles/Colors'
import { Platform, View } from 'react-native'
import { addNavigationHelpers, StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import Fixtures from '../Fixtures/index'
import LoginScreen from './../Screen/Login/LoginScreen.mob'
import styles from '../Styles/AppStyle'
import colors from '../Styles/Colors';

import {
    createReduxBoundAddListener
} from 'react-navigation-redux-helpers';
import {Creators as UserActions} from "../Reducer/UserReducer";
import OneSignalService from "../Service/OneSignalService.mob";

const stackNavigationOptions = Platform.OS === 'ios' ? {} : {
    headerTitleStyle: { paddingLeft: 50 },
    headerPressColorAndroid: Colors.LinkColor,
};

const HomeNavigator = StackNavigator({
    HomeScreen: {getScreen: () => require('./../Screen/Home/HomeScreen.mob').default },
    StorylineScreen: { getScreen: () => require('./../Screen/Storyline/StorylineScreen.mob').default },
}, {
        navigationOptions: stackNavigationOptions
    }
);
const ComposeNavigator = StackNavigator({
    ComposeScreen: { getScreen: () => require('./../Screen/Compose/ComposeScreen.mob').default },
    ChannelStorylineScreen: { getScreen: () => require('./../Screen/Storyline/StorylineScreen.mob').default }
},
{
    navigationOptions: stackNavigationOptions,
}
);
const MediaNavigator = StackNavigator({
    MediaScreen: { getScreen: () => require('./../Screen/Media/MediaScreen.mob').default },
    MediaPreview: { getScreen: () => require('./../Screen/MediaPreview/MediaPreviewScreen.mob').default },
},{
        navigationOptions: stackNavigationOptions,
    }
);
const SettingsNavigator = StackNavigator({
    SettingsScreen: { getScreen: () => require('./../Screen/Settings/SettingsScreen.mob').default },
    SettingsChannels: { getScreen: () => require('./../Screen/SettingsChannels/SettingsChannelsScreen.mob').default },
    SettingsChangePassword: { getScreen: () => require('../Screen/ChangePassword/ChangePasswordScreen.mob').default },
    SettingsTeamManagementScreen: { getScreen: () => require('../Screen/TeamManagement/TeamManagementScreen.mob').default },
    SettingsTeamMemberInvitationScreen: { getScreen: () => require('../Screen/TeamMemberInvitation/TeamMemberInvitationScreen.mob').default }
},{
    initialRouteName: "SettingsScreen",
    navigationOptions: stackNavigationOptions,
});

const AnalyticsNavigator = StackNavigator({
        AnalyticsScreen: { getScreen: () => require('./../Screen/Analytics/AnalyticsScreen.mob').default },
        CampaignAnalyticsScreen: { getScreen: () => require('./../Screen/CampaignAnalytics/CampaignAnalyticsScreen.mob').default },
        ChannelAnalyticsScreen: { getScreen: () => require('./../Screen/ChannelAnalytics/ChannelAnalyticsScreen.mob').default }
    },
    {
        navigationOptions: stackNavigationOptions,
        cardStyle: {
            backgroundColor: colors.BackgroundColor
        },
    }
);


const NavWithTab = TabNavigator({
    HomeTab: { screen: HomeNavigator },
    ComposeTab: { screen: ComposeNavigator, key: 'main1',  },
    MediaTab: { screen: MediaNavigator },
    AnalyticsNavigation: { screen: AnalyticsNavigator },
    SettingsTab: { screen: SettingsNavigator },
}, {
    tabBarOptions: {
        activeTintColor: Colors.main,
        inactiveTintColor: Colors.secondary,
    },
    tabBarPosition: 'bottom',
    tabBarComponent: TabBarBottom,
    lazy: true,
    initialRouteName: "HomeTab",
    swipeEnabled: false,
    cardStyle: {
        backgroundColor: 'red'
    },
    style: {
        backgroundColor: 'red'
    }

});

const OnlyHeaderNavigator = StackNavigator({
    VideoEditorScreen: {
        getScreen: () => require('../Screen/VideoEditor/VideoEditor.mob').default,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
    VideoThumbnailScreen: {
        getScreen: () => require('../Screen/VideoThumbnail/VideoThumbnailScreen.mob').default,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
    ImageEditorScreen: {
        getScreen: () => require('../Screen/ImageEditor/ImageEditorScreen.mob').default,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
}, {
    gesturesEnabled: false
});

// TODO: fix
const OnlyHeaderNavigator2 = StackNavigator({
    ImageEditorScreen: {
        getScreen: () => require('../Screen/ImageEditor/ImageEditorScreen.mob').default,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
    MediaSelection: {
        getScreen: () => require('../Screen/MediaSelection/MediaSelection.mob').default,
        navigationOptions: {
            gesturesEnabled: false,
            mode: 'modal',
        }
    },
}, {
    gesturesEnabled: false
});

// TODO: fix
const OnlyHeaderNavigator3 = StackNavigator({
    VideoThumbnailScreen: {
        getScreen: () => require('../Screen/VideoThumbnail/VideoThumbnailScreen.mob').default,
        navigationOptions: {
            gesturesEnabled: false
        }
    }
}, {
    gesturesEnabled: false
});

/**
 * this is most outer navigating wrapper
 */
export const AppNavigator = StackNavigator({
    HeaderNav: { screen: OnlyHeaderNavigator, navigationOptions: { header: null } },
    HeaderNav2: { screen: OnlyHeaderNavigator2, navigationOptions: { header: null } },
    HeaderNav3: { screen: OnlyHeaderNavigator3, navigationOptions: { header: null } },
    MediaSelection: {
        getScreen: () => require('../Screen/MediaSelection/MediaSelection.mob').default,
        navigationOptions: {
            gesturesEnabled: false
        }
    },
    NavWithTab: {screen: NavWithTab, navigationOptions: { header: null }},
    PostCompose2Screen: { getScreen: () => require('./../Screen/PostCompose2/PostCompose2Screen.mob').default },
    Login: { screen: LoginScreen, navigationOptions: { header: null } },
    Register: { navigationOptions: { header: null }, getScreen: () => require('./../Screen/Register/RegisterScreen.mob').default },
    ForgotPassword: { navigationOptions: { header: null } ,getScreen: () => require('../Screen/ForgotPassword/ForgotPasswordScreen.mob').default },
    ChangePassword: { navigationOptions: { header: null } ,getScreen: () => require('../Screen/ChangePassword/ChangePasswordScreen.mob').default },
    CampaignsScreen: { getScreen: () => require('./../Screen/Campaigns/CampaignsScreen.mob').default },
    },{
    initialRouteName: "Login",
});

const addListener = createReduxBoundAddListener("root");

class AppWithNavigationState  extends Component{

    constructor(props) {
        super(props)

        this.state = {
            isAuthenticated: props.isAuthenticated,
            pushToken: props.pushToken
        }
    }

    componentWillMount() {
        OneSignalService.init();
    }

    componentDidMount() {
        this.checkPermissions();
    }

    componentWillReceiveProps(nextProps) {
        this.shouldUseFixtures(nextProps.useFixtures);

        if (!this.state.isAuthenticated && nextProps.isAuthenticated) {
            this.checkPermissions(nextProps.isAuthenticated);
        }

        this.setState({
            isAuthenticated: nextProps.isAuthenticated,
            pushToken: nextProps.pushToken
        })
    }

    checkPermissions(isAuthenticated) {
        if ((this.state.isAuthenticated || isAuthenticated) && !this.state.pushToken) {
            OneSignalService.checkPermissions((data) => {
                if (data) {
                    this.savePushToken(data);
                }
            });
        }
    }

    shouldUseFixtures(enableFixtures) {
        if (enableFixtures)
            return Fixtures.enableFixtures(500);
        Fixtures.disableFixtures();
    }

    render() {
        this.shouldUseFixtures(this.props.useFixtures);

        return <View style={[styles.fullHeight]}>
            <AppNavigator navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav,
                addListener
            })}
            >
            </AppNavigator>
        </View>
    }

    savePushToken(data) {
        // On ios simulator pushToken and userId can be null, we can't send notification to simulator
        if (data.pushToken && data.userId) {
            this.props.dispatch(UserActions.createPushToken(data.pushToken, data.userId))
        }
    }
}

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    nav: state.nav,
    useFixtures: state.settings.useFixtures,
    isAuthenticated: state.auth.isAuthenticated,
    pushToken: state.settings.pushToken
});

export default connect(mapStateToProps)(AppWithNavigationState);
