import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, TextInput, TouchableWithoutFeedback, Linking} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Button from '../../Component/Button/ButtonComponent.mob';
import StartScreenComponent from '../../Component/StartScreen/StartScreen.mob';
import styles from './Style/LoginScreenStyle'
import Text from '../../Component/Text/TextComponent.mob'
import { Creators as AuthActions } from '../../Reducer/AuthReducer'
import { Creators as SettingsActions } from '../../Reducer/SettingsReducer'
import {Card, CheckBox} from 'react-native-elements'
import Api from '../../API/BaseApi'
import Platform from "../../Helpers/Platform";

const LOGIN_SCREEN_INIT_STATE = {
    email: null,
    password: null,
    error: false,
    demoAccess: false,
    isAuthenticated: false
};

class LoginScreen extends React.Component {

    constructor (props) {
        super(props);
        this.state = LOGIN_SCREEN_INIT_STATE;
    }

    componentDidMount() {
        if (this.props.isAuthenticated) {
            Api.authToken = this.props.token;
            this._loginSuccess();
        }
    }

    componentWillReceiveProps (newProps) {
        if (this.state.isAuthenticated && this.state.isAuthenticated === newProps.isAuthenticated) {
            return false;
        }
        let isError = false;
        // state change from busy to not busy and is not Authenticated, means error
        if(this.state.busy && !newProps.busy && !newProps.isAuthenticated){
            isError = true;
        }

        this.setState({
            error: isError,
            busy: newProps.busy,
            demoAccess: newProps.demoAccess,
        });

        if(newProps.isAuthenticated && !newProps.sentResetPassword){
            this.setState({
                isAuthenticated: newProps.isAuthenticated
            });
            this._loginSuccess();
        }
    }

    _loginSuccess(){
        this.props.redirect('HomeTab');
    }

    _forgotPassword() {
        this.props.redirect('ForgotPassword');
    }

    _register() {
        this.props.redirect('Register');
    }

    _loginClick(){
        this.props.authenticate(this.state.email, this.state.password);

    }

    _renderErrorMessage(){
        if(this.state.error)
            return <Text style={styles.errorMessage}>Invalid e-mail or password</Text>
    }

    _renderDemoAccess(){

        if(Platform.isProd()) return null;

        return <Card containerStyle={styles.formWrapper}>
            <CheckBox
                title='DEMO ACCESS'
                onPress={() => {
                    this.props.useFixtures(!this.state.demoAccess);
                    this.setState({'demoAccess': !this.state.demoAccess});
                }}
                checked={this.state.demoAccess}
            />
            { (!this.state.demoAccess) ? null :
                <Text style={{color: '#aaaaaa', alignSelf: 'center'}}>e-mail: '', password: ok</Text>}
        </Card>
    }


    render() {

        const InputDisabledStyle = (this.state.busy) ? styles.inputDisable : null;
        return <StartScreenComponent>

            <Card containerStyle={styles.formWrapper}>

                {this._renderErrorMessage()}

                <TextInput
                    placeholder="e-mail"
                    onChangeText={(text) => this.setState({
                        email: text
                    })}
                    value={this.state.email}
                    autoCapitalize="none"
                   /* autoFocus={true} //:TODO causing Test issues...*/
                    blurOnSubmit={true}
                    keyboardType="email-address"
                    underlineColorAndroid='#00000000'
                    returnKeyType={"next"}
                    style={[styles.input, InputDisabledStyle]}
                    editable={!this.state.busy}
                />

                <TextInput
                    placeholder="password"
                    onChangeText={(text) => this.setState({
                        password: text
                    })}
                    value={this.state.password}
                    blurOnSubmit={true}
                    returnKeyType={"done"}
                    underlineColorAndroid='#00000000'
                    secureTextEntry={true}
                    style={[styles.input, InputDisabledStyle]}
                    editable={!this.state.busy}
                    onSubmitEditing={this._loginClick.bind(this)}
                />




                <Button onPress={this._loginClick.bind(this)} style={styles.button} active={!this.state.busy}>Login</Button>

                <TouchableWithoutFeedback onPress={() => this._forgotPassword()}>
                    <View>
                        <Text style={{textAlign: 'center', marginTop: 10, textDecorationLine: 'underline'}}>Forgot Password?</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => this._register()}>
                    <View>
                        <Text style={{textAlign: 'center', marginTop: 10, textDecorationLine: 'underline'}}>Register</Text>
                    </View>
                </TouchableWithoutFeedback>

            </Card>

            <Card containerStyle={styles.formWrapper}>
                <TouchableWithoutFeedback onPress={() => { Linking.openURL('https://levuro.com/general-terms-service') }}>
                    <View>
                        <Text style={{textAlign: 'center', textDecorationLine: 'underline'}}>General Terms of Service</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { Linking.openURL('https://levuro.com/data-privacy') }}>
                    <View>
                        <Text style={{textAlign: 'center', marginTop: 10, textDecorationLine: 'underline'}}>Data Privacy Statement</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { Linking.openURL('https://levuro.com/impressum') }}>
                    <View>
                        <Text style={{textAlign: 'center', marginTop: 10, textDecorationLine: 'underline'}}>Impressum</Text>
                    </View>
                </TouchableWithoutFeedback>
            </Card>

            {this._renderDemoAccess()}

        </StartScreenComponent>;
    }
}

LoginScreen.propTypes = {
    busy: PropTypes.bool.isRequired,
};


const mapStateToProps = state => ({
    busy: state.auth.busy,
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token,
    demoAccess: state.settings.useFixtures,
    sentResetPassword: state.auth.sentResetPassword
});

const mapDispatchToProps = dispatch => ({
    redirect: (scene) => dispatch(NavigationActions.navigate({ routeName: scene })),
    authenticate: (email, password) => {
        return dispatch(AuthActions.loginRequest(email,password))
    },
    useFixtures: (value) => {
        return dispatch(SettingsActions.useFixtures(value))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);