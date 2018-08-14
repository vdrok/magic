import React from 'react';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom'
import { Header, Container, Item, Button, Grid, Divider, Loader, Dimmer, Dropdown, Message} from 'semantic-ui-react'

import {Creators as UserActions} from "../../Reducer/UserReducer";
import BackButtonComponent from '../../Component/BackButton/BackButtonComponent.web';
import './Style/TeamManagement.scss'
import {USER_ROLES} from "../../Helpers";

class TeamManagementScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            busy: props.location.state || false,
            currentClient: props.currentClient,
            usersList: props.usersList
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            currentClient: props.currentClient,
            usersList: props.usersList,
            busy: props.busy
        })
    }

    render() {
        return <Container className="team-management">
            {this._renderHeader()}
            {this.state.error ?
                <Message
                    error
                    header='Error'
                    content={this.state.error}
                /> : null}
            <Item.Group divided>
                {this._renderMembers()}
            </Item.Group>
        </Container>;
    }

    _renderHeader() {
        return <Grid>
            <Grid.Row>
                <Grid.Column>
                    <BackButtonComponent onClickCallback={() => this.props.history.push('/settings')}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={6} verticalAlign='bottom'>
                    <Header as='h3' className="client-name">{this.state.currentClient && this.state.currentClient.name || ''}</Header>
                </Grid.Column>
                <Grid.Column  width={10} textAlign='right'>
                    <Button className="btn" content="Invite new member + " onClick={this._goToInvitationScreen.bind(this)} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Divider/>
                </Grid.Column>
            </Grid.Row>
            {this.state.busy ? <Grid.Row>
                <Grid.Column width={16} textAlign='center'>
                    <Dimmer active inverted><Loader inverted>Refreshing</Loader></Dimmer>
                </Grid.Column>
            </Grid.Row> : ''}
        </Grid>;
    }

    _renderMembers() {
        return this.state.usersList.map(user => {
            const permissions = this.getUserPermissions(user)
            return <Item key={user.id} className={this.props.user.id === user.id ? "disabled item" : "item"}>
                <Item.Content className="item-content">
                    <Item.Header className="item-header">{`${user.name ? `${user.name}, ` : ''}${user.email}`}</Item.Header>
                    <Item.Description className="item-description">{permissions}</Item.Description>
                </Item.Content>
                <Item.Extra className='item-extra'>
                    {this._renderActions(user)}
                </Item.Extra>
            </Item>
        })
    }

    _renderActions(user) {
        const pointing = this.state.usersList.length && this.state.usersList.length - 1 === this.state.usersList.indexOf(user) ? "bottom" : "top";

        return <Dropdown text='Actions' basic button pointing={pointing}>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => this._onAccessLevelClick(user)}>
                    Change permission
                </Dropdown.Item>
                <Dropdown.Item className="text-danger" onClick={() => this._onRemoveAccessClick(user)}>
                    Remove access
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    }

    getUserPermissions(user) {

        const userClient = user.clients.find(client => client.id === this.state.currentClient.id)
        if (userClient && userClient.permissions) {
            if (userClient.permissions.includes("ROLE_ADMIN")) {
                return USER_ROLES["ROLE_ADMIN"].name
            }

            return userClient.permissions.map(permission => USER_ROLES[permission].name).join(", ");
        }

        return "";
    }

    _onAccessLevelClick(user) {
        this.props.history.push('/team-member', {
            user: user
        })
    }

    _onRemoveAccessClick(user) {
        if (this.props.user.id === user.id) {
            this.setState({
                error: "You can not remove yourself"
            })
        } else {
            this.setState({
                error: null,
                busy: true
            })
            this.props.removeAccess(user, this.state.currentClient.id)
        }
    }

    _goToInvitationScreen() {
        this.props.history.push('/team-member', {
            user: null
        })
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamManagementScreen));