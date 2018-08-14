import React from 'react';
import { connect } from 'react-redux';
import { NavigationActions, withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import {TextInput, Image, Button as NativeButton, TouchableWithoutFeedback, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Card} from 'react-native-elements';
import { logo } from '../../Helpers';
import Button from '../../Component/Button/ButtonComponent.mob';
import Text from '../../Component/Text/TextComponent.mob';
import StartScreenComponent from '../../Component/StartScreen/StartScreen.mob';
import style from './Style/ChangePasswordScreenStyle';
import {Creators as AuthActions} from '../../Reducer/AuthReducer';

class ChangePasswordScreen extends React.Component {

    static propTypes = {
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    shouldGoBack: PropTypes.bool
                })
            })
        })
    };

    static navigationOptions = ({ navigation }) =>  {
        return {
            title: <Image source={logo} style={style.header_logo}/>,
            tabBarLabel: 'Settings',
            tabBarIcon: ({tintColor}) => (
                <Icon name="more-horiz" size={30} color={tintColor}/>
            ),
            headerLeft: <NativeButton
                title="Back"
                onPress={() => { navigation.goBack(null) }}
            />,

        }};

    constructor(props) {
        super(props);

        this.state = {
            password: '',
            passwordConfirmation: '',
            error: false,
            passwordMatch: false,
            busy: false,
            success: false
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.state.busy && !newProps.busy) {
            if (newProps.passwordChanged) {
                if (this.props.navigation.state.params && this.props.navigation.state.params.shouldGoBack) {
                    this.props.resetChangePasswordState();
                    return this.props.redirect('SettingsScreen');
                }
                else {
                    return this.props.resetChangePasswordState();
                }
            }

            this.setState({
                error: !newProps.passwordChanged
            });
        }

        this.setState({
            busy: newProps.busy
        });
    }

    render() {
        const InputDisabledStyle = (this.state.busy) ? style.inputDisable : null;

        return <StartScreenComponent>
            <Card containerStyle={style.formWrapper}>
                <Text>Please input and confirm your new password.</Text>

                {this._renderSuccessMessage()}

                <TextInput
                    placeholder="Password"
                    onChangeText={(text) => this.setState({
                        password: text
                    })}
                    value={this.state.password}
                    autoCapitalize="none"
                    autoFocus={true}
                    blurOnSubmit={true}
                    returnKeyType={"next"}
                    style={[style.input, InputDisabledStyle]}
                    editable={!this.state.busy}
                    secureTextEntry={true}
                />

                <TextInput
                    placeholder="Confirm password"
                    onChangeText={(text) => this.setState({
                        passwordConfirmation: text
                    })}
                    value={this.state.passwordConfirmation}
                    autoCapitalize="none"
                    blurOnSubmit={true}
                    returnKeyType={"next"}
                    style={[style.input, InputDisabledStyle]}
                    editable={!this.state.busy}
                    secureTextEntry={true}
                />

                {this._renderPasswordMatchErrorMessage()}
                {this._renderErrorMessage()}


                <Button onPress={this._changePassword.bind(this)} style={style.button} active={!this.state.busy}>Submit</Button>
                {this._renderSkip()}
            </Card>
        </StartScreenComponent>;
    }

    _renderSuccessMessage() {
        if (this.state.successMessage) {
            return <Text>Password changed successfully.</Text>;
        }
    }

    _renderPasswordMatchErrorMessage() {
        if(this.state.passwordMatch) {
            return <Text style={style.errorMessage}>Password does not match.</Text>;
        }
    }

    _renderErrorMessage() {
        if (this.state.error) {
            return <Text style={style.errorMessage}>Error changing password.</Text>;
        }
    }

    _renderSkip() {
        return <TouchableWithoutFeedback onPress={() => this.props.redirect('HomeScreen')}>
            <View>
                <Text style={{textAlign: 'center', marginTop: 10, textDecorationLine: 'underline'}}>Skip</Text>
            </View>
        </TouchableWithoutFeedback>;
    }

    _changePassword() {
        this.setState({
            error: false,
            passwordMatch: false
        });

        const { password, passwordConfirmation } = this.state;

        if (password !== passwordConfirmation) {
            return this._setError(true);
        }

        this.props.changePasswordRequest(password);
    }

    _setError(passwordMatch) {
        this.setState({
            passwordMatch
        });
    }
}

const mapStateToProps = state => ({
    busy: state.auth.busy,
    passwordChanged: state.auth.changedPassword
});

const mapDispatchToProps = dispatch => ({
    redirect: (scene) => dispatch(NavigationActions.navigate({ routeName: scene })),
    goBack: () => dispatch(NavigationActions.back()),
    logout: () => dispatch(AuthActions.logout()),
    changePasswordRequest: plainPassword => dispatch(AuthActions.changePassword(plainPassword)),
    resetChangePasswordState: () => dispatch(AuthActions.resetPasswordStateRefresh())
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen));