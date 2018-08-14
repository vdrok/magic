import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import {Form, Segment, Message, Button} from 'semantic-ui-react';
import { Creators as AuthActions } from '../../Reducer/AuthReducer';

class ChangePasswordScreen extends React.Component {
    static propTypes = {
        callback: PropTypes.func.isRequired,
        token: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            password: '',
            confirmation: '',
            confirmationError: false,
            apiError: false,
            busy: false
        }
    }

    componentDidMount() {
        if (this.props.token && !this.props.isAuthenticated) {
            this.props.verifyToken(this.props.token);
            this.setState({
                busy: true
            });
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.state.busy && !newProps.busy) {

            if (!newProps.isAuthenticated) {
                return this.setState({
                    error: true,
                    busy: newProps.busy
                });
            }

            if (newProps.changedPassword) {
                this.props.resetState();
                return this.props.callback();

            }

            this.setState({
                error: !newProps.changedPassword
            });
        }

        this.setState({
            busy: newProps.busy
        });
    }

    render() {
        return <div>
            {this._renderError()}
                <Form onSubmit={this._resetPassword.bind(this)} loading={this.state.busy} style={{marginBottom: 10}} size='large'>
                    <Segment>
                        <p>Please confirm your new password.</p>

                        <Form.Input
                            fluid
                            icon='lock'
                            type='password'
                            iconPosition='left'
                            placeholder='Password'
                            onChange={(event) => this.setState({
                                password: event.target.value
                            })}
                        />

                        <Form.Input
                            fluid
                            icon='lock'
                            type='password'
                            iconPosition='left'
                            placeholder='Confirm password'
                            onChange={(event) => this.setState({
                                confirmation: event.target.value
                            })}
                        />
                    </Segment>
                    <Button className="btn" type='submit'>Submit</Button>
                </Form>
            <Link to={"/"}>Skip</Link>
        </div>;
    }

    _renderError() {
        if (this.state.confirmationError) {
            return <Message
                error
                content='Password does not match.'
            />;
        }

        if (this.state.error) {
            return <Message
                error
                content='Error changing password, invalid token.'
            />;
        }
    }

    _resetPassword() {
        this.setState({
            apiError: false,
            confirmationError: false
        });

        const {password, confirmation} = this.state;

        if (password !== confirmation) {
            return this.setState({
                confirmationError: true
            });
        }

        this.props.changePassword(password);
    }
}

const mapStateToProps = state => ({
    busy: state.auth.busy,
    isAuthenticated: state.auth.isAuthenticated,
    changedPassword: state.auth.changedPassword
});

const mapDispatchToProps = dispatch => ({
    verifyToken: (token) => dispatch(AuthActions.verifyToken(token)),
    changePassword: (plainPassword) => dispatch(AuthActions.changePassword(plainPassword)),
    resetState: () => dispatch(AuthActions.resetPasswordStateRefresh())
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen);