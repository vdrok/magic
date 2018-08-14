import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, Text, TouchableWithoutFeedback, TextInput } from 'react-native';
import Button from '../Button/ButtonComponent.mob';
import Style from './Style/NewProjectModalStyle';


class NewProjectModalComponent extends React.Component {
    static propTypes = {
        onSubmitCallback: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            inputData: {},
            errorMessage: null
        };
    }


    show() {
        this.setState({
            visible: true
        });
    }

    hide() {
        this.setState({
            visible: false,
            inputData: {},
            errorMessage: null
        });
    }


    render() {

        return (
            <Modal
                animationType={'fade'}
                visible={this.state.visible}
                transparent
                onRequestClose={()=> this.hide()}
            >
                <View style={Style.contentWrapper}>
                    <View style={Style.container}>
                        <TouchableWithoutFeedback onPress={() => this.hide()}>
                            <View style={Style.closeButton}>
                                <Text style={Style.closeText}>X</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <View style={Style.content}>
                            <Text>Name</Text>
                            <TextInput
                                placeholder="Name"
                                onChangeText={(text) => this.onInputChange('name', text)}
                                value={this.state.inputData.name}
                                autoCapitalize="none"
                                blurOnSubmit={true}
                                returnKeyType={"next"}
                                style={this.state.errorMessage ? [Style.input, Style.inputError] : Style.input}
                            />
                            {this.state.errorMessage ? <Text style={Style.errorMessage}>{this.state.errorMessage}</Text> : null}
                            <Text style={Style.description}>Projects allow you to work with a different team on a different publishing channels</Text>
                            <Button onPress={this.submit.bind(this)}>
                                <Text>Submit</Text>
                            </Button>
                        </View>
                    </View>
                </View>

            </Modal>
        )
    }


    submit() {
        if(!this.state.inputData || !this.state.inputData.name || !this.state.inputData.name.length){
            this.setState({
                errorMessage: "Please enter an name"
            });

            return;
        }

        this.props.onSubmitCallback(this.state.inputData);

        this.setState({
            visible: false,
            errorMessage: null,
            inputData: {}
        });
    }


    onInputChange(fieldName, value) {
        let inputData = this.state.inputData;
        inputData[fieldName] = value;

        this.setState({
            inputData
        });
    }
}

export default NewProjectModalComponent;