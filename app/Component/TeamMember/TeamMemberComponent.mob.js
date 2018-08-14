import React from 'react';
import {View, TouchableWithoutFeedback, Text} from 'react-native';
import { ActionSheet } from 'native-base';
import PropTypes from 'prop-types';
import styles from './Style/TeamMemberComponentStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {USER_ROLES} from "../../Helpers";


class TeamMemberComponent extends React.Component {

    static propTypes = {
        user: PropTypes.shape({}).isRequired,
        disabled: PropTypes.bool,
        client: PropTypes.shape({}).isRequired,
        onAccessLevelClick: PropTypes.func.isRequired,
        onRemoveAccessClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            busy: false,
            user: props.user,
            client: props.client,
            disabled: props.disabled !== 'undefined' ? props.disabled : false
        };

        this.actionSheet = null;

    }

    componentWillReceiveProps(props) {
        //we only cancel busy state
        if (props.busy === false) {
            this.setState({
                busy: props.busy
            });
        }

        this.setState({
            user: props.user,
            client: props.client,
            disabled: props.disabled !== 'undefined' ? props.disabled : false
        });
    }

    render() {
        const {disabled, user} = this.state;
        const permissions = this.getUserPermissions(user)
        return <TouchableWithoutFeedback onPress={this._showActionSheet.bind(this)} disabled={disabled}>
            <View style={[styles.container, disabled ? styles.disabled : {}]}>
                <View style={styles.userDetails}>
                    <Text style={styles.user}>{`${user.name ? `${user.name}, ` : ''}${user.email}`}</Text>
                    <Text style={styles.role}>{permissions}</Text>
                </View>
                <View style={styles.arrowContainer}>
                    <Icon name="keyboard-arrow-right" size={30} style={styles.arrow}/>
                </View>
                <ActionSheet ref={(c) => { this.actionSheet = c; }} />
            </View>
        </TouchableWithoutFeedback>
    }

    getUserPermissions(user) {
        const userClient = user.clients.find(client => client.id === this.state.client.id)

        if (userClient && userClient.permissions) {
            if (userClient.permissions.includes("ROLE_ADMIN")) {
                return USER_ROLES["ROLE_ADMIN"].name
            }

            return userClient.permissions.map(permission => USER_ROLES[permission].name).join(", ");
        }

        return "";
    }

    _showActionSheet() {
        const BUTTONS = ['Change permission', 'Remove access', 'Cancel'];
        if ( this.actionSheet !== null ) {
            // Call as you would ActionSheet.show(config, callback)
            this.actionSheet._root.showActionSheet({
                options: BUTTONS,
                cancelButtonIndex: 2,
                destructiveButtonIndex: 1,
                title: "Actions"
            }, buttonIndex => this.optionMenuHandler(buttonIndex));
        }
    }

    optionMenuHandler(buttonIndex) {
        switch(buttonIndex) {
            case 0:
                this.props.onAccessLevelClick(this.props.user)
                break;
            case 1:
                this.props.onRemoveAccessClick(this.props.user)
                break;
        }
    }
}


export default TeamMemberComponent;
