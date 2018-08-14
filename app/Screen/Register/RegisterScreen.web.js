import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Segment, Form, Button, Image, Grid, Message } from 'semantic-ui-react';
import { logo } from '../../Helpers';
import APILogin from '../../API/ApiLogin';
import './Style/RegisterScreen.scss';
import {Creators as AuthActions} from "../../Reducer/AuthReducer";
import {connect} from "react-redux";

class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            busy: false,
            registered: false,
            error: '',
            company_name: '',
            name: '',
            email: '',
            password: '',
            registration_code: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        const data = {
            companyName: this.state.company_name,
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            registrationCode: this.state.registration_code
        };

        this.setState({
            busy: true
        });

        APILogin.register(data)
            .then(success => {
                this.setState({
                    busy: false,
                    registered: true
                });
                this.props.authenticate(data.email, data.password);
            })
            .catch(error => {

                if(error.response.status === 400){
                    return this.setState({
                        busy: false,
                        error: error.response.data.message
                    });
                }

                this.setState({
                    busy: false,
                    error: 'Error while saving. Please contact us to solve the problem.'
                });
            });
    }

    render() {
        return (
            <div className="screen-register">
                <Grid textAlign="center" className="register-grid" verticalAlign="middle">
                    <Grid.Column className="register-grid-column">
                        <Header as="h2" textAlign="center">
                            <Image src={logo} /> Engage
                        </Header>
                        {this.renderError()}
                        {this.renderContent()}
                    </Grid.Column>
                </Grid>
            </div>
        );
    }

    renderContent() {
        return this.state.registered ? this.renderConfirmation() : this.renderForm();
    }

    renderForm() {
        return (
            <Form onSubmit={this.handleSubmit} loading={this.state.busy} className="register-form" size="large">
                <Segment>
                    <Form.Input
                        fluid
                        required={true}
                        icon="user"
                        iconPosition="left"
                        placeholder="Company Name"
                        onChange={event =>
                            this.setState({
                                company_name: event.target.value
                            })
                        }
                    />
                    <Form.Input
                        fluid
                        required={true}
                        icon="user"
                        iconPosition="left"
                        placeholder="Your Name"
                        onChange={event =>
                            this.setState({
                                name: event.target.value
                            })
                        }
                    />
                    <Form.Input
                        fluid
                        required={true}
                        icon="at"
                        iconPosition="left"
                        placeholder="E-mail"
                        type="email"
                        onChange={event =>
                            this.setState({
                                email: event.target.value
                            })
                        }
                    />
                    <Form.Input
                        fluid
                        required={true}
                        minLength={6}
                        icon="lock"
                        iconPosition="left"
                        placeholder="Password"
                        type="password"
                        onChange={event =>
                            this.setState({
                                password: event.target.value
                            })
                        }
                    />
                    <Form.Input
                        fluid
                        required={true}
                        icon="lock"
                        iconPosition="left"
                        placeholder="Registration Code"
                        onChange={event =>
                            this.setState({
                                registration_code: event.target.value
                            })
                        }
                    />
                    <p className="disclaimer">
                        <small>Contact us to get Registration Code</small>
                    </p>
                </Segment>

                <Button className="btn" type="submit">
                    Register
                </Button>
                <p>
                    <Link to={'/'}>Back</Link>
                </p>
            </Form>
        );
    }

    renderConfirmation() {
        return (
            <div className="confirmation">
                <Segment>
                    <p>Your account has been created successfully.</p>
                </Segment>
                <p>
                    <Link to={'/'}>Back</Link>
                </p>
            </div>
        );
    }

    renderError() {
        if (this.state.error) return <Message error content={this.state.error} />;
    }
}



const mapDispatchToProps = dispatch => ({
    authenticate: (email, password) => {
        return dispatch(AuthActions.loginRequest(email,password))
    },
});

export default connect(null, mapDispatchToProps)(RegisterScreen);

