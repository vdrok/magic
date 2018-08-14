import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, Text, TouchableWithoutFeedback, TextInput } from 'react-native';
import DatePicker from 'react-native-datepicker';
import Button from '../Button/ButtonComponent.mob';
import Style from './Style/TemplateQuestionaryModal';
import moment from "moment/moment";
import DeviceInfo from 'react-native-device-info';

const deviceLocale = DeviceInfo.getDeviceLocale();

class TemplateQuestionaryModalComponent extends React.Component {
    static propTypes = {
        template: PropTypes.object.isRequired,
        closeCallback: PropTypes.func.isRequired
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
            visible: true
        });
    }

    hide() {
        this.props.closeCallback(false);
        this.setState({
            visible: false,
            inputData: {},
            error: {},
            errorMessage: null
        });
    }


    render() {
        const {visible} = this.state;

        return (
            <Modal
                animationType={'fade'}
                visible={visible}
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
                            <Text style={Style.heading}>{this.props.template.name}</Text>

                            <Text>Name</Text>
                            <TextInput
                                placeholder="Campaign name"
                                onChangeText={(text) => this.onInputChange('name', text)}
                                value={this.state.inputData.name}
                                autoCapitalize="none"
                                blurOnSubmit={true}
                                returnKeyType={"next"}
                                style={this.state.error.name ? [Style.input, Style.inputError] : Style.input}
                            />

                            <Text>Start date</Text>
                            <DatePicker
                                date={this.state.inputData.startDate}
                                mode="date"
                                locale={deviceLocale ? deviceLocale : "en"}
                                placeholder="Start date"
                                format="DD MMM YYYY"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                style={this.state.error.startDate ? [Style.datePickerWrapper, Style.inputError] : Style.datePickerWrapper}
                                customStyles={{
                                    dateIcon: {
                                        display: 'none'
                                    },
                                    dateInput: Style.datePickerInner
                                }}
                                onDateChange={(date) => {
                                    const parsedDate = moment(date, 'DD MMM YYYY');
                                    this.onInputChange('startDate', parsedDate)}
                                }
                            />


                            <Text>End date</Text>
                            <DatePicker
                                date={this.state.inputData.endDate}
                                mode="date"
                                locale={deviceLocale ? deviceLocale : "en"}
                                placeholder="End date"
                                format="DD MMM YYYY"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                style={Style.datePickerWrapper}
                                customStyles={{
                                    dateIcon: {
                                        display: 'none'
                                    },
                                    dateInput: Style.datePickerInner
                                }}
                                onDateChange={(date) => {
                                    const parsedDate = moment(date, 'DD MMM YYYY');
                                    this.onInputChange('endDate', parsedDate)
                                }}
                            />

                            <Button onPress={() => this.submit(true)}>
                                <Text>Submit</Text>
                            </Button>
                        </View>
                    </View>
                </View>

            </Modal>
        )
    }


    submit(submitted = false) {
        if(!this.validate()){
            return;
        }
        this.props.closeCallback(submitted, this.state.inputData);
        this.setState({
            visible: false,
            inputData: {}
        });
    }


    validate(){
        if(!this.state.inputData.name){
            this.setState({
                'error': {
                    name: true
                },
                'errorMessage': 'Campaign name is required'
            });
            return false;
        }


        if(!this.state.inputData.startDate){
            this.setState({
                'error': {
                    startDate: true
                },
                'errorMessage': 'Campaign start date is required'
            });
            return false;
        }

        if(!moment(this.state.inputData.startDate).isValid()){
            this.setState({
                'error': {
                    startDate: true
                },
                'errorMessage': 'The start date is not valid date format'
            });
            return false;
        }

        this.setState({
            'error': {},
            'errorMessage': null
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
}

export default TemplateQuestionaryModalComponent;