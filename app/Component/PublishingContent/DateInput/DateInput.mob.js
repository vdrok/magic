import React from 'react';
import PropTypes from 'prop-types';
import {View, Image, Text } from 'react-native';
import { Button } from 'native-base'
import Style from "./Style/DateInput";
import Icon from 'react-native-vector-icons/dist/Entypo';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Colors from '../../../Styles/Colors'
import moment from "moment/moment";
import DatePicker from 'react-native-datepicker';
import DeviceInfo from 'react-native-device-info';

const deviceLocale = DeviceInfo.getDeviceLocale();

class DateInput extends React.Component {

    static propTypes = {
        publishing_date: PropTypes.any,
        onChange: PropTypes.func.isRequired
    };

    onPress(){
        if(this.datePickerRef){
            this.datePickerRef.onPressDate();
        }
    }

    constructor(props) {
        super(props);
        this.onPress = this.onPress.bind(this);
        this.datePickerRef = React.createRef();
    }

    render() {
        const selectedStyle = this._isSelected() ? Style.selectedWrapper : null;
        return <Button iconRight transparent style={[Style.wrapper, selectedStyle]} onPress={this.onPress}>

            {this._renderIcon()}
            {this._renderTime()}
        </Button>
    }

    _renderIcon(){
        const iconSize = this._isSelected() ? 30 : 45;
        return <View style={Style.iconWrapper}>
            <MaterialIcons name='access-time' size={iconSize} style={Style.channelIcon} color={Colors.textGray}/>
        </View>
    }

    _renderTime(){
        const { publishing_date } = this.props;
        const date = moment(publishing_date).isValid() ? moment(publishing_date) : moment(publishing_date, 'DD MMM YYYY HH:mm');

            return  <View style={Style.nameWrapper}>
                <Text style={{fontSize: 14, color: Colors.secondary }}>planned on</Text>

           <DatePicker
                    ref={(el) => this.datePickerRef = el}
                    date={date}
                    locale={deviceLocale ? deviceLocale : "en"}
                    mode="datetime"
                    format="DD MMM YYYY HH:mm"
                    placeholder="Click choose publishing time"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    style={{ padding: 0, height: 20 }}
                    customStyles={{
                        dateIcon: {
                            display: 'none'
                        },
                        dateTouchBody:{
                            height: 20,
                        },
                        dateInput: { alignItems: 'flex-start', borderWidth: 0, height: 20 },
                        placeholderText: { color: '#000000' }
                    }}
                    onDateChange={(date) => {
                        const parsedDate = moment(date, 'DD MMM YYYY HH:mm');
                        this.props.onChange(parsedDate);
                    }}
           /></View>;
    }

    _isSelected(){
        const { publishing_date } = this.props;
        if(publishing_date) return true;

        return false;
    }

}


export default DateInput;