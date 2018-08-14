import React from 'react'
import { connect } from 'react-redux'

import PropTypes from 'prop-types';

import { Route, Router } from 'react-router'

import {  routerMiddleware } from 'react-router-redux'
import { createDevTools } from 'redux-devtools';


import {Redirect, withRouter} from 'react-router-dom'

import HomeScreen from '../Screen/Home/HomeScreen.web'
import ComposeScreen from '../Screen/Compose/ComposeScreen.web'
import MediaScreen from '../Screen/Media/MediaScreen.web'
import SettingsScreen from '../Screen/Settings/SettingsScreen.web'
import LoginScreen from '../Screen/Login/LoginScreen.web'
import RegisterScreen from '../Screen/Register/RegisterScreen.web'
import ChangePasswordScreen from '../Screen/ChangePassword/ChangePasswordScreen.web'
import ForgotPasswordScreen from '../Screen/ForgotPassword/ForgotPasswordScreen.web'

import MediaPreviewScreen from '../Screen/MediaPreview/MediaPreviewScreen.web'
import CampaignScreen from '../Screen/Campaigns/CampaignsScreen.web'
import StorylineScreen from '../Screen/Storyline/StorylineScreen.web'
import PostCompose2Screen from '../Screen/PostCompose2/PostCompose2Screen.web'

import CampaignAnalyticsScreen from '../Screen/CampaignAnalytics/CampaignAnalyticsScreen.web'
import ChannelAnalyticsScreen from '../Screen/ChannelAnalytics/ChannelAnalyticsScreen.web'
import VideoEditor from '../Screen/VideoEditor/VideoEditor.web'
import VideoThumbnailScreen from '../Screen/VideoThumbnail/VideoThumbnailScreen.web'
import ImageEditorScreen from '../Screen/ImageEditor/ImageEditorScreen.web'
import TeamManagementScreen from '../Screen/TeamManagement/TeamManagementScreen.web'
import TeamMemberInvitationScreen from '../Screen/TeamMemberInvitation/TeamMemberInvitationScreen.web'

import SettingsChannelsScreen from '../Screen/SettingsChannels/SettingsChannelsScreen.web'
import NoPermissionsScreen from "../Screen/NoPermissions/NoPermissionsScreen.web"
import AnalyticsScreen from "../Screen/Analytics/AnalyticsScreen.web"

import './Style/AppNavigation.scss'
import Fixtures from "../Fixtures";
import Api from '../API/BaseApi';
import {isAllow} from "../Helpers/Permissions";

export class AppNavigation extends React.Component {

    componentWillReceiveProps(nextProps) {
        this.shouldEnableFixtures(nextProps.useFixtures);
    }

    shouldEnableFixtures(fixtures) {
        if(fixtures)
            return Fixtures.enableFixtures();

        Fixtures.disableFixtures();
        Api.authToken = this.props.token;
    }

    render() {
        this.shouldEnableFixtures(this.props.useFixtures);

        if(this.props.isAuthenticated)
            return (
                <div>
                    <Route exact path="/" component={HomeScreen}/>
                    <Route path="/compose" component={ComposeScreen}/>
                    <Route path="/compose-post2" component={PostCompose2Screen}/>
                    <Route path="/media" component={MediaScreen}/>
                    <Route path="/settings" component={SettingsScreen}/>
                    <Route path="/settings-channels" component={SettingsChannelsScreen}/>
                    <Route path="/media-preview" component={MediaPreviewScreen}/>
                    <Route path='/campaigns' component={CampaignScreen} />
                    <Route path="/campaign-posts" component={StorylineScreen} />
                    <Route path="/channel-posts" component={StorylineScreen} />
                    <Route path="/campaign-analytics" component={requiresPermissions(CampaignAnalyticsScreen, 'analytics')} />
                    <Route path="/channel-analytics" component={requiresPermissions(ChannelAnalyticsScreen, 'analytics')} />
                    <Route path="/change-password" component={ChangePasswordScreen}/>
                    <Route path='/video-editor' component={VideoEditor} />
                    <Route path='/video-thumbnail' component={VideoThumbnailScreen} />
                    <Route path='/image-editor' component={ImageEditorScreen} />
                    <Route path='/team-management' component={requiresPermissions(TeamManagementScreen, 'teamManagement')}/>
                    <Route path='/team-member' component={TeamMemberInvitationScreen} />
                    <Route path='/analytics' component={AnalyticsScreen} />

                    {this._renderCommonRoutes()}
                </div>
            )
        else{
            return <div style={{width: '100%' }}>
                <Route exact path="/" component={LoginScreen}/>
                <Route exact path="/register" component={RegisterScreen}/>
                <Route exact strict={true} path="/forgot-password" component={ForgotPasswordScreen}/>
                <Route exact path="/settings" render={() => (<Redirect to={'/'}/>)} />
                {this._renderCommonRoutes()}
            </div>
        }
    }

    _renderCommonRoutes() {
        return [
            <Route exact path="/forgot-password/:token" component={ChangePasswordScreen} key="forgot-pass"/>
        ];
    }
}


AppNavigation.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    useFixtures: PropTypes.bool.isRequired
};

function requiresPermissions(Component, restrictionsKey) {
    class PermissionsComponent extends React.Component {
        render() {
            return isAllow(this.props.currentClient, restrictionsKey) ? <Component {...this.props}/> : <NoPermissionsScreen {...this.props} restrictionsKey={restrictionsKey}/>;
        }
    }

    const mapStateToProps = state => ({
        currentClient: state.auth.currentClient,
    });

    return withRouter(connect(mapStateToProps, null)(PermissionsComponent))
}

const mapStateToProps = (state) => {
    return {
        route: state.router,
        isAuthenticated: state.auth.isAuthenticated,
        token: state.auth.token,
        useFixtures: state.settings.useFixtures
    };
}

export default withRouter(connect(mapStateToProps)(AppNavigation))
