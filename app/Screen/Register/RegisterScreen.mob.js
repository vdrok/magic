import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { View, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Card } from 'react-native-elements';
import Validate from 'validate.js';
import Button from '../../Component/Button/ButtonComponent.mob';
import Text from '../../Component/Text/TextComponent.mob';
import StartScreenComponent from '../../Component/StartScreen/StartScreen.mob';
import APILogin from '../../API/ApiLogin';
import styles from './Style/RegisterScreenStyle';
import {Creators as AuthActions} from "../../Reducer/AuthReducer";

const fieldValidations = {
    company_name: {
        presence: {
            message: '^Please enter a company name',
            allowEmpty: false
        }
    },
    name: {
        presence: {
            message: '^Please enter your name',
            allowEmpty: false
        }
    },
    email: {
        presence: {
            message: '^Please enter an email address',
            allowEmpty: false
        },
        email: {
            message: '^Please enter a valid email address'
        }
    },
    password: {
        presence: {
            message: '^Please enter a password',
            allowEmpty: false
        },
        length: {
            minimum: 6,
            message: '^Your password must be at least 6 characters'
        }
    }
};

class RegisterScreen extends React.Component {
    static propTypes = {
        busy: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            busy: this.props.busy,
            registered: false,
            error: '',
            company_name: '',
            name: '',
            email: '',
            password: '',
        };

        this.handleRegister = this.handleRegister.bind(this);
    }

    handleRegister() {
        const data = {
            companyName: this.state.company_name,
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
        };
        const validate = this.validate();

        if (validate) {
            this.setState({
                error: validate.join('\n')
            });
            return;
        }

        this.setState({
            error: '',
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
                    error: 'Error while saving.\nPlease contact us to solve the problem.'
                });
            });
    }

    validate() {
        const validation = Validate(
            {
                company_name: this.state.company_name,
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            },
            fieldValidations,
            { format: 'flat' }
        );

        return validation;
    }

    render() {
        return <StartScreenComponent>{this.renderContent()}</StartScreenComponent>;
    }

    renderContent() {
        return this.state.registered ? this.renderConfirmation() : this.renderForm();
    }

    renderForm() {
        const InputDisabledStyle = this.state.busy ? styles.inputDisable : null;

        return (
            <Card containerStyle={styles.formWrapper}>
                {this.renderError()}
                <TextInput
                    placeholder="Company Name"
                    onChangeText={text =>
                        this.setState({
                            company_name: text
                        })
                    }
                    value={this.state.company_name}
                    blurOnSubmit={true}
                    returnKeyType={'next'}
                    style={[styles.input, InputDisabledStyle]}
                    editable={!this.state.busy}
                />
                <TextInput
                    placeholder="Your Name"
                    onChangeText={text =>
                        this.setState({
                            name: text
                        })
                    }
                    value={this.state.name}
                    blurOnSubmit={true}
                    returnKeyType={'next'}
                    style={[styles.input, InputDisabledStyle]}
                    editable={!this.state.busy}
                />
                <TextInput
                    placeholder="E-mail"
                    onChangeText={text =>
                        this.setState({
                            email: text
                        })
                    }
                    value={this.state.email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    blurOnSubmit={true}
                    returnKeyType={'next'}
                    style={[styles.input, InputDisabledStyle]}
                    editable={!this.state.busy}
                />
                <TextInput
                    placeholder="Password"
                    onChangeText={text =>
                        this.setState({
                            password: text
                        })
                    }
                    value={this.state.password}
                    blurOnSubmit={true}
                    returnKeyType={'next'}
                    secureTextEntry={true}
                    style={[styles.input, InputDisabledStyle]}
                    editable={!this.state.busy}
                />

                
                <Button onPress={this.handleRegister} style={styles.button} active={!this.state.busy}>
                    Register
                </Button>
                {this.renderGoBack()}
            </Card>
        );
    }

    renderConfirmation() {
        return (
            <Card containerStyle={styles.formWrapper}>
                <Text style={styles.confirmMessage}>Your account has been created successfully.</Text>
                {this.renderGoBack()}
            </Card>
        );
    }

    renderError() {
        if (this.state.error) {
            return (
                <View style={styles.errorWrapper}>
                    <Text style={styles.errorMessage}>{this.state.error}</Text>
                </View>
            );
        }
    }

    renderGoBack() {
        return (
            <TouchableWithoutFeedback onPress={() => this.props.back()}>
                <View>
                    <Text style={styles.backButton}>Back</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const mapStateToProps = state => ({
    busy: state.auth.busy
});

const mapDispatchToProps = dispatch => ({
    back: () => dispatch(NavigationActions.back()),
    authenticate: (email, password) => {
        return dispatch(AuthActions.loginRequest(email,password))
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
