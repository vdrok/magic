import React from 'react';
import { View, WebView, Modal, Text, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import {extractQueryParameters} from '../../Helpers';
import Style from './Style/InstagramModal';


export default class InstagramModalComponent extends React.Component {
    static propTypes = {
        redirectUrl: PropTypes.string.isRequired,
        clientId: PropTypes.string.isRequired,
        successCallback: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };
    }

    show() {
        this.setState({
            visible: true
        });
    }

    hide() {
        this.setState({
            visible: false
        });
    }

    _onNavigationStateChange(state) {
        if (state.url.indexOf('access_token') === -1) {
            return;
        }

        const url = state.url.split('#');

        if (!url[1]) {
            return;
        }

        const parametersList = extractQueryParameters(url[1]);

        if (!parametersList || !parametersList.access_token) {
            return;
        }

        this.hide();
        this.props.successCallback(parametersList.access_token);
    }

    render() {
        const {visible} = this.state;
        const uri = this.getUri();

        return (
            <Modal
                animationType={'slide'}
                visible={visible}
                onRequestClose={this.hide.bind(this)}
                transparent
            >
                <View style={Style.contentWrapper}>
                    <View style={Style.content}>
                        <WebView
                            source={{ uri }}
                            scalesPageToFit
                            style={{ flex: 1 }}
                            startInLoadingState
                            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                            onError={this._onNavigationStateChange.bind(this)}
                        />

                        <TouchableWithoutFeedback onPress={this.hide.bind(this)}>
                            <View style={Style.closeButton}>
                                <Text style={Style.closeText}>X</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>

            </Modal >

        )
    }

    getUri() {
        const {clientId, redirectUrl} = this.props;
        return `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=token`
    }
}