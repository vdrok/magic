import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, Button, View, ScrollView, TextInput, Switch, Alert } from 'react-native';
import { List, ListItem, Body, Right } from 'native-base';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Validate from "validate.js/validate";

import { logo, USER_ROLES } from '../../Helpers';
import styles from './Style/TeamMemberInvitationScreenStyle'
import ButtonComponent from "../../Component/Button/ButtonComponent.mob";

import { Creators as UserActions } from '../../Reducer/UserReducer'

const fieldValidations = {
    email: {
        presence: {
            message: '^Please enter an email address',
            allowEmpty: false
        },
        email: {
            message: '^Please enter a valid email address'
        }
    },
    name: {
        presence: {
            message: '^Please enter a name',
            allowEmpty: false
        }
    },
    permissions: {
        length: {
            minimum: 1,
            message: '^You must select at least 1 permission'
        }
    }
};

class TeamMemberInvitationScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: <Image source={ logo } style={styles.headerLogo} />,
            tabBarLabel: 'Settings',
            tabBarIcon: ({tintColor}) => (
                <Icon name="more-horiz" size={30} color={tintColor}/>
            ),
            headerLeft: <Button
                title="Back"
                onPress={() => {
                    navigation.navigate("SettingsTeamManagementScreen")
                }}/>,
        }
    };

    static propTypes = {
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    user: PropTypes.object
                })
            })
        })
    }

    constructor(props) {
        super(props)

        const {user} = props.navigation.state.params;

        this.state = {
            currentClient: props.currentClient,
            usersList: props.usersList,
            user: user,
            email: user ? user.email : '',
            name: user ? user.name : '',
            permissions: [],
            isAdmin: false
        }
    }

    componentDidMount() {
        const permissions = this.state.user ? this.getUserPermissions(this.state.user) : ["ROLE_EDITOR"];

        this.setState({
            permissions: permissions,
            isAdmin: permissions.includes("ROLE_ADMIN")
        })
    }

    componentWillReceiveProps(props) {
        this.setState({
            currentClient: props.currentClient,
            usersList: props.usersList
        })
    }


    render() {
        return <View style={[styles.fullHeight, styles.container]}>
            <ScrollView>
                {this._renderHeader()}
                {this._renderForm()}
            </ScrollView>
        </View>;
    }

    _renderHeader() {
        return <View style={styles.headerWrapper}>
            <Text style={styles.headerTitle}>{this.state.currentClient ? this.state.currentClient.name : ''}</Text>
        </View>
    }

    _renderForm() {
        return <View style={styles.formWrapper}>
            {this._renderNewUserForm()}
            <Text style={styles.header}>Permissions</Text>
            {this._renderPermission()}
            <View>
                <ButtonComponent onPress={this.onSubmit.bind(this)} active={true}>
                    {this.state.user ? "Change permissions" : "Invite new member"}
                </ButtonComponent>
            </View>
        </View>
    }

    _renderNewUserForm() {
        return <View>
            <Text>Email</Text>
            <TextInput
                placeholder="Email"
                onChangeText={text => this.onChangeListener('email', text)}
                value={this.state.email}
                autoCapitalize="none"
                style={[styles.input, this.state.user ? styles.inputDisabled : {}]}
                editable={!this.state.user}
            />
            <Text>Name</Text>
            <TextInput
                placeholder="Name"
                onChangeText={text => this.onChangeListener('name', text)}
                value={this.state.name}
                autoCapitalize="words"
                style={[styles.input, this.state.user ? styles.inputDisabled : {}]}
                editable={!this.state.user}
            />
        </View>
    }

    _renderPermission() {
        return <View>
            <List>
                {Object.keys(USER_ROLES).map((key, index) => {
                    return <ListItem icon key={index} style={styles.listItem}>
                        <Body>
                            <Text style={styles.permissionTitle}>{USER_ROLES[key].name}</Text>
                            <Text style={styles.permissionDescription}>{USER_ROLES[key].description}</Text>
                        </Body>
                        <Right>
                            <Switch
                                value={this.state.permissions.includes(key)}
                                onValueChange={() => this.onPermissionChange(key)}
                                disabled={key === "ROLE_EDITOR" || (this.state.isAdmin && key !== "ROLE_ADMIN")}
                            />
                        </Right>
                    </ListItem>
                })}
            </List>
        </View>
    }

    onPermissionChange(permission) {
        const {permissions} = this.state;
        let newPermissions = [];

        if (permission === "ROLE_ADMIN") {
            newPermissions = permissions.includes(permission) ? ["ROLE_EDITOR"] : [...Object.keys(USER_ROLES).map(key => key)]
        } else {
            newPermissions = permissions.includes(permission) ? permissions.filter(item => item !== permission) : [...permissions, permission]
        }

        this.setState({
            permissions: newPermissions,
            isAdmin: newPermissions.includes("ROLE_ADMIN")
        })
    }

    onChangeListener(fieldName, value) {
        this.setState({
            [fieldName]: value
        });
    }

    onSubmit() {
        const validate = this.validate()
        if (validate) {
            Alert.alert(
                'Fix the form',
                validate.join('\n')
            );

            return null;
        }

        let permissions = [];
        if (this.state.isAdmin) {
            permissions = ["ROLE_ADMIN"];
        } else {
            permissions = this.state.permissions.includes("ROLE_EDITOR") ? this.state.permissions : [...this.state.permissions, "ROLE_EDITOR"]
        }

        if (this.state.user) {
            this.props.updatePermissions(this.state.user, this.state.currentClient.id, permissions)
        } else {
            this.props.inviteMember(this.state.email, this.state.name, this.state.currentClient.id, permissions)
        }

        this.props.navigation.navigate('SettingsTeamManagementScreen', {
            busy: true
        })
    }

    validate() {
        let validate = Validate(
            {
                email: this.state.email,
                name: this.state.name,
                permissions: this.state.permissions
            },
            fieldValidations,
            { format: 'flat' }
        );

        const userExists = this.state.usersList.find(user => user.email === this.state.email.trim())
        if (!this.state.user && userExists) {
            if (!validate) {
                validate = []
            }
            validate.push("User already exists")
        }

        return validate
    }

    getUserPermissions(user) {
        const userClient = user.clients.find(client => client.id === this.state.currentClient.id)

        if (userClient && userClient.permissions) {
            if (userClient.permissions.includes("ROLE_ADMIN")) {
                return [...Object.keys(USER_ROLES).map(key => key)]
            }

            return userClient.permissions;
        }

        return [];
    }
}

const mapStateToProps = state => ({
    currentClient:  state.auth.currentClient,
    usersList: state.user.list
});

const mapDispatchToProps = dispatch => ({
    inviteMember: (email, name, client, permissions) => dispatch(UserActions.inviteMember(email, name, client, permissions)),
    updatePermissions: (user, client, permissions) => dispatch(UserActions.updatePermissions(user, client, permissions))
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(TeamMemberInvitationScreen));