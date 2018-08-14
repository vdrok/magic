import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, Text, TouchableWithoutFeedback, TextInput } from 'react-native';

import APICampaigns from '../../API/ApiCampaigns';
import Button from '../Button/ButtonComponent.mob';
import Style from './Style/CampaignEditModalStyle';

class CampaignEditModalComponent extends React.Component {
    static propTypes = {
        campaign: PropTypes.shape({}).isRequired,
        onCloseCallback: PropTypes.func,
        onSuccessCallback: PropTypes.func
    };

    static defaultProps = {
        onCloseCallback: () => {},
        onSuccessCallback: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            inputData: {},
            error: {},
            errorMessage: null
        };
    }

    show() {
        this.setState({
            visible: true,
            inputData: { ...this.state.inputData, name: this.props.campaign.name }
        });
    }

    hide() {
        this.setState({
            visible: false,
            error: {},
            errorMessage: null
        });
        this.props.onCloseCallback();
    }

    submit() {
        if (!this.validate()) {
            return;
        }

        const data = this.state.inputData;

        APICampaigns.updateCampaign(this.props.campaign.id, data)
            .then(success => {
                this.setState({
                    visible: false,
                    error: {},
                    errorMessage: null
                });
                this.props.onSuccessCallback(data);
            })
            .catch(error => {
                this.setState({
                    error: {
                        saving: true
                    },
                    errorMessage:
                        error.response.status === 400
                            ? error.response.data.message
                            : 'Error while saving. Please try again or contact tech support'
                });
            });
    }

    validate() {
        if (!this.state.inputData.name) {
            this.setState({
                error: {
                    name: true
                },
                errorMessage: 'Name is required'
            });
            return false;
        }

        this.setState({
            error: {},
            errorMessage: null
        });

        return true;
    }

    onInputChange(fieldName, value) {
        let inputData = this.state.inputData;
        inputData[fieldName] = value;

        this.setState({
            inputData
        });
    }

    render() {
        return (
            <Modal
                animationType={'fade'}
                visible={this.state.visible}
                transparent
                onRequestClose={() => this.hide()}
            >
                <View style={Style.contentWrapper}>
                    <View style={Style.container}>
                        <TouchableWithoutFeedback onPress={() => this.hide()}>
                            <View style={Style.closeButton}>
                                <Text style={Style.closeText}>X</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={Style.content}>
                            <Text style={Style.heading}>Edit campaign</Text>
                            <Text>Name</Text>
                            <TextInput
                                placeholder="Name"
                                onChangeText={text => this.onInputChange('name', text)}
                                value={this.state.inputData.name}
                                autoCapitalize="none"
                                blurOnSubmit={true}
                                returnKeyType={'next'}
                                style={
                                    this.state.error.name
                                        ? [Style.input, Style.inputError]
                                        : Style.input
                                }
                            />
                            {this.state.errorMessage && (
                                <Text style={Style.errorMessage}>{this.state.errorMessage}</Text>
                            )}
                            <Button onPress={() => this.submit()}>
                                <Text>Submit</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default CampaignEditModalComponent;
