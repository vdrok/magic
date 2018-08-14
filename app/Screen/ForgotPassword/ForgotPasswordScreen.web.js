import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {Header, Segment, Form, Button, Image, Grid, Message} from 'semantic-ui-react'
import { logo } from '../../Helpers';
import './Style/ForgotPasswordScreen.scss';
import { Creators as AuthActions } from '../../Reducer/AuthReducer';

class ForgotPasswordScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            busy: false,
            error: false,
            email: ''
        };
    }

    componentWillReceiveProps(newProps) {
        if (this.state.busy && !newProps.busy) {
            this.setState({
                busy: newProps.busy,
                error: !newProps.sentResetPassword,
            });
        }

        this.setState({
            busy: newProps.busy
        });
    }

    render() {
        return <div className="screen-login">
                <Grid
                    textAlign='center'
                    style={{ height: '100%' }}
                    verticalAlign='middle'
                >
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' textAlign='center'>
                            <Image src={logo} />
                            {' '}Engage
                        </Header>
                        {this._renderError()}
                        {this._renderContent()}

                        <Link to={"/"}>Back</Link>

                    </Grid.Column>

                </Grid>

            </div>;
    }

    _renderContent() {
        return this.props.sentResetPassword ? this._renderConfirmation() : this._renderForm();
    }

    _renderForm() {
        return <Form onSubmit={() => {}} loading={this.props.busy} style={{marginBottom: 10}} size='large'>
            <Segment>
                <p>Please input the email associated with your account and we will send you the link to reset your password.</p>

                <Form.Input
                    fluid
                    icon='at'
                    iconPosition='left'
                    placeholder='E-mail or Username'
                    onChange={(event) => this.setState({
                        email: event.target.value
                    })}
                />
            </Segment>

            <Button className="btn"
                    type='submit'
                    onClick={this._sendResetPasswordLink.bind(this)}>Send Email</Button>
        </Form>;
    }

    _renderConfirmation() {
        return <div style={{marginBottom: 10}}>
            <Segment>
                <p>We've sent the email with link to reset your password.</p>
            </Segment>
        </div>
    }

    _renderError() {
        if (this.state.error)
            return <Message
                    error
                    content='User not found or reset password email is already sent.'
                />;
    }

    _sendResetPasswordLink() {
        this.props.sendResetPassword(this.state.email);
    }
}

const mapStateToProps = state => ({
    busy: state.auth.busy,
    sentResetPassword: state.auth.sentResetPassword
});

const mapDispatchToProps = dispatch => ({
    sendResetPassword: (email) => dispatch(AuthActions.sendResetPassword(email))
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen);