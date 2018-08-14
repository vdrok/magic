import React from 'react';
import { Image, ScrollView, Button, View, FlatList, Text, ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import colors from "../../Styles/Colors";
import { logo } from '../../Helpers';
import styles from './Style/TeamManagementScreenStyle'

import TeamMemberComponent from "../../Component/TeamMember/TeamMemberComponent.mob";
import ButtonComponent from "../../Component/Button/ButtonComponent.mob";
import {Creators as UserActions} from "../../Reducer/UserReducer";

class TeamManagementScreen extends React.Component {

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
                    navigation.navigate("SettingsScreen")
                }}/>,
        }
    };

    constructor(props) {
        super(props)

        this.state = {
            busy: props.navigation.state.params ? props.navigation.state.params.busy : false,
            currentClient: props.currentClient,
            usersList: props.usersList
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            currentClient: props.currentClient,
            usersList: props.usersList
        })

        if (props.busy === false) {
            this.setState({
                busy: false
            })
        }
    }


    render() {
        return <View style={[styles.fullHeight, styles.container]}>
            <ScrollView>
                {this._renderHeader()}
                {this._renderMembers()}
            </ScrollView>
            {this._renderInvitationBtn()}
        </View>;
    }

    _renderHeader() {
        return <View style={styles.headerWrapper}>
            <Text style={styles.headerTitle}>{this.state.currentClient ? this.state.currentClient.name : ''}</Text>
            {this._renderLoader()}
        </View>
    }

    _renderMembers() {
        return <FlatList
            style={styles.list}
            keyExtractor={(user) => user.id}
            data={this.state.usersList}
            renderItem={(user) => <TeamMemberComponent
                key={user.id}
                user={user.item}
                client={this.state.currentClient}
                disabled={this.props.user.id === user.item.id}
                onAccessLevelClick={this.onAccessLevelClick.bind(this)}
                onRemoveAccessClick={this.onRemoveAccessClick.bind(this)}
            />}
        />
    }

    _renderLoader(){
        if(this.state.busy) return <ActivityIndicator size='large' color={colors.LinkColor} style={[styles.loader]}/>;

        return null;
    }

    _renderInvitationBtn() {
        return <ButtonComponent onPress={this._goToInvitationScreen.bind(this)} active={true} style={styles.button}>
            Invite new member +
        </ButtonComponent>
    }

    _goToInvitationScreen() {
        this.props.navigation.navigate('SettingsTeamMemberInvitationScreen', {
            user: null
        })
    }

    onAccessLevelClick(user) {
        this.props.navigation.navigate('SettingsTeamMemberInvitationScreen', {
            user: user
        })
    }

    onRemoveAccessClick(user) {
        if (this.props.user.id === user.id) {
            Alert.alert(
                'Error',
                'You can not remove yourself'
            );
        } else {
            this.setState({
                busy: true
            })
            this.props.removeAccess(user, this.state.currentClient.id)
        }
    }
}

const mapStateToProps = state => ({
    currentClient:  state.auth.currentClient,
    busy: state.user.busy,
    usersList: state.user.list,
    user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
    removeAccess: (user, client) => dispatch(UserActions.removeAccess(user, client))
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(TeamManagementScreen));