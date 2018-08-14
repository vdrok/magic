import React from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import {View, TextInput, TouchableWithoutFeedback} from 'react-native';
import {Card} from 'react-native-elements';
import Button from '../../Component/Button/ButtonComponent.mob';
import Text from '../../Component/Text/TextComponent.mob';
import StartScreenComponent from '../../Component/StartScreen/StartScreen.mob';
import style from './Style/ForgotPasswordScreenStyle';
import {Creators as AuthActions} from '../../Reducer/AuthReducer';

class ForgotPasswordScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            pin: '',
            busy: false,
            error: false,
            result: false,
            finished: false
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.state.finished) {
            return;
        }

        if (newProps.isAuthenticated && !newProps.changedPassword) {
            this.setState({
                finished: true
            });
            return this.props.redirect('ChangePassword');
        }

        if (this.state.busy && !newProps.busy) {
            this.setState({
                busy: newProps.busy,
                error: !newProps.sentResetPassword || this.state.result && !newProps.isAuthenticated,
                result: newProps.sentResetPassword
            });
        }

        this.setState({
            busy: newProps.busy
        });
    }

    _sendPasswordResetRequest() {
        this.setState({
            error: false,
            result: false
        });

        this.props.sendPasswordResetRequest(this.state.email);
    }

    _sendPinConfirmation() {
        this.props.sendPinRequest(this.state.email, this.state.pin);
    }

    render() {
        return <StartScreenComponent>
            {this._renderContent()}
        </StartScreenComponent>;
    }

    _renderContent() {
        return this.state.result ? this._renderPinEnter() : this._renderSendMail();
    }

    _renderPinEnter() {
        const InputDisabledStyle = (this.state.busy) ? style.inputDisable : null;

        return <Card containerStyle={style.formWrapper}>
            <Text>Please input the PIN code that was sent to your email address.</Text>


            <TextInput
                placeholder="PIN"
                onChangeText={(text) => this.setState({
                    pin: text
                })}
                value={this.state.pin}
                autoCapitalize="none"
                autoFocus={true}
                blurOnSubmit={true}
                returnKeyType={"next"}
                style={[style.input, InputDisabledStyle]}
                editable={!this.state.busy}
            />

            {this._renderPinErrorMessage()}


            <Button onPress={this._sendPinConfirmation.bind(this)} style={style.button} active={!this.state.busy}>Submit</Button>

            {this._renderGoBack()}
        </Card>;
    }

    _renderPinErrorMessage() {
        if(this.state.error) {
            return <Text style={style.errorMessage}>Invalid PIN.</Text>;
        }
    }

    _renderSendMail() {
        const InputDisabledStyle = (this.state.busy) ? style.inputDisable : null;

        return <Card containerStyle={style.formWrapper}>
            <Text>Please input the email or username associated with your account and we will send you the link to reset your password.</Text>


            <TextInput
                placeholder="E-mail or Username"
                onChangeText={(text) => this.setState({
                    email: text
                })}
                value={this.state.email}
                autoCapitalize="none"
                autoFocus={true}
                blurOnSubmit={true}
                keyboardType="email-address"
                returnKeyType={"next"}
                style={[style.input, InputDisabledStyle]}
                editable={!this.state.busy}
            />

            {this._renderMailErrorMessage()}


            <Button onPress={this._sendPasswordResetRequest.bind(this)} style={style.button} active={!this.state.busy}>Submit</Button>

            {this._renderGoBack()}
        </Card>;
    }

    _renderMailErrorMessage() {
        if(this.state.error) {
            return <Text style={style.errorMessage}>User not found or reset password email is already sent.</Text>;
        }
    }

    _renderGoBack() {
        return <TouchableWithoutFeedback onPress={() => this.props.back()}>
            <View>
                <Text style={{textAlign: 'center', marginTop: 10, textDecorationLine: 'underline'}}>Back</Text>
            </View>
        </TouchableWithoutFeedback>;
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    busy: state.auth.busy,
    sentResetPassword: state.auth.sentResetPassword,
    changedPassword: state.auth.changedPassword
});

const mapDispatchToProps = dispatch => ({
    back: () => dispatch(NavigationActions.back()),
    redirect: (scene) => dispatch(NavigationActions.navigate({ routeName: scene })),
    sendPasswordResetRequest: user => dispatch(AuthActions.sendResetPassword(user)),
    sendPinRequest: (user, pin) => dispatch(AuthActions.verifyPin(user, pin))
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen);