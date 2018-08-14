import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Picker, Item, Icon } from 'native-base';

import style from './Style/PickerStyle';

class PickerComponent extends React.Component {

    static propTypes = {
        options: PropTypes.array.isRequired,
        defaultOption: PropTypes.shape({
            key: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
        }),
        textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
        iconColor: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        iosHeader: PropTypes.string,
        headerBackButtonTextStyle: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            onChange: props.onChange,
            options: props.options,
            activeValueKey: ''
        }


        this.onValueChange = this.onValueChange.bind(this)
    }

    componentDidMount() {
        if (this.props.defaultOption) {
            this.setState({
                activeValueKey: this.props.defaultOption.key
            })
        } else {
            this.setState({
                activeValueKey: this.props.options[0].key
            }, () => this.props.onChange(this.getActiveOptionByKey(this.state.activeValueKey)))
        }
    }

    render() {
        const iosHeader = this.props.iosHeader ? this.props.iosHeader : "Options"
        const textStyle = this.props.textStyle ? this.props.textStyle : null;

        const headerBackButtonStyle = this.props.headerBackButtonTextStyle ? this.props.headerBackButtonTextStyle : style.pickerBackButton

        return <View style={style.pickerWrapper}>
            <Picker
                iosHeader={iosHeader}
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                selectedValue={this.state.activeValueKey}
                headerBackButtonTextStyle={headerBackButtonStyle}
                textStyle={textStyle}
                style={style.picker}
                onValueChange={this.onValueChange}>
                {this.state.options.map(item => {
                    return this._renderPickerItem(item)
                })}
            </Picker>
        </View>
    }

    _renderPickerItem(item) {
        return <Item key={item.key} label={item.text} value={item.key}/>
    }

    onValueChange(value) {
        this.setState({
            activeValueKey: value
        }, () => {
            this.props.onChange(this.getActiveOptionByKey(value))
        })
    }

    getActiveOptionByKey(key) {
        return this.state.options.find(item => item.key === key)
    }
}

export default PickerComponent;