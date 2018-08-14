import React from 'react';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import { View, Image, TouchableWithoutFeedback, ScrollView, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { logo } from '../../Helpers';
import styles from './Style/SettingsScreenStyle';
import Text from '../../Component/Text/TextComponent.mob'
import Colours from '../../Styles/Colors'
import { Creators as AuthActions } from '../../Reducer/AuthReducer'
import { Creators as UserActions } from '../../Reducer/UserReducer'
import { Creators as SettingsActions } from '../../Reducer/SettingsReducer'
import { NavigationActions } from 'react-navigation';
import ClientSelector from '../../Component/ClientSelector/ClientSelectorComponent.mob'
import NewProjectModalComponent from "../../Component/NewProjectModal/NewProjectModalComponent.mob";
import {isAllow, restrictions} from "../../Helpers/Permissions";

class SettingsScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="more-horiz" size={30} color={tintColor }  />
        ),
        headerLeft: <ClientSelector />,
        headerRight: <Image source={ logo } style={[styles.header_logo,{ marginRight: 15 }]} />
    };

    constructor(props){
        super(props)
        this.state = {
            channels: [],
            currentClient: props.currentClient,
            usersList: []
        }
    }

    componentDidMount() {
        if (this.state.currentClient && this.state.currentClient.id) {
            this.props.getUsers(this.state.currentClient.id)
        }
    }

    componentWillReceiveProps(props){
        if (props.currentClient && this.state.currentClient && props.currentClient.id !== this.state.currentClient.id) {
            this.props.getUsers(props.currentClient.id)
        }

        this.setState({
            channels: props.channels,
            currentClient: props.currentClient,
            usersList: pathOr(this.state.usersList, ['usersList'], props)
        });
    }


    render() {
        const {user} = this.props
        const { name, email, username } = user || '';
        const {usersList} = this.state

        return <ScrollView style={styles.container}>
            {this._renderNewProjectModal()}
            <View style={[styles.sectionSpacer]}>
                <Text style={styles.sectionHeader}>Account</Text>
                <View style={[styles.sectionBox, styles.flexHorizontal]}>
                    <Icon name="account-circle" size={35} color={Colours.LinkColor} style={styles.accountIcon}/>
                    <View style={styles.fullHeight}>
                        <Text>
                            <Text>{name || username}, </Text>
                            <Text style={styles.TextSupport}>({email})</Text>
                        </Text>
                        <Text style={styles.TextSupport}>{this.getClientNames()}</Text>
                    </View>
                    <Icon name="keyboard-arrow-right" size={20} color={Colours.boxBorder} style={styles.arrow}/>
                </View>
                <View style={[styles.sectionBox]}>
                    <Text>Subscription</Text>
                    <Text style={styles.TextSupport}>Free trial</Text>
                    <Icon name="keyboard-arrow-right" size={20} color={Colours.boxBorder} style={styles.arrow}/>
                </View>
                <TouchableWithoutFeedback onPress={this._goToChangePassword.bind(this)}>
                    <View style={[styles.sectionBox]}>
                        <Text>Change Password</Text>
                        <Icon name="keyboard-arrow-right" size={20} color={Colours.boxBorder} style={styles.arrow}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>

            <View style={[styles.sectionSpacer]}>
                <Text style={styles.sectionHeader}>Settings</Text>
                <TouchableWithoutFeedback onPress={ () => this.props.navigate('SettingsChannels') }>
                    <View style={[styles.sectionBox]}>
                        <Text>Publishing Channels</Text>
                        <Text style={styles.TextSupport}>{this.state.channels.length} Connected Channels</Text>
                        <Icon name="keyboard-arrow-right" size={20} color={Colours.boxBorder} style={styles.arrow}/>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this._goToTeamManagementScreen.bind(this)}>
                    <View style={[styles.sectionBox]}>
                        <Text>Team management</Text>
                        <Text style={styles.TextSupport}>{usersList.length} {usersList.length === 1 ? "member" : "members"}</Text>
                        <Icon name="keyboard-arrow-right" size={20} color={Colours.boxBorder} style={styles.arrow}/>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this.showNewProjectModal.bind(this)}>
                    <View style={[styles.sectionBox]}>
                        <Text>New Project +</Text>
                        <Icon name="keyboard-arrow-right" size={20} color={Colours.boxBorder} style={styles.arrow}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>

            <View style={[styles.sectionSpacer]}>
                <TouchableWithoutFeedback onPress={() => { Linking.openURL('https://levuro.com/general-terms-service') }}>
                    <View style={[styles.sectionBox]}>
                        <Text>General Terms of Service</Text>
                        <Icon name="keyboard-arrow-right" size={20} color={Colours.boxBorder} style={styles.arrow}/>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { Linking.openURL('https://levuro.com/data-privacy') }}>
                    <View style={[styles.sectionBox]}>
                        <Text>Data Privacy Statement</Text>
                        <Icon name="keyboard-arrow-right" size={20} color={Colours.boxBorder} style={styles.arrow}/>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { Linking.openURL('https://levuro.com/impressum') }}>
                    <View style={[styles.sectionBox]}>
                        <Text>Impressum</Text>
                        <Icon name="keyboard-arrow-right" size={20} color={Colours.boxBorder} style={styles.arrow}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>

            <TouchableWithoutFeedback onPress={this.props.logout.bind(this)}>
                <View style={[styles.sectionBox, styles.sectionSpacer]}>
                    <Text>Logout</Text>
                    <Icon name="keyboard-arrow-right" size={20} color={Colours.boxBorder} style={styles.arrow}/>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>;
    }

    _renderNewProjectModal() {
        return <NewProjectModalComponent
            ref="newProjectModal"
            onSubmitCallback={this.onNewProjectSubmit.bind(this)}/>
    }

    showNewProjectModal() {
        if (!isAllow(this.state.currentClient, 'teamManagement')) {
            Alert.alert(
                restrictions['teamManagement'].permissions.message,
                "Please contact your team administrator"
            );
            return;
        }

        this.refs.newProjectModal.show()
    }

    onNewProjectSubmit(data) {
        if (isAllow(this.state.currentClient, 'teamManagement')) {
            this.props.newClient(data.name, this.state.currentClient.id)
            this.refs.newProjectModal.hide()
        }
    }

    getClientNames() {
        const {clients} = this.props;

        if (!clients || !Array.isArray(clients) || clients.length === 0)
            return '-';

        return clients.map(client => {
            return client.name;
        }).join(', ');
    }

    _goToChangePassword() {
        this.props.dispatchNav(NavigationActions.navigate({
            routeName: 'SettingsChangePassword',
            params: {shouldGoBack: true}
        }))
    }

    _goToTeamManagementScreen() {
        if (!isAllow(this.state.currentClient, 'teamManagement')) {
            Alert.alert(
                restrictions['teamManagement'].permissions.message,
                ' \n Please contact your administrator'
            );
            return;
        }

        this.props.navigate('SettingsTeamManagementScreen')
    }
}

SettingsScreen.propTypes = {
};


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    channels: state.channel.list,
    user: state.auth.user,
    usersList: state.user.list,
    clients: state.auth.clients,
    currentClient: state.auth.currentClient
});

const mapDispatchToProps = dispatch => ({
    logout: () => {
        dispatch(SettingsActions.useFixtures(false));
        return dispatch(AuthActions.logout())
    },
    navigate: (scene) => dispatch(NavigationActions.navigate({ routeName: scene })),
    dispatchNav: (navigationOptions) => dispatch(navigationOptions),
    getUsers: (client) => dispatch(UserActions.getUsers(client)),
    newClient: (name, client)  => dispatch(UserActions.newClient(name, client))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);