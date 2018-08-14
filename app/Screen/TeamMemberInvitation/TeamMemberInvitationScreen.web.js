import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom'
import { Header, Container, Button, Grid, Checkbox, Form, List, Divider, Message} from 'semantic-ui-react'
import Validate from "validate.js/validate";

import { USER_ROLES } from "../../Helpers";
import {Creators as UserActions} from "../../Reducer/UserReducer";
import BackButtonComponent from '../../Component/BackButton/BackButtonComponent.web';
import './Style/TeamMemberInvitation.scss'

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

    static propTypes = {
        location: PropTypes.shape({
            state: PropTypes.shape({
                user: PropTypes.object
            })
        })
    }

    constructor(props) {
        super(props)

        const {user} = props.location.state;
        this.state = {
            currentClient: props.currentClient,
            usersList: props.usersList,
            user: user,
            email: user ? user.email : '',
            name: user ? user.name : '',
            permissions: [],
            isAdmin: false,
            error: {}
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
        return <Container className="team-invitation">
            {this._renderHeader()}
            {this._renderForm()}
        </Container>;
    }

    _renderHeader() {
        return <Grid>
            <Grid.Row>
                <Grid.Column>
                    <BackButtonComponent onClickCallback={() => this.props.history.push('/team-management')}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={6} verticalAlign='bottom'>
                    <Header as='h3'>{this.state.currentClient && this.state.currentClient.name || ''}</Header>
                </Grid.Column>
            </Grid.Row>
        </Grid>;
    }

    _renderForm() {
        return <Grid>
            <Grid.Row>
                <Grid.Column width={8}>
                    {this.state.error.user ?
                        <Message
                            error
                            header='User'
                            content={this.state.error.user.join('\n')}
                        /> : null}
                    {this._renderNewUserForm()}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={8}>
                    <Header as="h4">Permissions</Header>
                    <Divider fitted/>
                    {this._renderPermission()}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={8} textAlign='right'>
                    <Button className="btn" content={this.state.user ? 'Change permissions' : 'Invite new member'} onClick={this.onSubmit.bind(this)}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    }

    _renderNewUserForm() {
        return <Form>
            <Form.Field error={!!this.state.error.email}>
                <label>Email</label>
                <input name="email" value={this.state.email} required placeholder='Email' onChange={this.onChangeListener.bind(this)} disabled={!!this.state.user}/>
                {this.state.error.email ? <span className="text-danger">{this.state.error.email.join('\n')}</span> : null}
            </Form.Field>
            <Form.Field error={!!this.state.error.name}>
                <label>Name</label>
                <input name="name" value={this.state.name} required placeholder='Name' onChange={this.onChangeListener.bind(this)} disabled={!!this.state.user}/>
                {this.state.error.name ? <span className="text-danger">{this.state.error.name.join('\n')}</span> : null}
            </Form.Field>
        </Form>
    }

    _renderPermission() {
        return <div>
            <List divided>
                {Object.keys(USER_ROLES).map((key, index) => {
                    return <List.Item key={index} className="list-item">
                        <List.Content floated='left'>
                            <List.Header>
                                {USER_ROLES[key].name}
                            </List.Header>
                            <List.Description>
                                {USER_ROLES[key].description}
                            </List.Description>
                        </List.Content>
                        <List.Content floated='right' verticalAlign='bottom' className="list-content-checkbox">
                            <Checkbox
                                toggle
                                checked={this.state.permissions.includes(key)}
                                onClick={() => this.onPermissionChange(key)}
                                disabled={key === "ROLE_EDITOR" || (this.state.isAdmin && key !== "ROLE_ADMIN")}/>
                        </List.Content>
                    </List.Item>
                })}
            </List>
            {this.state.error.permissions ?
                <Message
                    error
                    header='Permissions'
                    content={this.state.error.permissions.join('\n')}
            /> : null}
        </div>
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

    onChangeListener(attributes) {
        this.setState({
            [attributes.target.name]: attributes.target.value
        })
    }

    onSubmit() {
        if (!this.validate()) {
            return null;
        }

        let permissions = [];
        if (this.state.isAdmin) {
            permissions = ["ROLE_ADMIN"];
        } else {
            permissions = this.state.permissions.includes("ROLE_EDITOR") ? this.state.permissions : [...this.state.permissions, "ROLE_EDITOR"]
        }

        if(this.state.user) {
            this.props.updatePermissions(this.state.user, this.state.currentClient.id, permissions)
        } else {
            this.props.inviteMember(this.state.email, this.state.name, this.state.currentClient.id, permissions)
        }

        this.props.history.push('/team-management', {
            busy: true
        })
    }

    validate() {
        const validate = Validate(
            {
                email: this.state.email,
                name: this.state.name,
                permissions: this.state.permissions
            },
            fieldValidations
        );

        if (validate) {
            this.setState({
                error: validate
            })

            return false;
        }

        const userExists = this.state.usersList.find(user => user.email === this.state.email.trim())
        if (!this.state.user && userExists) {
            this.setState({
                error: {
                    user: ['User already exists']
                }
            })

            return false;
        }

        this.setState({
            error: {}
        })

        return true;
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamMemberInvitationScreen));