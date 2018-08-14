import React from 'react';
import { pathOr } from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link,  withRouter} from 'react-router-dom'
import './Style/SettingsScreen.scss'
import { Creators as AuthActions } from '../../Reducer/AuthReducer'
import { Creators as UserActions } from '../../Reducer/UserReducer'
import { Creators as SettingsReducer } from '../../Reducer/SettingsReducer'
import ChannelActions from '../../Reducer/ChannelReducer'
import { Header, Icon, Card, Grid} from 'semantic-ui-react'
import Platform from "../../Helpers/Platform";
import NewProjectModalComponent from "../../Component/NewProjectModal/NewProjectModalComponent.web";
import {isAllow, restrictions} from "../../Helpers/Permissions";

class SettingsScreen extends React.Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)

        this.state = {
            currentClient: props.currentClient,
            usersList: []
        }
    }

    componentDidMount() {
        this.props.getChannels();
        if (this.state.currentClient && this.state.currentClient.id) {
            this.props.getUsers(this.state.currentClient.id)
        }
    }

    componentWillReceiveProps(props) {
        if (props.currentClient && this.state.currentClient && props.currentClient.id !== this.state.currentClient.id) {
            this.props.getUsers(props.currentClient.id)
        }

        this.setState({
            currentClient: props.currentClient,
            usersList: pathOr(this.state.usersList, ['usersList'], props)
        })
    }

    redirect(page){
        this.props.history.push(page);
    }

    render() {
        const { channels, user } = this.props;
        const { username, name, email } = user || '';
        const {usersList} = this.state;

        return <Grid className="page-settings">
                <Grid.Column width={8}>
                    <Header as='h1'>Account</Header>
                    {this._renderNewProjectModal()}
                    <Card.Group>
                        <Card key="account">
                            <Card.Content>
                                <Icon name="user" floated='left' size="huge"  />
                                <div className="user-info-box">
                                    <Card.Header>{name || username}, <span>({email})</span></Card.Header>
                                    <Card.Meta>{this.getClientNames()}</Card.Meta>
                                </div>
                            </Card.Content>
                        </Card>

                        <Card key="subscription">
                            <Card.Content>
                                <Card.Header>Subscription</Card.Header>
                                <Card.Meta>Free trial</Card.Meta>
                            </Card.Content>
                        </Card>

                        <Card key="change-pass" onClick={() => this.redirect('/change-password')}>
                            <Card.Content>
                                <Card.Header>Change Password</Card.Header>
                            </Card.Content>
                        </Card>
                    </Card.Group>


                    <button className="btn danger" onClick={this.props.logout}>Logout</button>
                </Grid.Column>
            <Grid.Column width={8}>


                <Header as='h1'>Settings</Header>

                <Card.Group>
                    <Card key="channels"  onClick={() => this.redirect('/settings-channels')}>
                        <Card.Content>
                            <Card.Header>Publishing channels</Card.Header>
                            <Card.Meta>{channels.length} Connected Channels</Card.Meta>
                        </Card.Content>
                    </Card>
                    <Card key="teamManagement" onClick={() => this.props.history.push('/team-management')}>
                        <Card.Content>
                            <Card.Header>Team management</Card.Header>
                            <Card.Meta> {usersList.length} {usersList.length === 1 ? 'member' : 'members'} </Card.Meta>
                        </Card.Content>
                    </Card>
                    <Card key="newProject" onClick={this.showNewProjectModal.bind(this)}>
                        <Card.Content>
                            <Card.Header>New Project +</Card.Header>
                        </Card.Content>
                    </Card>
                </Card.Group>
            </Grid.Column>
        </Grid>;
    }

    _renderNewProjectModal() {
        return <NewProjectModalComponent
            ref="newProjectModal"
            onSubmitCallback={this.onNewProjectSubmit.bind(this)}/>
    }

    showNewProjectModal() {
        if (!isAllow(this.state.currentClient, 'teamManagement')) {
            alert(restrictions['teamManagement'].permissions.message + "\nPlease contact your team administrator");
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
}

SettingsScreen.propTypes = {
    logout: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
    user: state.auth.user,
    usersList: state.user.list,
    currentClient: state.auth.currentClient,
    clients: state.auth.clients,
    channels: state.channel.list,
});

const mapDispatchToProps = dispatch => ({
    logout: () => {
        dispatch(SettingsReducer.useFixtures(false));
        return dispatch(AuthActions.logout())
    },
    getChannels: () => dispatch(ChannelActions.getChannels()),
    getUsers: (client) => dispatch(UserActions.getUsers(client)),
    newClient: (name, client)  => dispatch(UserActions.newClient(name, client))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsScreen));